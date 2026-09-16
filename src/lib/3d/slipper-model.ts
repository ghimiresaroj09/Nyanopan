import * as THREE from "three";

/**
 * Organic Felt Slipper 3D Model with Realistic Wool Silhouette,
 * authentic foot curvature, thick felt edge roll, and natural materials.
 */

// Slipper footprint curve width along the X-axis (length from -1.3 heel to +1.25 toe)
function getSoleProfile(u: number): { halfWidth: number; yCenter: number; zOffset: number } {
  // u from 0 (heel) to 1 (toe)
  let halfWidth = 0.44;

  if (u < 0.22) {
    // Heel rounding
    const t = u / 0.22;
    halfWidth = 0.4 * Math.sqrt(Math.max(0, 1 - Math.pow(1 - t, 2))) + 0.06;
  } else if (u < 0.52) {
    // Arch tapering
    const t = (u - 0.22) / 0.3;
    halfWidth = 0.44 - Math.sin(t * Math.PI) * 0.07;
  } else if (u < 0.82) {
    // Ball of foot (widest part)
    const t = (u - 0.52) / 0.3;
    halfWidth = 0.47 + Math.sin(t * Math.PI) * 0.12;
  } else {
    // Soft rounded toe box
    const t = (u - 0.82) / 0.18;
    halfWidth = 0.55 * Math.sqrt(Math.max(0, 1 - Math.pow(t, 2)));
  }

  // Natural toe lift / rocker and slight heel incline
  const yCenter = Math.pow(Math.max(0, u - 0.65) / 0.35, 1.8) * 0.22 + Math.pow(Math.max(0, 0.18 - u) / 0.18, 1.8) * 0.04;
  // Natural inward ergonomic curve of human foot
  const zOffset = -Math.sin(u * Math.PI) * 0.1;

  return { halfWidth: Math.max(0.04, halfWidth), yCenter, zOffset };
}

/**
 * 1. Seamless Wool Felt Upper 3D Solid Geometry
 * Sculpted with authentic rounded felt volume, high arch instep, and open collar rim
 */
export function createFeltUpperGeometry(): THREE.BufferGeometry {
  const uSegments = 56;
  const vSegments = 40;

  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= uSegments; i++) {
    const u = i / uSegments;
    const x = (u - 0.5) * 2.65;
    const profile = getSoleProfile(u);

    // Height profile of the wool felt upper dome
    let maxHeight = 0.68;
    if (u < 0.28) {
      // Heel rise
      maxHeight = 0.56 + (u / 0.28) * 0.12;
    } else if (u < 0.64) {
      // Instep / bridge apex
      const t = (u - 0.28) / 0.36;
      maxHeight = 0.68 + Math.sin(t * Math.PI) * 0.22;
    } else {
      // Sloping down towards the soft toe box
      const t = (u - 0.64) / 0.36;
      maxHeight = 0.82 - Math.pow(t, 1.1) * 0.54;
    }

    // Collar / Ankle entry hole profile (open between heel and mid-instep)
    const isCollarZone = u >= 0.12 && u <= 0.5;
    const collarOpening = isCollarZone
      ? Math.sin(((u - 0.12) / (0.5 - 0.12)) * Math.PI) * 0.36
      : 0;

    for (let j = 0; j <= vSegments; j++) {
      const v = j / vSegments;
      const angle = v * Math.PI;

      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      const px = x;
      let pz = profile.zOffset + cosA * profile.halfWidth;
      let py = profile.yCenter + sinA * maxHeight;

      // Ankle opening cutout with rounded felt rim lip
      if (isCollarZone && sinA > 0.42 && Math.abs(cosA) < 0.8) {
        const dip = (1 - Math.abs(cosA) / 0.8) * collarOpening * 1.15;
        py = Math.max(profile.yCenter + 0.12, py - dip);
      }

      // Add gentle organic felt surface waviness (handmade irregular texture)
      const feltImperfection = Math.sin(x * 9 + angle * 4) * 0.012 + Math.cos(x * 14) * 0.008;
      py += feltImperfection;
      pz += feltImperfection * 0.5;

      positions.push(px, py, pz);
      // Continuous UV wrapping for micro-wool fibers
      uvs.push(u * 3.5, v * 2.0);
    }
  }

  // Generate faces
  for (let i = 0; i < uSegments; i++) {
    for (let j = 0; j < vSegments; j++) {
      const a = i * (vSegments + 1) + j;
      const b = (i + 1) * (vSegments + 1) + j;
      const c = (i + 1) * (vSegments + 1) + (j + 1);
      const d = i * (vSegments + 1) + (j + 1);

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

/**
 * 2. Thick Felt Collar Hem Tube (The rolled wool edge along ankle opening)
 */
export function createCollarHemGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector3[] = [];
  const segments = 48;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const u = 0.12 + t * (0.5 - 0.12);
    const x = (u - 0.5) * 2.65;
    const profile = getSoleProfile(u);
    const widthFactor = Math.sin(t * Math.PI) * 0.35;
    const height = profile.yCenter + 0.48 + Math.sin(t * Math.PI) * 0.18;

    // Oval path around the opening
    const angle = t * Math.PI * 2;
    const ox = x + Math.cos(angle) * 0.05;
    const oz = profile.zOffset + Math.sin(angle) * (profile.halfWidth * 0.65 + widthFactor * 0.15);
    const oy = height - Math.abs(Math.sin(angle)) * 0.18;

    points.push(new THREE.Vector3(ox, oy, oz));
  }

  const curve = new THREE.CatmullRomCurve3(points, true);
  return new THREE.TubeGeometry(curve, 64, 0.038, 8, true);
}

/**
 * 3. Contoured Insole (8mm pressed wool footbed)
 */
export function createInsoleGeometry(): THREE.BufferGeometry {
  const uSegments = 44;
  const vSegments = 18;

  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= uSegments; i++) {
    const u = i / uSegments;
    const x = (u - 0.5) * 2.52;
    const profile = getSoleProfile(u);
    const halfW = profile.halfWidth * 0.94;

    for (let j = 0; j <= vSegments; j++) {
      const v = j / vSegments;
      const t = (v - 0.5) * 2;
      const pz = profile.zOffset + t * halfW;

      let cup = (1 - Math.abs(t)) * 0.045;
      if (u < 0.24) cup += (1 - u / 0.24) * 0.035;
      if (u >= 0.28 && u <= 0.62 && t > 0) {
        cup += Math.sin(((u - 0.28) / 0.34) * Math.PI) * (t * 0.06);
      }

      const py = profile.yCenter + cup + 0.02;
      positions.push(x, py, pz);
      uvs.push(u * 2.5, v * 2.0);
    }
  }

  for (let i = 0; i < uSegments; i++) {
    for (let j = 0; j < vSegments; j++) {
      const a = i * (vSegments + 1) + j;
      const b = (i + 1) * (vSegments + 1) + j;
      const c = (i + 1) * (vSegments + 1) + (j + 1);
      const d = i * (vSegments + 1) + (j + 1);

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

/**
 * 4. Midsole Geometry (Jute fiber core)
 */
export function createMidsoleGeometry(): THREE.BufferGeometry {
  const uSegments = 40;
  const positions: number[] = [];
  const indices: number[] = [];

  const topY = 0.0;
  const botY = -0.06;

  for (let i = 0; i <= uSegments; i++) {
    const u = i / uSegments;
    const x = (u - 0.5) * 2.54;
    const profile = getSoleProfile(u);
    const halfW = profile.halfWidth * 0.95;

    positions.push(x, profile.yCenter + topY, profile.zOffset + halfW);
    positions.push(x, profile.yCenter + botY, profile.zOffset + halfW);
    positions.push(x, profile.yCenter + topY, profile.zOffset - halfW);
    positions.push(x, profile.yCenter + botY, profile.zOffset - halfW);
  }

  for (let i = 0; i < uSegments; i++) {
    const idx = i * 4;
    indices.push(idx, idx + 1, idx + 5);
    indices.push(idx, idx + 5, idx + 4);
    indices.push(idx + 2, idx + 6, idx + 7);
    indices.push(idx + 2, idx + 7, idx + 3);
    indices.push(idx, idx + 4, idx + 6);
    indices.push(idx, idx + 6, idx + 2);
    indices.push(idx + 1, idx + 3, idx + 7);
    indices.push(idx + 1, idx + 7, idx + 5);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

/**
 * 5. Outsole Geometry (Vegetable-Tanned Calfskin with Stitched Welt)
 */
export function createOutsoleGeometry(): THREE.BufferGeometry {
  const uSegments = 48;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const thickness = 0.085;

  for (let i = 0; i <= uSegments; i++) {
    const u = i / uSegments;
    const x = (u - 0.5) * 2.62;
    const profile = getSoleProfile(u);
    const halfW = profile.halfWidth * 1.03;

    const yTop = profile.yCenter - 0.015;
    const yBot = profile.yCenter - thickness;

    positions.push(x, yTop, profile.zOffset + halfW);
    positions.push(x, yBot, profile.zOffset + halfW);
    positions.push(x, yTop, profile.zOffset - halfW);
    positions.push(x, yBot, profile.zOffset - halfW);

    uvs.push(u * 3, 1, u * 3, 0, u * 3, 1, u * 3, 0);
  }

  for (let i = 0; i < uSegments; i++) {
    const idx = i * 4;
    indices.push(idx, idx + 1, idx + 5);
    indices.push(idx, idx + 5, idx + 4);
    indices.push(idx + 2, idx + 6, idx + 7);
    indices.push(idx + 2, idx + 7, idx + 3);
    indices.push(idx + 1, idx + 3, idx + 7);
    indices.push(idx + 1, idx + 7, idx + 5);
    indices.push(idx, idx + 4, idx + 6);
    indices.push(idx, idx + 6, idx + 2);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

/**
 * 6. Perimeter Hand-Stitch Welt (Waxed Cord Stitches)
 */
export function createStitchGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector3[] = [];
  const segments = 100;

  for (let i = 0; i <= segments; i++) {
    const u = i / segments;
    const profile = getSoleProfile(u);
    const x = (u - 0.5) * 2.6;
    const y = profile.yCenter - 0.008;
    const z = profile.zOffset + profile.halfWidth * 1.01;
    points.push(new THREE.Vector3(x, y, z));
  }
  for (let i = segments; i >= 0; i--) {
    const u = i / segments;
    const profile = getSoleProfile(u);
    const x = (u - 0.5) * 2.6;
    const y = profile.yCenter - 0.008;
    const z = profile.zOffset - profile.halfWidth * 1.01;
    points.push(new THREE.Vector3(x, y, z));
  }

  const curve = new THREE.CatmullRomCurve3(points, true);
  return new THREE.TubeGeometry(curve, 180, 0.016, 6, true);
}
