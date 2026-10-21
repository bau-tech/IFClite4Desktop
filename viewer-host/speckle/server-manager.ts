/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { normalizeServerUrl, serverHost, testServer, type SpeckleServer } from './servers.js';

/**
 * "Speckle servers" dialog: add, test and remove any number of servers, each
 * with its own token. Resolves with the saved list, or null when cancelled.
 *
 * The host's settings form has a fixed set of single-line fields, so it cannot
 * hold a list of servers; this dialog is opened from the provider's sign-in
 * instead. Plain DOM, styled with the viewer's theme variables so it follows
 * light and dark mode.
 */

const STYLE_ID = 'ifclite-speckle-servers-style';
const CSS = `
.sps-backdrop { position: fixed; inset: 0; z-index: 2147483000; display: flex; align-items: center;
  justify-content: center; background: rgb(0 0 0 / 0.5); padding: 16px; }
.sps-dialog { width: min(560px, 100%); max-height: calc(100vh - 32px); overflow: auto; border-radius: 10px;
  border: 1px solid var(--color-border, #e4e4e7); background: var(--color-popover, #fff);
  color: var(--color-popover-foreground, #09090b); box-shadow: 0 10px 40px rgb(0 0 0 / 0.35);
  font: 14px/1.4 system-ui, sans-serif; padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.sps-dialog h2 { margin: 0; font-size: 16px; font-weight: 600; }
.sps-hint { margin: 0; font-size: 12px; color: var(--color-muted-foreground, #71717a); }
.sps-hint.sps-error { color: var(--color-destructive, #dc2626); }
.sps-hint.sps-error:empty { display: none; }
.sps-list { display: flex; flex-direction: column; gap: 10px; }
.sps-row { border: 1px solid var(--color-border, #e4e4e7); border-radius: 8px; padding: 10px;
  display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.sps-row label { display: flex; flex-direction: column; gap: 4px; font-size: 12px; font-weight: 500; }
.sps-row .sps-wide { grid-column: 1 / -1; }
.sps-dialog input { font: inherit; padding: 6px 8px; border-radius: 6px; color: inherit;
  border: 1px solid var(--color-input, var(--color-border, #e4e4e7)); background: var(--color-background, #fff); }
.sps-actions { grid-column: 1 / -1; display: flex; align-items: center; gap: 8px; }
.sps-status { flex: 1; font-size: 12px; color: var(--color-muted-foreground, #71717a); }
.sps-status.ok { color: #16a34a; } .sps-status.err { color: var(--color-destructive, #dc2626); }
.sps-dialog button { font: inherit; padding: 6px 12px; border-radius: 6px; cursor: pointer;
  border: 1px solid var(--color-border, #e4e4e7); background: transparent; color: inherit; }
.sps-dialog button:hover { background: var(--color-muted, #f4f4f5); }
.sps-dialog button.sps-primary { background: var(--color-primary, #2563eb);
  color: var(--color-primary-foreground, #fff); border-color: transparent; }
.sps-dialog button.sps-danger { color: var(--color-destructive, #dc2626); }
.sps-dialog button:disabled { opacity: 0.5; cursor: default; }
.sps-footer { display: flex; gap: 8px; justify-content: flex-end; }
.sps-footer .sps-add { margin-right: auto; }
`;

interface Row {
  label: HTMLInputElement;
  url: HTMLInputElement;
  token: HTMLInputElement;
  status: HTMLSpanElement;
  element: HTMLElement;
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Partial<HTMLElementTagNameMap[K]> = {},
  ...children: (Node | string)[]
): HTMLElementTagNameMap[K] {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children);
  return node;
}

function field(title: string, input: HTMLInputElement, wide = false): HTMLLabelElement {
  return el('label', { className: wide ? 'sps-wide' : '' }, title, input);
}

export function openServerManager(initial: readonly SpeckleServer[]): Promise<SpeckleServer[] | null> {
  if (!document.getElementById(STYLE_ID)) {
    document.head.append(el('style', { id: STYLE_ID, textContent: CSS }));
  }

  return new Promise((resolve) => {
    const rows: Row[] = [];
    const list = el('div', { className: 'sps-list' });
    const error = el('p', { className: 'sps-hint sps-error' });

    const addRow = (server?: SpeckleServer) => {
      const row: Row = {
        label: el('input', { placeholder: 'e.g. Converge', value: server?.label ?? '' }),
        url: el('input', { placeholder: 'https://app.speckle.systems', value: server?.url ?? '' }),
        token: el('input', { type: 'password', placeholder: 'Personal access token', value: server?.token ?? '' }),
        status: el('span', { className: 'sps-status' }),
        element: el('div', { className: 'sps-row' }),
      };
      const test = el('button', { type: 'button', textContent: 'Test' });
      const remove = el('button', { type: 'button', className: 'sps-danger', textContent: 'Remove' });
      test.onclick = async () => {
        row.status.className = 'sps-status';
        row.status.textContent = 'Testing…';
        try {
          const url = normalizeServerUrl(row.url.value);
          const name = await testServer(url, row.token.value.trim());
          row.status.className = 'sps-status ok';
          row.status.textContent = `Connected as ${name}`;
        } catch (err) {
          row.status.className = 'sps-status err';
          row.status.textContent = `Failed: ${err instanceof Error ? err.message : String(err)}`;
        }
      };
      remove.onclick = () => {
        rows.splice(rows.indexOf(row), 1);
        row.element.remove();
      };
      row.element.append(
        field('Name', row.label),
        field('Server URL', row.url),
        field('Personal access token', row.token, true),
        el('div', { className: 'sps-actions' }, row.status, test, remove),
      );
      rows.push(row);
      list.append(row.element);
      return row;
    };

    for (const server of initial) addRow(server);
    if (rows.length === 0) addRow();

    const close = (result: SpeckleServer[] | null) => {
      document.removeEventListener('keydown', onKey, true);
      backdrop.remove();
      resolve(result);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        close(null);
      }
    };

    const save = () => {
      const servers: SpeckleServer[] = [];
      const seen = new Set<string>();
      for (const row of rows) {
        if (!row.url.value.trim() && !row.token.value.trim()) continue;
        let url: string;
        try {
          url = normalizeServerUrl(row.url.value);
        } catch (err) {
          error.textContent = err instanceof Error ? err.message : String(err);
          row.url.focus();
          return;
        }
        const token = row.token.value.trim();
        if (!token) {
          error.textContent = `${serverHost(url)}: enter a personal access token.`;
          row.token.focus();
          return;
        }
        if (seen.has(url)) {
          error.textContent = `${serverHost(url)} is listed twice.`;
          return;
        }
        seen.add(url);
        servers.push({ url, token, label: row.label.value.trim() || serverHost(url) });
      }
      if (servers.length === 0) {
        error.textContent = 'Add at least one server.';
        return;
      }
      close(servers);
    };

    const addButton = el('button', { type: 'button', className: 'sps-add', textContent: '+ Add server' });
    addButton.onclick = () => addRow().url.focus();
    const cancelButton = el('button', { type: 'button', textContent: 'Cancel' });
    cancelButton.onclick = () => close(null);
    const saveButton = el('button', { type: 'button', className: 'sps-primary', textContent: 'Save and connect' });
    saveButton.onclick = save;

    const dialog = el(
      'div',
      { className: 'sps-dialog', role: 'dialog' },
      el('h2', { textContent: 'Speckle servers' }),
      el('p', {
        className: 'sps-hint',
        textContent:
          'Add every Speckle server you use. Create a token on each server under Settings → Developer → ' +
          'Access tokens, with the profile:read, streams:read and users:read scopes. A token only works on ' +
          'the server that issued it. Tokens are stored on this computer.',
      }),
      list,
      error,
      el('div', { className: 'sps-footer' }, addButton, cancelButton, saveButton),
    );
    dialog.setAttribute('aria-modal', 'true');
    const backdrop = el('div', { className: 'sps-backdrop' }, dialog);
    backdrop.onclick = (event) => {
      if (event.target === backdrop) close(null);
    };
    document.addEventListener('keydown', onKey, true);
    document.body.append(backdrop);
    (rows[0].url.value ? rows[0].token : rows[0].url).focus();
  });
}
