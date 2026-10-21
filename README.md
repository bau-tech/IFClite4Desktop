# IFClite Desktop

A Windows desktop IFC viewer built on [IFC-Lite](https://ifclite.dev/docs/guide/desktop/) and
packaged with **Tauri v2**. It has two modes, and you can switch between them at any time:

| Mode | What it is | GPU API |
|---|---|---|
| **Full viewer** (default) | IFC-Lite's own web viewer (`apps/viewer`), embedded unchanged: BCF, IDS, clash, sections, measuring, 2D drawings, lists, scripting, export and more | WebGPU |
| **Lite mode** | A lightweight viewer written for this app: `@ifc-lite/geometry` + `@ifc-lite/parser` rendered with Three.js | WebGL |

- The app remembers the last mode you used.
- To switch, use the **Lite mode** button at the bottom center of the full viewer, or the
  **Full viewer** button in the Lite toolbar.
- If WebGPU isn't available at startup, the app opens in Lite mode automatically.
- Opening an `.ifc` file with the app (double-click, via the file association the installer
  registers) loads it in whichever mode is active.

## Lite mode features

- **Opening files:** **Open…** (Ctrl+O) or drag and drop
- **Navigation:** orbit with left-drag, pan with right-drag, zoom with the wheel; click to
  select, double-click to focus
- **Structure tree:** Project → Site → Building → Storey → type → element, with search
- **Properties panel:** attributes, property sets and quantities
- **Keyboard:**
  - Hide (H), Isolate (I), Show all (A), Fit (F)
  - Spaces and zones (S), structure tree (T), clear selection (Esc)
  - Selecting a storey in the tree and pressing **I** isolates the whole storey.

## Prerequisites (Windows)

- Node.js 20+
- Rust (`winget install Rustlang.Rustup`)
- Microsoft C++ Build Tools with the "Desktop development with C++" workload
- WebView2 runtime (already included in Windows 10/11)

## Building the full viewer

The full viewer is built from the IFC-Lite monorepo and served as static files at the app root.
The steps below build it on E: (the monorepo needs several GB):

```powershell
git clone https://github.com/LTplus-AG/ifc-lite.git E:\ifc-lite-src
cd E:\ifc-lite-src
npx pnpm@10.8.1 install --filter "@ifc-lite/viewer..."
node scripts/fetch-prebuilt-wasm.mjs        # prebuilt WASM, no wasm-pack needed
npx pnpm@10.8.1 exec turbo build --filter="@ifc-lite/viewer..." --filter="!@ifc-lite/wasm"
```

Then build the viewer with this app's extra cloud sources and copy it to `vendor\ifc-lite-viewer`:

```powershell
npm run viewer:build
```

This builds `apps\viewer` with `viewer-host\desktop-entry.ts` in place of its `src\main.tsx`.
That entry calls the viewer's `mountViewer` with extra file-source providers, so the viewer's
source stays unpatched. `IFCLITE_SRC` overrides the monorepo location (default
`..\ifc-lite-src`). To serve a different build, set `IFCLITE_VIEWER_DIST`.

### Speckle cloud source

**Open from cloud → Speckle** is a single source for any number of Speckle servers, for example
app.speckle.systems, a self-hosted server, or the servers [Converge](https://converge.ing) hosts.

- **Sign in** opens the **Speckle servers** dialog. Add each server with its URL, an optional name
  and a personal access token, then use **Test** to check it. Create the token on that server under
  Settings → Developer → Access tokens, with `profile:read`, `streams:read` and `users:read`. A
  token only works on the server that issued it.
- To add, change or remove servers later, select **Sign out**, then **Sign in**. Signing out keeps
  the list, so the dialog opens with your servers filled in.
- Browse by server → project → model → IFC files. Each project also has **All uploaded IFC
  files**, which lists every IFC upload in it.
- The source loads the original uploaded IFC. Models pushed by connectors (Revit, Rhino, …) have no
  IFC original, so they don't appear.
- The server list and tokens are stored in the app's local storage on this computer, the same place
  the viewer keeps other sources' settings.

The provider is in `viewer-host\speckle\`.

On Windows, enable long paths before cloning: `git config --global core.longpaths true`.

## Run and build the app

```powershell
npm install
npm run app:dev      # run the desktop app in development mode
npm run app:build    # build the installers (platform-specific)
```

**Build outputs:**
- **Windows:** NSIS installer (`.exe`) and MSI installer (`.msi`) in `src-tauri/target/release/bundle/nsis` and `src-tauri/target/release/bundle/msi`
- **Linux:** AppImage (`.AppImage`) in `src-tauri/target/release/bundle/appimage`

### Building on Linux

On Ubuntu/Debian, install build dependencies:
```bash
sudo apt-get install -y libwebkit2gtk-4.1-dev libssl-dev libappindicator3-dev librsvg2-dev patchelf
npm install
npm run app:build
```

The resulting AppImage runs on any Linux distro without additional dependencies.

### Updating the full viewer

The full viewer is pre-built and committed to `vendor/ifc-lite-viewer/`. To update it:

```powershell
# Clone and build the IFC-Lite monorepo
git clone https://github.com/LTplus-AG/ifc-lite.git E:\ifc-lite-src
cd E:\ifc-lite-src
npx pnpm@10.8.1 install --filter "@ifc-lite/viewer..."
node scripts/fetch-prebuilt-wasm.mjs
npx pnpm@10.8.1 exec turbo build --filter="@ifc-lite/viewer..." --filter="!@ifc-lite/wasm"

# Return to this project and rebuild the viewer
cd E:\IFClite4Desktop
npm run viewer:build

# Commit the updated vendor directory
git add vendor/ifc-lite-viewer/
git commit -m "chore: update full viewer"
```

### Automated builds

Push a git tag to trigger automated builds for Windows and Linux via GitHub Actions:
```bash
git tag v0.1.1
git push origin v0.1.1
```

GitHub Actions will:
1. Check out your code (including the pre-built viewer in `vendor/ifc-lite-viewer/`)
2. Build the frontend
3. Build the desktop app for **Windows** (NSIS + MSI) and **Linux** (AppImage)
4. Create a GitHub Release with all installers

No monorepo checkout needed — CI uses the vendored viewer directly.

Sample models are in `samples/`.

## Project layout

| Path | Purpose |
|---|---|
| `lite.html`, `src/main.ts` | Lite viewer: loading, Three.js scene, picking, tree, properties, visibility |
| `src/ifc-to-threejs.ts` | Bakes mesh origins and merges `MeshData` into vertex-colored Three.js meshes |
| `src/ifc-data.ts` | Wrapper around `@ifc-lite/parser` (properties, spatial tree) |
| `src/host.ts` | Tauri integration (native dialog, file reads) with a browser fallback |
| `src-tauri/src/lib.rs` | Window setup and Rust commands (`read_ifc_file`, `startup_file`) |
| `src-tauri/src/shell.js` | Injected into every page: Full/Lite switching, WebGPU fallback, `/__local_file/` fetch shim |

## Notes

- Both modes run geometry on the IFC-Lite **WASM** engine. The desktop guide also describes a
  native Rust path (`get_geometry*` host commands). The full viewer forces
  `preferNative: false`, so that path isn't used yet.
- The full viewer runs at full fidelity. `shell.js` turns off three of the web viewer's speed
  shortcuts: LOD decimation (`__IFC_LITE_LOD_PX=0`), quantized vertex positions
  (`__IFC_LITE_QUANTIZED=false`) and small-object culling (`__IFC_LITE_CONTRIB_CULL=0`).
  With them on, thin MEP geometry such as round ducts renders boxy and broken.
- `MeshData.positions` are relative to `MeshData.origin`. Lite mode bakes each origin in when
  it loads a model (see `bakeMeshOrigins`).
- `vite.config.ts` works around `@ifc-lite/geometry` 7.8.x referencing `geometry.worker.ts`
  in its published build.
- `ifc-to-threejs.ts` and `ifc-data.ts` are adapted from IFC-Lite's `examples/threejs-viewer`.
  They, and the embedded viewer, are under MPL-2.0.

## License

This project is licensed under the **Mozilla Public License 2.0 (MPL-2.0)**.

**Dependencies:**
- **IFC-Lite viewer** (bundled at `vendor/ifc-lite-viewer`) — MPL-2.0
- **Three.js** — MIT
- **Tauri** — MIT / Apache 2.0

See [LICENSE](LICENSE) for the full text.
