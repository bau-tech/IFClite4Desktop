/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Builds the IFC-Lite viewer from the monorepo with desktop-entry.ts in place
// of its src/main.tsx, so the viewer gains the desktop app's cloud sources
// without patching its source. Run through `npm run viewer:build`.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin, UserConfig } from 'vite';
import viewerConfig from '../../ifc-lite-src/apps/viewer/vite.config';

const hostDir = path.dirname(fileURLToPath(import.meta.url));
const viewerDir = path.resolve(hostDir, '../../ifc-lite-src/apps/viewer');
const entry = path.join(hostDir, 'desktop-entry.ts');
const viewerMain = path.join(viewerDir, 'src', 'main.tsx');

function useDesktopEntry(): Plugin {
  return {
    name: 'ifclite-desktop-entry',
    enforce: 'pre',
    resolveId(id) {
      if (id === '/src/main.tsx' || path.resolve(id) === viewerMain) return entry;
      return null;
    },
  };
}

const base = viewerConfig as UserConfig;

export default {
  ...base,
  root: viewerDir,
  plugins: [useDesktopEntry(), ...(base.plugins ?? [])],
  resolve: {
    ...base.resolve,
    alias: {
      ...(base.resolve?.alias as Record<string, string>),
      '@ifclite-viewer': path.join(viewerDir, 'src'),
      // Files in this folder sit outside the monorepo's node_modules; share the
      // viewer's own copy of the plugin API.
      '@ifc-lite/plugin-api': path.resolve(viewerDir, '../../packages/plugin-api/dist/index.js'),
    },
  },
} satisfies UserConfig;
