/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Replaces the viewer's src/main.tsx (see vite.config.ts): mounts the stock
// viewer with the desktop app's extra cloud sources.
import { mountViewer } from '@ifclite-viewer/bootstrap';
import { SpeckleProvider } from './speckle/index.js';

mountViewer(document.getElementById('root')!, {
  sourceProviders: [() => new SpeckleProvider()],
});
