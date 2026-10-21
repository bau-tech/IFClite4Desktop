/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import type { PluginManifest } from '@ifc-lite/plugin-api';

/**
 * Hosts allowed before the user adds any server. Each server the user adds is
 * appended (see `SpeckleProvider.manifest`), since the host's fetch wrapper
 * only lets a provider reach hosts its manifest lists.
 */
export const DEFAULT_SPECKLE_HOSTS = [
  'app.speckle.systems',
  '*.speckle.systems',
  '*.speckle.xyz',
  // Speckle servers hosted by the Converge coordination platform.
  '*.converge.ing',
] as const;

export function createSpeckleManifest(hosts: readonly string[]): PluginManifest {
  return {
    name: 'speckle',
    title: 'Speckle',
    api: '^2.0.0',
    // "Sign in" opens the server manager, where the user adds any number of
    // servers with a token each.
    auth: 'interactive',
    // Speckle answers CORS for any origin, the Tauri webview's included, so
    // no relay is needed.
    permissions: { network: [...new Set([...DEFAULT_SPECKLE_HOSTS, ...hosts])] },
    preferences: [],
    capabilities: {
      sourceNamePatterns: ['*.ifc'],
      // Server → project → model; each level is listed on its own.
      containerListing: 'direct-children',
      listFilesIsRecursive: false,
      // Every upload is its own immutable file; there is no per-file history.
      revisionHistory: false,
      downloadHistoricalRevisions: false,
      changeDetection: false,
      search: false,
    },
    contributes: {
      fileSources: ['./provider.ts'],
    },
  };
}
