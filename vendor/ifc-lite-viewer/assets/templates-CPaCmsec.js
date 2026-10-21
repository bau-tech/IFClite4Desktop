import{t as e}from"./cost-tree-DEswcKeK.js";var t=`/* This Source Code Form is subject to the terms of the Mozilla Public\r
 * License, v. 2.0. If a copy of the MPL was not distributed with this\r
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */\r
\r
export {} // module boundary (stripped by transpiler)\r
\r
// ── Data Quality Audit ──────────────────────────────────────────────────\r
// Stakeholder: BIM Manager / QA\r
//\r
// Scans every entity in the model for data completeness issues that would\r
// take hours to find by clicking through the UI. Produces a scorecard,\r
// color-codes the 3D view by quality level, and exports an issues CSV.\r
// ─────────────────────────────────────────────────────────────────────────\r
\r
bim.viewer.resetColors()\r
const all = bim.query.all()\r
if (all.length === 0) { console.error('No entities loaded'); throw new Error('empty model') }\r
\r
// ── 1. Check every entity for missing attributes ────────────────────────\r
interface Issue { entity: BimEntity; field: string }\r
const issues: Issue[] = []\r
const scores: Record<string, { entity: BimEntity; score: number }> = {}\r
\r
// Track property coverage per type\r
const typePsetCoverage: Record<string, { total: number; withPsets: number }> = {}\r
\r
for (const e of all) {\r
  let score = 0\r
  const maxScore = 5 // Name, Description, ObjectType, has properties, has quantities\r
\r
  if (e.Name && e.Name !== '') score++\r
  else issues.push({ entity: e, field: 'Name' })\r
\r
  if (e.Description && e.Description !== '') score++\r
  else issues.push({ entity: e, field: 'Description' })\r
\r
  if (e.ObjectType && e.ObjectType !== '') score++\r
  else issues.push({ entity: e, field: 'ObjectType' })\r
\r
  const psets = bim.query.properties(e)\r
  if (psets.length > 0) score++\r
  else issues.push({ entity: e, field: 'PropertySets' })\r
\r
  const qsets = bim.query.quantities(e)\r
  if (qsets.length > 0) score++\r
  else issues.push({ entity: e, field: 'Quantities' })\r
\r
  scores[e.GlobalId] = { entity: e, score }\r
\r
  // Track pset coverage per type\r
  if (!typePsetCoverage[e.Type]) typePsetCoverage[e.Type] = { total: 0, withPsets: 0 }\r
  typePsetCoverage[e.Type].total++\r
  if (psets.length > 0) typePsetCoverage[e.Type].withPsets++\r
}\r
\r
// ── 2. Classify entities by quality tier ────────────────────────────────\r
const tiers = { complete: [] as BimEntity[], good: [] as BimEntity[], partial: [] as BimEntity[], poor: [] as BimEntity[] }\r
for (const { entity, score } of Object.values(scores)) {\r
  if (score === 5) tiers.complete.push(entity)\r
  else if (score >= 4) tiers.good.push(entity)\r
  else if (score >= 2) tiers.partial.push(entity)\r
  else tiers.poor.push(entity)\r
}\r
\r
// ── 3. Color-code by quality ────────────────────────────────────────────\r
const batches: Array<{ entities: BimEntity[]; color: string }> = []\r
if (tiers.complete.length > 0) batches.push({ entities: tiers.complete, color: '#27ae60' }) // green\r
if (tiers.good.length > 0) batches.push({ entities: tiers.good, color: '#f1c40f' })    // yellow\r
if (tiers.partial.length > 0) batches.push({ entities: tiers.partial, color: '#e67e22' }) // orange\r
if (tiers.poor.length > 0) batches.push({ entities: tiers.poor, color: '#e74c3c' })    // red\r
if (batches.length > 0) bim.viewer.colorizeAll(batches)\r
\r
// ── 4. Report ───────────────────────────────────────────────────────────\r
const overallScore = ((tiers.complete.length + tiers.good.length * 0.8 + tiers.partial.length * 0.4) / all.length * 100)\r
console.log('═══════════════════════════════════════')\r
console.log('  DATA QUALITY AUDIT')\r
console.log('═══════════════════════════════════════')\r
console.log('')\r
console.log('Overall score: ' + overallScore.toFixed(1) + '% (' + all.length + ' entities)')\r
console.log('')\r
console.log('  Complete (5/5): ' + tiers.complete.length + '  ● green')\r
console.log('  Good     (4/5): ' + tiers.good.length + '  ● yellow')\r
console.log('  Partial  (2-3): ' + tiers.partial.length + '  ● orange')\r
console.log('  Poor     (0-1): ' + tiers.poor.length + '  ● red')\r
\r
// ── 5. Issue breakdown by field ─────────────────────────────────────────\r
const issuesByField: Record<string, number> = {}\r
for (const issue of issues) {\r
  issuesByField[issue.field] = (issuesByField[issue.field] || 0) + 1\r
}\r
console.log('')\r
console.log('── Missing Data Breakdown ──')\r
for (const [field, count] of Object.entries(issuesByField).sort((a, b) => b[1] - a[1])) {\r
  const pct = (count / all.length * 100).toFixed(1)\r
  console.log('  ' + field + ': ' + count + ' entities (' + pct + '% missing)')\r
}\r
\r
// ── 6. Property coverage per type ───────────────────────────────────────\r
console.log('')\r
console.log('── Property Coverage by Type ──')\r
const coverageSorted = Object.entries(typePsetCoverage)\r
  .sort((a, b) => b[1].total - a[1].total)\r
  .slice(0, 15)\r
for (const [type, cov] of coverageSorted) {\r
  const pct = (cov.withPsets / cov.total * 100).toFixed(0)\r
  const bar = '█'.repeat(Math.round(cov.withPsets / cov.total * 20))\r
  console.log('  ' + type + ': ' + bar + ' ' + pct + '% (' + cov.withPsets + '/' + cov.total + ')')\r
}\r
\r
// ── 7. Worst offenders (first 10 entities with score 0-1) ──────────────\r
if (tiers.poor.length > 0) {\r
  console.log('')\r
  console.log('── Worst Offenders (score 0-1) ──')\r
  for (const e of tiers.poor.slice(0, 10)) {\r
    console.log('  ' + (e.Name || '<no name>') + ' [' + e.Type + '] GlobalId=' + e.GlobalId)\r
  }\r
  if (tiers.poor.length > 10) {\r
    console.log('  ... and ' + (tiers.poor.length - 10) + ' more')\r
  }\r
}\r
\r
// ── 8. Export all entities with discovered property/quantity data ────────\r
// Discover common property columns from a sample\r
const sampleForDiscovery = all.slice(0, 200)\r
const discoveredPropPaths = new Set<string>()\r
const discoveredQtyPaths = new Set<string>()\r
for (const e of sampleForDiscovery) {\r
  const psets = bim.query.properties(e)\r
  for (const pset of psets) {\r
    for (const p of pset.properties) {\r
      if (p.value !== null && p.value !== '') {\r
        discoveredPropPaths.add(pset.name + '.' + p.name)\r
      }\r
    }\r
  }\r
  const qsets = bim.query.quantities(e)\r
  for (const qset of qsets) {\r
    for (const q of qset.quantities) {\r
      if (q.value !== null && q.value !== 0) {\r
        discoveredQtyPaths.add(qset.name + '.' + q.name)\r
      }\r
    }\r
  }\r
}\r
// Cap columns to keep CSV manageable\r
const auditPropCols = Array.from(discoveredPropPaths).sort().slice(0, 20)\r
const auditQtyCols = Array.from(discoveredQtyPaths).sort().slice(0, 10)\r
bim.export.csv(all, {\r
  columns: ['Name', 'Type', 'GlobalId', 'Description', 'ObjectType', ...auditPropCols, ...auditQtyCols],\r
  filename: 'data-quality-audit.csv'\r
})\r
console.log('')\r
console.log('Exported ' + all.length + ' entities (' + (5 + auditPropCols.length + auditQtyCols.length) + ' columns) to data-quality-audit.csv')\r
`,n=`/* This Source Code Form is subject to the terms of the Mozilla Public\r
 * License, v. 2.0. If a copy of the MPL was not distributed with this\r
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */\r
\r
export {} // module boundary (stripped by transpiler)\r
\r
// ── Fire Safety Compliance Check ────────────────────────────────────────\r
// Stakeholder: Architect / Fire Safety Engineer\r
//\r
// Cross-references fire rating properties across walls and doors — a task\r
// that requires clicking through hundreds of entities in the properties\r
// panel. The script checks Pset_WallCommon.FireRating and\r
// Pset_DoorCommon.FireRating, flags missing or non-compliant values,\r
// color-codes the model by compliance status, and generates a report.\r
// ─────────────────────────────────────────────────────────────────────────\r
\r
bim.viewer.resetColors()\r
\r
// ── 1. Gather fire-rated element types ──────────────────────────────────\r
const walls = bim.query.byType('IfcWall', 'IfcWallStandardCase')\r
const doors = bim.query.byType('IfcDoor', 'IfcDoorStandardCase')\r
const slabs = bim.query.byType('IfcSlab')\r
const total = walls.length + doors.length + slabs.length\r
\r
if (total === 0) {\r
  console.error('No walls, doors, or slabs found in model')\r
  throw new Error('no elements')\r
}\r
\r
// ── 2. Extract fire rating from properties ──────────────────────────────\r
interface FireResult {\r
  entity: BimEntity\r
  rating: string | null\r
  isLoadBearing: boolean | null\r
  isExternal: boolean | null\r
}\r
\r
// Collect fire-related property paths for CSV export\r
const firePropPaths = new Set<string>()\r
\r
function extractFireData(entity: BimEntity): FireResult {\r
  const result: FireResult = { entity, rating: null, isLoadBearing: null, isExternal: null }\r
  const psets = bim.query.properties(entity)\r
  for (const pset of psets) {\r
    for (const p of pset.properties) {\r
      const lower = p.name.toLowerCase()\r
      if (lower === 'firerating' && p.value !== null && p.value !== '') {\r
        result.rating = String(p.value)\r
        firePropPaths.add(pset.name + '.FireRating')\r
      }\r
      if (lower === 'loadbearing' && p.value !== null) {\r
        result.isLoadBearing = p.value === true || p.value === 'TRUE' || p.value === '.T.'\r
        firePropPaths.add(pset.name + '.LoadBearing')\r
      }\r
      if (lower === 'isexternal' && p.value !== null) {\r
        result.isExternal = p.value === true || p.value === 'TRUE' || p.value === '.T.'\r
        firePropPaths.add(pset.name + '.IsExternal')\r
      }\r
    }\r
  }\r
  return result\r
}\r
\r
// ── 3. Analyze each element category ────────────────────────────────────\r
const wallResults = walls.map(extractFireData)\r
const doorResults = doors.map(extractFireData)\r
const slabResults = slabs.map(extractFireData)\r
\r
// Classify\r
const rated: BimEntity[] = []\r
const unrated: BimEntity[] = []\r
const loadBearingUnrated: BimEntity[] = []\r
const externalUnrated: BimEntity[] = []\r
\r
for (const r of [...wallResults, ...doorResults, ...slabResults]) {\r
  if (r.rating) {\r
    rated.push(r.entity)\r
  } else {\r
    unrated.push(r.entity)\r
    if (r.isLoadBearing) loadBearingUnrated.push(r.entity)\r
    if (r.isExternal) externalUnrated.push(r.entity)\r
  }\r
}\r
\r
// ── 4. Group by fire rating value ───────────────────────────────────────\r
const ratingGroups: Record<string, BimEntity[]> = {}\r
for (const r of [...wallResults, ...doorResults, ...slabResults]) {\r
  if (r.rating) {\r
    if (!ratingGroups[r.rating]) ratingGroups[r.rating] = []\r
    ratingGroups[r.rating].push(r.entity)\r
  }\r
}\r
\r
// ── 5. Color-code by compliance ─────────────────────────────────────────\r
const batches: Array<{ entities: BimEntity[]; color: string }> = []\r
if (rated.length > 0) batches.push({ entities: rated, color: '#27ae60' })           // green = rated\r
if (loadBearingUnrated.length > 0) batches.push({ entities: loadBearingUnrated, color: '#e74c3c' }) // red = critical\r
if (externalUnrated.length > 0) batches.push({ entities: externalUnrated, color: '#e67e22' })       // orange = warning\r
// Remaining unrated that are not load-bearing or external\r
const otherUnrated = unrated.filter(e => {\r
  const isLB = loadBearingUnrated.some(lb => lb.GlobalId === e.GlobalId)\r
  const isExt = externalUnrated.some(ext => ext.GlobalId === e.GlobalId)\r
  return !isLB && !isExt\r
})\r
if (otherUnrated.length > 0) batches.push({ entities: otherUnrated, color: '#f1c40f' }) // yellow = missing\r
if (batches.length > 0) bim.viewer.colorizeAll(batches)\r
\r
// ── 6. Report ───────────────────────────────────────────────────────────\r
const compliancePct = (rated.length / total * 100).toFixed(1)\r
console.log('═══════════════════════════════════════')\r
console.log('  FIRE SAFETY COMPLIANCE CHECK')\r
console.log('═══════════════════════════════════════')\r
console.log('')\r
console.log('Scanned: ' + walls.length + ' walls, ' + doors.length + ' doors, ' + slabs.length + ' slabs')\r
console.log('Compliance: ' + compliancePct + '% (' + rated.length + '/' + total + ' rated)')\r
console.log('')\r
console.log('  ● Rated:                    ' + rated.length + '  green')\r
console.log('  ● Missing (load-bearing):   ' + loadBearingUnrated.length + '  red — CRITICAL')\r
console.log('  ● Missing (external):       ' + externalUnrated.length + '  orange — WARNING')\r
console.log('  ● Missing (other):          ' + otherUnrated.length + '  yellow')\r
\r
// ── 7. Rating distribution ──────────────────────────────────────────────\r
if (Object.keys(ratingGroups).length > 0) {\r
  console.log('')\r
  console.log('── Fire Rating Distribution ──')\r
  const ratingsSorted = Object.entries(ratingGroups).sort((a, b) => b[1].length - a[1].length)\r
  for (const [rating, entities] of ratingsSorted) {\r
    console.log('  ' + rating + ': ' + entities.length + ' elements')\r
  }\r
}\r
\r
// ── 8. Per-type breakdown ───────────────────────────────────────────────\r
console.log('')\r
console.log('── Breakdown by Element Type ──')\r
const typeGroups: Record<string, { rated: number; total: number }> = {}\r
for (const r of [...wallResults, ...doorResults, ...slabResults]) {\r
  const t = r.entity.Type\r
  if (!typeGroups[t]) typeGroups[t] = { rated: 0, total: 0 }\r
  typeGroups[t].total++\r
  if (r.rating) typeGroups[t].rated++\r
}\r
for (const [type, g] of Object.entries(typeGroups).sort((a, b) => b[1].total - a[1].total)) {\r
  const pct = (g.rated / g.total * 100).toFixed(0)\r
  console.log('  ' + type + ': ' + g.rated + '/' + g.total + ' rated (' + pct + '%)')\r
}\r
\r
// ── 9. Critical issues list ─────────────────────────────────────────────\r
if (loadBearingUnrated.length > 0) {\r
  console.log('')\r
  console.warn('── CRITICAL: Load-Bearing Without Fire Rating ──')\r
  for (const e of loadBearingUnrated.slice(0, 15)) {\r
    console.warn('  ' + (e.Name || '<unnamed>') + ' [' + e.Type + '] GlobalId=' + e.GlobalId)\r
  }\r
  if (loadBearingUnrated.length > 15) console.warn('  ... and ' + (loadBearingUnrated.length - 15) + ' more')\r
}\r
\r
// ── 10. Export all scanned elements with fire properties ────────────────\r
const allFireElements = [...walls, ...doors, ...slabs]\r
const fireCols = Array.from(firePropPaths).sort()\r
bim.export.csv(allFireElements, {\r
  columns: ['Name', 'Type', 'GlobalId', 'ObjectType', ...fireCols],\r
  filename: 'fire-safety-report.csv'\r
})\r
console.log('')\r
console.log('Exported ' + allFireElements.length + ' elements (' + (4 + fireCols.length) + ' columns) to fire-safety-report.csv')\r
`,r=`/* This Source Code Form is subject to the terms of the Mozilla Public\r
 * License, v. 2.0. If a copy of the MPL was not distributed with this\r
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */\r
\r
export {} // module boundary (stripped by transpiler)\r
\r
// ── Quantity Takeoff ────────────────────────────────────────────────────\r
// Stakeholder: Cost Estimator / Project Manager\r
//\r
// Aggregates quantities (area, volume, length, width, height) across all\r
// structural and architectural element types. This combines what would\r
// require opening the properties panel for each element individually,\r
// manually recording numbers, and aggregating in a spreadsheet. The\r
// script does it in seconds and exports a ready-to-use CSV.\r
// ─────────────────────────────────────────────────────────────────────────\r
\r
const ELEMENT_TYPES = [\r
  'IfcWall', 'IfcWallStandardCase',\r
  'IfcSlab',\r
  'IfcColumn',\r
  'IfcBeam',\r
  'IfcDoor', 'IfcDoorStandardCase',\r
  'IfcWindow',\r
  'IfcCovering',\r
  'IfcCurtainWall',\r
  'IfcRoof',\r
  'IfcStair', 'IfcStairFlight',\r
  'IfcRailing',\r
  'IfcPlate',\r
  'IfcMember',\r
  'IfcFooting',\r
  'IfcPile',\r
]\r
\r
// Quantities we care about (case-insensitive matching)\r
const QTY_KEYS = ['area', 'volume', 'length', 'width', 'height', 'netarea', 'netsidearea', 'netvolume', 'grossarea', 'grossvolume', 'perimeter']\r
\r
/**\r
 * One figure per element for the summary table, taken from the IFC standard\r
 * base-quantity names in priority order. Summing every quantity whose name\r
 * merely CONTAINS "volume" added GrossVolume, NetVolume and each exporter's\r
 * localised duplicates ("Brutto-Volumen der Wand", "Konditionales Volumen", …)\r
 * together, overstating a wall's volume ~3x; "area" likewise added a wall's\r
 * side area to its footprint area. Area priority runs side -> plan -> plain so\r
 * each class lands on the area that describes it: walls on GrossSideArea,\r
 * slabs and roofs on GrossArea, doors and windows on Area.\r
 */\r
const VOLUME_PRIORITY = ['GrossVolume', 'NetVolume']\r
const AREA_PRIORITY = ['GrossSideArea', 'NetSideArea', 'GrossArea', 'NetArea', 'Area']\r
\r
/** Cap per type; beyond it the sums are extrapolated and labelled as such. */\r
const SAMPLE_CAP = 500\r
\r
interface TypeTakeoff {\r
  type: string\r
  count: number\r
  sampled: number\r
  quantities: Record<string, { sum: number; count: number }>\r
  area: { sum: number; count: number }\r
  volume: { sum: number; count: number }\r
}\r
\r
console.log('═══════════════════════════════════════')\r
console.log('  QUANTITY TAKEOFF')\r
console.log('═══════════════════════════════════════')\r
console.log('')\r
\r
// One query, grouped by each element's CONCRETE class. \`byType\` already expands\r
// to subtypes, so querying \`IfcWall\` and \`IfcWallStandardCase\` separately\r
// returned the same walls twice and reported them as two types.\r
const elements = bim.query.byType(...ELEMENT_TYPES)\r
const byClass = new Map<string, BimEntity[]>()\r
for (const e of elements) {\r
  const list = byClass.get(e.Type)\r
  if (list) list.push(e)\r
  else byClass.set(e.Type, [e])\r
}\r
\r
const takeoffs: TypeTakeoff[] = []\r
// Collect all unique Qto set+quantity paths for CSV export columns\r
const quantityColumns = new Set<string>()\r
\r
for (const [type, entities] of byClass) {\r
  const sample = entities.length > SAMPLE_CAP ? entities.slice(0, SAMPLE_CAP) : entities\r
  const takeoff: TypeTakeoff = {\r
    type, count: entities.length, sampled: sample.length, quantities: {},\r
    area: { sum: 0, count: 0 }, volume: { sum: 0, count: 0 },\r
  }\r
\r
  for (const entity of sample) {\r
    const byName = new Map<string, number>()\r
    for (const qset of bim.query.quantities(entity)) {\r
      for (const q of qset.quantities) {\r
        if (q.value === null || q.value === 0) continue\r
        const lower = q.name.toLowerCase()\r
        if (!QTY_KEYS.some(k => lower.includes(k))) continue\r
        if (!takeoff.quantities[q.name]) takeoff.quantities[q.name] = { sum: 0, count: 0 }\r
        takeoff.quantities[q.name].sum += q.value\r
        takeoff.quantities[q.name].count++\r
        if (!byName.has(q.name)) byName.set(q.name, q.value)\r
        quantityColumns.add(qset.name + '.' + q.name)\r
      }\r
    }\r
    const volume = VOLUME_PRIORITY.map(n => byName.get(n)).find(v => v !== undefined)\r
    if (volume !== undefined) { takeoff.volume.sum += volume; takeoff.volume.count++ }\r
    const area = AREA_PRIORITY.map(n => byName.get(n)).find(v => v !== undefined)\r
    if (area !== undefined) { takeoff.area.sum += area; takeoff.area.count++ }\r
  }\r
\r
  // Scale up if sampled -- the report says so below rather than presenting an\r
  // extrapolation as a measured total.\r
  if (sample.length < entities.length) {\r
    const factor = entities.length / sample.length\r
    for (const q of Object.values(takeoff.quantities)) q.sum *= factor\r
    takeoff.area.sum *= factor\r
    takeoff.volume.sum *= factor\r
  }\r
\r
  takeoffs.push(takeoff)\r
}\r
\r
if (takeoffs.length === 0) {\r
  console.log('No ' + ELEMENT_TYPES.join(', ') + ' elements in this model, so there is nothing to take off.')\r
} else {\r
  // ── Report ────────────────────────────────────────────────────────────\r
  console.log('Scanned ' + elements.length + ' elements across ' + takeoffs.length + ' classes')\r
  console.log('')\r
\r
  for (const t of takeoffs.sort((a, b) => b.count - a.count)) {\r
    const extrapolated = t.sampled < t.count ? '  [extrapolated from ' + t.sampled + ' of ' + t.count + ']' : ''\r
    console.log('── ' + t.type + ' (' + t.count + ')' + extrapolated + ' ──')\r
    const qEntries = Object.entries(t.quantities).sort((a, b) => b[1].sum - a[1].sum)\r
    if (qEntries.length === 0) {\r
      console.log('  (no quantities defined)')\r
    } else {\r
      for (const [name, q] of qEntries) {\r
        const avg = q.sum / q.count\r
        console.log('  ' + name + ': total=' + q.sum.toFixed(2) + '  avg=' + avg.toFixed(2) + '  (from ' + q.count + ' entities)')\r
      }\r
    }\r
    console.log('')\r
  }\r
\r
  // ── Summary table ─────────────────────────────────────────────────────\r
  // Values are in the model's own length unit, squared and cubed. \`bim\` has no\r
  // project-unit accessor yet, so the column headers do not claim metres.\r
  console.log('── Summary (one standard base quantity per element) ──')\r
  console.log('Class                      | Count |    Area    |   Volume')\r
  console.log('---------------------------+-------+------------+-----------')\r
  for (const t of takeoffs) {\r
    const typeStr = (t.type + '                           ').slice(0, 27)\r
    const countStr = ('     ' + t.count).slice(-5)\r
    const areaStr = t.area.count > 0 ? t.area.sum.toFixed(1) : '-'\r
    const volStr = t.volume.count > 0 ? t.volume.sum.toFixed(2) : '-'\r
    const mark = t.sampled < t.count ? '  *' : ''\r
    console.log(typeStr + '| ' + countStr + ' | ' + ('          ' + areaStr).slice(-10) + ' | ' + ('         ' + volStr).slice(-9) + mark)\r
  }\r
  if (takeoffs.some(t => t.sampled < t.count)) {\r
    console.log('* extrapolated from the first ' + SAMPLE_CAP + ' elements of the class')\r
  }\r
}\r
\r
// ── Export ───────────────────────────────────────────────────────────────\r
// Build a flat entity list with quantities for CSV export\r
let allElements = bim.query.byType(...ELEMENT_TYPES)\r
// Respect the active advanced filter, if one is set, so the CSV matches the\r
// current filtered view rather than the whole model (issue #1107).\r
const activeFilter = bim.query.matchingActiveFilter()\r
if (activeFilter) {\r
  const keep = new Set(activeFilter.map(e => e.ref.modelId + ':' + e.ref.expressId))\r
  const before = allElements.length\r
  allElements = allElements.filter(e => keep.has(e.ref.modelId + ':' + e.ref.expressId))\r
  console.log('Active filter applied: ' + allElements.length + ' of ' + before + ' elements')\r
}\r
if (allElements.length > 0) {\r
  const qtyCols = Array.from(quantityColumns).sort()\r
  bim.export.csv(allElements, {\r
    columns: ['Name', 'Type', 'ObjectType', 'GlobalId', ...qtyCols],\r
    filename: 'quantity-takeoff.csv'\r
  })\r
  console.log('')\r
  console.log('Exported ' + allElements.length + ' elements (' + (4 + qtyCols.length) + ' columns) to quantity-takeoff.csv')\r
}\r
`,i=`/* This Source Code Form is subject to the terms of the Mozilla Public\r
 * License, v. 2.0. If a copy of the MPL was not distributed with this\r
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */\r
\r
export {} // module boundary (stripped by transpiler)\r
\r
// ── Building Envelope & Thermal Check ───────────────────────────────────\r
// Stakeholder: Architect / Energy Consultant\r
//\r
// Identifies all external-facing elements (walls, slabs, roofs, windows,\r
// doors, curtain walls) by reading Pset_*Common.IsExternal and checks\r
// whether they carry thermal transmittance values. Missing thermal data\r
// on external elements is a common issue in energy models. The script\r
// isolates the envelope, color-codes by thermal status, and exports\r
// the findings — a workflow that requires cross-referencing two property\r
// values across hundreds of elements.\r
// ─────────────────────────────────────────────────────────────────────────\r
\r
bim.viewer.resetColors()\r
bim.viewer.resetVisibility()\r
\r
// ── 1. Gather envelope candidates ───────────────────────────────────────\r
const envelopeTypes = [\r
  'IfcWall', 'IfcWallStandardCase', 'IfcCurtainWall',\r
  'IfcSlab', 'IfcRoof',\r
  'IfcDoor', 'IfcDoorStandardCase',\r
  'IfcWindow',\r
  'IfcPlate',\r
]\r
const candidates = bim.query.byType(...envelopeTypes)\r
\r
if (candidates.length === 0) {\r
  console.error('No envelope element types found')\r
  throw new Error('no elements')\r
}\r
\r
// ── 2. Classify each element ────────────────────────────────────────────\r
interface EnvelopeResult {\r
  entity: BimEntity\r
  isExternal: boolean | null\r
  thermalTransmittance: number | null\r
  thermalSource: string\r
}\r
\r
const results: EnvelopeResult[] = []\r
// Collect property paths for CSV export\r
const envelopePropPaths = new Set<string>()\r
\r
for (const entity of candidates) {\r
  const result: EnvelopeResult = { entity, isExternal: null, thermalTransmittance: null, thermalSource: '' }\r
  const psets = bim.query.properties(entity)\r
  for (const pset of psets) {\r
    for (const p of pset.properties) {\r
      const lower = p.name.toLowerCase()\r
      if (lower === 'isexternal' && p.value !== null) {\r
        result.isExternal = p.value === true || p.value === 'TRUE' || p.value === '.T.'\r
        envelopePropPaths.add(pset.name + '.IsExternal')\r
      }\r
      if (lower === 'thermaltransmittance' && p.value !== null && p.value !== '') {\r
        result.thermalTransmittance = typeof p.value === 'number' ? p.value : parseFloat(String(p.value))\r
        result.thermalSource = pset.name\r
        envelopePropPaths.add(pset.name + '.ThermalTransmittance')\r
      }\r
      // Also capture other thermal-related properties\r
      if ((lower === 'firerating' || lower === 'loadbearing' || lower === 'acousticrating') && p.value !== null && p.value !== '') {\r
        envelopePropPaths.add(pset.name + '.' + p.name)\r
      }\r
    }\r
  }\r
  results.push(result)\r
}\r
\r
// ── 3. Separate external vs internal ────────────────────────────────────\r
const external = results.filter(r => r.isExternal === true)\r
const internal = results.filter(r => r.isExternal === false)\r
const unknown = results.filter(r => r.isExternal === null)\r
\r
const extWithThermal = external.filter(r => r.thermalTransmittance !== null)\r
const extNoThermal = external.filter(r => r.thermalTransmittance === null)\r
\r
// ── 4. Color-code ───────────────────────────────────────────────────────\r
const batches: Array<{ entities: BimEntity[]; color: string }> = []\r
if (extWithThermal.length > 0) batches.push({ entities: extWithThermal.map(r => r.entity), color: '#27ae60' })  // green: external + thermal\r
if (extNoThermal.length > 0) batches.push({ entities: extNoThermal.map(r => r.entity), color: '#e74c3c' })    // red: external, missing thermal\r
if (internal.length > 0) batches.push({ entities: internal.map(r => r.entity), color: '#95a5a6' })            // grey: internal\r
if (unknown.length > 0) batches.push({ entities: unknown.map(r => r.entity), color: '#f39c12' })              // orange: unknown\r
if (batches.length > 0) bim.viewer.colorizeAll(batches)\r
\r
// Isolate envelope if we found external elements\r
if (external.length > 0) {\r
  bim.viewer.isolate(external.map(r => r.entity))\r
}\r
\r
// ── 5. Report ───────────────────────────────────────────────────────────\r
console.log('═══════════════════════════════════════')\r
console.log('  BUILDING ENVELOPE & THERMAL CHECK')\r
console.log('═══════════════════════════════════════')\r
console.log('')\r
console.log('Scanned ' + candidates.length + ' envelope-type elements')\r
console.log('')\r
console.log('  External:   ' + external.length + '  (isolated in view)')\r
console.log('  Internal:   ' + internal.length + '  ● grey')\r
console.log('  Undefined:  ' + unknown.length + '  ● orange — IsExternal not set')\r
console.log('')\r
console.log('  External with thermal data:    ' + extWithThermal.length + '  ● green')\r
console.log('  External without thermal data: ' + extNoThermal.length + '  ● red — NEEDS ATTENTION')\r
\r
// ── 6. Thermal value distribution ───────────────────────────────────────\r
if (extWithThermal.length > 0) {\r
  console.log('')\r
  console.log('── Thermal Transmittance (U-value) Distribution ──')\r
\r
  // Group by type\r
  const byType: Record<string, number[]> = {}\r
  for (const r of extWithThermal) {\r
    if (!byType[r.entity.Type]) byType[r.entity.Type] = []\r
    if (r.thermalTransmittance !== null) byType[r.entity.Type].push(r.thermalTransmittance)\r
  }\r
\r
  for (const [type, values] of Object.entries(byType).sort((a, b) => b[1].length - a[1].length)) {\r
    const min = Math.min(...values)\r
    const max = Math.max(...values)\r
    const avg = values.reduce((s, v) => s + v, 0) / values.length\r
    console.log('  ' + type + ' (' + values.length + ')')\r
    console.log('    min=' + min.toFixed(3) + '  avg=' + avg.toFixed(3) + '  max=' + max.toFixed(3) + ' W/(m²·K)')\r
  }\r
}\r
\r
// ── 7. Elements missing IsExternal property ─────────────────────────────\r
if (unknown.length > 0) {\r
  console.log('')\r
  console.warn('── Missing IsExternal Property ──')\r
  const byType: Record<string, number> = {}\r
  for (const r of unknown) {\r
    byType[r.entity.Type] = (byType[r.entity.Type] || 0) + 1\r
  }\r
  for (const [type, count] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {\r
    console.warn('  ' + type + ': ' + count + ' elements')\r
  }\r
}\r
\r
// ── 8. External elements missing thermal data ───────────────────────────\r
if (extNoThermal.length > 0) {\r
  console.log('')\r
  console.warn('── External Elements Without Thermal Data ──')\r
  for (const r of extNoThermal.slice(0, 15)) {\r
    console.warn('  ' + (r.entity.Name || '<unnamed>') + ' [' + r.entity.Type + ']')\r
  }\r
  if (extNoThermal.length > 15) console.warn('  ... and ' + (extNoThermal.length - 15) + ' more')\r
\r
  const envPropCols = Array.from(envelopePropPaths).sort()\r
  bim.export.csv(extNoThermal.map(r => r.entity), {\r
    columns: ['Name', 'Type', 'GlobalId', 'ObjectType', ...envPropCols],\r
    filename: 'envelope-missing-thermal.csv'\r
  })\r
  console.log('')\r
  console.log('Exported ' + extNoThermal.length + ' elements to envelope-missing-thermal.csv')\r
}\r
\r
// Export full envelope dataset with all discovered properties\r
if (external.length > 0) {\r
  const envPropCols = Array.from(envelopePropPaths).sort()\r
  bim.export.csv(external.map(r => r.entity), {\r
    columns: ['Name', 'Type', 'GlobalId', 'ObjectType', ...envPropCols],\r
    filename: 'envelope-analysis.csv'\r
  })\r
  console.log('Exported ' + external.length + ' external elements (' + (4 + envPropCols.length) + ' columns) to envelope-analysis.csv')\r
}\r
`,a=`/* This Source Code Form is subject to the terms of the Mozilla Public\r
 * License, v. 2.0. If a copy of the MPL was not distributed with this\r
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */\r
\r
export {} // module boundary (stripped by transpiler)\r
\r
// ── MEP Equipment Schedule ──────────────────────────────────────────────\r
// Stakeholder: HVAC / MEP Engineer\r
//\r
// Discovers all MEP/distribution elements in the model, extracts their\r
// properties (manufacturer, model, capacity, pressure, flow rate), and\r
// generates a structured equipment register. The UI's property panel\r
// shows one element at a time — this script scans hundreds of elements\r
// and builds the schedule that would otherwise require a spreadsheet.\r
// ─────────────────────────────────────────────────────────────────────────\r
\r
// ── 1. Query all MEP-related IFC types ──────────────────────────────────\r
const MEP_TYPES = [\r
  // HVAC\r
  'IfcAirTerminal', 'IfcAirTerminalBox', 'IfcFan', 'IfcCoil', 'IfcCompressor',\r
  'IfcCondenser', 'IfcCooledBeam', 'IfcCoolingTower', 'IfcEvaporativeCooler',\r
  'IfcEvaporator', 'IfcHeatExchanger', 'IfcHumidifier', 'IfcUnitaryEquipment',\r
  'IfcBoiler', 'IfcChiller', 'IfcAirToAirHeatRecovery',\r
  // Plumbing\r
  'IfcSanitaryTerminal', 'IfcWasteTerminal', 'IfcFireSuppressionTerminal',\r
  'IfcTank', 'IfcPump', 'IfcValve',\r
  // Electrical\r
  'IfcElectricDistributionBoard', 'IfcElectricGenerator', 'IfcElectricMotor',\r
  'IfcTransformer', 'IfcSwitchingDevice', 'IfcOutlet', 'IfcLightFixture',\r
  'IfcLamp', 'IfcJunctionBox',\r
  // Generic distribution\r
  'IfcDistributionElement', 'IfcDistributionControlElement',\r
  'IfcDistributionFlowElement', 'IfcFlowTerminal', 'IfcFlowMovingDevice',\r
  'IfcFlowController', 'IfcFlowStorageDevice', 'IfcFlowTreatmentDevice',\r
  'IfcFlowFitting', 'IfcFlowSegment', 'IfcEnergyConversionDevice',\r
  // Segments\r
  'IfcDuctSegment', 'IfcPipeSegment', 'IfcCableCarrierSegment', 'IfcCableSegment',\r
  'IfcDuctFitting', 'IfcPipeFitting', 'IfcCableCarrierFitting',\r
  // Furnishing (often used for MEP equipment in some models)\r
  'IfcFurnishingElement',\r
]\r
\r
const elements = bim.query.byType(...MEP_TYPES)\r
\r
if (elements.length === 0) {\r
  // Fall back: show what types ARE in the model so user can adapt\r
  console.warn('No standard MEP element types found.')\r
  console.log('')\r
  console.log('Available types in this model:')\r
  const all = bim.query.all()\r
  const types: Record<string, number> = {}\r
  for (const e of all) types[e.Type] = (types[e.Type] || 0) + 1\r
  for (const [t, c] of Object.entries(types).sort((a, b) => b[1] - a[1])) {\r
    console.log('  ' + t + ': ' + c)\r
  }\r
  console.log('')\r
  console.log('Tip: edit MEP_TYPES at top of script to match your model\\'s types.')\r
  throw new Error('no MEP elements')\r
}\r
\r
// ── 2. Group by IFC type ────────────────────────────────────────────────\r
const byType: Record<string, BimEntity[]> = {}\r
for (const e of elements) {\r
  if (!byType[e.Type]) byType[e.Type] = []\r
  byType[e.Type].push(e)\r
}\r
\r
console.log('═══════════════════════════════════════')\r
console.log('  MEP EQUIPMENT SCHEDULE')\r
console.log('═══════════════════════════════════════')\r
console.log('')\r
console.log('Found ' + elements.length + ' MEP elements across ' + Object.keys(byType).length + ' types')\r
\r
// ── 3. Extract properties for each type ─────────────────────────────────\r
// Properties of interest for MEP equipment\r
const MEP_PROPS = [\r
  'manufacturer', 'model', 'reference', 'status',\r
  'capacity', 'power', 'voltage', 'current', 'frequency',\r
  'flowrate', 'pressure', 'temperature',\r
  'nominalcapacity', 'nominalpower',\r
]\r
\r
interface EquipmentEntry {\r
  entity: BimEntity\r
  props: Record<string, string | number | boolean | null>\r
}\r
\r
const schedule: Record<string, EquipmentEntry[]> = {}\r
// Collect all unique property paths for CSV export columns\r
const propertyColumns = new Set<string>()\r
\r
for (const [type, entities] of Object.entries(byType).sort((a, b) => b[1].length - a[1].length)) {\r
  schedule[type] = []\r
\r
  // Cap property extraction at 200 per type\r
  const sample = entities.length > 200 ? entities.slice(0, 200) : entities\r
\r
  for (const entity of sample) {\r
    const entry: EquipmentEntry = { entity, props: {} }\r
    const psets = bim.query.properties(entity)\r
    for (const pset of psets) {\r
      for (const p of pset.properties) {\r
        const lower = p.name.toLowerCase()\r
        if (MEP_PROPS.some(k => lower.includes(k)) && p.value !== null && p.value !== '') {\r
          const path = pset.name + '.' + p.name\r
          entry.props[path] = p.value\r
          propertyColumns.add(path)\r
        }\r
      }\r
    }\r
    schedule[type].push(entry)\r
  }\r
}\r
\r
// ── 4. Print schedule ───────────────────────────────────────────────────\r
for (const [type, entries] of Object.entries(schedule).sort((a, b) => b[1].length - a[1].length)) {\r
  console.log('')\r
  console.log('── ' + type + ' (' + byType[type].length + ') ──')\r
\r
  // Collect all property keys found in this type\r
  const allKeys = new Set<string>()\r
  for (const entry of entries) {\r
    for (const key of Object.keys(entry.props)) allKeys.add(key)\r
  }\r
\r
  if (allKeys.size === 0) {\r
    // Show name grouping even without properties\r
    const names: Record<string, number> = {}\r
    for (const entry of entries) {\r
      const key = entry.entity.Name || entry.entity.ObjectType || '<unnamed>'\r
      names[key] = (names[key] || 0) + 1\r
    }\r
    for (const [name, count] of Object.entries(names).sort((a, b) => b[1] - a[1])) {\r
      console.log('  ' + name + (count > 1 ? ' (x' + count + ')' : ''))\r
    }\r
  } else {\r
    // Show first 10 entries with their properties\r
    for (const entry of entries.slice(0, 10)) {\r
      const label = entry.entity.Name || entry.entity.ObjectType || '<unnamed>'\r
      console.log('  ' + label)\r
      for (const [key, value] of Object.entries(entry.props)) {\r
        console.log('    ' + key + ' = ' + value)\r
      }\r
    }\r
    if (entries.length > 10) console.log('  ... and ' + (entries.length - 10) + ' more')\r
  }\r
}\r
\r
// ── 5. Color-code by system type ────────────────────────────────────────\r
const palette = [\r
  '#e74c3c', '#3498db', '#2ecc71', '#f39c12',\r
  '#9b59b6', '#1abc9c', '#e67e22', '#34495e',\r
]\r
const batches: Array<{ entities: BimEntity[]; color: string }> = []\r
let colorIdx = 0\r
for (const [type, entities] of Object.entries(byType).sort((a, b) => b[1].length - a[1].length)) {\r
  batches.push({ entities, color: palette[colorIdx % palette.length] })\r
  colorIdx++\r
}\r
bim.viewer.colorizeAll(batches)\r
bim.viewer.isolate(elements)\r
\r
// ── 6. Summary ──────────────────────────────────────────────────────────\r
console.log('')\r
console.log('── Type Summary ──')\r
for (const [type, entities] of Object.entries(byType).sort((a, b) => b[1].length - a[1].length)) {\r
  const color = palette[(Object.keys(byType).sort((a, b) => byType[b].length - byType[a].length).indexOf(type)) % palette.length]\r
  console.log('  ' + type + ': ' + entities.length + '  ● ' + color)\r
}\r
\r
// ── 7. Export ────────────────────────────────────────────────────────────\r
const propCols = Array.from(propertyColumns).sort()\r
bim.export.csv(elements, {\r
  columns: ['Name', 'Type', 'ObjectType', 'GlobalId', 'Description', ...propCols],\r
  filename: 'mep-equipment-schedule.csv'\r
})\r
console.log('')\r
console.log('Exported ' + elements.length + ' MEP elements (' + (5 + propCols.length) + ' columns) to mep-equipment-schedule.csv')\r
console.log('Elements are isolated and color-coded by type in 3D view')\r
`,o=`/* This Source Code Form is subject to the terms of the Mozilla Public\r
 * License, v. 2.0. If a copy of the MPL was not distributed with this\r
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */\r
\r
export {} // module boundary (stripped by transpiler)\r
\r
// ── Space & Room Validation ─────────────────────────────────────────────\r
// Stakeholder: Facility Manager / Architect\r
//\r
// Validates IfcSpace entities for operations handover readiness. Checks\r
// that every space has a Name, LongName, area and volume quantities,\r
// and required properties. Generates a room schedule with measurements\r
// and flags incomplete spaces. This would take hours of clicking through\r
// individual spaces in the property panel.\r
// ─────────────────────────────────────────────────────────────────────────\r
\r
bim.viewer.resetColors()\r
bim.viewer.resetVisibility()\r
\r
const spaces = bim.query.byType('IfcSpace')\r
\r
if (spaces.length === 0) {\r
  console.warn('No IfcSpace entities found in this model.')\r
  console.log('')\r
  console.log('This script validates room/space data. Models without')\r
  console.log('IfcSpace entities are missing spatial programming data.')\r
  console.log('')\r
  // Show what spatial types exist\r
  const spatialTypes = bim.query.byType('IfcBuildingStorey', 'IfcBuilding', 'IfcSite')\r
  if (spatialTypes.length > 0) {\r
    console.log('Spatial structure found:')\r
    for (const e of spatialTypes) {\r
      console.log('  ' + e.Type + ': ' + (e.Name || '<unnamed>'))\r
    }\r
  }\r
  throw new Error('no spaces')\r
}\r
\r
// ── 1. Extract space data ───────────────────────────────────────────────\r
interface SpaceData {\r
  entity: BimEntity\r
  area: number | null\r
  volume: number | null\r
  perimeter: number | null\r
  height: number | null\r
  longName: string | null\r
  category: string | null\r
  occupancy: string | null\r
  issues: string[]\r
}\r
\r
const spaceData: SpaceData[] = []\r
// Collect property/quantity paths for CSV export\r
const spacePropPaths = new Set<string>()\r
const spaceQtyPaths = new Set<string>()\r
\r
for (const space of spaces) {\r
  const data: SpaceData = {\r
    entity: space, area: null, volume: null, perimeter: null, height: null,\r
    longName: null, category: null, occupancy: null, issues: []\r
  }\r
\r
  // Extract quantities by their standard Qto_SpaceBaseQuantities names, in\r
  // priority order. Matching any name that CONTAINS "volume" would take an\r
  // exporter's localised duplicate (e.g. ArchiCADQuantities) if it came first.\r
  const qsets = bim.query.quantities(space)\r
  const byName = new Map<string, number>()\r
  for (const qset of qsets) {\r
    for (const q of qset.quantities) {\r
      if (typeof q.value === 'number' && !byName.has(q.name)) byName.set(q.name, q.value)\r
      if (q.value !== null && q.value !== 0) spaceQtyPaths.add(qset.name + '.' + q.name)\r
    }\r
  }\r
  const pick = (names: string[]) => names.map(n => byName.get(n)).find(v => v !== undefined) ?? null\r
  data.area = pick(['NetFloorArea', 'GrossFloorArea'])\r
  data.volume = pick(['NetVolume', 'GrossVolume'])\r
  data.perimeter = pick(['GrossPerimeter', 'NetPerimeter'])\r
  data.height = pick(['Height', 'FinishCeilingHeight'])\r
\r
  // Extract properties\r
  const psets = bim.query.properties(space)\r
  for (const pset of psets) {\r
    for (const p of pset.properties) {\r
      const lower = p.name.toLowerCase()\r
      if (lower === 'longname' && p.value) data.longName = String(p.value)\r
      if (lower === 'category' && p.value) data.category = String(p.value)\r
      if (lower === 'occupancytype' && p.value) data.occupancy = String(p.value)\r
      if (p.value !== null && p.value !== '') spacePropPaths.add(pset.name + '.' + p.name)\r
    }\r
  }\r
\r
  // \`LongName\` is an EXPRESS attribute of IfcSpace (the room's human name --\r
  // "Schlafzimmer", where \`Name\` is the room number "4"), not a property-set\r
  // value, so the pset scan above can never find it. Reading only psets flagged\r
  // every room of every model "Missing LongName" and named the schedule rows by\r
  // number.\r
  if (!data.longName) {\r
    const longName = bim.query.attributes(space).find(a => a.name === 'LongName')?.value\r
    if (longName !== null && longName !== undefined && longName !== '') data.longName = String(longName)\r
  }\r
  if (!data.longName && space.Description) data.longName = space.Description\r
\r
  // Check for issues\r
  if (!space.Name || space.Name === '') data.issues.push('Missing Name')\r
  if (!data.longName) data.issues.push('Missing LongName/Description')\r
  if (data.area === null) data.issues.push('Missing Area')\r
  if (data.volume === null) data.issues.push('Missing Volume')\r
\r
  spaceData.push(data)\r
}\r
\r
// ── 2. Classify spaces ─────────────────────────────────────────────────\r
const complete = spaceData.filter(s => s.issues.length === 0)\r
const incomplete = spaceData.filter(s => s.issues.length > 0)\r
\r
// ── 3. Color-code ───────────────────────────────────────────────────────\r
const batches: Array<{ entities: BimEntity[]; color: string }> = []\r
if (complete.length > 0) batches.push({ entities: complete.map(s => s.entity), color: '#27ae60' })\r
const minor = incomplete.filter(s => s.issues.length <= 2)\r
const major = incomplete.filter(s => s.issues.length > 2)\r
if (minor.length > 0) batches.push({ entities: minor.map(s => s.entity), color: '#f39c12' })\r
if (major.length > 0) batches.push({ entities: major.map(s => s.entity), color: '#e74c3c' })\r
if (batches.length > 0) bim.viewer.colorizeAll(batches)\r
\r
// ── 4. Report ───────────────────────────────────────────────────────────\r
console.log('═══════════════════════════════════════')\r
console.log('  SPACE & ROOM VALIDATION')\r
console.log('═══════════════════════════════════════')\r
console.log('')\r
console.log('Spaces found: ' + spaces.length)\r
console.log('  Complete:     ' + complete.length + '  ● green')\r
console.log('  Minor issues: ' + minor.length + '  ● orange (1-2 issues)')\r
console.log('  Major issues: ' + major.length + '  ● red (3+ issues)')\r
\r
// ── 5. Room schedule ────────────────────────────────────────────────────\r
console.log('')\r
console.log('── Room Schedule ──')\r
console.log('Name                    | Area m²  | Volume m³ | Height m | Status')\r
console.log('------------------------+----------+-----------+----------+-------')\r
\r
// Sort by name\r
const sorted = [...spaceData].sort((a, b) => {\r
  const nameA = a.entity.Name || 'zzz'\r
  const nameB = b.entity.Name || 'zzz'\r
  return nameA.localeCompare(nameB)\r
})\r
\r
let totalArea = 0\r
let totalVolume = 0\r
\r
for (const s of sorted) {\r
  const label = s.longName ? (s.entity.Name ? s.entity.Name + ' ' + s.longName : s.longName) : (s.entity.Name || '<unnamed>')\r
  const name = (label + '                        ').slice(0, 24)\r
  const area = s.area !== null ? (s.area.toFixed(1) + '    ').slice(0, 8) : '-       '\r
  const vol = s.volume !== null ? (s.volume.toFixed(1) + '     ').slice(0, 9) : '-        '\r
  const height = s.height !== null ? (s.height.toFixed(2) + '   ').slice(0, 8) : '-       '\r
  const status = s.issues.length === 0 ? 'OK' : s.issues.length + ' issues'\r
  console.log(name + '| ' + area + ' | ' + vol + ' | ' + height + ' | ' + status)\r
  if (s.area !== null) totalArea += s.area\r
  if (s.volume !== null) totalVolume += s.volume\r
}\r
\r
console.log('------------------------+----------+-----------+----------+-------')\r
console.log('TOTALS                  | ' + (totalArea.toFixed(1) + '    ').slice(0, 8) + ' | ' + (totalVolume.toFixed(1) + '     ').slice(0, 9) + ' |')\r
\r
// ── 6. Category breakdown ───────────────────────────────────────────────\r
const categories: Record<string, { count: number; area: number }> = {}\r
for (const s of spaceData) {\r
  const cat = s.category || s.entity.ObjectType || 'Uncategorized'\r
  if (!categories[cat]) categories[cat] = { count: 0, area: 0 }\r
  categories[cat].count++\r
  if (s.area !== null) categories[cat].area += s.area\r
}\r
\r
if (Object.keys(categories).length > 1) {\r
  console.log('')\r
  console.log('── By Category ──')\r
  for (const [cat, data] of Object.entries(categories).sort((a, b) => b[1].area - a[1].area)) {\r
    console.log('  ' + cat + ': ' + data.count + ' spaces, ' + data.area.toFixed(1) + ' m²')\r
  }\r
}\r
\r
// ── 7. Issue details ────────────────────────────────────────────────────\r
if (incomplete.length > 0) {\r
  console.log('')\r
  console.warn('── Incomplete Spaces ──')\r
  const issueCount: Record<string, number> = {}\r
  for (const s of incomplete) {\r
    for (const issue of s.issues) {\r
      issueCount[issue] = (issueCount[issue] || 0) + 1\r
    }\r
  }\r
  for (const [issue, count] of Object.entries(issueCount).sort((a, b) => b[1] - a[1])) {\r
    console.warn('  ' + issue + ': ' + count + ' spaces')\r
  }\r
}\r
\r
// ── 8. Export ────────────────────────────────────────────────────────────\r
const spPropCols = Array.from(spacePropPaths).sort().slice(0, 15)\r
const spQtyCols = Array.from(spaceQtyPaths).sort().slice(0, 15)\r
bim.export.csv(spaces, {\r
  columns: ['Name', 'Type', 'GlobalId', 'Description', 'ObjectType', ...spPropCols, ...spQtyCols],\r
  filename: 'room-schedule.csv'\r
})\r
console.log('')\r
console.log('Exported ' + spaces.length + ' spaces (' + (5 + spPropCols.length + spQtyCols.length) + ' columns) to room-schedule.csv')\r
`,s=`/* This Source Code Form is subject to the terms of the Mozilla Public\r
 * License, v. 2.0. If a copy of the MPL was not distributed with this\r
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */\r
\r
export {} // module boundary (stripped by transpiler)\r
\r
// ── Multi-Model Federation Comparison ───────────────────────────────────\r
// Stakeholder: Project Manager / BIM Coordinator\r
//\r
// When multiple IFC models are loaded (architectural + structural + MEP),\r
// this script compares them side by side: entity counts, type coverage,\r
// naming consistency, and property completeness per model. The UI shows\r
// one tree at a time — this script cross-references everything and\r
// highlights discrepancies that indicate coordination issues.\r
// ─────────────────────────────────────────────────────────────────────────\r
\r
const models = bim.model.list()\r
\r
if (models.length === 0) {\r
  console.error('No models loaded')\r
  throw new Error('no models')\r
}\r
\r
console.log('═══════════════════════════════════════')\r
console.log('  FEDERATION COMPARISON')\r
console.log('═══════════════════════════════════════')\r
console.log('')\r
\r
// ── 1. Model overview ───────────────────────────────────────────────────\r
console.log('── Loaded Models (' + models.length + ') ──')\r
let totalEntities = 0\r
for (const m of models) {\r
  const sizeMB = (m.fileSize / 1024 / 1024).toFixed(1)\r
  console.log('  [' + m.id.slice(0, 8) + '] ' + m.name)\r
  console.log('    Schema: ' + m.schemaVersion + '  |  Entities: ' + m.entityCount + '  |  Size: ' + sizeMB + ' MB')\r
  totalEntities += m.entityCount\r
}\r
console.log('')\r
console.log('Total: ' + totalEntities + ' entities across ' + models.length + ' models')\r
\r
// ── 2. Type distribution per model ──────────────────────────────────────\r
const all = bim.query.all()\r
\r
// Build type→model distribution\r
const typeByModel: Record<string, Record<string, number>> = {}\r
const modelEntityMap: Record<string, BimEntity[]> = {}\r
for (const e of all) {\r
  const mid = e.ref.modelId\r
  if (!modelEntityMap[mid]) modelEntityMap[mid] = []\r
  modelEntityMap[mid].push(e)\r
\r
  if (!typeByModel[e.Type]) typeByModel[e.Type] = {}\r
  typeByModel[e.Type][mid] = (typeByModel[e.Type][mid] || 0) + 1\r
}\r
\r
// Find types that exist in multiple models (potential overlaps/conflicts)\r
const sharedTypes: string[] = []\r
const exclusiveTypes: Record<string, string[]> = {} // modelId → types only in that model\r
\r
for (const [type, distribution] of Object.entries(typeByModel)) {\r
  const modelIds = Object.keys(distribution)\r
  if (modelIds.length > 1) {\r
    sharedTypes.push(type)\r
  } else {\r
    const mid = modelIds[0]\r
    if (!exclusiveTypes[mid]) exclusiveTypes[mid] = []\r
    exclusiveTypes[mid].push(type)\r
  }\r
}\r
\r
console.log('')\r
console.log('── Type Distribution ──')\r
console.log('')\r
\r
// Types present in multiple models\r
if (sharedTypes.length > 0) {\r
  console.log('Types shared across models (' + sharedTypes.length + '):')\r
  const header = '  Type                         ' + models.map(m => ('| ' + m.name.slice(0, 10) + '          ').slice(0, 13)).join('')\r
  console.log(header)\r
  console.log('  ' + '-'.repeat(header.length - 2))\r
\r
  for (const type of sharedTypes.sort((a, b) => {\r
    const totalA = Object.values(typeByModel[a]).reduce((s, v) => s + v, 0)\r
    const totalB = Object.values(typeByModel[b]).reduce((s, v) => s + v, 0)\r
    return totalB - totalA\r
  }).slice(0, 20)) {\r
    const typeStr = (type + '                              ').slice(0, 30)\r
    const counts = models.map(m => {\r
      const c = typeByModel[type][m.id] || 0\r
      return ('| ' + (c > 0 ? String(c) : '-') + '           ').slice(0, 13)\r
    }).join('')\r
    console.log('  ' + typeStr + counts)\r
  }\r
}\r
\r
// Types exclusive to one model\r
console.log('')\r
console.log('Types exclusive to one model:')\r
for (const m of models) {\r
  const exclusive = exclusiveTypes[m.id] || []\r
  if (exclusive.length > 0) {\r
    console.log('  ' + m.name + ': ' + exclusive.slice(0, 8).join(', ') + (exclusive.length > 8 ? ' (+' + (exclusive.length - 8) + ' more)' : ''))\r
  }\r
}\r
\r
// ── 3. Naming consistency check ─────────────────────────────────────────\r
console.log('')\r
console.log('── Naming Consistency ──')\r
for (const m of models) {\r
  const entities = modelEntityMap[m.id] || []\r
  const named = entities.filter(e => e.Name && e.Name !== '')\r
  const described = entities.filter(e => e.Description && e.Description !== '')\r
  const typed = entities.filter(e => e.ObjectType && e.ObjectType !== '')\r
  const namePct = entities.length > 0 ? (named.length / entities.length * 100).toFixed(1) : '0'\r
  const descPct = entities.length > 0 ? (described.length / entities.length * 100).toFixed(1) : '0'\r
  const typePct = entities.length > 0 ? (typed.length / entities.length * 100).toFixed(1) : '0'\r
  console.log('  ' + m.name + ':')\r
  console.log('    Named: ' + namePct + '%  |  Described: ' + descPct + '%  |  ObjectType: ' + typePct + '%')\r
}\r
\r
// ── 4. Property coverage comparison ─────────────────────────────────────\r
console.log('')\r
console.log('── Property Coverage (sample of 100 per model) ──')\r
for (const m of models) {\r
  const entities = modelEntityMap[m.id] || []\r
  const sample = entities.slice(0, 100)\r
  let withPsets = 0\r
  let withQsets = 0\r
  let totalPsets = 0\r
  for (const e of sample) {\r
    const psets = bim.query.properties(e)\r
    const qsets = bim.query.quantities(e)\r
    if (psets.length > 0) withPsets++\r
    if (qsets.length > 0) withQsets++\r
    totalPsets += psets.length\r
  }\r
  const psetPct = sample.length > 0 ? (withPsets / sample.length * 100).toFixed(0) : '0'\r
  const qsetPct = sample.length > 0 ? (withQsets / sample.length * 100).toFixed(0) : '0'\r
  const avgPsets = sample.length > 0 ? (totalPsets / sample.length).toFixed(1) : '0'\r
  console.log('  ' + m.name + ':')\r
  console.log('    With properties: ' + psetPct + '%  |  With quantities: ' + qsetPct + '%  |  Avg psets/entity: ' + avgPsets)\r
}\r
\r
// ── 5. Potential coordination issues ────────────────────────────────────\r
if (models.length > 1) {\r
  console.log('')\r
  console.log('── Coordination Notes ──')\r
\r
  // Check for spatial types in non-architectural models\r
  const spatialTypes = ['IfcBuilding', 'IfcBuildingStorey', 'IfcSite', 'IfcSpace']\r
  for (const m of models) {\r
    const hasSpatial: string[] = []\r
    for (const st of spatialTypes) {\r
      if (typeByModel[st] && typeByModel[st][m.id]) {\r
        hasSpatial.push(st + '(' + typeByModel[st][m.id] + ')')\r
      }\r
    }\r
    if (hasSpatial.length > 0) {\r
      console.log('  ' + m.name + ' defines: ' + hasSpatial.join(', '))\r
    }\r
  }\r
\r
  // Check entity count ratios (large disparities may indicate issues)\r
  const counts = models.map(m => modelEntityMap[m.id]?.length || 0)\r
  const maxCount = Math.max(...counts)\r
  const minCount = Math.min(...counts)\r
  if (maxCount > 0 && minCount > 0 && maxCount / minCount > 10) {\r
    console.warn('')\r
    console.warn('  Large entity count disparity (' + maxCount + ' vs ' + minCount + ')')\r
    console.warn('  This may indicate models at different levels of detail')\r
  }\r
}\r
\r
// ── 6. Color-code by model origin ───────────────────────────────────────\r
const modelColors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c']\r
const colorBatches: Array<{ entities: BimEntity[]; color: string }> = []\r
let idx = 0\r
for (const m of models) {\r
  const entities = modelEntityMap[m.id] || []\r
  if (entities.length > 0) {\r
    colorBatches.push({ entities, color: modelColors[idx % modelColors.length] })\r
    idx++\r
  }\r
}\r
if (colorBatches.length > 0) bim.viewer.colorizeAll(colorBatches)\r
\r
console.log('')\r
console.log('── Model Colors ──')\r
idx = 0\r
for (const m of models) {\r
  console.log('  ' + m.name + '  ● ' + modelColors[idx % modelColors.length])\r
  idx++\r
}\r
`,c=`/* This Source Code Form is subject to the terms of the Mozilla Public\r
 * License, v. 2.0. If a copy of the MPL was not distributed with this\r
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */\r
\r
export {} // module boundary (stripped by transpiler)\r
\r
// Reset colors and visibility\r
bim.viewer.resetColors()\r
bim.viewer.resetVisibility()\r
console.log('View reset — all colors and visibility restored')\r
`,l=`/* This Source Code Form is subject to the terms of the Mozilla Public\r
 * License, v. 2.0. If a copy of the MPL was not distributed with this\r
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */\r
\r
export {} // module boundary for type checking\r
/**\r
 * Create IFC from scratch: two storeys with attributed structure, filled\r
 * openings, a straight stair, and a parametric timber gridshell.\r
 * Positions passed to element constructors are relative to their storey.\r
 */\r
\r
type Point3 = [number, number, number];\r
const footprintWidth = 5;\r
const footprintDepth = 8;\r
const storeyHeight = 3;\r
const wallThickness = 0.2;\r
const slabThickness = 0.3;\r
const concreteDensity = 2400;\r
const steelDensity = 7850;\r
\r
const h = bim.create.project({\r
  Name: 'Sample Building',\r
  Description: 'Demonstration of ifc-lite IFC creation from scratch',\r
  Author: 'ifc-lite',\r
  Organization: 'ifc-lite',\r
});\r
const ground = bim.create.addIfcBuildingStorey(h, { Name: 'Ground Floor', Elevation: 0 });\r
const first = bim.create.addIfcBuildingStorey(h, { Name: 'First Floor', Elevation: storeyHeight });\r
\r
function finish(\r
  id: number, colorName: string, rgb: [number, number, number],\r
  material: { Name: string; Category?: string; Layers?: { Name: string; Thickness: number; Category: string }[] },\r
): void {\r
  bim.create.setColor(h, id, colorName, rgb);\r
  bim.create.addIfcMaterial(h, id, material);\r
}\r
\r
// The layers total the modeled 200 mm wall thickness.\r
const wallMaterial = {\r
  Name: 'Exterior Wall Assembly',\r
  Layers: [\r
    { Name: 'Gypsum Board', Thickness: 0.01, Category: 'Finish' },\r
    { Name: 'Mineral Wool Insulation', Thickness: 0.08, Category: 'Insulation' },\r
    { Name: 'Concrete C30/37', Thickness: 0.1, Category: 'Structural' },\r
    { Name: 'External Render', Thickness: 0.01, Category: 'Finish' },\r
  ],\r
};\r
const slabMaterial = {\r
  Name: 'Floor Slab Assembly',\r
  Layers: [\r
    { Name: 'Ceramic Tile', Thickness: 0.01, Category: 'Finish' },\r
    { Name: 'Screed', Thickness: 0.05, Category: 'Finish' },\r
    { Name: 'Reinforced Concrete C30/37', Thickness: 0.24, Category: 'Structural' },\r
  ],\r
};\r
const columnMaterial = { Name: 'Reinforced Concrete C30/37', Category: 'Concrete' };\r
const beamMaterial = { Name: 'Structural Steel S235', Category: 'Steel' };\r
\r
type Opening = { Name: string; Width: number; Height: number; Position: Point3; Kind: 'door' | 'window' };\r
type WallSide = { Name: string; Start: Point3; End: Point3; Openings?: Opening[] };\r
\r
function addWalls(storey: number, floor: number): void {\r
  // Opening positions are wall local: distance along Start→End, 0, sill height.\r
  const sides: WallSide[] = [\r
    { Name: 'South Wall', Start: [0, 0, 0], End: [footprintWidth, 0, 0],\r
      Openings: [{ Name: floor === 0 ? 'W-01 Window' : 'W-03 Window',\r
        Width: 1.2, Height: 1.5, Position: [1.5, 0, 0.9], Kind: 'window' }] },\r
    { Name: 'East Wall', Start: [footprintWidth, 0, 0], End: [footprintWidth, footprintDepth, 0],\r
      Openings: floor === 0\r
        ? [{ Name: 'D-01 Entrance Door', Width: 0.9, Height: 2.1, Position: [3, 0, 0], Kind: 'door' }]\r
        : [{ Name: 'W-04 Window', Width: 1.4, Height: 1.5, Position: [3, 0, 0.9], Kind: 'window' }] },\r
    { Name: 'North Wall', Start: [footprintWidth, footprintDepth, 0], End: [0, footprintDepth, 0],\r
      Openings: [{ Name: floor === 0 ? 'W-02 Window' : 'W-05 Window',\r
        Width: 1.4, Height: 1.5, Position: [1.8, 0, 0.9], Kind: 'window' }] },\r
    { Name: 'West Wall', Start: [0, footprintDepth, 0], End: [0, 0, 0] },\r
  ];\r
\r
  for (const side of sides) {\r
    const length = Math.hypot(side.End[0] - side.Start[0], side.End[1] - side.Start[1]);\r
    const id = bim.create.addIfcWall(h, storey, {\r
      Name: side.Name, Description: 'Exterior wall', ObjectType: 'Basic Wall:Exterior - 200mm',\r
      Start: side.Start, End: side.End, Thickness: wallThickness, Height: storeyHeight,\r
    });\r
    finish(id, 'Plaster - Beige', [0.92, 0.88, 0.80], wallMaterial);\r
    bim.create.addIfcPropertySet(h, id, {\r
      Name: 'Pset_WallCommon',\r
      Properties: [\r
        { Name: 'Reference', NominalValue: 'Exterior - 200mm', Type: 'IfcIdentifier' },\r
        { Name: 'IsExternal', NominalValue: true, Type: 'IfcBoolean' },\r
        { Name: 'LoadBearing', NominalValue: true, Type: 'IfcBoolean' },\r
        { Name: 'FireRating', NominalValue: 'REI60', Type: 'IfcLabel' },\r
        { Name: 'AcousticRating', NominalValue: 'STC 45', Type: 'IfcLabel' },\r
        // The current create API supports IfcReal, not the dedicated IFC measure type.\r
        { Name: 'ThermalTransmittance', NominalValue: 0.25, Type: 'IfcReal' },\r
      ],\r
    });\r
    bim.create.addIfcElementQuantity(h, id, {\r
      Name: 'Qto_WallBaseQuantities',\r
      Quantities: [\r
        { Name: 'Length', Value: length, Kind: 'IfcQuantityLength' },\r
        { Name: 'Height', Value: storeyHeight, Kind: 'IfcQuantityLength' },\r
        { Name: 'Width', Value: wallThickness, Kind: 'IfcQuantityLength' },\r
        { Name: 'GrossSideArea', Value: length * storeyHeight, Kind: 'IfcQuantityArea' },\r
        { Name: 'GrossVolume', Value: length * storeyHeight * wallThickness, Kind: 'IfcQuantityVolume' },\r
      ],\r
    });\r
    for (const opening of side.Openings ?? []) {\r
      const { Kind, ...params } = opening;\r
      const fillId = Kind === 'door'\r
        ? bim.create.addIfcWallDoor(h, id, params)\r
        : bim.create.addIfcWallWindow(h, id, params);\r
      finish(fillId, Kind === 'door' ? 'Timber - Door' : 'Glass - Blue',\r
        Kind === 'door' ? [0.55, 0.38, 0.23] : [0.48, 0.72, 0.85],\r
        Kind === 'door' ? { Name: 'Timber Door', Category: 'Timber' }\r
          : { Name: 'Glazing', Category: 'Glass' });\r
      bim.create.addIfcPropertySet(h, fillId, {\r
        Name: Kind === 'door' ? 'Pset_DoorCommon' : 'Pset_WindowCommon',\r
        Properties: [{ Name: 'IsExternal', NominalValue: true, Type: 'IfcBoolean' }],\r
      });\r
      bim.create.addIfcElementQuantity(h, fillId, {\r
        Name: Kind === 'door' ? 'Qto_DoorBaseQuantities' : 'Qto_WindowBaseQuantities',\r
        Quantities: [\r
          { Name: 'Width', Value: opening.Width, Kind: 'IfcQuantityLength' },\r
          { Name: 'Height', Value: opening.Height, Kind: 'IfcQuantityLength' },\r
          { Name: 'Area', Value: opening.Width * opening.Height, Kind: 'IfcQuantityArea' },\r
        ],\r
      });\r
    }\r
  }\r
}\r
\r
const numRisers = 17;\r
const riserHeight = 0.176;\r
const treadLength = 0.28;\r
const stairWidth = 1;\r
const stairStartY = 1;\r
const stairRun = numRisers * treadLength;\r
const stairOpeningLength = 4.2;\r
const stairOpeningWidth = stairWidth + 0.2;\r
// The opening spans x=0..1.2 and y=1.56..5.76, within the slab.\r
const stairOpeningCenter: Point3 = [\r
  stairOpeningWidth / 2, stairStartY + stairRun - stairOpeningLength / 2, 0,\r
];\r
\r
function addSlab(storey: number, name: string, hasStairOpening: boolean): void {\r
  const openingArea = hasStairOpening ? stairOpeningWidth * stairOpeningLength : 0;\r
  const grossArea = footprintWidth * footprintDepth;\r
  const id = bim.create.addIfcSlab(h, storey, {\r
    Name: name, Description: 'Reinforced concrete floor slab', ObjectType: 'Floor:Concrete - 300mm',\r
    Position: [0, 0, -slabThickness], Thickness: slabThickness,\r
    Width: footprintWidth, Depth: footprintDepth,\r
    Openings: hasStairOpening ? [{\r
      Name: 'Stair Opening', Width: stairOpeningWidth, Height: stairOpeningLength,\r
      Position: stairOpeningCenter,\r
    }] : undefined,\r
  });\r
  finish(id, 'Concrete - Grey', [0.65, 0.65, 0.65], slabMaterial);\r
  bim.create.addIfcPropertySet(h, id, {\r
    Name: 'Pset_SlabCommon',\r
    Properties: [\r
      { Name: 'Reference', NominalValue: 'Concrete - 300mm', Type: 'IfcIdentifier' },\r
      { Name: 'IsExternal', NominalValue: false, Type: 'IfcBoolean' },\r
      { Name: 'LoadBearing', NominalValue: true, Type: 'IfcBoolean' },\r
      { Name: 'FireRating', NominalValue: 'REI90', Type: 'IfcLabel' },\r
      { Name: 'AcousticRating', NominalValue: 'STC 52', Type: 'IfcLabel' },\r
      { Name: 'Combustible', NominalValue: false, Type: 'IfcBoolean' },\r
    ],\r
  });\r
  bim.create.addIfcElementQuantity(h, id, {\r
    Name: 'Qto_SlabBaseQuantities',\r
    Quantities: [\r
      { Name: 'Width', Value: slabThickness, Kind: 'IfcQuantityLength' },\r
      { Name: 'GrossArea', Value: grossArea, Kind: 'IfcQuantityArea' },\r
      { Name: 'NetArea', Value: grossArea - openingArea, Kind: 'IfcQuantityArea' },\r
      { Name: 'GrossVolume', Value: grossArea * slabThickness, Kind: 'IfcQuantityVolume' },\r
      { Name: 'NetVolume', Value: (grossArea - openingArea) * slabThickness, Kind: 'IfcQuantityVolume' },\r
      { Name: 'GrossWeight', Value: grossArea * slabThickness * concreteDensity, Kind: 'IfcQuantityWeight' },\r
    ],\r
  });\r
}\r
\r
const columnPositions: [string, number, number][] = [\r
  ['C-01 SW', 0.1, 0.1], ['C-02 SE', 4.7, 0.1],\r
  ['C-03 NE', 4.7, 7.7], ['C-04 NW', 0.1, 7.7],\r
];\r
function addColumns(storey: number): void {\r
  const sectionArea = 0.3 * 0.3;\r
  for (const [name, x, y] of columnPositions) {\r
    const id = bim.create.addIfcColumn(h, storey, {\r
      Name: name, Description: 'Reinforced concrete column', ObjectType: 'Column:Concrete 300x300',\r
      Position: [x, y, 0], Width: 0.3, Depth: 0.3, Height: storeyHeight,\r
    });\r
    finish(id, 'Concrete - Light', [0.72, 0.72, 0.74], columnMaterial);\r
    bim.create.addIfcPropertySet(h, id, {\r
      Name: 'Pset_ColumnCommon',\r
      Properties: [\r
        { Name: 'Reference', NominalValue: 'Concrete 300x300', Type: 'IfcIdentifier' },\r
        { Name: 'LoadBearing', NominalValue: true, Type: 'IfcBoolean' },\r
        { Name: 'IsExternal', NominalValue: false, Type: 'IfcBoolean' },\r
        { Name: 'FireRating', NominalValue: 'R120', Type: 'IfcLabel' },\r
        { Name: 'Slope', NominalValue: 0, Type: 'IfcReal' },\r
      ],\r
    });\r
    bim.create.addIfcElementQuantity(h, id, {\r
      Name: 'Qto_ColumnBaseQuantities',\r
      Quantities: [\r
        { Name: 'Length', Value: storeyHeight, Kind: 'IfcQuantityLength' },\r
        { Name: 'CrossSectionArea', Value: sectionArea, Kind: 'IfcQuantityArea' },\r
        { Name: 'GrossVolume', Value: sectionArea * storeyHeight, Kind: 'IfcQuantityVolume' },\r
        { Name: 'GrossWeight', Value: sectionArea * storeyHeight * concreteDensity, Kind: 'IfcQuantityWeight' },\r
      ],\r
    });\r
  }\r
}\r
\r
function addStructuralBeams(storey: number): void {\r
  // The creator emits rectangular sections, so describe and quantify them as such.\r
  const sectionArea = 0.2 * 0.4;\r
  for (const [name, y] of [['B-01 South Beam', 0], ['B-02 North Beam', footprintDepth]] as [string, number][]) {\r
    const id = bim.create.addIfcBeam(h, storey, {\r
      Name: name, Description: 'Rectangular steel beam', ObjectType: 'Beam:Steel 200x400',\r
      Start: [0, y, storeyHeight], End: [footprintWidth, y, storeyHeight],\r
      Width: 0.2, Height: 0.4,\r
    });\r
    finish(id, 'Steel - Grey', [0.55, 0.55, 0.58], beamMaterial);\r
    bim.create.addIfcPropertySet(h, id, {\r
      Name: 'Pset_BeamCommon',\r
      Properties: [\r
        { Name: 'Reference', NominalValue: 'Steel 200x400', Type: 'IfcIdentifier' },\r
        { Name: 'LoadBearing', NominalValue: true, Type: 'IfcBoolean' },\r
        { Name: 'IsExternal', NominalValue: false, Type: 'IfcBoolean' },\r
        { Name: 'FireRating', NominalValue: 'R60', Type: 'IfcLabel' },\r
        { Name: 'Span', NominalValue: footprintWidth, Type: 'IfcReal' },\r
      ],\r
    });\r
    bim.create.addIfcElementQuantity(h, id, {\r
      Name: 'Qto_BeamBaseQuantities',\r
      Quantities: [\r
        { Name: 'Length', Value: footprintWidth, Kind: 'IfcQuantityLength' },\r
        { Name: 'CrossSectionArea', Value: sectionArea, Kind: 'IfcQuantityArea' },\r
        { Name: 'GrossVolume', Value: footprintWidth * sectionArea, Kind: 'IfcQuantityVolume' },\r
        { Name: 'GrossWeight', Value: footprintWidth * sectionArea * steelDensity, Kind: 'IfcQuantityWeight' },\r
      ],\r
    });\r
  }\r
}\r
\r
addWalls(ground, 0);\r
addSlab(ground, 'Ground Floor Slab', false);\r
addColumns(ground);\r
addStructuralBeams(ground);\r
\r
// Direction rotates the stair run toward +Y and its width toward -X.\r
const stair = bim.create.addIfcStair(h, ground, {\r
  Name: 'ST-01 Main Stair', Description: 'Straight-run concrete stair',\r
  ObjectType: 'Stair:Concrete - Straight Run',\r
  Position: [stairWidth, stairStartY, 0], Direction: Math.PI / 2,\r
  NumberOfRisers: numRisers, RiserHeight: riserHeight,\r
  TreadLength: treadLength, Width: stairWidth,\r
});\r
finish(stair, 'Concrete - Warm', [0.80, 0.78, 0.74],\r
  { Name: 'Reinforced Concrete C25/30', Category: 'Concrete' });\r
bim.create.addIfcPropertySet(h, stair, {\r
  Name: 'Pset_StairCommon',\r
  Properties: [\r
    { Name: 'Reference', NominalValue: 'Concrete - Straight Run', Type: 'IfcIdentifier' },\r
    { Name: 'FireRating', NominalValue: 'REI60', Type: 'IfcLabel' },\r
    { Name: 'NumberOfRiser', NominalValue: numRisers, Type: 'IfcInteger' },\r
    { Name: 'NumberOfTreads', NominalValue: numRisers, Type: 'IfcInteger' },\r
    { Name: 'RiserHeight', NominalValue: riserHeight, Type: 'IfcReal' },\r
    { Name: 'TreadLength', NominalValue: treadLength, Type: 'IfcReal' },\r
    { Name: 'IsExternal', NominalValue: false, Type: 'IfcBoolean' },\r
    { Name: 'HandicapAccessible', NominalValue: false, Type: 'IfcBoolean' },\r
  ],\r
});\r
// The creator emits one rectangular tread solid for each riser.\r
bim.create.addIfcElementQuantity(h, stair, {\r
  Name: 'Example_StairQuantities', // Qto_StairFlightBaseQuantities targets IfcStairFlight.\r
  Quantities: [\r
    { Name: 'Length', Value: stairRun, Kind: 'IfcQuantityLength' },\r
    { Name: 'GrossVolume', Value: stairRun * stairWidth * riserHeight, Kind: 'IfcQuantityVolume' },\r
  ],\r
});\r
\r
addSlab(first, 'First Floor Slab', true);\r
addWalls(first, 1);\r
addColumns(first);\r
addStructuralBeams(first);\r
\r
// Two diagonal families form a diamond lattice on a doubly curved surface.\r
const crown = 1.8;\r
const divisionsX = 10;\r
const divisionsY = 16;\r
const lathWidth = 0.06;\r
const lathDepth = 0.08;\r
// Replace roofZ to explore a symmetric dome:\r
// return storeyHeight + crown * Math.sin(Math.PI * u) * Math.sin(Math.PI * v);\r
// Or rolling dunes: multiply that envelope by several Gaussian peaks.\r
function roofZ(u: number, v: number): number {\r
  const envelope = Math.sin(Math.PI * u) * Math.sin(Math.PI * v);\r
  const twist = (2 * u - 1) * (2 * v - 1);\r
  return storeyHeight + crown * envelope * (1 + 0.8 * twist);\r
}\r
const grid: Point3[][] = [];\r
for (let i = 0; i <= divisionsX; i++) {\r
  const row: Point3[] = [];\r
  for (let j = 0; j <= divisionsY; j++) {\r
    const u = i / divisionsX;\r
    const v = j / divisionsY;\r
    row.push([u * footprintWidth, v * footprintDepth, roofZ(u, v)]);\r
  }\r
  grid.push(row);\r
}\r
function timberBeam(name: string, start: Point3, end: Point3, ring: boolean): void {\r
  const id = bim.create.addIfcBeam(h, first, {\r
    Name: name, Description: ring ? 'Gridshell perimeter ring beam' : 'Gridshell lath',\r
    ObjectType: ring ? 'Beam:GL28h 120x200' : 'Timber Lath:GL24h 60x80',\r
    Start: start, End: end, Width: ring ? 0.12 : lathWidth, Height: ring ? 0.20 : lathDepth,\r
  });\r
  finish(id, ring ? 'Timber - Dark' : name.startsWith('GL-A') ? 'Timber - Larch' : 'Timber - Oak',\r
    ring ? [0.45, 0.32, 0.20] : name.startsWith('GL-A') ? [0.82, 0.62, 0.38] : [0.72, 0.52, 0.30],\r
    { Name: ring ? 'Glulam GL28h Larch' : 'Glulam GL24h Spruce', Category: 'Timber' });\r
}\r
let lathCount = 0;\r
for (let i = 0; i < divisionsX; i++) {\r
  for (let j = 0; j < divisionsY; j++) {\r
    timberBeam(\`GL-A/\${i}/\${j}\`, grid[i][j], grid[i + 1][j + 1], false);\r
    timberBeam(\`GL-B/\${i}/\${j}\`, grid[i][j + 1], grid[i + 1][j], false);\r
    lathCount += 2;\r
  }\r
}\r
const ringPoints: Point3[] = [];\r
for (let i = 0; i <= divisionsX; i++) ringPoints.push(grid[i][0]);\r
for (let j = 1; j <= divisionsY; j++) ringPoints.push(grid[divisionsX][j]);\r
for (let i = divisionsX - 1; i >= 0; i--) ringPoints.push(grid[i][divisionsY]);\r
for (let j = divisionsY - 1; j >= 1; j--) ringPoints.push(grid[0][j]);\r
for (let k = 0; k < ringPoints.length; k++) {\r
  timberBeam(\`GL-Ring/\${k}\`, ringPoints[k], ringPoints[(k + 1) % ringPoints.length], true);\r
}\r
console.log(\`Gridshell roof: \${lathCount} laths + \${ringPoints.length} ring segments\`);\r
\r
const result = bim.create.toIfc(h);\r
console.log(\r
  \`Created \${result.entities.length} entities, \${result.stats.entityCount} STEP lines, \` +\r
  \`\${(result.stats.fileSize / 1024).toFixed(1)} KB\`,\r
);\r
bim.model.loadIfc(result.content, 'sample-building.ifc');\r
bim.export.download(result.content, 'sample-building.ifc', 'application/x-step');\r
`,u=`/* This Source Code Form is subject to the terms of the Mozilla Public\r
 * License, v. 2.0. If a copy of the MPL was not distributed with this\r
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */\r
\r
export {} // module boundary (stripped by transpiler)\r
\r
// ─────────────────────────────────────────────────────────────────────────\r
// Construction schedule — build an IfcWorkSchedule + IfcTasks + sequences\r
//\r
// Two modes:\r
//   1) Attach a construction sequence to the CURRENTLY LOADED model.\r
//      The script reads CSV task rows (attached via the chat paperclip)\r
//      and creates IfcTasks whose products are resolved by name/type.\r
//\r
//   2) No model loaded — generate a standalone demo IFC file with a few\r
//      walls and a matching 4-task construction schedule.\r
//\r
// CSV expected columns (case-insensitive, any subset works):\r
//   id, name, start, finish, duration, predecessor, products, predefinedType,\r
//   isMilestone, isCritical, completion\r
//\r
// Dates are ISO 8601 (e.g. 2024-05-01T08:00:00).\r
// Durations are ISO 8601 (e.g. P5D, PT8H).\r
// \`products\` is a comma-separated list of IFC types (e.g. "IfcWall,IfcSlab")\r
// OR entity globalIds; elements matching each row are assigned to that task.\r
// \`predecessor\` is the \`id\` of the row that must finish before this one.\r
// ─────────────────────────────────────────────────────────────────────────\r
\r
function toIso(v: string | undefined): string | undefined {\r
  if (!v) return undefined\r
  const s = String(v).trim()\r
  if (!s) return undefined\r
  // Accept "YYYY-MM-DD" → append midnight\r
  if (/^\\d{4}-\\d{2}-\\d{2}$/.test(s)) return \`\${s}T00:00:00\`\r
  return s\r
}\r
\r
function toBool(v: unknown): boolean | undefined {\r
  if (v === undefined || v === null || v === '') return undefined\r
  const s = String(v).trim().toLowerCase()\r
  if (s === 'true' || s === '1' || s === 'yes' || s === 'y') return true\r
  if (s === 'false' || s === '0' || s === 'no' || s === 'n') return false\r
  return undefined\r
}\r
\r
function toNumber(v: unknown): number | undefined {\r
  if (v === undefined || v === null || v === '') return undefined\r
  const n = Number(v)\r
  return Number.isFinite(n) ? n : undefined\r
}\r
\r
// Canonicalize a column name so "Start Date", "start_date" and "start" all match.\r
function findCol(cols: string[], ...aliases: string[]): string | null {\r
  const norm = (s: string) => s.toLowerCase().replace(/[\\s_-]+/g, '')\r
  const wanted = aliases.map(norm)\r
  for (const c of cols) if (wanted.includes(norm(c))) return c\r
  return null\r
}\r
\r
const files = bim.files.list()\r
const csvFile = files.find((f) => f.name.toLowerCase().endsWith('.csv'))\r
\r
if (csvFile) {\r
  // ─── Mode 1: attach schedule to currently loaded model ────────────────\r
  const rows = bim.files.csv(csvFile.name) ?? []\r
  const cols = bim.files.csvColumns(csvFile.name)\r
  if (rows.length === 0) {\r
    console.warn(\`[schedule] \${csvFile.name} has no rows\`)\r
  } else {\r
    console.log(\`[schedule] loading \${rows.length} tasks from \${csvFile.name}\`)\r
  }\r
\r
  const idCol = findCol(cols, 'id', 'taskid')\r
  const nameCol = findCol(cols, 'name', 'task', 'activity')\r
  const startCol = findCol(cols, 'start', 'startdate', 'schedulestart')\r
  const finishCol = findCol(cols, 'finish', 'end', 'enddate', 'schedulefinish')\r
  const durCol = findCol(cols, 'duration', 'scheduleduration')\r
  const predCol = findCol(cols, 'predecessor', 'depends', 'dependson')\r
  const productsCol = findCol(cols, 'products', 'type', 'entities', 'targets')\r
  const typeCol = findCol(cols, 'predefinedtype', 'kind')\r
  const mileCol = findCol(cols, 'ismilestone', 'milestone')\r
  const critCol = findCol(cols, 'iscritical', 'critical')\r
  const compCol = findCol(cols, 'completion', 'percentcomplete', 'progress')\r
\r
  // Discover every loaded product once so we can resolve \`products\` values\r
  // (IFC type OR globalId substring) into a list of expressIds.\r
  const allProducts = bim.query.byType(\r
    'IfcWall', 'IfcSlab', 'IfcColumn', 'IfcBeam', 'IfcRoof', 'IfcStair',\r
    'IfcDoor', 'IfcWindow', 'IfcRailing', 'IfcFooting', 'IfcCurtainWall',\r
    'IfcMember', 'IfcPlate', 'IfcFurnishingElement', 'IfcBuildingElementProxy',\r
  )\r
\r
  // Minimum character count before we fall back to a globalId prefix match;\r
  // avoids accidental wildcarding when the CSV column holds short tokens.\r
  const MIN_GID_PREFIX_LEN = 4\r
\r
  function resolveProducts(spec: string | undefined): number[] {\r
    if (!spec) return []\r
    const parts = spec.split(/[,;]/).map((s) => s.trim()).filter(Boolean)\r
    const ids = new Set<number>()\r
    for (const part of parts) {\r
      const upper = part.toUpperCase()\r
      if (upper.startsWith('IFC')) {\r
        // IFC type — match all loaded entities of that class\r
        for (const e of allProducts) {\r
          if (e.Type.toUpperCase() === upper) ids.add(e.ref.expressId)\r
        }\r
      } else {\r
        // Exact globalId match, OR prefix match when the token is long enough\r
        // to uniquely identify an element (≥ 4 chars).\r
        for (const e of allProducts) {\r
          if (e.GlobalId === part) {\r
            ids.add(e.ref.expressId)\r
          } else if (part.length >= MIN_GID_PREFIX_LEN && e.GlobalId.startsWith(part)) {\r
            ids.add(e.ref.expressId)\r
          }\r
        }\r
      }\r
    }\r
    return Array.from(ids)\r
  }\r
\r
  // We can't use bim.create on an existing model in this iteration — the\r
  // creator produces a fresh IFC file. So we log what *would* be created\r
  // and print a plan. The plan is directly feedable to a follow-up\r
  // save/export workflow.\r
  console.log('[schedule] plan:')\r
  for (const row of rows) {\r
    const id = idCol ? row[idCol] : '-'\r
    const name = nameCol ? row[nameCol] : '(unnamed)'\r
    const start = startCol ? toIso(row[startCol]) : undefined\r
    const finish = finishCol ? toIso(row[finishCol]) : undefined\r
    const dur = durCol ? row[durCol] : undefined\r
    const pred = predCol ? row[predCol] : undefined\r
    const prodSpec = productsCol ? row[productsCol] : undefined\r
    const prodIds = resolveProducts(prodSpec)\r
    const predefinedType = typeCol ? row[typeCol] : undefined\r
    const isMilestone = mileCol ? toBool(row[mileCol]) : undefined\r
    const isCritical = critCol ? toBool(row[critCol]) : undefined\r
    const completion = compCol ? toNumber(row[compCol]) : undefined\r
    console.log(\r
      \`  • [\${id}] \${name}  \${start ?? '?'} → \${finish ?? dur ?? '?'}  \` +\r
      \`prod=\${prodIds.length}  pred=\${pred ?? '-'}  \` +\r
      \`type=\${predefinedType ?? '-'}  mile=\${isMilestone ?? '-'}  \` +\r
      \`crit=\${isCritical ?? '-'}  comp=\${completion ?? '-'}\`,\r
    )\r
  }\r
  console.log(\r
    '[schedule] Attaching tasks to an existing IFC requires a separate ' +\r
    'mutation workflow — ask the assistant to wire the plan into a fresh ' +\r
    'IFC export using bim.create.* so the 4D Gantt panel can play it.',\r
  )\r
} else {\r
  // ─── Mode 2: generate a demo IFC with walls + a matching schedule ─────\r
  console.log('[schedule] No CSV attached — building demo model + schedule')\r
\r
  const h = bim.create.project({ Name: 'Demo with schedule', Schema: 'IFC4' })\r
  const storey = bim.create.addIfcBuildingStorey(h, { Name: 'Ground', Elevation: 0 })\r
\r
  const wallA = bim.create.addIfcWall(h, storey, {\r
    Name: 'Wall A', Start: [0, 0, 0], End: [5, 0, 0], Thickness: 0.2, Height: 3,\r
  })\r
  const wallB = bim.create.addIfcWall(h, storey, {\r
    Name: 'Wall B', Start: [5, 0, 0], End: [5, 5, 0], Thickness: 0.2, Height: 3,\r
  })\r
  const wallC = bim.create.addIfcWall(h, storey, {\r
    Name: 'Wall C', Start: [5, 5, 0], End: [0, 5, 0], Thickness: 0.2, Height: 3,\r
  })\r
  const wallD = bim.create.addIfcWall(h, storey, {\r
    Name: 'Wall D', Start: [0, 5, 0], End: [0, 0, 0], Thickness: 0.2, Height: 3,\r
  })\r
\r
  const schedule = bim.create.addIfcWorkSchedule(h, {\r
    Name: 'Construction schedule',\r
    StartTime: '2024-05-01T08:00:00',\r
    FinishTime: '2024-05-20T17:00:00',\r
    PredefinedType: 'PLANNED',\r
  })\r
\r
  const tFoundation = bim.create.addIfcTask(h, {\r
    Name: 'Site preparation',\r
    PredefinedType: 'CONSTRUCTION',\r
    ScheduleStart: '2024-05-01T08:00:00',\r
    ScheduleFinish: '2024-05-03T17:00:00',\r
    ScheduleDuration: 'P3D',\r
    IsMilestone: false,\r
  })\r
  const tWallAB = bim.create.addIfcTask(h, {\r
    Name: 'Install walls A+B',\r
    PredefinedType: 'INSTALLATION',\r
    ScheduleStart: '2024-05-06T08:00:00',\r
    ScheduleFinish: '2024-05-10T17:00:00',\r
    ScheduleDuration: 'P5D',\r
  })\r
  const tWallCD = bim.create.addIfcTask(h, {\r
    Name: 'Install walls C+D',\r
    PredefinedType: 'INSTALLATION',\r
    ScheduleStart: '2024-05-13T08:00:00',\r
    ScheduleFinish: '2024-05-17T17:00:00',\r
    ScheduleDuration: 'P5D',\r
    IsCritical: true,\r
  })\r
  const tHandover = bim.create.addIfcTask(h, {\r
    Name: 'Handover',\r
    PredefinedType: 'CONSTRUCTION',\r
    ScheduleStart: '2024-05-20T08:00:00',\r
    ScheduleFinish: '2024-05-20T17:00:00',\r
    IsMilestone: true,\r
  })\r
\r
  bim.create.assignTasksToWorkSchedule(h, schedule, [tFoundation, tWallAB, tWallCD, tHandover])\r
  bim.create.assignProductsToTask(h, tWallAB, [wallA, wallB])\r
  bim.create.assignProductsToTask(h, tWallCD, [wallC, wallD])\r
\r
  bim.create.addIfcRelSequence(h, tFoundation, tWallAB, { SequenceType: 'FINISH_START', TimeLag: 'P2D' })\r
  bim.create.addIfcRelSequence(h, tWallAB, tWallCD, { SequenceType: 'FINISH_START' })\r
  bim.create.addIfcRelSequence(h, tWallCD, tHandover, { SequenceType: 'FINISH_START' })\r
\r
  const result = bim.create.toIfc(h)\r
  console.log(\`[schedule] generated \${result.stats.entityCount} entities (\${result.stats.fileSize} bytes)\`)\r
  bim.export.download(result.content, 'demo-with-schedule.ifc', 'model/ifc')\r
  console.log('[schedule] downloaded demo-with-schedule.ifc — open it in this viewer to see the 4D Gantt panel animate the construction.')\r
}\r
`,d=`/* This Source Code Form is subject to the terms of the Mozilla Public\r
 * License, v. 2.0. If a copy of the MPL was not distributed with this\r
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */\r
\r
export {} // module boundary (stripped by transpiler)\r
\r
// ── Cost report (IFC 5D) ────────────────────────────────────────────────\r
// Stakeholder: Cost Estimator / Quantity Surveyor\r
//\r
// Reads the loaded model's IfcCostSchedule / IfcCostItem graph through\r
// \`bim.cost\` (the same read model the viewer's Cost panel uses — see\r
// docs/guide/cost-panel.md) and prints a per-item report: resolved amount\r
// and currency, or — when a value could not be evaluated — the evaluator's\r
// own diagnostic, never a guess. Exports a JSON report alongside the console\r
// report.\r
//\r
// This script is READ-ONLY: \`bim.cost\` has no write/author methods.\r
// Spreadsheet-style cost editing is out of scope for the viewer's Cost\r
// panel and for this template.\r
// ─────────────────────────────────────────────────────────────────────────\r
\r
const data = bim.cost.data()\r
\r
if (!data.HasCostData) {\r
  // Genuinely no cost data — NOT the same as "the read failed". \`bim.cost\`\r
  // never conflates the two; neither does this report.\r
  console.log('[cost] this model has no IfcCostItem/IfcCostSchedule data.')\r
} else {\r
  console.log(\`[cost] schema \${data.SchemaVersion} — \${data.CostSchedules.length} schedule(s), \${data.CostItems.length} cost item(s)\`)\r
\r
  if (data.Currency) {\r
    console.log(\`[cost] project currency: \${data.Currency}\`)\r
  } else {\r
    const mixedCurrency = data.Diagnostics.some((d) => d.Code === 'MIXED_CURRENCY')\r
    console.log(mixedCurrency\r
      ? '[cost] WARNING: the project declares more than one currency — amounts below are never summed across currencies.'\r
      : '[cost] no project currency declared.')\r
  }\r
\r
  // Kept in sync with the Cost panel's own \`CYCLE_CODES_LIST\`\r
  // (apps/viewer/src/lib/cost/cost-tree.ts) — templates.ts substitutes the\r
  // real list into the literal below at template-build time (see the\r
  // CYCLE_CODES_INJECT marker and templates.test.ts's sync assertion), so\r
  // this file never hand-duplicates which diagnostic codes count as cyclic.\r
  const cycleCodes: string[] = ['NESTING_CYCLE'] // CYCLE_CODES_INJECT\r
  const cyclic = data.Diagnostics.some((d) => cycleCodes.includes(d.Code))\r
  if (cyclic) {\r
    console.log('[cost] WARNING: a cost item cycle was detected — see per-item diagnostics below.')\r
  }\r
\r
  type Row = { id: string; name: string; identification: string; amount: string; currency: string; diagnostics: string }\r
  const rows: Row[] = []\r
\r
  for (const item of data.CostItems) {\r
    const evaluation = bim.cost.evaluateItem(item.ref)\r
    const unresolved = evaluation.Amount === undefined\r
    const diagnosticText = evaluation.Diagnostics.map((d) => \`\${d.Code}: \${d.Message}\`).join(' | ')\r
    console.log(\r
      unresolved\r
        ? \`  ✗ #\${item.ref.expressId} \${item.Name ?? '(unnamed)'} — unresolved\${diagnosticText ? \` (\${diagnosticText})\` : ''}\`\r
        : \`  ✓ #\${item.ref.expressId} \${item.Name ?? '(unnamed)'} — \${evaluation.Amount}\${evaluation.Currency ? \` \${evaluation.Currency}\` : ''}\`,\r
    )\r
    rows.push({\r
      id: String(item.ref.expressId),\r
      name: item.Name ?? '',\r
      identification: item.Identification ?? '',\r
      amount: evaluation.Amount ?? '',\r
      currency: evaluation.Currency ?? '',\r
      diagnostics: diagnosticText,\r
    })\r
  }\r
\r
  // JSON, not CSV: \`bim.export.csv()\`/\`bim.export.json()\` resolve columns from an\r
  // entity's property/quantity sets (\`SetName.ValueName\`), and these rows carry\r
  // \`bim.cost.evaluateItem()\` results instead — a resolved amount, currency and\r
  // diagnostics text with no backing pset/qset to point a column path at. Rolling\r
  // a CSV writer by hand here would just be an eighth escaper (the repo caps this\r
  // at exactly one per language — see \`scripts/check-csv-escaper-copies.mjs\`), so\r
  // this template hands the report to \`bim.export.download()\` as JSON, which\r
  // needs no escaping of its own: \`JSON.stringify\` already quotes every value.\r
  const json = JSON.stringify(rows, null, 2)\r
\r
  bim.export.download(json, 'cost-report.json', 'application/json')\r
  console.log(\`[cost] exported cost-report.json (\${rows.length} row(s))\`)\r
}\r
`;function f(e){return e.replace(/^export \{\}[^\n]*\n\n?/m,``)}function p(t){let n=/const cycleCodes: string\[\] = \[[^\]]*\] \/\/ CYCLE_CODES_INJECT/;if(!n.test(t))throw Error(`cost-report.ts: CYCLE_CODES_INJECT marker not found — template/cost-tree.ts sync is broken`);return t.replace(n,`const cycleCodes: string[] = ${JSON.stringify(e)} // CYCLE_CODES_INJECT`)}var m=[{name:`Data quality audit`,description:`BIM Manager — scan all entities for missing names, properties, and quantities; score model completeness; color-code by data quality`,code:f(t)},{name:`Fire safety compliance`,description:`Architect — check fire ratings across walls, doors, and slabs; flag load-bearing elements without ratings; export non-compliant list`,code:f(n)},{name:`Quantity takeoff`,description:`Cost Estimator — aggregate area, volume, and length quantities across all element types; generate material takeoff table and CSV`,code:f(r)},{name:`Envelope & thermal check`,description:`Energy Consultant — identify external elements, check thermal transmittance values, isolate building envelope, flag missing data`,code:f(i)},{name:`MEP equipment schedule`,description:`HVAC Engineer — discover all distribution elements, extract equipment properties, generate schedule, isolate and color by system`,code:f(a)},{name:`Space & room validation`,description:`Facility Manager — validate IfcSpace entities for area, volume, naming; generate room schedule with totals; flag incomplete spaces`,code:f(o)},{name:`Federation comparison`,description:`Project Manager — compare multiple loaded models side by side: entity counts, type coverage, naming consistency, coordination issues`,code:f(s)},{name:`Create building (IFC from scratch)`,description:`Developer — generate a complete IFC file with walls, slab, columns, beams, stair, and parametric timber gridshell roof with diamond lattice`,code:f(l)},{name:`Construction schedule (4D)`,description:`Scheduler — build an IfcWorkSchedule with IfcTasks, IfcRelSequence dependencies, and product assignments that drive the 4D Gantt animation. Accepts a CSV attachment for real task data.`,code:f(u)},{name:`Cost report (5D)`,description:`Cost Estimator — read the loaded IfcCostSchedule/IfcCostItem graph via bim.cost, print resolved amounts (or diagnostics for what could not be evaluated), and download the report as JSON. Read-only.`,code:f(p(d))},{name:`Reset view`,description:`Utility — remove all color overrides and show all entities`,code:f(c)}];export{f as n,m as t};