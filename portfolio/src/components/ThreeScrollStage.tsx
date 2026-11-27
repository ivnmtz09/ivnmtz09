import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PARTICLE_COUNT = 1650;
const SECTION_IDS = ['top', 'about', 'projects', 'skills', 'trajectory', 'contact'] as const;

// ─── 3-Color Monochrome + Electric Blue Brand Palette ─────────────────────────
const C_BLUE      = new THREE.Color(0x0066ff);
const C_BLUE_HI   = new THREE.Color(0x5ca3ff);
const C_BLUE_DEEP = new THREE.Color(0x0040aa);
const C_WHITE     = new THREE.Color(0xe4e4e7);
const C_SILVER    = new THREE.Color(0xa1a1aa);
const C_SLATE     = new THREE.Color(0x71717a);
const C_CHARCOAL  = new THREE.Color(0x3f3f46);

interface FigureData {
  pos: Float32Array;
  col: Float32Array;
  size: Float32Array;
  group: Float32Array;
}

interface ParticleDraft {
  x: number;
  y: number;
  z: number;
  r: number;
  g: number;
  b: number;
  size: number;
  group: number;
}

function rand(min = -1, max = 1): number {
  return min + Math.random() * (max - min);
}

function lerpColor(a: THREE.Color, b: THREE.Color, t: number): THREE.Color {
  return new THREE.Color().lerpColors(a, b, Math.max(0, Math.min(1, t)));
}

/** Bake soft top-left clay shading + AO directly into vertex RGB */
function pushShaded(
  out: ParticleDraft[],
  x: number,
  y: number,
  z: number,
  nx: number,
  ny: number,
  nz: number,
  base: THREE.Color,
  size = 1.0,
  group = 0,
  ao = 1.0,
) {
  const len = Math.hypot(nx, ny, nz) || 1;
  const lightDot = (nx * -0.42 + ny * 0.66 + nz * 0.62) / len;
  const shade = (0.82 + lightDot * 0.24) * ao;
  out.push({
    x,
    y,
    z,
    r: Math.min(1, Math.max(0.03, base.r * shade)),
    g: Math.min(1, Math.max(0.03, base.g * shade)),
    b: Math.min(1, Math.max(0.04, base.b * shade)),
    size,
    group,
  });
}

/** 3D rounded capsule shell between A and B */
function addCapsule(
  out: ParticleDraft[],
  ax: number, ay: number, az: number,
  bx: number, by: number, bz: number,
  radius: number,
  count: number,
  colA: THREE.Color,
  colB: THREE.Color,
  ptSize = 1.0,
  group = 0,
) {
  const dx = bx - ax;
  const dy = by - ay;
  const dz = bz - az;
  const len = Math.hypot(dx, dy, dz) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const uz = dz / len;

  const refX = Math.abs(ux) < 0.85 ? 1 : 0;
  const refY = Math.abs(ux) < 0.85 ? 0 : 1;
  let px = -uz * refY;
  let py = uz * refX;
  let pz = ux * refY - uy * refX;
  const pLen = Math.hypot(px, py, pz) || 1;
  px /= pLen; py /= pLen; pz /= pLen;

  const qx = uy * pz - uz * py;
  const qy = uz * px - ux * pz;
  const qz = ux * py - uy * px;

  for (let i = 0; i < count; i++) {
    const t = Math.random();
    const angle = rand(0, Math.PI * 2);
    const shell = rand(0.78, 1.0);
    const rad = radius * shell;

    const nx = Math.cos(angle) * px + Math.sin(angle) * qx;
    const ny = Math.cos(angle) * py + Math.sin(angle) * qy;
    const nz = Math.cos(angle) * pz + Math.sin(angle) * qz;

    const capFactor = t < 0.08 ? Math.sin((t / 0.08) * (Math.PI / 2)) : t > 0.92 ? Math.sin(((1 - t) / 0.08) * (Math.PI / 2)) : 1;
    const effRad = rad * (0.48 + 0.52 * capFactor);

    const x = ax + dx * t + nx * effRad;
    const y = ay + dy * t + ny * effRad;
    const z = az + dz * t + nz * effRad;

    const c = lerpColor(colA, colB, t * 0.6 + (nz * 0.25 + 0.25));
    pushShaded(out, x, y, z, nx, ny, nz, c, ptSize * rand(0.88, 1.14), group);
  }
}

/** 3D ellipsoid outer clay shell */
function addEllipsoid(
  out: ParticleDraft[],
  cx: number, cy: number, cz: number,
  rx: number, ry: number, rz: number,
  count: number,
  colA: THREE.Color,
  colB: THREE.Color,
  ptSize = 1.0,
  group = 0,
) {
  for (let i = 0; i < count; i++) {
    const theta = rand(0, Math.PI * 2);
    const phi = Math.acos(rand(-1, 1));
    const shell = rand(0.82, 1.0);
    const nx = Math.sin(phi) * Math.cos(theta);
    const ny = Math.sin(phi) * Math.sin(theta);
    const nz = Math.cos(phi);
    const x = cx + nx * rx * shell;
    const y = cy + ny * ry * shell;
    const z = cz + nz * rz * shell;
    const c = lerpColor(colA, colB, ny * 0.35 + nz * 0.2 + 0.45);
    pushShaded(out, x, y, z, nx, ny, nz, c, ptSize * rand(0.88, 1.15), group);
  }
}

/** 3D beveled box prism outer faces */
function addBeveledBox(
  out: ParticleDraft[],
  cx: number, cy: number, cz: number,
  hw: number, hh: number, hd: number,
  count: number,
  colA: THREE.Color,
  colB: THREE.Color,
  ptSize = 1.0,
) {
  for (let i = 0; i < count; i++) {
    let lx = 0, ly = 0, lz = 0, nx = 0, ny = 0, nz = 0;
    const face = Math.random();
    if (face < 0.60) {
      const sign = face < 0.38 ? 1 : -1;
      lx = rand(-hw, hw);
      ly = rand(-hh, hh);
      lz = sign * hd * rand(0.88, 1.0);
      nz = sign;
    } else if (face < 0.82) {
      const sign = face < 0.72 ? 1 : -1;
      lx = rand(-hw, hw);
      ly = sign * hh * rand(0.88, 1.0);
      lz = rand(-hd, hd);
      ny = sign;
    } else {
      const sign = face < 0.91 ? 1 : -1;
      lx = sign * hw * rand(0.88, 1.0);
      ly = rand(-hh, hh);
      lz = rand(-hd, hd);
      nx = sign;
    }

    const mixT = (ly / (hh || 1) + 1) * 0.5;
    const c = lerpColor(colA, colB, mixT);
    pushShaded(out, cx + lx, cy + ly, cz + lz, nx, ny, nz, c, ptSize * rand(0.88, 1.13));
  }
}

/** Extruded 3D triangular prism */
function addTriPrism(
  out: ParticleDraft[],
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  halfDepth: number,
  count: number,
  colA: THREE.Color,
  colB: THREE.Color,
  ptSize = 1.0,
) {
  for (let i = 0; i < count; i++) {
    let u = Math.random();
    let v = Math.random();
    if (u + v > 1) {
      u = 1 - u;
      v = 1 - v;
    }
    const w = 1 - u - v;
    const x = p0[0] * u + p1[0] * v + p2[0] * w;
    const y = p0[1] * u + p1[1] * v + p2[1] * w;

    const edgeDist = Math.min(u, v, w) * 3;
    const taper = 0.38 + 0.62 * Math.sqrt(Math.min(1, edgeDist));
    const zSign = Math.random() < 0.55 ? 1 : -1;
    const z = zSign * rand(0.75, 1.0) * halfDepth * taper;

    const nx = x * 0.35;
    const ny = 0.35;
    const nz = z >= 0 ? 0.85 : -0.85;
    const c = lerpColor(colA, colB, (y + 1) * 0.25 + (1 - Math.abs(x) * 0.35) * 0.5);
    pushShaded(out, x, y, z, nx, ny, nz, c, ptSize * rand(0.88, 1.14));
  }
}

/** Normalize draft list cleanly to exact PARTICLE_COUNT */
function finalizeFigure(draft: ParticleDraft[]): FigureData {
  const pos = new Float32Array(PARTICLE_COUNT * 3);
  const col = new Float32Array(PARTICLE_COUNT * 3);
  const size = new Float32Array(PARTICLE_COUNT);
  const group = new Float32Array(PARTICLE_COUNT);

  for (let i = draft.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = draft[i];
    draft[i] = draft[j];
    draft[j] = tmp;
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = draft[i % draft.length];
    pos[i * 3]     = p.x;
    pos[i * 3 + 1] = p.y;
    pos[i * 3 + 2] = p.z;
    col[i * 3]     = p.r;
    col[i * 3 + 1] = p.g;
    col[i * 3 + 2] = p.b;
    size[i]        = p.size;
    group[i]       = p.group;
  }

  return { pos, col, size, group };
}

// ─── 6 Representative 3D Claymorphism Figure Builders ─────────────────────────

/** 0 · Hero — Upward Launch Rocket Arrow ▲ */
function buildArrowFigure(): FigureData {
  const pts: ParticleDraft[] = [];

  addTriPrism(pts, [-1.14, 0.24], [0, 2.18], [1.14, 0.24], 0.38, 600, C_BLUE_DEEP, C_BLUE_HI, 1.06);
  addCapsule(pts, 0, 0.34, 0.18, 0, 2.12, 0.04, 0.15, 110, C_BLUE_HI, C_WHITE, 1.02);
  addCapsule(pts, 0, 0.38, 0, 0, -1.18, 0, 0.28, 310, C_SILVER, C_WHITE, 1.04);
  addEllipsoid(pts, 0, -1.24, 0, 0.34, 0.13, 0.34, 95, C_CHARCOAL, C_SLATE, 0.98);
  addTriPrism(pts, [-0.20, -0.45], [-0.96, -1.36], [-0.20, -1.22], 0.15, 150, C_CHARCOAL, C_SLATE, 0.96);
  addTriPrism(pts, [0.20, -0.45], [0.96, -1.36], [0.20, -1.22], 0.15, 150, C_CHARCOAL, C_SLATE, 0.96);

  for (let s = 0; s < 7; s++) {
    const sx = (s - 3) * 0.13;
    const len = s === 3 ? 0.56 : s === 2 || s === 4 ? 0.42 : 0.28;
    const y0 = -1.44 - Math.abs(s - 3) * 0.05;
    addCapsule(pts, sx, y0, 0, sx * 1.12, y0 - len, 0, s === 3 ? 0.10 : 0.07, 34, C_BLUE, C_BLUE_HI, 0.88);
  }

  return finalizeFigure(pts);
}

/** 1 · 01 Perfil — Developer Profile Bust Silhouette 👤 */
function buildProfileFigure(): FigureData {
  const pts: ParticleDraft[] = [];

  addEllipsoid(pts, 0, 1.42, 0, 0.68, 0.76, 0.66, 480, C_SILVER, C_WHITE, 1.06);
  addBeveledBox(pts, 0, 1.46, 0.56, 0.44, 0.11, 0.12, 110, C_CHARCOAL, C_BLUE, 0.94);
  addCapsule(pts, 0, 0.72, 0, 0, 0.38, 0, 0.24, 90, C_SILVER, C_WHITE, 0.98);

  for (let i = 0; i < 690; i++) {
    const u = rand(-1.95, 1.95);
    const archTop = 0.42 * (1 - (u * u) / (2.05 * 2.05));
    const y = rand(-1.42, Math.max(-0.9, archTop));
    const taperX = y < -1.1 ? 0.92 : 1.0;
    const x = u * taperX;
    const edge = 1 - Math.abs(x) / 2.02;
    const maxZ = 0.46 * Math.sqrt(Math.max(0.08, edge));
    const zSign = Math.random() < 0.56 ? 1 : -1;
    const z = zSign * rand(0.75, 1.0) * maxZ;
    const c = lerpColor(C_BLUE_DEEP, C_BLUE_HI, (y + 1.42) / 1.9 * 0.7 + 0.2);
    pushShaded(pts, x, y, z, x * 0.3, y > archTop - 0.2 ? 0.7 : 0.1, z >= 0 ? 0.85 : -0.85, c, rand(0.92, 1.15));
  }

  const barWidths = [0.72, 0.48, 0.62];
  for (let r = 0; r < 3; r++) {
    addBeveledBox(pts, -0.22 + r * 0.08, -0.35 - r * 0.32, 0.46, barWidths[r], 0.085, 0.08, 50, C_WHITE, C_BLUE_HI, 0.94);
  }

  for (let i = 0; i < 130; i++) {
    const a = (i / 130) * Math.PI * 1.4 - Math.PI * 0.2;
    const rx = Math.cos(a) * 1.92;
    const ry = 0.08 + Math.sin(a) * 1.92;
    pushShaded(pts, rx, ry, -0.45 + rand(-0.06, 0.06), 0, 0.3, 0.9, C_SLATE, 0.86);
  }

  return finalizeFigure(pts);
}

/** 2 · 02 Proyectos — 3D Code Brackets < / > */
function buildBracketsFigure(): FigureData {
  const pts: ParticleDraft[] = [];

  addCapsule(pts, -0.82, 1.56, 0.08, -2.06, 0.0, 0.08, 0.25, 265, C_BLUE_DEEP, C_BLUE_HI, 1.05);
  addCapsule(pts, -2.06, 0.0, 0.08, -0.82, -1.56, 0.08, 0.25, 265, C_BLUE_DEEP, C_BLUE_HI, 1.05);
  addCapsule(pts, 0.44, 1.76, -0.08, -0.44, -1.76, -0.08, 0.22, 330, C_SILVER, C_WHITE, 1.05);
  addCapsule(pts, 0.82, 1.56, 0.08, 2.06, 0.0, 0.08, 0.25, 265, C_BLUE_DEEP, C_BLUE_HI, 1.05);
  addCapsule(pts, 2.06, 0.0, 0.08, 0.82, -1.56, 0.08, 0.25, 265, C_BLUE_DEEP, C_BLUE_HI, 1.05);

  addEllipsoid(pts, -2.06, 0, 0.10, 0.29, 0.29, 0.29, 70, C_BLUE_HI, C_WHITE, 1.08);
  addEllipsoid(pts, 2.06, 0, 0.10, 0.29, 0.29, 0.29, 70, C_BLUE_HI, C_WHITE, 1.08);
  addCapsule(pts, -0.82, 1.56, -0.48, -2.06, 0.0, -0.48, 0.12, 60, C_CHARCOAL, C_SLATE, 0.88);
  addCapsule(pts, 0.82, -1.56, -0.48, 2.06, 0.0, -0.48, 0.12, 60, C_CHARCOAL, C_SLATE, 0.88);

  return finalizeFigure(pts);
}

const ATOM_ORBITS: [number, number, number][] = [
  [0.42, 0.0, 0.15],
  [-0.45, Math.PI / 3, -0.25],
  [1.08, -Math.PI * 0.35, 0.4],
];

const ATOM_ORBIT_AXES: [number, number, number][] = ATOM_ORBITS.map(([tx, ty, tz]) => {
  const v = new THREE.Vector3(0, 0, 1).applyEuler(new THREE.Euler(tx, ty, tz)).normalize();
  return [v.x, v.y, v.z];
});

/** 3 · 03 Stack Tecnológico — Atomic Orbital System ⚛ */
function buildAtomFigure(): FigureData {
  const pts: ParticleDraft[] = [];

  const coreOffsets: [number, number, number, THREE.Color][] = [
    [0, 0, 0, C_BLUE],
    [0.24, 0.18, 0.14, C_WHITE],
    [-0.22, 0.2, -0.1, C_BLUE_HI],
    [0.16, -0.24, -0.14, C_SILVER],
    [-0.2, -0.18, 0.2, C_BLUE],
    [0.02, 0.04, -0.26, C_BLUE_DEEP],
    [-0.04, -0.02, 0.26, C_WHITE],
  ];
  coreOffsets.forEach(([ox, oy, oz, col]) => {
    addEllipsoid(pts, ox, oy, oz, 0.28, 0.28, 0.28, 56, col, C_BLUE_HI, 1.06, 0);
  });

  const ringColors: [THREE.Color, THREE.Color, THREE.Color][] = [
    [C_BLUE, C_BLUE_HI, C_WHITE],
    [C_BLUE_HI, C_SLATE, C_BLUE],
    [C_SILVER, C_WHITE, C_BLUE],
  ];

  ATOM_ORBITS.forEach(([tx, ty, tz], idx) => {
    const groupId = idx + 1;
    const euler = new THREE.Euler(tx, ty, tz);
    const rx = 2.15;
    const ry = 0.84;
    const [colA, colB, electronCol] = ringColors[idx];

    for (let i = 0; i < 330; i++) {
      const a = (i / 330) * Math.PI * 2;
      const tAngle = rand(0, Math.PI * 2);
      const tubeR = 0.115 * rand(0.75, 1.0);
      const cosA = Math.cos(a);
      const sinA = Math.sin(a);

      const lx = cosA * rx + cosA * Math.cos(tAngle) * tubeR;
      const ly = sinA * ry + sinA * Math.cos(tAngle) * tubeR;
      const lz = Math.sin(tAngle) * tubeR;

      const p = new THREE.Vector3(lx, ly, lz).applyEuler(euler);
      const n = new THREE.Vector3(
        cosA * Math.cos(tAngle),
        sinA * Math.cos(tAngle),
        Math.sin(tAngle),
      ).applyEuler(euler);

      const c = lerpColor(colA, colB, (i % 40) / 40);
      pushShaded(pts, p.x, p.y, p.z, n.x, n.y, n.z, c, rand(0.86, 1.08), groupId);
    }

    const eA = (idx * Math.PI * 2) / 3 + 0.4;
    const eCenter = new THREE.Vector3(Math.cos(eA) * rx, Math.sin(eA) * ry, 0).applyEuler(euler);
    addEllipsoid(pts, eCenter.x, eCenter.y, eCenter.z, 0.25, 0.25, 0.25, 88, C_BLUE, electronCol, 1.12, groupId);
  });

  return finalizeFigure(pts);
}

/** 4 · 04 Trayectoria — Stepped Ascending Pyramid 🪜 */
function buildPyramidFigure(): FigureData {
  const pts: ParticleDraft[] = [];

  const tiers: [number, number, number, number, THREE.Color, THREE.Color][] = [
    [2.05, 0.19, 1.02, -1.56, C_CHARCOAL, C_SLATE],
    [1.68, 0.19, 0.86, -0.94, C_SLATE,    C_SILVER],
    [1.30, 0.19, 0.70, -0.32, C_SILVER,   C_BLUE_HI],
    [0.94, 0.19, 0.54,  0.30, C_BLUE_DEEP, C_BLUE_HI],
    [0.58, 0.19, 0.38,  0.92, C_BLUE,     C_WHITE],
  ];

  const tierCounts = [360, 315, 280, 245, 215];

  tiers.forEach(([hw, hh, hd, y, cA, cB], idx) => {
    addBeveledBox(pts, 0, y, 0, hw, hh, hd, tierCounts[idx], cA, cB, 0.98);
  });

  addEllipsoid(pts, 0, 1.66, 0, 0.33, 0.33, 0.33, 165, C_BLUE, C_WHITE, 1.1);
  addCapsule(pts, 0, 1.16, 0, 0, 1.50, 0, 0.08, 70, C_WHITE, C_BLUE_HI, 0.94);

  return finalizeFigure(pts);
}

/** 5 · 05 Contacto — 3D Clay Envelope with Flap & Signal Waves ✉️ */
function buildEnvelopeFigure(): FigureData {
  const pts: ParticleDraft[] = [];

  addBeveledBox(pts, -0.1, -0.15, -0.05, 1.88, 1.18, 0.22, 690, C_SLATE, C_WHITE, 0.98);
  addCapsule(pts, -1.98, 1.03, 0.15, 1.78, 1.03, 0.15, 0.075, 65, C_CHARCOAL, C_SLATE, 0.9);
  addCapsule(pts, -1.98, -1.33, 0.15, 1.78, -1.33, 0.15, 0.075, 65, C_CHARCOAL, C_SLATE, 0.9);

  addCapsule(pts, -1.92, 1.01, 0.22, -0.1, -0.18, 0.30, 0.135, 200, C_BLUE_DEEP, C_BLUE_HI, 1.04);
  addCapsule(pts, -0.1, -0.18, 0.30, 1.72, 1.01, 0.22, 0.135, 200, C_BLUE_DEEP, C_BLUE_HI, 1.04);

  addCapsule(pts, -1.88, -1.27, 0.20, -0.45, -0.38, 0.20, 0.08, 65, C_CHARCOAL, C_SLATE, 0.9);
  addCapsule(pts, 1.68, -1.27, 0.20, 0.25, -0.38, 0.20, 0.08, 65, C_CHARCOAL, C_SLATE, 0.9);

  addEllipsoid(pts, -0.1, -0.18, 0.36, 0.25, 0.25, 0.17, 105, C_WHITE, C_BLUE_HI, 1.08);

  const radii = [0.36, 0.64, 0.92];
  const counts = [55, 65, 75];
  radii.forEach((r, idx) => {
    const segs = 12;
    const perSeg = Math.ceil(counts[idx] / segs);
    for (let s = 0; s < segs; s++) {
      const a0 = (s / segs) * (Math.PI * 0.45) + 0.15;
      const a1 = ((s + 1) / segs) * (Math.PI * 0.45) + 0.15;
      addCapsule(
        pts,
        1.12 + Math.cos(a0) * r, 0.92 + Math.sin(a0) * r, 0.14,
        1.12 + Math.cos(a1) * r, 0.92 + Math.sin(a1) * r, 0.14,
        0.072,
        perSeg,
        C_BLUE,
        C_BLUE_HI,
        0.92,
      );
    }
  });

  return finalizeFigure(pts);
}

// ─── Optimized GLSL Claymorphism Morph Shaders ────────────────────────────────

const VERTEX_SHADER = `
  attribute vec3 aPosA;
  attribute vec3 aPosB;
  attribute vec3 aColA;
  attribute vec3 aColB;
  attribute float aSizeA;
  attribute float aSizeB;
  attribute float aGroupA;
  attribute float aGroupB;
  attribute vec3 aSeed;

  uniform float uMorph;
  uniform float uTime;
  uniform float uOffsetX_A;
  uniform float uOffsetX_B;
  uniform float uScale_A;
  uniform float uScale_B;
  uniform float uOffsetY;
  uniform float uTiltX;
  uniform float uTiltY;
  uniform float uOrbitWeightA;
  uniform float uOrbitWeightB;
  uniform float uProjScale;
  uniform float uBaseSize;
  uniform float uIsDark;
  uniform float uMobileDim;

  uniform vec3 uAxis1;
  uniform vec3 uAxis2;
  uniform vec3 uAxis3;

  varying vec3 vColor;
  varying float vDepthFade;
  varying float vDark;

  vec3 rotateAxis(vec3 p, vec3 axis, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return p * c + cross(axis, p) * s + axis * dot(axis, p) * (1.0 - c);
  }

  vec3 applyOrbit(vec3 p, float grp, float weight, float time) {
    if (weight <= 0.001 || grp < 0.5) return p;
    vec3 ax = uAxis1;
    float spd = 0.55;
    if (grp > 1.5 && grp < 2.5) {
      ax = uAxis2;
      spd = -0.45;
    } else if (grp >= 2.5) {
      ax = uAxis3;
      spd = 0.38;
    }
    return rotateAxis(p, ax, time * spd * weight);
  }

  vec3 applyTilt(vec3 p, float ry, float rx) {
    float cy = cos(ry), sy = sin(ry);
    p = vec3(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy);
    float cx = cos(rx), sx = sin(rx);
    return vec3(p.x, p.y * cx - p.z * sx, p.y * sx + p.z * cx);
  }

  void main() {
    float rY = uTiltY + sin(uTime * 0.55) * 0.16;
    float rX = uTiltX;

    vec3 localA = applyOrbit(aPosA, aGroupA, uOrbitWeightA, uTime);
    vec3 localB = applyOrbit(aPosB, aGroupB, uOrbitWeightB, uTime);

    vec3 worldA = applyTilt(localA, rY, rX) * uScale_A + vec3(uOffsetX_A, uOffsetY, 0.0);
    vec3 worldB = applyTilt(localB, rY, rX) * uScale_B + vec3(uOffsetX_B, uOffsetY, 0.0);

    // Tighter per-particle stagger so transitions feel fast, smooth & cohesive
    float m = clamp((uMorph - aSeed.x * 0.16) / 0.84, 0.0, 1.0);
    m = m * m * (3.0 - 2.0 * m);

    vec3 pos = mix(worldA, worldB, m);

    // Sideways sweep + front/back Z arc without bloating screen overdraw
    float mid = sin(m * 3.14159265);
    float swirlAngle = aSeed.y + m * 2.2;
    pos.xy += vec2(cos(swirlAngle) * 1.65, sin(swirlAngle) * 0.65) * mid * aSeed.z;
    pos.z += -1.85 * sin(m * 6.2831853) * mid * aSeed.z;

    pos.y += sin(uTime * 1.1 + aSeed.x * 6.28) * 0.03;

    vec3 rawCol = mix(aColA, aColB, m);
    float maxC = max(rawCol.r, max(rawCol.g, rawCol.b));
    float minC = min(rawCol.r, min(rawCol.g, rawCol.b));
    float isNeutral = 1.0 - smoothstep(0.08, 0.25, maxC - minC);
    vec3 lightAdapted = mix(rawCol * 0.88, rawCol * 0.42 + vec3(0.06), isNeutral);
    vColor = mix(lightAdapted, rawCol, uIsDark);
    vDark = uIsDark;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;

    float ptSize = mix(aSizeA, aSizeB, m) * (1.0 - 0.14 * mid) * uBaseSize;
    gl_PointSize = ptSize * uProjScale / max(1.0, -mvPos.z);

    vDepthFade = clamp(1.0 - max(0.0, -pos.z) * 0.09, 0.58, 1.0) * uMobileDim;
  }
`;

// Algebraic clay lighting (zero pow() calls per fragment -> significantly faster on GPU)
const FRAGMENT_SHADER = `
  varying vec3 vColor;
  varying float vDepthFade;
  varying float vDark;

  void main() {
    vec2 uv = gl_PointCoord * 2.0 - 1.0;
    float r2 = dot(uv, uv);
    if (r2 > 0.92) discard;

    float z = sqrt(max(0.0, 1.0 - r2));
    vec3 normal = vec3(uv.x, -uv.y, z);

    vec3 keyDir = vec3(-0.44, 0.66, 0.61);
    float wrapDiff = clamp(dot(normal, keyDir) * 0.42 + 0.62, 0.24, 1.04);

    vec3 halfDir = vec3(-0.24, 0.36, 0.90);
    float nh = max(dot(normal, halfDir), 0.0);
    float nh2 = nh * nh;
    float nh4 = nh2 * nh2;
    float spec = (nh4 * nh4 * nh4) * mix(0.18, 0.26, vDark);

    float rim = 1.0 - max(normal.z, 0.0);
    float fresnel = rim * rim;
    float rimAO = smoothstep(0.68, 0.92, r2) * mix(0.28, 0.34, vDark);

    vec3 bounceCol = mix(vec3(0.0, 0.32, 0.85), vec3(0.36, 0.64, 1.0), vDark);
    vec3 lit = vColor * (wrapDiff - rimAO) + vec3(spec) + bounceCol * fresnel * 0.22;

    gl_FragColor = vec4(clamp(lit * vDepthFade, 0.0, 1.0), 1.0);
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

export function ThreeScrollStage() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'high-performance' });
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);

    const grid = new THREE.GridHelper(32, 32, 0x0066ff, 0x52525b);
    grid.position.set(0, -4.6, -4.5);
    const gridMats = Array.isArray(grid.material) ? grid.material : [grid.material];
    gridMats.forEach((m) => {
      m.transparent = true;
      m.opacity = 0.07;
    });
    scene.add(grid);

    const figures: FigureData[] = [
      buildArrowFigure(),
      buildProfileFigure(),
      buildBracketsFigure(),
      buildAtomFigure(),
      buildPyramidFigure(),
      buildEnvelopeFigure(),
    ];

    const dummyPos = new Float32Array(PARTICLE_COUNT * 3);
    const seeds = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      seeds[i * 3]     = Math.random();
      seeds[i * 3 + 1] = rand(0, Math.PI * 2);
      seeds[i * 3 + 2] = rand(0.45, 1.25);
    }

    const morphGeo = new THREE.BufferGeometry();
    morphGeo.setAttribute('position', new THREE.BufferAttribute(dummyPos, 3));
    morphGeo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 3));

    const attrPosA   = new THREE.BufferAttribute(figures[0].pos, 3);
    const attrPosB   = new THREE.BufferAttribute(figures[1].pos, 3);
    const attrColA   = new THREE.BufferAttribute(figures[0].col, 3);
    const attrColB   = new THREE.BufferAttribute(figures[1].col, 3);
    const attrSizeA  = new THREE.BufferAttribute(figures[0].size, 1);
    const attrSizeB  = new THREE.BufferAttribute(figures[1].size, 1);
    const attrGroupA = new THREE.BufferAttribute(figures[0].group, 1);
    const attrGroupB = new THREE.BufferAttribute(figures[1].group, 1);

    morphGeo.setAttribute('aPosA',   attrPosA);
    morphGeo.setAttribute('aPosB',   attrPosB);
    morphGeo.setAttribute('aColA',   attrColA);
    morphGeo.setAttribute('aColB',   attrColB);
    morphGeo.setAttribute('aSizeA',  attrSizeA);
    morphGeo.setAttribute('aSizeB',  attrSizeB);
    morphGeo.setAttribute('aGroupA', attrGroupA);
    morphGeo.setAttribute('aGroupB', attrGroupB);

    const uniforms = {
      uMorph:        { value: 0 },
      uTime:         { value: 0 },
      uOffsetX_A:    { value: 2.8 },
      uOffsetX_B:    { value: -2.8 },
      uScale_A:      { value: 1.0 },
      uScale_B:      { value: 1.0 },
      uOffsetY:      { value: 0.0 },
      uTiltX:        { value: 0.0 },
      uTiltY:        { value: 0.0 },
      uOrbitWeightA: { value: 0.0 },
      uOrbitWeightB: { value: 0.0 },
      uProjScale:    { value: 900.0 },
      uBaseSize:     { value: 0.195 },
      uIsDark:       { value: document.documentElement.classList.contains('dark') ? 1.0 : 0.0 },
      uMobileDim:    { value: 1.0 },
      uAxis1:        { value: new THREE.Vector3(...ATOM_ORBIT_AXES[0]) },
      uAxis2:        { value: new THREE.Vector3(...ATOM_ORBIT_AXES[1]) },
      uAxis3:        { value: new THREE.Vector3(...ATOM_ORBIT_AXES[2]) },
    };

    const morphMat = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      transparent: false,
      depthTest: true,
      depthWrite: true,
    });

    const clayMesh = new THREE.Points(morphGeo, morphMat);
    clayMesh.frustumCulled = false;
    scene.add(clayMesh);

    const normOffsets = [0.583, -0.583, 0.67, -0.583, 0.67, -0.583];
    const desktopScales = [0.90, 0.94, 0.88, 0.94, 0.87, 0.92];

    let halfVisibleWorldW = 5.5;
    let containerScaleRatio = 0.88;
    let desktopResponsiveFit = 1.0;
    let isDesktop = window.innerWidth >= 1024;
    let cachedCenters: number[] = [];

    const measureSectionCenters = () => {
      cachedCenters = SECTION_IDS.map((id) => {
        const el = document.getElementById(id);
        return el ? el.offsetTop + el.offsetHeight * 0.45 : 0;
      });
    };

    const updateLayoutMetrics = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      isDesktop = w >= 1024;
      const curDpr = Math.min(window.devicePixelRatio || 1, 1.5);

      camera.aspect = w / h;
      camera.position.z = w < 640 ? 11.8 : w < 1024 ? 10.6 : 9.2;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(curDpr);
      renderer.setSize(w, h);

      const tanHalfFov = Math.tan(THREE.MathUtils.degToRad(22.5));
      const halfH = tanHalfFov * camera.position.z;
      halfVisibleWorldW = halfH * camera.aspect;

      const usablePx = Math.min(w - 48, 1152);
      containerScaleRatio = Math.max(0.7, usablePx / w);
      const worldHalf = halfVisibleWorldW * containerScaleRatio;
      desktopResponsiveFit = Math.min(1.0, Math.max(0.76, worldHalf / 5.8));

      uniforms.uProjScale.value = (h * curDpr) / (2.0 * tanHalfFov);
      uniforms.uBaseSize.value = w < 640 ? 0.165 : w < 1024 ? 0.175 : 0.195 * desktopResponsiveFit + (1 - desktopResponsiveFit) * 0.165;
      uniforms.uOffsetY.value = isDesktop ? 0.0 : 1.35;
      uniforms.uMobileDim.value = isDesktop ? 1.0 : 0.72;

      measureSectionCenters();
    };
    updateLayoutMetrics();

    const bodyResizeObserver = new ResizeObserver(measureSectionCenters);
    bodyResizeObserver.observe(document.body);

    const syncTheme = () => {
      const dark = document.documentElement.classList.contains('dark');
      uniforms.uIsDark.value = dark ? 1.0 : 0.0;
      gridMats.forEach((m) => { m.opacity = dark ? 0.07 : 0.05; });
    };
    syncTheme();
    const themeObserver = new MutationObserver(syncTheme);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    let targetMx = 0;
    let targetMy = 0;
    let mx = 0;
    let my = 0;
    const onPointerMove = (e: PointerEvent) => {
      targetMx = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMy = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('resize', updateLayoutMetrics, { passive: true });

    const getRawProgress = (): number => {
      if (cachedCenters.length === 0) return 0;
      const viewCenter = window.scrollY + window.innerHeight * 0.5;
      if (viewCenter <= cachedCenters[0]) return 0;
      const last = cachedCenters.length - 1;
      if (viewCenter >= cachedCenters[last]) return last;

      for (let i = 0; i < last; i++) {
        if (viewCenter >= cachedCenters[i] && viewCenter < cachedCenters[i + 1]) {
          const span = Math.max(1, cachedCenters[i + 1] - cachedCenters[i]);
          return i + (viewCenter - cachedCenters[i]) / span;
        }
      }
      return 0;
    };

    const swapPairAttributes = (idxA: number, idxB: number) => {
      const figA = figures[idxA];
      const figB = figures[idxB];
      attrPosA.array   = figA.pos;   attrPosA.needsUpdate   = true;
      attrPosB.array   = figB.pos;   attrPosB.needsUpdate   = true;
      attrColA.array   = figA.col;   attrColA.needsUpdate   = true;
      attrColB.array   = figB.col;   attrColB.needsUpdate   = true;
      attrSizeA.array  = figA.size;  attrSizeA.needsUpdate  = true;
      attrSizeB.array  = figB.size;  attrSizeB.needsUpdate  = true;
      attrGroupA.array = figA.group; attrGroupA.needsUpdate = true;
      attrGroupB.array = figB.group; attrGroupB.needsUpdate = true;
    };

    let curPairA = -1;
    let curPairB = -1;
    let smoothRaw = getRawProgress();
    let raf = 0;
    const clock = new THREE.Clock();
    let prevTime = 0;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const dt = Math.min(0.1, Math.max(0.004, t - prevTime));
      prevTime = t;

      const targetRaw = getRawProgress();
      const followRate = 1.0 - Math.exp(-15.0 * dt);
      smoothRaw += (targetRaw - smoothRaw) * followRate;
      const clamped = Math.max(0, Math.min(figures.length - 1, smoothRaw));

      const idxA = Math.min(figures.length - 2, Math.floor(clamped));
      const idxB = idxA + 1;
      const rawFrac = clamped - idxA;

      if (idxA !== curPairA || idxB !== curPairB) {
        swapPairAttributes(idxA, idxB);
        curPairA = idxA;
        curPairB = idxB;
      }

      const morphT = Math.max(0, Math.min(1, (rawFrac - 0.25) / 0.50));

      mx += (targetMx - mx) * 0.08;
      my += (targetMy - my) * 0.08;

      uniforms.uMorph.value = morphT;
      uniforms.uTime.value = t;
      uniforms.uTiltY.value = mx * 0.28;
      uniforms.uTiltX.value = my * 0.18;

      const worldContainerHalf = halfVisibleWorldW * containerScaleRatio;
      uniforms.uOffsetX_A.value = isDesktop ? normOffsets[idxA] * worldContainerHalf : 0;
      uniforms.uOffsetX_B.value = isDesktop ? normOffsets[idxB] * worldContainerHalf : 0;
      uniforms.uScale_A.value   = isDesktop ? desktopScales[idxA] * desktopResponsiveFit : 0.74;
      uniforms.uScale_B.value   = isDesktop ? desktopScales[idxB] * desktopResponsiveFit : 0.74;

      uniforms.uOrbitWeightA.value = idxA === 3 ? 1.0 : 0.0;
      uniforms.uOrbitWeightB.value = idxB === 3 ? 1.0 : 0.0;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      bodyResizeObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', updateLayoutMetrics);
      morphGeo.dispose();
      morphMat.dispose();
      grid.geometry.dispose();
      gridMats.forEach((m) => m.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}

export default ThreeScrollStage;
