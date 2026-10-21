/**
 * IFClite Desktop — IFC viewer: @ifc-lite/geometry + @ifc-lite/parser + Three.js (WebGL).
 *
 *  1. Geometry streams from the IFC-Lite WASM engine; each batch is merged with
 *     vertex colors and shown immediately.
 *  2. On 'complete' the whole model is rebuilt as a few merged meshes (one draw
 *     call for all opaque geometry) and the streaming batches are disposed.
 *  3. Then @ifc-lite/parser builds the columnar data store that feeds the
 *     structure tree and the properties panel.
 *
 * Rendering is on demand (only when the camera or scene changes) so an idle
 * window costs no GPU time — important on older hardware.
 */

import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GeometryProcessor, type MeshData } from '@ifc-lite/geometry';
import {
  bakeMeshOrigins,
  batchWithVertexColors,
  findEntityByFace,
  meshDataToGeometry,
  type TriangleMaps,
} from './ifc-to-threejs';
import {
  buildDataStore,
  buildSpatialTreeFromStore,
  getEntityData,
  IfcTypeEnum,
  type IfcDataStore,
  type EntityData,
  type NamedRows,
  type SpatialTreeNode,
} from './ifc-data';
import { createHost, setWindowTitle, type LoadedFile } from './host';

const APP_NAME = 'IFClite Desktop';

// ── DOM ───────────────────────────────────────────────────────────────
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const canvas = $<HTMLCanvasElement>('canvas');
const viewport = $('viewport');
const statusEl = $('status');
const progressEl = $('progress');
const dropHint = $('drop-hint');
const treePanel = $('tree-panel');
const treeEl = $('tree');
const treeSearch = $<HTMLInputElement>('tree-search');
const treeCount = $('tree-count');
const propsPanel = $('props-panel');
const propsType = $('props-type');
const propsName = $('props-name');
const propsId = $('props-id');
const propsBody = $('props-body');
const btnOpen = $<HTMLButtonElement>('btn-open');
const btnFit = $<HTMLButtonElement>('btn-fit');
const btnHide = $<HTMLButtonElement>('btn-hide');
const btnIsolate = $<HTMLButtonElement>('btn-isolate');
const btnShowAll = $<HTMLButtonElement>('btn-show-all');
const btnTree = $<HTMLButtonElement>('btn-tree');
const btnSpaces = $<HTMLButtonElement>('btn-spaces');

// ── Three.js ──────────────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
// Cap the pixel ratio: rendering at full 4K density is the first thing that
// makes an older GPU struggle.
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2b3038);

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10000);
camera.position.set(20, 15, 20);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = false;
controls.screenSpacePanning = true;

scene.add(new THREE.HemisphereLight(0xffffff, 0x5a5f66, 1.6));
const sun = new THREE.DirectionalLight(0xffffff, 1.4);
sun.position.set(0.5, 1, 0.35);
scene.add(sun);

let renderPending = false;
function requestRender() {
  if (renderPending) return;
  renderPending = true;
  requestAnimationFrame(() => {
    renderPending = false;
    // Keep the key light coming from over the viewer's shoulder.
    sun.position.copy(camera.position).sub(controls.target).normalize().add(new THREE.Vector3(0, 0.8, 0));
    renderer.render(scene, camera);
  });
}
controls.addEventListener('change', requestRender);

function resize() {
  const w = viewport.clientWidth;
  const h = viewport.clientHeight;
  if (w === 0 || h === 0) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  requestRender();
}
new ResizeObserver(resize).observe(viewport);

// ── State ─────────────────────────────────────────────────────────────
// Native Rust geometry (NativeBridge) needs host commands we don't register yet,
// so stay on the WASM engine even inside Tauri. Instancing is off because
// instanced-only elements arrive as GPU shards, not as MeshData we can draw.
const geometry = new GeometryProcessor({ preferNative: false, enableInstancing: false });

/** Volumes that would hide the building; shown only when "Spaces" is on. */
const SPACE_TYPES = new Set(['IfcSpace', 'IfcSpatialZone', 'IfcOpeningElement', 'IfcZone']);
let showSpaces = false;
let geometryReady: Promise<void> | null = null;

let fileName = '';
let loadToken = 0;
let allMeshes: MeshData[] = [];
const meshesById = new Map<number, MeshData[]>();
let triangleMaps: TriangleMaps = new Map();
let modelRoot: THREE.Group | null = null;
let streamRoot: THREE.Group | null = null;
let dataStore: IfcDataStore | null = null;
let spatialRoot: SpatialTreeNode | null = null;
const hidden = new Set<number>();

type Selection = { id: number; spatial: SpatialTreeNode | null };
let selection: Selection | null = null;
let highlight: THREE.Mesh | null = null;
const highlightMaterial = new THREE.MeshBasicMaterial({
  color: 0x3d8bfd,
  transparent: true,
  opacity: 0.6,
  side: THREE.DoubleSide,
  depthWrite: false,
});

// ── Loading ───────────────────────────────────────────────────────────
function setStatus(text: string) {
  statusEl.textContent = text;
  statusEl.title = text;
}

function setBusy(busy: boolean) {
  progressEl.hidden = !busy;
}

async function loadFile(file: LoadedFile): Promise<void> {
  const token = ++loadToken;
  const t0 = performance.now();
  fileName = file.name;
  setBusy(true);
  setStatus(`Loading ${file.name}…`);
  void setWindowTitle(`${file.name} — ${APP_NAME}`);
  clearModel();

  try {
    geometryReady ??= geometry.init();
    await geometryReady;

    const batchGroups: THREE.Group[] = [];
    const meshes: MeshData[] = [];
    const stream = new THREE.Group();
    streamRoot = stream;
    scene.add(stream);
    let batches = 0;
    let base: [number, number, number] | null = null;

    for await (const event of geometry.processStreaming(file.bytes)) {
      if (token !== loadToken) return; // a newer file was opened
      if (event.type === 'batch') {
        base = bakeMeshOrigins(event.meshes, base);
        meshes.push(...event.meshes);
        const { group } = batchWithVertexColors(event.meshes.filter(isShown));
        stream.add(group);
        batchGroups.push(group);
        batches++;
        if (batches === 1 || batches % 20 === 0) fitToObject(stream, true);
        setStatus(`Loading ${file.name}… ${meshes.length.toLocaleString()} meshes`);
        requestRender();
      } else if (event.type === 'complete') {
        allMeshes = meshes;
        for (const m of meshes) {
          const list = meshesById.get(m.expressId);
          if (list) list.push(m);
          else meshesById.set(m.expressId, [m]);
        }
        rebuildModel();
        fitToObject(modelRoot, false);
        scene.remove(stream);
        for (const g of batchGroups) disposeObject(g);
        streamRoot = null;
        requestRender();
      }
    }
    if (token !== loadToken) return;

    const geomSec = ((performance.now() - t0) / 1000).toFixed(1);
    setStatus(`${file.name} — ${meshesById.size.toLocaleString()} elements · reading properties…`);
    updateButtons();

    // Parse attributes / properties / spatial structure. Copy the bytes into a
    // fresh ArrayBuffer in case the view does not span its whole buffer.
    const buffer = file.bytes.byteOffset === 0 && file.bytes.byteLength === file.bytes.buffer.byteLength
      ? (file.bytes.buffer as ArrayBuffer)
      : file.bytes.slice().buffer;
    const store = await buildDataStore(buffer);
    if (token !== loadToken) return;
    dataStore = store;
    spatialRoot = buildSpatialTreeFromStore(store);
    renderTree();

    const totalSec = ((performance.now() - t0) / 1000).toFixed(1);
    setStatus(`${file.name} — ${meshesById.size.toLocaleString()} elements · geometry ${geomSec}s · total ${totalSec}s`);
  } catch (err) {
    console.error(err);
    if (token === loadToken) setStatus(`Error loading ${file.name}: ${(err as Error).message ?? err}`);
  } finally {
    if (token === loadToken) setBusy(false);
  }
}

function clearModel() {
  clearSelection();
  if (streamRoot) { scene.remove(streamRoot); disposeObject(streamRoot); streamRoot = null; }
  if (modelRoot) { scene.remove(modelRoot); disposeObject(modelRoot); modelRoot = null; }
  allMeshes = [];
  meshesById.clear();
  triangleMaps = new Map();
  hidden.clear();
  dataStore = null;
  spatialRoot = null;
  resetTree();
  updateButtons();
  requestRender();
}

function isShown(m: MeshData): boolean {
  if (hidden.has(m.expressId)) return false;
  return showSpaces || !SPACE_TYPES.has(m.ifcType ?? '');
}

/** (Re)build the merged scene meshes from every visible element. */
function rebuildModel() {
  if (modelRoot) { scene.remove(modelRoot); disposeObject(modelRoot); }
  const { group, triangleMaps: maps } = batchWithVertexColors(allMeshes.filter(isShown));
  modelRoot = group;
  triangleMaps = maps;
  scene.add(group);
  requestRender();
}

function disposeObject(obj: THREE.Object3D) {
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry.dispose();
      (child.material as THREE.Material).dispose();
    }
  });
}

// ── Camera ────────────────────────────────────────────────────────────
function fitToBox(box: THREE.Box3, keepDirection: boolean) {
  if (box.isEmpty()) return;
  const center = box.getCenter(new THREE.Vector3());
  const radius = Math.max(box.getSize(new THREE.Vector3()).length() / 2, 0.01);
  const distance = radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2)) * 1.05;

  let dir: THREE.Vector3;
  if (keepDirection) {
    dir = camera.position.clone().sub(controls.target);
    if (dir.lengthSq() < 1e-8) dir.set(1, 0.6, 1);
    dir.normalize();
  } else {
    // Default home view: from the south-east, ~30° above the horizon.
    dir = new THREE.Vector3(1, 0.75, 1).normalize();
  }
  controls.target.copy(center);
  camera.position.copy(center).addScaledVector(dir, distance);
  // A tight near/far range keeps depth precision high (less z-fighting).
  camera.near = Math.max(distance / 1000, 0.01);
  camera.far = distance + radius * 20;
  camera.updateProjectionMatrix();
  controls.update();
  requestRender();
}

function fitToObject(obj: THREE.Object3D | null, keepDirection: boolean) {
  if (obj) fitToBox(new THREE.Box3().setFromObject(obj), keepDirection);
}

function boxForIds(ids: Iterable<number>): THREE.Box3 {
  const box = new THREE.Box3();
  const tmp = new THREE.Box3();
  for (const id of ids) {
    for (const m of meshesById.get(id) ?? []) {
      const p = m.positions;
      tmp.makeEmpty();
      for (let i = 0; i < p.length; i += 3) tmp.expandByPoint(new THREE.Vector3(p[i], p[i + 1], p[i + 2]));
      box.union(tmp);
    }
  }
  return box;
}

function fitAll() {
  if (modelRoot && modelRoot.children.length) fitToObject(modelRoot, true);
}

function focusSelection() {
  if (!selection) return;
  const box = boxForIds(selectionIds(selection));
  if (!box.isEmpty()) fitToBox(box, true);
}

// ── Picking ───────────────────────────────────────────────────────────
const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();

function pickAt(clientX: number, clientY: number): number | null {
  if (triangleMaps.size === 0) return null;
  const rect = canvas.getBoundingClientRect();
  ndc.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  const hits = raycaster.intersectObjects([...triangleMaps.keys()], false);
  const hit = hits[0];
  if (!hit || hit.faceIndex == null) return null;
  const ranges = triangleMaps.get(hit.object as THREE.Mesh);
  return ranges ? findEntityByFace(ranges, hit.faceIndex) : null;
}

let downX = 0;
let downY = 0;
let dragged = false;
canvas.addEventListener('pointerdown', (e) => {
  downX = e.clientX;
  downY = e.clientY;
  dragged = false;
});
canvas.addEventListener('pointermove', (e) => {
  if (e.buttons && Math.hypot(e.clientX - downX, e.clientY - downY) > 4) dragged = true;
});
canvas.addEventListener('click', (e) => {
  if (dragged) return;
  const id = pickAt(e.clientX, e.clientY);
  if (id == null) clearSelection();
  else select(id, true);
});
canvas.addEventListener('dblclick', (e) => {
  const id = pickAt(e.clientX, e.clientY);
  if (id != null) {
    select(id, true);
    focusSelection();
  }
});

// ── Selection ─────────────────────────────────────────────────────────
function typeNameOf(id: number): string {
  return dataStore?.entities.getTypeName(id) || meshesById.get(id)?.[0]?.ifcType || 'IfcProduct';
}

/** Element ids covered by a selection (a spatial node covers everything under it). */
function selectionIds(sel: Selection): number[] {
  if (!sel.spatial) return [sel.id];
  const out: number[] = [];
  const walk = (n: SpatialTreeNode) => {
    for (const g of n.elementGroups) out.push(...g.ids);
    n.children.forEach(walk);
  };
  walk(sel.spatial);
  return out;
}

function select(id: number, fromViewport: boolean, spatial: SpatialTreeNode | null = null) {
  selection = { id, spatial };
  applyHighlight(selectionIds(selection));
  showProperties(id);
  markTreeSelection(id, fromViewport);
  updateButtons();
}

function clearSelection() {
  selection = null;
  removeHighlight();
  propsPanel.hidden = true;
  markTreeSelection(null, false);
  updateButtons();
  requestRender();
}

function applyHighlight(ids: number[]) {
  removeHighlight();
  const meshes = ids.flatMap((id) => meshesById.get(id) ?? []).filter(isShown);
  if (meshes.length) {
    highlight = new THREE.Mesh(meshDataToGeometry(meshes), highlightMaterial);
    highlight.renderOrder = 2;
    scene.add(highlight);
  }
  requestRender();
}

function removeHighlight() {
  if (!highlight) return;
  scene.remove(highlight);
  highlight.geometry.dispose();
  highlight = null;
}

// ── Visibility ────────────────────────────────────────────────────────
function hideSelection() {
  if (!selection) return;
  for (const id of selectionIds(selection)) hidden.add(id);
  rebuildModel();
  clearSelection();
  refreshTreeVisibility();
}

function isolateSelection() {
  if (!selection) return;
  const keep = new Set(selectionIds(selection));
  hidden.clear();
  for (const id of meshesById.keys()) if (!keep.has(id)) hidden.add(id);
  rebuildModel();
  applyHighlight([...keep]);
  focusSelection();
  refreshTreeVisibility();
  updateButtons();
}

function showAll() {
  if (!hidden.size) return;
  hidden.clear();
  rebuildModel();
  if (selection) applyHighlight(selectionIds(selection));
  refreshTreeVisibility();
  updateButtons();
}

function updateButtons() {
  const loaded = meshesById.size > 0;
  btnFit.disabled = !loaded;
  btnHide.disabled = !selection || !loaded;
  btnIsolate.disabled = !selection || !loaded;
  btnShowAll.disabled = hidden.size === 0;
}

// ── Properties panel ──────────────────────────────────────────────────
function showProperties(id: number) {
  const typeName = typeNameOf(id);
  propsType.textContent = typeName;
  propsName.textContent = dataStore?.entities.getName(id) || '';
  propsId.textContent = `#${id}`;
  propsPanel.hidden = false;

  if (!dataStore) {
    propsBody.innerHTML = `<p class="note">Reading properties…</p>`;
    return;
  }
  let data: EntityData;
  try {
    data = getEntityData(dataStore, id, typeName);
  } catch (err) {
    propsBody.innerHTML = `<p class="note">Could not read properties: ${esc(String(err))}</p>`;
    return;
  }
  propsName.textContent = data.name || '';
  const attrs: Array<[string, string]> = [
    ['GlobalId', data.globalId],
    ['Name', data.name],
    ['Description', data.description],
    ['ObjectType', data.objectType],
    ['Tag', data.tag],
  ];
  propsBody.innerHTML = `
    <div class="section"><h3>Attributes</h3>${attrs.map(([k, v]) => kvRow(k, v || '—')).join('')}</div>
    <div class="section"><h3>Property sets</h3>${setsHtml(data.propertySets, 'No property sets')}</div>
    <div class="section"><h3>Quantities</h3>${setsHtml(data.quantitySets, 'No quantity sets')}</div>`;
}

propsBody.addEventListener('click', (e) => {
  const btn = (e.target as HTMLElement).closest('.set-toggle');
  if (!btn) return;
  btn.nextElementSibling?.classList.toggle('open');
  btn.querySelector('.twisty')?.classList.toggle('open');
});

function kvRow(k: string, v: string) {
  return `<div class="kv"><span class="k">${esc(k)}</span><span class="v${v === '—' ? ' empty' : ''}">${esc(v)}</span></div>`;
}

function setsHtml(sets: NamedRows[], empty: string) {
  if (!sets.length) return `<p class="note">${empty}</p>`;
  // The first set starts expanded; the rest are one click away.
  return sets.map((s, i) => `
    <div class="set">
      <button class="set-toggle" type="button"><span>${esc(s.name)}</span><span class="twisty${i === 0 ? ' open' : ''}">▶</span></button>
      <div class="set-body${i === 0 ? ' open' : ''}">${s.rows.map(([k, v]) => kvRow(k, v)).join('')}</div>
    </div>`).join('');
}

$('props-close').addEventListener('click', clearSelection);

// ── Structure tree ────────────────────────────────────────────────────
// Spatial containers are rendered up front; element rows are created only when
// their type group is first expanded, so huge models don't flood the DOM.

interface GroupInfo { ids: number[]; depth: number; children: HTMLElement; populated: boolean }
const groupInfo = new Map<string, GroupInfo>();
const spatialById = new Map<number, SpatialTreeNode>();
const spatialParent = new Map<number, number>();
/** element id → the type-group key that contains it */
const elementGroupKey = new Map<number, string>();
const groupSpatial = new Map<string, number>();

function resetTree() {
  groupInfo.clear();
  spatialById.clear();
  spatialParent.clear();
  elementGroupKey.clear();
  groupSpatial.clear();
  treeSearch.value = '';
  treeCount.hidden = true;
  treeEl.innerHTML = `<p class="placeholder">${fileName ? 'Reading structure…' : 'Open an IFC file to explore its structure.'}</p>`;
}

function renderTree() {
  resetTree();
  if (!spatialRoot || !dataStore) {
    treeEl.innerHTML = `<p class="placeholder">No spatial structure found.</p>`;
    return;
  }
  treeCount.textContent = spatialRoot.totalElements.toLocaleString();
  treeCount.hidden = false;
  treeEl.textContent = '';
  treeEl.appendChild(spatialNodeEl(spatialRoot, 0, null));
}

function kindOf(type: IfcTypeEnum): [string, string] {
  switch (type) {
    case IfcTypeEnum.IfcProject: return ['prj', 'PRJ'];
    case IfcTypeEnum.IfcSite: return ['sit', 'SITE'];
    case IfcTypeEnum.IfcBuilding: return ['bld', 'BLDG'];
    case IfcTypeEnum.IfcBuildingStorey: return ['sto', 'LVL'];
    case IfcTypeEnum.IfcSpace: return ['', 'SPC'];
    default: return ['bld', 'FAC'];
  }
}

function makeRow(depth: number, hasChildren: boolean, open: boolean): { row: HTMLElement; twisty: HTMLElement } {
  const row = document.createElement('div');
  row.className = 'row';
  row.style.setProperty('--d', String(depth));
  const twisty = document.createElement('span');
  twisty.className = `twisty${hasChildren ? (open ? ' open' : '') : ' leaf'}`;
  twisty.textContent = '▶';
  row.appendChild(twisty);
  return { row, twisty };
}

function span(cls: string, text: string): HTMLElement {
  const s = document.createElement('span');
  s.className = cls;
  s.textContent = text;
  return s;
}

function spatialNodeEl(node: SpatialTreeNode, depth: number, parentId: number | null): HTMLElement {
  spatialById.set(node.expressId, node);
  if (parentId != null) spatialParent.set(node.expressId, parentId);

  const wrap = document.createElement('div');
  const hasChildren = node.children.length > 0 || node.elementGroups.length > 0;
  const open = depth < 3; // Project → Site → Building expanded by default
  const { row } = makeRow(depth, hasChildren, open);
  row.dataset.id = String(node.expressId);
  row.dataset.spatial = '1';
  const [cls, abbr] = kindOf(node.type);
  row.appendChild(span(`kind ${cls}`, abbr));
  row.appendChild(span('label', node.name || dataStore?.entities.getName(node.expressId) || `#${node.expressId}`));
  if (node.elevation != null) {
    const elev = Math.abs(node.elevation) < 0.005 ? 0 : node.elevation;
    row.appendChild(span('sub', `${elev.toFixed(2)} m`));
  }
  if (node.totalElements > 0) row.appendChild(span('count', node.totalElements.toLocaleString()));

  const children = document.createElement('div');
  children.className = `children${open ? ' open' : ''}`;
  children.id = `s-${node.expressId}`;
  for (const child of node.children) children.appendChild(spatialNodeEl(child, depth + 1, node.expressId));
  for (const g of node.elementGroups) children.appendChild(groupEl(node.expressId, g.typeName, g.ids, depth + 1));

  wrap.append(row, children);
  return wrap;
}

function groupEl(spatialId: number, typeName: string, ids: number[], depth: number): HTMLElement {
  const key = `${spatialId}:${typeName}`;
  const wrap = document.createElement('div');
  const { row } = makeRow(depth, ids.length > 0, false);
  row.dataset.group = key;
  row.appendChild(span('dot', ''));
  (row.lastChild as HTMLElement).style.background = typeColor(typeName);
  row.appendChild(span('label', typeName.replace(/^Ifc/, '')));
  row.appendChild(span('count', ids.length.toLocaleString()));

  const children = document.createElement('div');
  children.className = 'children';
  groupInfo.set(key, { ids, depth: depth + 1, children, populated: false });
  groupSpatial.set(key, spatialId);
  for (const id of ids) elementGroupKey.set(id, key);

  wrap.append(row, children);
  return wrap;
}

function elementRowEl(id: number, depth: number, sub?: string): HTMLElement {
  const { row } = makeRow(depth, false, false);
  row.dataset.id = String(id);
  row.dataset.element = '1';
  row.appendChild(span('label', dataStore?.entities.getName(id) || `#${id}`));
  if (sub) row.appendChild(span('sub', sub));
  if (hidden.has(id)) row.classList.add('hidden-el');
  if (selection?.id === id) row.classList.add('selected');
  return row;
}

function populateGroup(key: string) {
  const info = groupInfo.get(key);
  if (!info || info.populated) return;
  const frag = document.createDocumentFragment();
  for (const id of info.ids) frag.appendChild(elementRowEl(id, info.depth));
  info.children.appendChild(frag);
  info.populated = true;
}

function setOpen(row: HTMLElement, open: boolean) {
  const children = row.nextElementSibling as HTMLElement | null;
  if (!children) return;
  if (open && row.dataset.group) populateGroup(row.dataset.group);
  children.classList.toggle('open', open);
  row.querySelector('.twisty')?.classList.toggle('open', open);
}

treeEl.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const row = target.closest<HTMLElement>('.row');
  if (!row) return;
  const isTwisty = target.classList.contains('twisty') && !target.classList.contains('leaf');
  const children = row.nextElementSibling;
  const isOpen = !!children?.classList.contains('open');

  if (row.dataset.group || isTwisty) {
    setOpen(row, !isOpen);
    return;
  }
  const id = Number(row.dataset.id);
  if (row.dataset.spatial) select(id, false, spatialById.get(id) ?? null);
  else if (row.dataset.element) select(id, false);
});

treeEl.addEventListener('dblclick', (e) => {
  const row = (e.target as HTMLElement).closest<HTMLElement>('.row');
  if (row?.dataset.id && !row.dataset.group) focusSelection();
});

function markTreeSelection(id: number | null, reveal: boolean) {
  for (const r of treeEl.querySelectorAll('.row.selected')) r.classList.remove('selected');
  if (id == null) return;
  if (reveal && !treeSearch.value) revealInTree(id);
  for (const r of treeEl.querySelectorAll<HTMLElement>(`.row[data-id="${id}"]`)) r.classList.add('selected');
}

/** Expand the tree down to an element's row and scroll it into view. */
function revealInTree(id: number) {
  const key = elementGroupKey.get(id);
  if (!key) return;
  let sid: number | undefined = groupSpatial.get(key);
  while (sid != null) {
    const container = document.getElementById(`s-${sid}`);
    if (container?.previousElementSibling) setOpen(container.previousElementSibling as HTMLElement, true);
    sid = spatialParent.get(sid);
  }
  const groupRow = treeEl.querySelector<HTMLElement>(`.row[data-group="${CSS.escape(key)}"]`);
  if (groupRow) setOpen(groupRow, true);
  treeEl.querySelector<HTMLElement>(`.row[data-id="${id}"]`)?.scrollIntoView({ block: 'nearest' });
}

function refreshTreeVisibility() {
  for (const r of treeEl.querySelectorAll<HTMLElement>('.row[data-element]')) {
    r.classList.toggle('hidden-el', hidden.has(Number(r.dataset.id)));
  }
}

let searchTimer = 0;
treeSearch.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = window.setTimeout(runSearch, 150);
});

function runSearch() {
  if (!spatialRoot || !dataStore) return;
  const q = treeSearch.value.trim().toLowerCase();
  if (!q) {
    renderTree();
    if (selection) markTreeSelection(selection.id, true);
    return;
  }
  const LIMIT = 500;
  const matches: Array<{ id: number; typeName: string }> = [];
  let total = 0;
  const idQuery = q.replace(/^#/, '');
  for (const [id, key] of elementGroupKey) {
    const typeName = key.slice(key.indexOf(':') + 1);
    const name = dataStore.entities.getName(id) || '';
    if (typeName.toLowerCase().includes(q) || name.toLowerCase().includes(q) || String(id) === idQuery) {
      total++;
      if (matches.length < LIMIT) matches.push({ id, typeName });
    }
  }
  treeEl.textContent = '';
  if (!matches.length) {
    treeEl.innerHTML = `<p class="placeholder">No results for “${esc(q)}”</p>`;
    return;
  }
  const frag = document.createDocumentFragment();
  for (const m of matches) frag.appendChild(elementRowEl(m.id, 0, m.typeName.replace(/^Ifc/, '')));
  if (total > LIMIT) {
    const more = document.createElement('p');
    more.className = 'placeholder';
    more.textContent = `Showing ${LIMIT} of ${total.toLocaleString()} matches — refine the search.`;
    frag.appendChild(more);
  }
  treeEl.appendChild(frag);
}

function typeColor(typeName: string): string {
  let h = 0;
  for (let i = 0; i < typeName.length; i++) h = (h * 31 + typeName.charCodeAt(i)) & 0xffff;
  return `hsl(${h % 360},50%,55%)`;
}

// ── Toolbar & keyboard ────────────────────────────────────────────────
const host = createHost({
  onFile: (f) => void loadFile(f),
  onError: (msg) => setStatus(msg),
  onDragState: (active) => { dropHint.hidden = !active; },
});

function toggleSpaces() {
  showSpaces = !showSpaces;
  btnSpaces.classList.toggle('on', showSpaces);
  if (meshesById.size) {
    rebuildModel();
    if (selection) applyHighlight(selectionIds(selection));
  }
}

function toggleTree() {
  treePanel.hidden = !treePanel.hidden;
  btnTree.classList.toggle('on', !treePanel.hidden);
}

btnOpen.addEventListener('click', () => void host.openDialog().catch((e) => setStatus(String(e))));
btnFit.addEventListener('click', fitAll);
btnHide.addEventListener('click', hideSelection);
btnIsolate.addEventListener('click', isolateSelection);
btnShowAll.addEventListener('click', showAll);
btnTree.addEventListener('click', toggleTree);
btnSpaces.addEventListener('click', toggleSpaces);

// Full IFC-Lite viewer (WebGPU) lives at the app root; remember the choice.
const MODE_KEY = 'ifclite-desktop.mode';
$<HTMLButtonElement>('btn-full').addEventListener('click', () => {
  try { localStorage.setItem(MODE_KEY, 'full'); } catch { /* storage unavailable */ }
  location.href = '/index.html';
});
if (new URLSearchParams(location.search).get('reason') === 'no-webgpu') {
  setStatus('WebGPU is not available on this PC — using the Lite viewer.');
}

window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'o') {
    e.preventDefault();
    void host.openDialog();
    return;
  }
  if (e.target instanceof HTMLInputElement) {
    if (e.key === 'Escape') (e.target as HTMLInputElement).blur();
    return;
  }
  if (e.ctrlKey || e.altKey || e.metaKey) return;
  switch (e.key.toLowerCase()) {
    case 'escape': clearSelection(); break;
    case 'f': selection ? focusSelection() : fitAll(); break;
    case 'h': hideSelection(); break;
    case 'i': isolateSelection(); break;
    case 'a': showAll(); break;
    case 't': toggleTree(); break;
    case 's': toggleSpaces(); break;
  }
});

// Block the WebView's default context menu over the 3D view (right-drag pans).
canvas.addEventListener('contextmenu', (e) => e.preventDefault());

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

resize();
host.init().catch((err) => setStatus(`Startup error: ${err}`));
