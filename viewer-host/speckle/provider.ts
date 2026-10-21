/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { matchesGlob } from '@ifc-lite/plugin-api';
import type {
  ConnectionTestResult,
  DownloadOptions,
  FileFilter,
  FileSourceProvider,
  ListOptions,
  ListProjectsOptions,
  Page,
  PluginContext,
  PluginManifest,
  SourceAuth,
  SourceContainer,
  SourceFile,
  SourceFileRef,
  SourceIdentity,
  SourceProject,
} from '@ifc-lite/plugin-api';

import { createSpeckleManifest } from './manifest.js';
import { openServerManager } from './server-manager.js';
import {
  isConnected,
  loadServers,
  saveServers,
  serverHost,
  setConnected,
  type SpeckleServer,
} from './servers.js';

/**
 * One connector for any number of Speckle servers. It loads the original IFC
 * files uploaded to them, browsed as server → project → model → files. Each
 * project also has an "All uploaded IFC files" entry listing every IFC blob in
 * it, which covers uploads the model listing does not report.
 *
 * The user manages the server list (URL + token each) in a dialog opened from
 * Sign in. Signing out keeps the list, so Sign in again reopens it for editing.
 *
 * Models pushed by connectors (Revit, Rhino, …) have no IFC original and do not
 * appear. The bytes downloaded are the uploaded file unchanged.
 */

// Container ids: `p:<project>` (a Speckle project), `m:<project>:<model>` (a
// model), `a:<project>` (every IFC upload in the project). Speckle ids are hex.
const PAGE_DEFAULT = 50;
const PAGE_MAX = 100;
/** `BlobMetadata.uploadStatus`: 0 uploading, 1 stored, 2 failed. */
const BLOB_STORED = 1;

export class SpeckleHttpError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
    this.name = 'SpeckleHttpError';
  }
}

interface GqlResponse<T> {
  data?: T;
  errors?: { message: string; extensions?: { code?: string } }[];
}

interface UploadItem {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  uploadComplete: boolean;
}

interface BlobItem {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number | null;
  uploadStatus: number;
  createdAt: string;
}

type ContainerRef =
  | { kind: 'project'; projectId: string }
  | { kind: 'model'; projectId: string; modelId: string }
  | { kind: 'all'; projectId: string };

export class SpeckleProvider implements FileSourceProvider {
  private hosts: string[] = [];
  private cachedManifest = createSpeckleManifest([]);

  /**
   * Rebuilt only when the server list changes. The host creates a fresh
   * context from this for every operation, so servers added in the manager
   * become reachable without reloading.
   */
  get manifest(): PluginManifest {
    return this.cachedManifest;
  }

  readonly auth: SourceAuth = {
    restore: async (ctx) => {
      const servers = await loadServers(ctx.storage);
      this.allowHosts(servers);
      return servers.length && (await isConnected(ctx.storage)) ? identityOf(servers) : null;
    },
    signIn: async (ctx) => {
      const saved = await openServerManager(await loadServers(ctx.storage));
      if (!saved) throw new Error('Speckle server setup cancelled.');
      await saveServers(ctx.storage, saved);
      await setConnected(ctx.storage, true);
      this.allowHosts(saved);
      return identityOf(saved);
    },
    signOut: async (ctx) => {
      await setConnected(ctx.storage, false);
    },
    getIdentity: async (ctx) => {
      const servers = await loadServers(ctx.storage);
      return servers.length && (await isConnected(ctx.storage)) ? identityOf(servers) : null;
    },
  };

  /** Projects in the host's sense are the configured servers. */
  async listProjects(ctx: PluginContext, options?: ListProjectsOptions): Promise<Page<SourceProject>> {
    const query = options?.query?.toLowerCase();
    const servers = await loadServers(ctx.storage);
    return {
      items: servers
        .filter((server) => !query || server.label.toLowerCase().includes(query) || server.url.includes(query))
        .map((server) => ({ id: server.url, name: server.label, description: serverHost(server.url) })),
    };
  }

  async listContainers(
    ctx: PluginContext,
    serverId: string,
    parentId?: string,
    options?: ListOptions,
  ): Promise<Page<SourceContainer>> {
    const server = await this.server(ctx, serverId);
    if (!parentId) return this.listSpeckleProjects(ctx, server, options);

    const parent = parseContainer(parentId);
    if (parent.kind !== 'project') return { items: [] };
    const data = await gql<{
      project: { models: { cursor: string | null; items: { id: string; name: string }[] } };
    }>(
      ctx,
      server,
      `query ($projectId: String!, $limit: Int!, $cursor: String) {
        project(id: $projectId) { models(limit: $limit, cursor: $cursor) { cursor items { id name } } }
      }`,
      { projectId: parent.projectId, limit: pageSize(options), cursor: options?.cursor ?? null },
      options?.signal,
    );
    const { items, cursor } = data.project.models;
    const models: SourceContainer[] = items.map((model) => ({
      id: `m:${parent.projectId}:${model.id}`,
      name: model.name,
      parentId,
      hasChildren: false,
    }));
    if (!options?.cursor) {
      models.unshift({ id: `a:${parent.projectId}`, name: 'All uploaded IFC files', parentId, hasChildren: false });
    }
    return { items: models, cursor: nextCursor(cursor, items.length) };
  }

  async listFiles(
    ctx: PluginContext,
    serverId: string,
    containerId: string,
    filter?: FileFilter,
    options?: ListOptions,
  ): Promise<Page<SourceFile>> {
    const server = await this.server(ctx, serverId);
    const container = parseContainer(containerId);
    const page =
      container.kind === 'model'
        ? await this.listModelUploads(ctx, server, container, containerId, options)
        : container.kind === 'all'
          ? await this.listProjectBlobs(ctx, server, container.projectId, containerId, options)
          : { items: [] };

    let files = page.items;
    if (filter?.namePatterns?.length) {
      const patterns = filter.namePatterns;
      files = files.filter((file) => patterns.some((pattern) => matchesGlob(file.name, pattern)));
    }
    return { items: files, cursor: page.cursor };
  }

  async download(ctx: PluginContext, ref: SourceFileRef, options?: DownloadOptions): Promise<ArrayBuffer> {
    const server = await this.server(ctx, ref.projectId);
    const { projectId } = parseContainer(ref.containerId);
    // An upload's id is the id of the blob holding the original file.
    const url = `${server.url}/api/stream/${enc(projectId)}/blob/${enc(ref.fileId)}`;
    options?.onPhase?.('downloading');
    const response = await ctx.fetch(url, {
      headers: { Authorization: `Bearer ${server.token}` },
      signal: options?.signal,
    });
    if (!response.ok) throw await httpError(response, server, 'download');

    const total = Number(response.headers.get('content-length')) || undefined;
    if (!response.body || !options?.onProgress) return response.arrayBuffer();

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let received = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      received += value.byteLength;
      options.onProgress(received, total);
    }
    const bytes = new Uint8Array(received);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return bytes.buffer;
  }

  async testConnection(ctx: PluginContext): Promise<ConnectionTestResult> {
    const servers = await loadServers(ctx.storage);
    if (servers.length === 0) return { ok: false, message: 'No Speckle servers configured. Use Sign in to add one.' };
    const results = await Promise.all(
      servers.map(async (server) => {
        try {
          const data = await gql<{ activeUser: { name: string } | null }>(ctx, server, '{ activeUser { name } }', {});
          return data.activeUser
            ? { ok: true, line: `${server.label}: ${data.activeUser.name}` }
            : { ok: false, line: `${server.label}: token not accepted` };
        } catch (err) {
          return { ok: false, line: `${server.label}: ${err instanceof Error ? err.message : String(err)}` };
        }
      }),
    );
    return { ok: results.every((result) => result.ok), message: results.map((result) => result.line).join(' · ') };
  }

  private async listSpeckleProjects(
    ctx: PluginContext,
    server: SpeckleServer,
    options?: ListOptions,
  ): Promise<Page<SourceContainer>> {
    const data = await gql<{
      activeUser: { projects: { cursor: string | null; items: { id: string; name: string }[] } } | null;
    }>(
      ctx,
      server,
      `query ($limit: Int!, $cursor: String) {
        activeUser { projects(limit: $limit, cursor: $cursor) { cursor items { id name } } }
      }`,
      { limit: pageSize(options), cursor: options?.cursor ?? null },
      options?.signal,
    );
    if (!data.activeUser) {
      throw new SpeckleHttpError(401, `${server.label}: the token was not accepted. Sign out and sign in to update it.`);
    }
    const { items, cursor } = data.activeUser.projects;
    return {
      items: items.map((project) => ({ id: `p:${project.id}`, name: project.name, hasChildren: true })),
      cursor: nextCursor(cursor, items.length),
    };
  }

  private async listModelUploads(
    ctx: PluginContext,
    server: SpeckleServer,
    container: { projectId: string; modelId: string },
    containerId: string,
    options?: ListOptions,
  ): Promise<Page<SourceFile>> {
    const data = await gql<{
      project: { model: { uploads: { cursor: string | null; items: UploadItem[] } } };
    }>(
      ctx,
      server,
      `query ($projectId: String!, $modelId: String!, $limit: Int, $cursor: String) {
        project(id: $projectId) { model(id: $modelId) {
          uploads(input: { limit: $limit, cursor: $cursor }) {
            cursor items { id fileName fileType fileSize uploadDate uploadComplete }
          }
        } }
      }`,
      { ...container, limit: pageSize(options), cursor: options?.cursor ?? null },
      options?.signal,
    );
    const { items, cursor } = data.project.model.uploads;
    return {
      items: items
        .filter((upload) => upload.uploadComplete && isIfc(upload.fileName, upload.fileType))
        .map((upload) => ({
          id: upload.id,
          name: upload.fileName,
          containerId,
          sizeBytes: upload.fileSize,
          currentRevisionId: upload.id,
          modifiedAt: upload.uploadDate,
        })),
      cursor: nextCursor(cursor, items.length),
    };
  }

  private async listProjectBlobs(
    ctx: PluginContext,
    server: SpeckleServer,
    projectId: string,
    containerId: string,
    options?: ListOptions,
  ): Promise<Page<SourceFile>> {
    const data = await gql<{
      project: { blobs: { cursor: string | null; items: BlobItem[] } | null };
    }>(
      ctx,
      server,
      `query ($projectId: String!, $limit: Int, $cursor: String) {
        project(id: $projectId) { blobs(limit: $limit, cursor: $cursor) {
          cursor items { id fileName fileType fileSize uploadStatus createdAt }
        } }
      }`,
      { projectId, limit: pageSize(options), cursor: options?.cursor ?? null },
      options?.signal,
    );
    const blobs = data.project.blobs;
    if (!blobs) return { items: [] };
    return {
      items: blobs.items
        .filter((blob) => blob.uploadStatus === BLOB_STORED && isIfc(blob.fileName, blob.fileType))
        .map((blob) => ({
          id: blob.id,
          name: blob.fileName,
          containerId,
          sizeBytes: blob.fileSize ?? undefined,
          currentRevisionId: blob.id,
          modifiedAt: blob.createdAt,
        })),
      cursor: nextCursor(blobs.cursor, blobs.items.length),
    };
  }

  private async server(ctx: PluginContext, url: string): Promise<SpeckleServer> {
    const server = (await loadServers(ctx.storage)).find((candidate) => candidate.url === url);
    if (!server) throw new Error(`Speckle server ${url} is no longer configured`);
    return server;
  }

  private allowHosts(servers: readonly SpeckleServer[]): void {
    const hosts = servers.map((server) => new URL(server.url).hostname).sort();
    if (hosts.join() === this.hosts.join()) return;
    this.hosts = hosts;
    this.cachedManifest = createSpeckleManifest(hosts);
  }
}

/** Stable per server set, so the host keeps a catalog cache per set of servers. */
function identityOf(servers: readonly SpeckleServer[]): SourceIdentity {
  return {
    id: servers.map((server) => server.url).sort().join(' '),
    displayName: servers.map((server) => server.label).join(', '),
  };
}

function parseContainer(id: string): ContainerRef {
  const [kind, projectId, modelId] = id.split(':');
  if (kind === 'm' && projectId && modelId) return { kind: 'model', projectId, modelId };
  if (kind === 'a' && projectId) return { kind: 'all', projectId };
  if (kind === 'p' && projectId) return { kind: 'project', projectId };
  throw new Error(`Unknown Speckle container ${id}`);
}

async function gql<T>(
  ctx: PluginContext,
  server: SpeckleServer,
  query: string,
  variables: Record<string, unknown>,
  signal?: AbortSignal,
): Promise<T> {
  const response = await ctx.fetch(`${server.url}/graphql`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${server.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    signal,
  });
  if (!response.ok) throw await httpError(response, server, 'request');
  const body = (await response.json()) as GqlResponse<T>;
  if (body.errors?.length) {
    const forbidden = body.errors.some((error) => error.extensions?.code === 'FORBIDDEN');
    const message = body.errors.map((error) => error.message).join('; ');
    throw new SpeckleHttpError(forbidden ? 403 : 400, `Speckle: ${server.label}: ${message}`);
  }
  if (!body.data) throw new Error(`${server.label} returned an empty response`);
  return body.data;
}

async function httpError(response: Response, server: SpeckleServer, what: string): Promise<SpeckleHttpError> {
  const text = (await response.text().catch(() => '')).slice(0, 200);
  return new SpeckleHttpError(
    response.status,
    `${server.label}: ${what} failed (HTTP ${response.status})${text ? `: ${text}` : ''}`,
  );
}

function isIfc(fileName: string, fileType: string): boolean {
  return fileType.toLowerCase() === 'ifc' || fileName.toLowerCase().endsWith('.ifc');
}

function pageSize(options?: ListOptions): number {
  return Math.min(options?.limit ?? PAGE_DEFAULT, PAGE_MAX);
}

/** Speckle returns a cursor even on the last page; an empty page ends the listing. */
function nextCursor(cursor: string | null, count: number): string | undefined {
  return cursor && count > 0 ? cursor : undefined;
}

function enc(value: string): string {
  return encodeURIComponent(value);
}
