/**
 * Host integration. Inside Tauri, files are picked with the native dialog and
 * read from disk by a Rust command; drag-and-drop delivers real paths. In a plain
 * browser (`npm run dev` for UI work) it falls back to <input type=file> and
 * HTML5 drag-and-drop.
 */

import { isTauri } from '@ifc-lite/geometry';

export interface LoadedFile {
  name: string;
  bytes: Uint8Array;
}

export interface HostHandlers {
  onFile: (file: LoadedFile) => void;
  onError: (message: string) => void;
  onDragState: (active: boolean) => void;
}

const inTauri = isTauri();

function baseName(path: string): string {
  return path.split(/[\\/]/).pop() ?? path;
}

function isIfcName(name: string): boolean {
  return name.toLowerCase().endsWith('.ifc');
}

async function readPath(path: string): Promise<LoadedFile> {
  const { invoke } = await import('@tauri-apps/api/core');
  // The Rust side returns a raw binary IPC response → ArrayBuffer (no JSON copy).
  const buffer = await invoke<ArrayBuffer>('read_ifc_file', { path });
  return { name: baseName(path), bytes: new Uint8Array(buffer) };
}

export async function setWindowTitle(title: string): Promise<void> {
  document.title = title;
  if (!inTauri) return;
  const { getCurrentWindow } = await import('@tauri-apps/api/window');
  await getCurrentWindow().setTitle(title);
}

export function createHost(handlers: HostHandlers) {
  const fileInput = document.getElementById('file-input') as HTMLInputElement;

  const loadPath = (path: string) => {
    if (!isIfcName(path)) {
      handlers.onError(`Not an IFC file: ${baseName(path)}`);
      return;
    }
    readPath(path).then(handlers.onFile, (err) => handlers.onError(String(err)));
  };

  async function openDialog(): Promise<void> {
    if (!inTauri) {
      fileInput.value = '';
      fileInput.click();
      return;
    }
    const { open } = await import('@tauri-apps/plugin-dialog');
    const selected = await open({
      multiple: false,
      directory: false,
      filters: [{ name: 'IFC model', extensions: ['ifc', 'IFC'] }],
    });
    if (typeof selected === 'string') loadPath(selected);
  }

  async function init(): Promise<void> {
    fileInput.addEventListener('change', async () => {
      const file = fileInput.files?.[0];
      if (file) handlers.onFile({ name: file.name, bytes: new Uint8Array(await file.arrayBuffer()) });
    });

    // HTML5 drag-and-drop in both browser and Tauri: the window has
    // dragDropEnabled=false so the full IFC-Lite viewer receives drops too.
    window.addEventListener('dragover', (e) => {
      e.preventDefault();
      handlers.onDragState(true);
    });
    window.addEventListener('dragleave', (e) => {
      if (!e.relatedTarget) handlers.onDragState(false);
    });
    window.addEventListener('drop', async (e) => {
      e.preventDefault();
      handlers.onDragState(false);
      const file = e.dataTransfer?.files[0];
      if (!file) return;
      if (!isIfcName(file.name)) return handlers.onError(`Not an IFC file: ${file.name}`);
      handlers.onFile({ name: file.name, bytes: new Uint8Array(await file.arrayBuffer()) });
    });

    if (!inTauri) return;

    // A file passed on the command line (double-click via file association).
    const { invoke } = await import('@tauri-apps/api/core');
    const startup = await invoke<string | null>('startup_file');
    if (startup) loadPath(startup);
  }

  return { init, openDialog };
}

