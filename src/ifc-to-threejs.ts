/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/**
 * Converts @ifc-lite/geometry MeshData into Three.js (WebGL) objects.
 * Adapted from IFC-Lite's examples/threejs-viewer.
 *
 * All opaque meshes merge into ONE draw call using vertex colors; transparent
 * meshes are grouped by alpha. This keeps draw calls low, which matters most on
 * older GPUs. A triangle → expressId index makes per-entity picking possible.
 */

import * as THREE from 'three';
import type { MeshData } from '@ifc-lite/geometry';

/** A contiguous triangle range within a merged mesh, in triangle units. */
export type TriangleRange = { expressId: number; start: number; count: number };

/** Per-mesh triangle → entity lookup, keyed by the merged Mesh in the scene. */
export type TriangleMaps = Map<THREE.Mesh, TriangleRange[]>;

export function batchWithVertexColors(meshes: MeshData[]): {
  group: THREE.Group;
  triangleMaps: TriangleMaps;
} {
  const group = new THREE.Group();
  const triangleMaps: TriangleMaps = new Map();

  const opaque = meshes.filter((m) => m.color[3] >= 1);
  const transparent = meshes.filter((m) => m.color[3] < 1);

  if (opaque.length > 0) {
    const { mesh, triangleRanges } = mergeWithVertexColors(opaque, false);
    group.add(mesh);
    triangleMaps.set(mesh, triangleRanges);
  }

  if (transparent.length > 0) {
    const alphaGroups = new Map<number, MeshData[]>();
    for (const m of transparent) {
      const alpha = Math.round(m.color[3] * 100) / 100;
      let bucket = alphaGroups.get(alpha);
      if (!bucket) {
        bucket = [];
        alphaGroups.set(alpha, bucket);
      }
      bucket.push(m);
    }
    for (const [alpha, bucket] of alphaGroups) {
      const { mesh, triangleRanges } = mergeWithVertexColors(bucket, true, alpha);
      // Draw glass after opaque geometry so it blends over it.
      mesh.renderOrder = 1;
      group.add(mesh);
      triangleMaps.set(mesh, triangleRanges);
    }
  }

  return { group, triangleMaps };
}

/**
 * IFC-Lite emits `positions` in a per-mesh local frame: world = positions + origin
 * (`MeshData.origin`, see @ifc-lite/geometry types.ts). Bake each origin into the
 * vertices, relative to one shared `base` point so float32 precision stays good
 * for georeferenced models. Mutates the meshes in place; returns the base used.
 */
export function bakeMeshOrigins(
  meshes: MeshData[],
  base: [number, number, number] | null,
): [number, number, number] | null {
  for (const m of meshes) {
    const o = m.origin;
    if (!o) continue;
    base ??= [o[0], o[1], o[2]];
    const dx = o[0] - base[0];
    const dy = o[1] - base[1];
    const dz = o[2] - base[2];
    const p = m.positions;
    if (dx !== 0 || dy !== 0 || dz !== 0) {
      for (let i = 0; i < p.length; i += 3) {
        p[i] += dx;
        p[i + 1] += dy;
        p[i + 2] += dz;
      }
    }
    m.origin = undefined;
  }
  return base;
}

/** Binary-search the entity whose triangles contain `faceIndex`. */
export function findEntityByFace(ranges: TriangleRange[], faceIndex: number): number | null {
  let lo = 0;
  let hi = ranges.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    const r = ranges[mid];
    if (faceIndex < r.start) hi = mid - 1;
    else if (faceIndex >= r.start + r.count) lo = mid + 1;
    else return r.expressId;
  }
  return null;
}

/** Build a standalone geometry for one or more MeshData (selection overlay, bounds). */
export function meshDataToGeometry(meshes: MeshData[]): THREE.BufferGeometry {
  if (meshes.length === 1) {
    const m = meshes[0];
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(m.positions, 3));
    geometry.setAttribute('normal', new THREE.BufferAttribute(m.normals, 3));
    geometry.setIndex(new THREE.BufferAttribute(m.indices, 1));
    geometry.computeBoundingBox();
    return geometry;
  }
  const { geometry } = mergeGeometry(meshes, false);
  return geometry;
}

function mergeWithVertexColors(
  meshes: MeshData[],
  transparent: boolean,
  opacity = 1,
): { mesh: THREE.Mesh; triangleRanges: TriangleRange[] } {
  const { geometry, triangleRanges } = mergeGeometry(meshes, true);

  const material = new THREE.MeshLambertMaterial({
    vertexColors: true,
    transparent,
    opacity,
    // DoubleSide even for opaque: IFC triangle winding is not reliably outward,
    // and culling one of two coincident walls leaves the other z-fighting.
    side: THREE.DoubleSide,
    depthWrite: !transparent,
    // Nudge geometry back slightly so the selection overlay wins.
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  });
  faceNormalsToViewer(material);

  return { mesh: new THREE.Mesh(geometry, material), triangleRanges };
}

/**
 * IFC-Lite does not guarantee outward winding ("shade with abs(dot(normal,
 * viewDir))" — docs/guide/geometry.md). Three.js flips the normal of back-facing
 * triangles via gl_FrontFacing, which turns every inward-wound face dark. Instead,
 * always orient the shading normal toward the camera.
 */
function faceNormalsToViewer(material: THREE.Material) {
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <normal_fragment_begin>',
      `#include <normal_fragment_begin>
      // vViewPosition points from the fragment to the camera (view space).
      if (dot(normal, vViewPosition) < 0.0) normal = -normal;`,
    );
  };
  material.customProgramCacheKey = () => 'ifc-face-viewer';
}

function mergeGeometry(
  meshes: MeshData[],
  withColors: boolean,
): { geometry: THREE.BufferGeometry; triangleRanges: TriangleRange[] } {
  let totalVertices = 0;
  let totalIndices = 0;
  for (const m of meshes) {
    totalVertices += m.positions.length / 3;
    totalIndices += m.indices.length;
  }

  const positions = new Float32Array(totalVertices * 3);
  const normals = new Float32Array(totalVertices * 3);
  const colors = withColors ? new Float32Array(totalVertices * 3) : null;
  const indices = new Uint32Array(totalIndices);

  const triangleRanges: TriangleRange[] = [];
  let vOffset = 0;
  let iOffset = 0;

  for (const m of meshes) {
    const vertCount = m.positions.length / 3;

    positions.set(m.positions, vOffset * 3);
    normals.set(m.normals, vOffset * 3);

    if (colors) {
      const [r, g, b] = m.color;
      for (let v = 0; v < vertCount; v++) {
        const o = (vOffset + v) * 3;
        colors[o] = r;
        colors[o + 1] = g;
        colors[o + 2] = b;
      }
    }

    for (let i = 0; i < m.indices.length; i++) {
      indices[iOffset + i] = m.indices[i] + vOffset;
    }

    triangleRanges.push({ expressId: m.expressId, start: iOffset / 3, count: m.indices.length / 3 });

    vOffset += vertCount;
    iOffset += m.indices.length;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  if (colors) geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.computeBoundingSphere();
  geometry.computeBoundingBox();

  return { geometry, triangleRanges };
}
