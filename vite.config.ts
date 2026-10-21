import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';

// The full IFC-Lite web viewer (apps/viewer, built separately — see README) is
// served as static files at the app root; the Lite viewer is lite.html.
// Override the location with IFCLITE_VIEWER_DIST.
const viewerDist = resolve(process.env.IFCLITE_VIEWER_DIST ?? 'vendor/ifc-lite-viewer');
if (!existsSync(resolve(viewerDist, 'index.html'))) {
  console.warn(`[ifclite-desktop] Full viewer not found at ${viewerDist} — only lite.html will work.`);
}

// @ifc-lite/geometry 7.8.x ships `new URL('./geometry.worker.ts', import.meta.url)`
// in its compiled dist, but only geometry.worker.js is published. Point the
// worker URL at the file that exists.
function fixIfcLiteWorkerUrl(): Plugin {
  return {
    name: 'fix-ifc-lite-worker-url',
    enforce: 'pre',
    transform(code, id) {
      if (!/@ifc-lite[\\/]geometry[\\/]dist[\\/]/.test(id) || !code.includes('geometry.worker.ts')) return null;
      return { code: code.replaceAll("'./geometry.worker.ts'", "'./geometry.worker.js'"), map: null };
    },
  };
}

// In dev the full viewer is a static file, so map the app root onto it.
// OAuth redirects land on extension-less paths (`/oauth/bcf/callback`), which
// map onto the viewer's static callback pages, as Tauri's asset resolver does
// in the packaged app. The query carries `code`/`state` and must survive.
function serveViewerAtRoot(): Plugin {
  return {
    name: 'serve-viewer-at-root',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url === '/' || req.url?.startsWith('/?')) req.url = '/index.html' + req.url.slice(1);
        const callback = req.url?.match(/^(\/oauth\/[\w-]+\/callback)(\?.*)?$/);
        if (callback) req.url = `${callback[1]}.html${callback[2] ?? ''}`;
        next();
      });
    },
  };
}

// Cross-origin isolation enables SharedArrayBuffer, which the IFC-Lite geometry
// worker pool uses to share file bytes across its WASM workers. The same headers
// are set for the packaged app in src-tauri/tauri.conf.json (app.security.headers).
const isolationHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
};

export default defineConfig({
  clearScreen: false,
  plugins: [fixIfcLiteWorkerUrl(), serveViewerAtRoot()],
  appType: 'mpa',
  publicDir: viewerDist,
  // Tauri expects a fixed port in dev; fail instead of silently picking another.
  server: {
    port: 1420,
    strictPort: true,
    headers: isolationHeaders,
    watch: { ignored: ['**/src-tauri/**'] },
  },
  preview: { headers: isolationHeaders },
  // The geometry worker pool ships ES-module workers.
  worker: { format: 'es' },
  optimizeDeps: { exclude: ['@ifc-lite/wasm'] },
  build: {
    // WebView2 on Windows is evergreen Chromium.
    target: 'chrome105',
    chunkSizeWarningLimit: 4096,
    // Keep Lite assets apart from the full viewer's /assets.
    assetsDir: 'lite-assets',
    rollupOptions: { input: { lite: resolve('lite.html') } },
  },
  envPrefix: ['VITE_', 'TAURI_ENV_'],
});
