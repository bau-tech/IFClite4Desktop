/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import type { KeyValueStore } from '@ifc-lite/plugin-api';

/** One Speckle server the user connected, with the token it issued. */
export interface SpeckleServer {
  /** Normalised origin, e.g. `https://app.speckle.systems`. Also the server's id. */
  readonly url: string;
  /** Display name; the host name when the user gave none. */
  readonly label: string;
  readonly token: string;
}

const SERVERS_KEY = 'servers';
const CONNECTED_KEY = 'connected';

/** Normalises a typed server address to its https origin; throws on anything else. */
export function normalizeServerUrl(value: string): string {
  const raw = value.trim();
  const url = new URL(/^[a-z]+:\/\//i.test(raw) ? raw : `https://${raw}`);
  if (url.protocol !== 'https:') throw new Error(`${raw}: only https servers are supported`);
  return url.origin;
}

export function serverHost(url: string): string {
  return new URL(url).host;
}

function isServer(value: unknown): value is SpeckleServer {
  const v = value as Partial<SpeckleServer> | null;
  return typeof v?.url === 'string' && typeof v.label === 'string' && typeof v.token === 'string';
}

export async function loadServers(storage: KeyValueStore): Promise<SpeckleServer[]> {
  const raw = await storage.get(SERVERS_KEY);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isServer) : [];
  } catch {
    return [];
  }
}

export async function saveServers(storage: KeyValueStore, servers: readonly SpeckleServer[]): Promise<void> {
  await storage.set(SERVERS_KEY, JSON.stringify(servers));
}

/** Whether the user is "signed in". Signing out keeps the server list so it can be edited. */
export async function isConnected(storage: KeyValueStore): Promise<boolean> {
  return (await storage.get(CONNECTED_KEY)) === 'true';
}

export async function setConnected(storage: KeyValueStore, connected: boolean): Promise<void> {
  if (connected) await storage.set(CONNECTED_KEY, 'true');
  else await storage.delete(CONNECTED_KEY);
}

/**
 * Checks a server and token before they are saved. Runs outside the host's
 * fetch wrapper because a newly typed server is not yet in the provider's
 * allowed hosts; it applies the same rules (https only, no redirects, no
 * ambient credentials).
 */
export async function testServer(url: string, token: string): Promise<string> {
  const response = await fetch(`${url}/graphql`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: '{ activeUser { name } serverInfo { name } }' }),
    credentials: 'omit',
    redirect: 'error',
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const body = (await response.json()) as {
    data?: { activeUser: { name: string } | null; serverInfo: { name: string } | null };
    errors?: { message: string }[];
  };
  if (body.errors?.length) throw new Error(body.errors[0].message);
  if (!body.data?.activeUser) throw new Error('token not accepted');
  return body.data.activeUser.name;
}
