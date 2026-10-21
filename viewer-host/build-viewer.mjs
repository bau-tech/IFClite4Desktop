// Builds the full IFC-Lite viewer with the desktop entry (see vite.config.ts)
// and copies it to vendor/ifc-lite-viewer. The monorepo's packages must already
// be built once (see README, "Building the full viewer").
import { execSync } from 'node:child_process';
import { cpSync, existsSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const hostDir = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(hostDir, '..');
const srcRoot = path.resolve(process.env.IFCLITE_SRC ?? path.resolve(appDir, '../ifc-lite-src'));
const viewerDir = path.join(srcRoot, 'apps', 'viewer');
const dist = path.join(viewerDir, 'dist');
const vendor = path.join(appDir, 'vendor', 'ifc-lite-viewer');

if (!existsSync(viewerDir)) throw new Error(`IFC-Lite viewer not found at ${viewerDir} (set IFCLITE_SRC)`);

const run = (command, cwd) => execSync(command, { cwd, stdio: 'inherit' });
run(`npx pnpm@10.8.1 exec vite build --config "${path.join(hostDir, 'vite.config.ts')}"`, viewerDir);
run('node ../../scripts/check-tla-chunk-await.mjs', viewerDir);

rmSync(vendor, { recursive: true, force: true });
cpSync(dist, vendor, { recursive: true });
console.log(`[viewer:build] copied ${dist} -> ${vendor}`);
