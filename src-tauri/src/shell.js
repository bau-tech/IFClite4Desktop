// Injected into every page of the main window before page scripts run.
// - Serves `/__local_file/<path>` fetches from disk (so the full IFC-Lite viewer
//   can open a file passed on the command line via its same-origin `?model=`).
// - Adds RFC 7591 `redirect_uris` to OAuth client registrations (see below).
// - Switches between the full viewer (`/`) and the Lite viewer (`/lite.html`),
//   remembers the choice, and falls back to Lite when WebGPU is unavailable.
(() => {
  const MODE_KEY = 'ifclite-desktop.mode';
  const STARTED_KEY = 'ifclite-desktop.started';
  const LOCAL_PREFIX = '/__local_file/';

  const path = location.pathname;
  const isLite = path.endsWith('/lite.html');
  const isFull = path === '/' || path.endsWith('/index.html');
  if (!isLite && !isFull) return; // e.g. OAuth callback pages

  const invoke = (cmd, args) => window.__TAURI_INTERNALS__.invoke(cmd, args);
  const storage = (area) => {
    try { return window[area]; } catch { return null; }
  };
  const local = storage('localStorage');
  const session = storage('sessionStorage');

  // ── OAuth client registration ─────────────────────────────────────
  // The viewer registers BCF OAuth clients with the BCF API's `redirect_url`.
  // Some servers (Converge's bcf-bridge) only read RFC 7591's `redirect_uris`
  // and then reject any redirect that is not loopback — which includes this
  // app's http://tauri.localhost. Send both names.
  const withRedirectUris = (url, init) => {
    if (!init || typeof init.body !== 'string' || !/\/register$/.test(url.pathname)) return init;
    if ((init.method ?? 'GET').toUpperCase() !== 'POST') return init;
    try {
      const body = JSON.parse(init.body);
      if (typeof body?.redirect_url !== 'string' || body.redirect_uris !== undefined) return init;
      return { ...init, body: JSON.stringify({ ...body, redirect_uris: [body.redirect_url] }) };
    } catch {
      return init;
    }
  };

  // ── Local file fetch shim ─────────────────────────────────────────
  const originalFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    let url = null;
    try {
      const href = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      url = new URL(href, location.href);
    } catch { /* not a URL we handle */ }
    if (url && url.origin === location.origin && url.pathname.startsWith(LOCAL_PREFIX)) {
      // `/__local_file/<encoded full path>/<file name>` — the trailing name is only
      // there so the viewer shows a sensible model name.
      const encoded = url.pathname.slice(LOCAL_PREFIX.length).split('/')[0];
      const filePath = decodeURIComponent(encoded);
      return invoke('read_ifc_file', { path: filePath }).then(
        (buffer) => new Response(buffer, { status: 200, headers: { 'Content-Type': 'application/octet-stream' } }),
      );
    }
    return originalFetch(input, url && !(input instanceof Request) ? withRedirectUris(url, init) : init);
  };

  const goLite = (reason) => location.replace('/lite.html' + (reason ? `?reason=${reason}` : ''));

  if (isFull) {
    // Full-fidelity rendering. The web viewer trades accuracy for speed by
    // default, which wrecks thin MEP geometry (round ducts turn boxy, with gaps):
    // - LOD1 "sloppy" decimation of batches smaller than 48 px on screen
    // - 16-bit quantized vertex positions (coarse over large model extents)
    // - culling of objects smaller than 0.5 px
    // These are the viewer's own perf kill switches (apps/viewer/src/lib/perf/flags.ts).
    window.__IFC_LITE_LOD_PX = 0;
    window.__IFC_LITE_QUANTIZED = false;
    window.__IFC_LITE_CONTRIB_CULL = 0;

    // On app start, honour the remembered mode.
    if (session && !session.getItem(STARTED_KEY)) {
      session.setItem(STARTED_KEY, '1');
      if (local && local.getItem(MODE_KEY) === 'lite') return goLite();
    }

    // The full viewer needs WebGPU; without an adapter, use the Lite viewer.
    const gpu = navigator.gpu;
    (gpu ? gpu.requestAdapter().catch(() => null) : Promise.resolve(null)).then((adapter) => {
      if (!adapter) goLite('no-webgpu');
    });

    // "Lite mode" switch, floating over the viewer.
    const addSwitch = () => {
      const btn = document.createElement('button');
      btn.textContent = 'Lite mode';
      btn.title = 'Switch to the lightweight Three.js (WebGL) viewer';
      btn.setAttribute('style', [
        'position:fixed', 'left:50%', 'bottom:8px', 'transform:translateX(-50%)', 'z-index:2147483647',
        'padding:3px 12px', 'border-radius:12px', 'border:1px solid rgba(127,127,127,.45)',
        'background:rgba(30,33,38,.78)', 'color:#dfe3e8', 'font:12px "Segoe UI",system-ui,sans-serif',
        'cursor:pointer', 'opacity:.7',
      ].join(';'));
      btn.onmouseenter = () => { btn.style.opacity = '1'; };
      btn.onmouseleave = () => { btn.style.opacity = '.7'; };
      btn.onclick = () => {
        if (local) local.setItem(MODE_KEY, 'lite');
        goLite();
      };
      document.body.appendChild(btn);
    };
    if (document.body) addSwitch();
    else document.addEventListener('DOMContentLoaded', addSwitch, { once: true });
  } else if (session) {
    session.setItem(STARTED_KEY, '1');
  }
})();
