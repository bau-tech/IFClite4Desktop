/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/**
 * Thin wrapper around @ifc-lite/parser for entity data and the spatial tree.
 * Adapted from IFC-Lite's examples/threejs-viewer.
 */

import {
  IfcParser,
  type IfcDataStore,
  extractEntityAttributesOnDemand,
  extractPropertiesOnDemand,
  extractQuantitiesOnDemand,
} from '@ifc-lite/parser';
import { IfcTypeEnum, type SpatialNode } from '@ifc-lite/data';

export type { IfcDataStore };
export { IfcTypeEnum };

export interface NamedRows {
  name: string;
  rows: Array<[string, string]>;
}

export interface EntityData {
  expressId: number;
  ifcType: string;
  globalId: string;
  name: string;
  description: string;
  objectType: string;
  tag: string;
  propertySets: NamedRows[];
  quantitySets: NamedRows[];
}

export interface SpatialTreeNode {
  expressId: number;
  name: string;
  type: IfcTypeEnum;
  /** Only set for IfcBuildingStorey */
  elevation?: number;
  /** Child spatial containers (Site, Building, Storey, Space) */
  children: SpatialTreeNode[];
  /** Directly contained elements grouped by IFC type, largest group first */
  elementGroups: Array<{ typeName: string; ids: number[] }>;
  /** Recursive element count */
  totalElements: number;
}

export async function buildDataStore(buffer: ArrayBuffer): Promise<IfcDataStore> {
  return new IfcParser().parseColumnar(buffer);
}

export function getEntityData(store: IfcDataStore, expressId: number, ifcType: string): EntityData {
  const attrs = extractEntityAttributesOnDemand(store, expressId);

  const propertySets = extractPropertiesOnDemand(store, expressId).map((pset) => ({
    name: pset.name,
    rows: pset.properties.map((p) => [p.name, formatValue(p.value)] as [string, string]),
  }));

  const quantitySets = extractQuantitiesOnDemand(store, expressId).map((qset) => ({
    name: qset.name,
    rows: qset.quantities.map(
      (q) => [q.name, typeof q.value === 'number' ? formatNumber(q.value) : String(q.value)] as [string, string],
    ),
  }));

  return {
    expressId,
    ifcType,
    globalId: attrs.globalId,
    name: attrs.name,
    description: attrs.description,
    objectType: attrs.objectType,
    tag: attrs.tag,
    propertySets,
    quantitySets,
  };
}

export function buildSpatialTreeFromStore(store: IfcDataStore): SpatialTreeNode | null {
  const { spatialHierarchy } = store;
  if (!spatialHierarchy) return null;
  return convertNode(spatialHierarchy.project, store);
}

function convertNode(node: SpatialNode, store: IfcDataStore): SpatialTreeNode {
  const children = node.children.map((c) => convertNode(c, store));

  const typeMap = new Map<string, number[]>();
  for (const id of node.elements) {
    const typeName = store.entities.getTypeName(id) || 'IfcBuildingElement';
    let arr = typeMap.get(typeName);
    if (!arr) {
      arr = [];
      typeMap.set(typeName, arr);
    }
    arr.push(id);
  }
  const elementGroups = [...typeMap.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .map(([typeName, ids]) => ({ typeName, ids }));

  return {
    expressId: node.expressId,
    name: node.name,
    type: node.type as IfcTypeEnum,
    elevation: node.elevation,
    children,
    elementGroups,
    totalElements: node.elements.length + children.reduce((s, c) => s + c.totalElements, 0),
  };
}

function formatNumber(n: number): string {
  return Number.isInteger(n) ? String(n) : String(Math.round(n * 1000) / 1000);
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') return formatNumber(value);
  if (typeof value === 'object') {
    const v = value as Record<string, unknown>;
    if ('value' in v) return formatValue(v.value);
    if ('wrappedValue' in v) return formatValue(v.wrappedValue);
    return JSON.stringify(value);
  }
  return String(value);
}
