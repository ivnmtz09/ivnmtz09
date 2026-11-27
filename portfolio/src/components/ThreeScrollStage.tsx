import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PARTICLE_COUNT = 1650;
const FIGURE_WIDTHS = [2.25, 3.55, 4.35, 4.20, 4.25, 3.75];

const TAU = Math.PI * 2;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

const C_BLUE = new THREE.Color(0x0066ff);
const C_WHITE = new THREE.Color(0xe4e4e7);
const C_SLATE = new THREE.Color(0x71717a);
const C_BLACK = new THREE.Color(0x09090b);
const C_BLUE_LIGHT = C_BLUE.clone().lerp(C_WHITE, 0.22);
const C_BLUE_DARK = C_BLUE.clone().lerp(C_BLACK, 0.62);
const C_SILVER = C_SLATE.clone().lerp(C_WHITE, 0.48);
const C_CHARCOAL = C_BLACK.clone().lerp(C_SLATE, 0.36);

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

function sampleNoise(index: number): number {
  const bits = Math.imul(index + 1, 0x9e3779b1);
  return ((bits ^ (bits >>> 16)) >>> 0) / 0x100000000;
}

function lerpColor(a: THREE.Color, b: THREE.Color, t: number): THREE.Color {
  return new THREE.Color().lerpColors(a, b, THREE.MathUtils.clamp(t, 0, 1));
}

function pushShaded(
  out: ParticleDraft[],
  x: number, y: number, z: number,
  nx: number, ny: number, nz: number,
  base: THREE.Color,
  size: number,
  group = 0,
) {
  const len = Math.hypot(nx, ny, nz) || 1;
  const lightDot = (nx * -0.42 + ny * 0.66 + nz * 0.62) / len;
  const shade = 0.78 + lightDot * 0.22;
  out.push({
    x, y, z,
    r: base.r * shade,
    g: base.g * shade,
    b: base.b * shade,
    size: size * (0.96 + 0.08 * sampleNoise(out.length)),
    group,
  });
}

function addCapsule(
  out: ParticleDraft[],
  ax: number, ay: number, az: number,
  bx: number, by: number, bz: number,
  radius: number, count: number,
  colA: THREE.Color, colB: THREE.Color,
  size: number,
) {
  const start = new THREE.Vector3(ax, ay, az);
  const end = new THREE.Vector3(bx, by, bz);
  const axis = end.clone().sub(start).normalize();
  const ref = Math.abs(axis.x) < 0.85 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
  const across = new THREE.Vector3().crossVectors(axis, ref).normalize();
  const up = new THREE.Vector3().crossVectors(axis, across);
  const p = new THREE.Vector3();
  const n = new THREE.Vector3();

  // Equal-area bands across the cylindrical wall and both hemispherical caps.
  const length = start.distanceTo(end);
  const surfaceLength = length + 2 * radius;
  for (let i = 0; i < count; i++) {
    const s = (i + 0.38 + 0.24 * sampleNoise(i)) / count * surfaceLength - radius;
    const t = THREE.MathUtils.clamp(s / length, 0, 1);
    const axialNormal = (s - t * length) / radius;
    const radialNormal = Math.sqrt(Math.max(0, 1 - axialNormal * axialNormal));
    const angle = i * GOLDEN_ANGLE;
    n.copy(across).multiplyScalar(Math.cos(angle) * radialNormal)
      .addScaledVector(up, Math.sin(angle) * radialNormal)
      .addScaledVector(axis, axialNormal);
    p.lerpVectors(start, end, t).addScaledVector(n, radius);
    const color = lerpColor(colA, colB, 0.14 + t * 0.44 + (n.y + 1) * 0.15);
    pushShaded(out, p.x, p.y, p.z, n.x, n.y, n.z, color, size);
  }
}

function addEllipsoid(
  out: ParticleDraft[],
  cx: number, cy: number, cz: number,
  rx: number, ry: number, rz: number,
  count: number, colA: THREE.Color, colB: THREE.Color,
  size: number, group = 0,
) {
  for (let i = 0; i < count; i++) {
    const y = 1 - 2 * (i + 0.4 + 0.2 * sampleNoise(i)) / count;
    const theta = i * GOLDEN_ANGLE;
    const band = Math.sqrt(1 - y * y);
    const x = Math.cos(theta) * band;
    const z = Math.sin(theta) * band;
    const color = lerpColor(colA, colB, 0.48 + y * 0.32 + z * 0.12);
    pushShaded(out, cx + x * rx, cy + y * ry, cz + z * rz, x / rx, y / ry, z / rz, color, size, group);
  }
}

function addBeveledBox(
  out: ParticleDraft[],
  cx: number, cy: number, cz: number,
  hw: number, hh: number, hd: number,
  radius: number, count: number,
  colA: THREE.Color, colB: THREE.Color,
  size: number, highlight = 0,
) {
  const half = [hw, hh, hd];
  const faces = [
    { axis: 2, sign: 1, u: 0, v: 1, weight: hw * hh * 1.78 },
    { axis: 2, sign: -1, u: 0, v: 1, weight: hw * hh * 0.36 },
    { axis: 1, sign: 1, u: 0, v: 2, weight: hw * hd * 1.12 },
    { axis: 1, sign: -1, u: 0, v: 2, weight: hw * hd * 0.35 },
    { axis: 0, sign: 1, u: 2, v: 1, weight: hd * hh },
    { axis: 0, sign: -1, u: 2, v: 1, weight: hd * hh },
  ];
  const weight = faces.reduce((sum, face) => sum + face.weight, 0);
  const inner = half.map((extent) => extent - radius);
  const p = [0, 0, 0];
  const n = new THREE.Vector3();
  let allocated = 0;
  let cumulativeWeight = 0;

  for (const face of faces) {
    const { axis, sign, u, v } = face;
    cumulativeWeight += face.weight;
    const next = Math.round(count * cumulativeWeight / weight);
    const samples = next - allocated;
    allocated = next;
    const rows = Math.max(1, Math.min(samples, Math.round(Math.sqrt(samples * half[v] / half[u]))));
    for (let row = 0; row < rows; row++) {
      const columns = Math.round((row + 1) * samples / rows) - Math.round(row * samples / rows);
      for (let col = 0; col < columns; col++) {
        const ju = sampleNoise(out.length) - 0.5;
        const jv = sampleNoise(out.length + 521) - 0.5;
        const stagger = (row % 2 === 0 ? -0.14 : 0.14);
        p[axis] = sign * half[axis];
        p[u] = ((col + 0.5 + stagger + ju * 0.16) / columns * 2 - 1) * half[u];
        p[v] = ((row + 0.5 + jv * 0.16) / rows * 2 - 1) * half[v];

        // Project the regular face samples onto one rounded box surface.
        const x = THREE.MathUtils.clamp(p[0], -inner[0], inner[0]);
        const y = THREE.MathUtils.clamp(p[1], -inner[1], inner[1]);
        const z = THREE.MathUtils.clamp(p[2], -inner[2], inner[2]);
        n.set(p[0] - x, p[1] - y, p[2] - z).normalize();
        const localY = y + n.y * radius;
        const top = THREE.MathUtils.smoothstep(localY / hh, 0.36, 1);
        const edge = 1 - Math.abs(n.y) * 0.7;
        const color = lerpColor(colA, colB, (localY / hh + 1) * 0.5);
        color.lerp(C_WHITE, top * edge * highlight);
        pushShaded(out, cx + x + n.x * radius, cy + localY, cz + z + n.z * radius, n.x, n.y, n.z, color, size);
      }
    }
  }
}

function addRocketFin(out: ParticleDraft[], side: number, count: number) {
  const faceCount = count / 2;
  for (let i = 0; i < count; i++) {
    const u = ((i % faceCount) + 0.5) / faceCount;
    const v = (i * 0.61803398875) % 1;
    const root = Math.sqrt(u);
    const a = 1 - root;
    const b = root * (1 - v);
    const c = root * v;
    const x = side * (a * 0.32 + b * 1.02 + c * 0.34);
    const y = a * -0.28 + b * -1.27 + c * -1.03;
    const bevel = 0.35 + 0.65 * Math.sqrt(3 * Math.min(a, b, c));
    const sign = i < faceCount ? 1 : -1;
    const color = lerpColor(C_BLUE_DARK, C_BLUE, 0.24 + a * 0.6);
    pushShaded(out, x, y, sign * bevel * 0.19, side * 0.22, 0.24, sign, color, 0.91);
  }
}

function finalizeFigure(draft: ParticleDraft[]): FigureData {
  if (draft.length !== PARTICLE_COUNT) {
    throw new Error(`Expected ${PARTICLE_COUNT} particles, received ${draft.length}`);
  }
  const pos = new Float32Array(PARTICLE_COUNT * 3);
  const col = new Float32Array(PARTICLE_COUNT * 3);
  const size = new Float32Array(PARTICLE_COUNT);
  const group = new Float32Array(PARTICLE_COUNT);

  // Keep complete surfaces and mix travel paths during the morph.
  for (let i = 0; i < draft.length; i++) {
    const offset = (i * 1027) % PARTICLE_COUNT;
    const p = draft[i];
    pos.set([p.x, p.y, p.z], offset * 3);
    col.set([p.r, p.g, p.b], offset * 3);
    size[offset] = p.size;
    group[offset] = p.group;
  }

  return { pos, col, size, group };
}

function buildArrowFigure(): FigureData {
  const pts: ParticleDraft[] = [];
  const hull: [y0: number, y1: number, r0: number, r1: number, count: number, base: THREE.Color, tip: THREE.Color][] = [
    [-1.30, -1.13, 0.32, 0.43, 52, C_BLACK, C_SLATE],
    [-1.13, -0.62, 0.43, 0.50, 174, C_SLATE, C_WHITE],
    [-0.62, 0.06, 0.50, 0.55, 218, C_SILVER, C_WHITE],
    [0.06, 0.70, 0.55, 0.55, 222, C_WHITE, C_WHITE],
    [0.70, 1.25, 0.55, 0.44, 160, C_BLUE_DARK, C_BLUE],
    [1.25, 1.75, 0.44, 0.26, 104, C_BLUE, C_BLUE_LIGHT],
    [1.75, 2.12, 0.26, 0.015, 60, C_BLUE_LIGHT, C_BLUE],
  ];
  for (const [y0, y1, r0, r1, count, base, tip] of hull) {
    for (let i = 0; i < count; i++) {
      const t = (i + 0.5) / count;
      const angle = (pts.length + 1) * GOLDEN_ANGLE;
      const x = Math.cos(angle);
      const z = Math.sin(angle);
      const radius = THREE.MathUtils.lerp(r0, r1, t);
      const ny = (r0 - r1) / (y1 - y0);
      pushShaded(pts, x * radius, THREE.MathUtils.lerp(y0, y1, t), z * radius, x, ny, z, lerpColor(base, tip, t), 1.08);
    }
  }
  addRocketFin(pts, -1, 190);
  addRocketFin(pts, 1, 190);
  addEllipsoid(pts, 0, 0.23, 0.51, 0.26, 0.26, 0.11, 110, C_BLUE_DARK, C_BLUE_LIGHT, 0.92);
  addEllipsoid(pts, 0, -1.40, 0, 0.30, 0.12, 0.26, 80, C_BLUE, C_BLUE_LIGHT, 0.98);
  addEllipsoid(pts, 0, -1.64, 0, 0.22, 0.10, 0.19, 54, C_BLUE_DARK, C_BLUE_LIGHT, 0.9);
  addEllipsoid(pts, 0, -1.85, 0, 0.13, 0.08, 0.12, 36, C_BLUE_DARK, C_BLUE, 0.82);
  return finalizeFigure(pts);
}

function buildProfileFigure(): FigureData {
  const pts: ParticleDraft[] = [];
  addEllipsoid(pts, 0, 1.14, 0, 0.66, 0.77, 0.57, 490, C_SILVER, C_WHITE, 1.09);
  addCapsule(pts, -0.40, 1.18, 0.46, 0.40, 1.18, 0.46, 0.152, 125, C_BLUE_DARK, C_BLUE_LIGHT, 0.89);
  addCapsule(pts, 0, 0.20, 0, 0, 0.52, 0, 0.255, 115, C_SLATE, C_SILVER, 1.01);
  addEllipsoid(pts, 0, -0.68, 0, 1.72, 0.94, 0.51, 680, C_BLUE_DARK, C_BLUE_LIGHT, 1.08);

  const widths = [0.90, 0.60, 0.76];
  widths.forEach((width, i) => {
    const y = -0.42 - i * 0.25;
    addCapsule(pts, -0.53, y, 0.47, -0.53 + width, y, 0.51, 0.053, 80, C_SILVER, C_WHITE, 0.79);
  });
  return finalizeFigure(pts);
}

function buildBracketsFigure(): FigureData {
  const pts: ParticleDraft[] = [];
  for (const side of [-1, 1]) {
    addCapsule(pts, side * 0.96, 1.18, 0, side * 1.86, 0, 0, 0.24, 332, C_BLUE_LIGHT, C_BLUE, 1.01);
    addCapsule(pts, side * 1.86, 0, 0, side * 0.96, -1.18, 0, 0.24, 332, C_BLUE, C_BLUE_DARK, 1.01);
  }
  addCapsule(pts, -0.41, -1.44, 0, 0.41, 1.44, 0, 0.24, 322, C_SLATE, C_WHITE, 1.04);
  return finalizeFigure(pts);
}

const ATOM_ORBITS: [number, number, number][] = [
  [0.48, 0.05, 0.12],
  [-0.44, 0.52, Math.PI / 3],
  [0.55, -0.48, -Math.PI / 3],
];

const ATOM_ORBIT_AXES = ATOM_ORBITS.map(([tx, ty, tz]) =>
  new THREE.Vector3(0, 0, 1).applyEuler(new THREE.Euler(tx, ty, tz)).normalize(),
);

function buildAtomFigure(): FigureData {
  const pts: ParticleDraft[] = [];
  const core: [number, number, number, THREE.Color][] = [
    [0, 0.22, 0.10, C_BLUE],
    [0.24, 0.09, -0.08, C_SILVER],
    [-0.21, 0.06, -0.12, C_BLUE_LIGHT],
    [0.16, -0.21, 0.04, C_SLATE],
    [-0.18, -0.17, 0.09, C_BLUE],
    [0, -0.02, 0.25, C_SILVER],
  ];
  for (const [x, y, z, color] of core) {
    addEllipsoid(pts, x, y, z, 0.25, 0.25, 0.25, 65, color, color === C_SILVER ? C_WHITE : C_BLUE_LIGHT, 1.13);
  }

  const orbitColors = [C_BLUE, C_SILVER, C_BLUE_LIGHT];
  ATOM_ORBITS.forEach(([tx, ty, tz], index) => {
    const group = index + 1;
    const euler = new THREE.Euler(tx, ty, tz);
    const rx = 1.98;
    const ry = 0.82;
    const tube = 0.068;
    const count = 330;
    const position = new THREE.Vector3();
    const normal = new THREE.Vector3();

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const angle = TAU * t;
      const a = Math.cos(angle);
      const b = Math.sin(angle);
      const tubeAngle = i * GOLDEN_ANGLE;
      const len = Math.hypot(a / rx, b / ry);
      normal.set(a / rx / len * Math.cos(tubeAngle), b / ry / len * Math.cos(tubeAngle), Math.sin(tubeAngle));
      position.set(a * rx, b * ry, 0).addScaledVector(normal, tube).applyEuler(euler);
      normal.applyEuler(euler);
      const color = lerpColor(orbitColors[index], C_WHITE, 0.10 + 0.14 * (1 + b));
      pushShaded(pts, position.x, position.y, position.z, normal.x, normal.y, normal.z, color, 0.71, group);
    }

    const angle = 0.35 + TAU * index / 3;
    position.set(Math.cos(angle) * rx, Math.sin(angle) * ry, 0).applyEuler(euler);
    addEllipsoid(pts, position.x, position.y, position.z, 0.22, 0.22, 0.22, 90, C_BLUE, C_WHITE, 1.10, group);
  });

  return finalizeFigure(pts);
}

function buildPyramidFigure(): FigureData {
  const pts: ParticleDraft[] = [];
  const tiers: [number, number, number, number, THREE.Color, THREE.Color][] = [
    [1.93, 0.96, -1.14, 415, C_CHARCOAL, C_SLATE],
    [1.56, 0.79, -0.65, 345, C_SLATE, C_SILVER],
    [1.19, 0.63, -0.16, 278, C_SLATE, C_WHITE],
    [0.82, 0.47, 0.33, 226, C_BLUE_DARK, C_BLUE],
    [0.46, 0.33, 0.82, 196, C_BLUE, C_BLUE_LIGHT],
  ];
  for (const [hw, hd, y, count, base, top] of tiers) {
    addBeveledBox(pts, 0, y, 0, hw, 0.245, hd, 0.105, count, base, top, 0.99, 0.42);
  }
  addEllipsoid(pts, 0, 1.27, 0, 0.27, 0.28, 0.27, 190, C_BLUE_DARK, C_BLUE_LIGHT, 1.06);
  return finalizeFigure(pts);
}

function buildEnvelopeFigure(): FigureData {
  const pts: ParticleDraft[] = [];
  addBeveledBox(pts, 0, -0.35, -0.08, 1.78, 1.05, 0.23, 0.15, 350, C_CHARCOAL, C_SLATE, 0.91);
  addBeveledBox(pts, 0, -0.35, 0.12, 1.71, 0.98, 0.13, 0.11, 800, C_SILVER, C_WHITE, 1.07);
  addCapsule(pts, -1.58, 0.52, 0.26, 0, -0.39, 0.27, 0.086, 120, C_BLUE_LIGHT, C_BLUE, 0.91);
  addCapsule(pts, 0, -0.39, 0.27, 1.58, 0.52, 0.26, 0.086, 120, C_BLUE, C_BLUE_LIGHT, 0.91);
  addCapsule(pts, -1.53, -1.20, 0.247, -0.50, -0.57, 0.247, 0.046, 45, C_SLATE, C_SILVER, 0.73);
  addCapsule(pts, 1.53, -1.20, 0.247, 0.50, -0.57, 0.247, 0.046, 45, C_SLATE, C_SILVER, 0.73);
  addEllipsoid(pts, 0, -0.39, 0.32, 0.18, 0.18, 0.12, 74, C_BLUE, C_BLUE_LIGHT, 0.96);

  const radii = [0.30, 0.52, 0.74];
  radii.forEach((radius, index) => {
    const count = 24 + index * 8;
    for (let i = 0; i < count; i++) {
      const t = (i + 0.5) / count;
      const angle = Math.PI * (0.24 + t * 0.48);
      const tubeAngle = i * GOLDEN_ANGLE;
      const taper = Math.sin(Math.PI * t);
      const tube = (0.038 - index * 0.005) * (0.6 + 0.4 * taper);
      const x = Math.cos(angle);
      const y = Math.sin(angle);
      const ny = Math.cos(tubeAngle);
      const distance = radius + tube * ny;
      const color = lerpColor(C_BLUE, C_BLUE_LIGHT, taper * (0.55 - index * 0.12));
      pushShaded(pts, 0.91 + x * distance, 0.68 + y * distance, 0.16 + tube * Math.sin(tubeAngle), x * ny, y * ny, Math.sin(tubeAngle), color, 0.69 - index * 0.045);
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
  uniform float uTiltX;
  uniform float uTiltY;
  uniform float uOrbitWeightA;
  uniform float uOrbitWeightB;
  uniform float uProjScale;
  uniform float uBaseSize;
  uniform float uIsDark;
  uniform float uMotion;

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
    float rY = uTiltY + sin(uTime * 0.55) * 0.14;
    float rX = uTiltX;

    vec3 localA = applyOrbit(aPosA, aGroupA, uOrbitWeightA, uTime);
    vec3 localB = applyOrbit(aPosB, aGroupB, uOrbitWeightB, uTime);

    vec3 worldA = applyTilt(localA, rY, rX) * uScale_A + vec3(uOffsetX_A, 0.0, 0.0);
    vec3 worldB = applyTilt(localB, rY, rX) * uScale_B + vec3(uOffsetX_B, 0.0, 0.0);

    // Tighter per-particle stagger so transitions feel fast, smooth & cohesive
    float m = clamp((uMorph - aSeed.x * 0.16) / 0.84, 0.0, 1.0);
    m = m * m * (3.0 - 2.0 * m);

    vec3 pos = mix(worldA, worldB, m);

    // Sideways sweep + front/back Z arc without bloating screen overdraw
    float mid = sin(m * 3.14159265);
    float swirlAngle = aSeed.y + m * 2.2;
    pos.xy += vec2(cos(swirlAngle) * 1.65, sin(swirlAngle) * 0.65) * mid * aSeed.z;
    pos.z += -1.85 * sin(m * 6.2831853) * mid * aSeed.z;

    pos.y += sin(uTime * 1.1 + aSeed.x * 6.28) * 0.014 * uMotion;

    vec3 rawCol = mix(aColA, aColB, m);
    float maxC = max(rawCol.r, max(rawCol.g, rawCol.b));
    float minC = min(rawCol.r, min(rawCol.g, rawCol.b));
    float isNeutral = 1.0 - smoothstep(0.08, 0.25, maxC - minC);
    vec3 lightAdapted = mix(rawCol * 0.72, rawCol * 0.63, isNeutral);
    vColor = mix(lightAdapted, rawCol, uIsDark);
    vDark = uIsDark;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;

    float figureScale = mix(uScale_A, uScale_B, m);
    float ptSize = mix(aSizeA, aSizeB, m) * (1.0 - 0.14 * mid) * uBaseSize * figureScale;
    gl_PointSize = ptSize * uProjScale / max(1.0, -mvPos.z);

    vDepthFade = 1.0 - min(0.16, max(0.0, -pos.z) * 0.10);
  }
`;

// Analytic edge coverage and soft lighting in the same depth-writing draw call.
const FRAGMENT_SHADER = `
  varying vec3 vColor;
  varying float vDepthFade;
  varying float vDark;

  void main() {
    vec2 uv = gl_PointCoord * 2.0 - 1.0;
    float r2 = dot(uv, uv);
    float aa = clamp(0.40 * fwidth(r2), 0.035, 0.30);
    float coverage = 1.0 - smoothstep(0.79 - aa, 0.79 + aa, r2);
    if (coverage <= 0.0) discard;

    float z = sqrt(max(0.0, 1.0 - r2));
    vec3 normal = vec3(uv.x, -uv.y, z);
    float halfLambert = 0.5 + 0.5 * dot(normal, vec3(-0.44, 0.66, 0.61));
    float diffuse = 0.28 + 0.72 * halfLambert;

    float nh = max(dot(normal, vec3(-0.24, 0.36, 0.90)), 0.0);
    float nh2 = nh * nh;
    float nh4 = nh2 * nh2;
    float specular = nh4 * nh4 * mix(0.043, 0.083, vDark);

    float rim = 1.0 - normal.z;
    float fresnel = rim * rim;
    float ao = smoothstep(0.38, 0.85, r2) * 0.25;
    vec3 bounce = vec3(0.0, 0.133, 1.0) * mix(0.09, 0.16, vDark);
    vec3 lit = vColor * (diffuse - ao) + vec3(specular) + bounce * fresnel;

    gl_FragColor = vec4(clamp(lit * vDepthFade, 0.0, 1.0), coverage);
    #include <colorspace_fragment>
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

export function ThreeScrollStage() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'high-performance' });
    renderer.domElement.className = 'absolute';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);

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
      seeds[i * 3]     = sampleNoise(i);
      seeds[i * 3 + 1] = sampleNoise(i + 751) * TAU;
      seeds[i * 3 + 2] = 0.45 + sampleNoise(i + 1913) * 0.8;
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
      uTiltX:        { value: 0.0 },
      uTiltY:        { value: 0.0 },
      uOrbitWeightA: { value: 0.0 },
      uOrbitWeightB: { value: 0.0 },
      uProjScale:    { value: 900.0 },
      uBaseSize:     { value: 0.207 },
      uIsDark:       { value: document.documentElement.classList.contains('dark') ? 1.0 : 0.0 },
      uMotion:       { value: 1.0 },
      uAxis1:        { value: ATOM_ORBIT_AXES[0] },
      uAxis2:        { value: ATOM_ORBIT_AXES[1] },
      uAxis3:        { value: ATOM_ORBIT_AXES[2] },
    };

    const morphMat = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      transparent: true,
      depthTest: true,
      depthWrite: true,
    });

    const clayMesh = new THREE.Points(morphGeo, morphMat);
    clayMesh.frustumCulled = false;
    scene.add(clayMesh);

    const anchors = Array.from(document.querySelectorAll<HTMLElement>('[data-stage-anchor]'));
    const tanHalfFov = Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5));
    let isDesktop = false;
    let viewportWidth = 0;
    let viewportHeight = 0;
    let focalY = 0;
    let canvasHeight = 0;
    let cachedCenters: number[] = [];
    let offsets: number[] = [];
    let scales: number[] = [];

    const measureSectionCenters = () => {
      const worldPerPixel = (2 * tanHalfFov * camera.position.z) / viewportHeight;
      cachedCenters = anchors.map((anchor) => {
        // Flow position is stable while the surrounding section reveals via transform.
        let y = anchor.offsetHeight * 0.5;
        for (let el: HTMLElement | null = anchor; el; el = el.offsetParent as HTMLElement | null) {
          y += el.offsetTop;
        }
        return y;
      });
      offsets = anchors.map((anchor) => {
        const { left, width } = anchor.getBoundingClientRect();
        return (left + width * 0.5 - viewportWidth * 0.5) * worldPerPixel;
      });
      scales = anchors.map((anchor, i) => {
        const fit = anchor.offsetWidth * 0.88 / FIGURE_WIDTHS[i];
        const verticalFit = isDesktop ? 108 : (anchor.offsetHeight - 20) / 4.2;
        return Math.min(fit, verticalFit) * worldPerPixel;
      });
      focalY = Math.min(viewportHeight * 0.5, cachedCenters[0]);
      renderer.domElement.style.top = `${Math.round(focalY - canvasHeight * 0.5)}px`;
    };

    const updateLayoutMetrics = () => {
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
      isDesktop = viewportWidth >= 1024;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      // Match the viewport projection while redrawing only the band occupied by the figures.
      const canvasWidth = Math.min(viewportWidth, 1250);
      canvasHeight = Math.min(viewportHeight, isDesktop ? 520 : viewportWidth < 640 ? 230 : 280);
      camera.aspect = canvasWidth / canvasHeight;
      camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(tanHalfFov * canvasHeight / viewportHeight));
      camera.position.z = isDesktop ? 9.2 : 11.8;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(dpr);
      renderer.setSize(canvasWidth, canvasHeight);
      renderer.domElement.style.left = `${(viewportWidth - canvasWidth) * 0.5}px`;

      uniforms.uProjScale.value = (viewportHeight * dpr) / (2 * tanHalfFov);
      measureSectionCenters();
    };
    updateLayoutMetrics();

    const sectionResizeObserver = new ResizeObserver(measureSectionCenters);
    sectionResizeObserver.observe(document.body);
    for (const anchor of anchors) {
      const section = anchor.closest('section');
      if (section) sectionResizeObserver.observe(section);
    }

    const syncTheme = () => {
      uniforms.uIsDark.value = document.documentElement.classList.contains('dark') ? 1 : 0;
    };
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
      const viewCenter = window.scrollY + focalY;
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
    const timer = new THREE.Timer();
    timer.connect(document);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const animate = (timestamp: number) => {
      raf = requestAnimationFrame(animate);
      timer.update(timestamp);
      const animateDetails = !reducedMotion.matches;
      const t = animateDetails ? timer.getElapsed() : 0;
      const dt = Math.min(0.1, Math.max(0.004, timer.getDelta()));

      const targetRaw = getRawProgress();
      const followRate = animateDetails ? 1 - Math.exp(-15 * dt) : 1;
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
      uniforms.uTiltY.value = animateDetails && isDesktop ? mx * 0.22 : 0;
      uniforms.uTiltX.value = animateDetails && isDesktop ? my * 0.12 + 0.08 : 0.08;
      uniforms.uMotion.value = animateDetails ? 1 : 0;
      uniforms.uOffsetX_A.value = offsets[idxA];
      uniforms.uOffsetX_B.value = offsets[idxB];
      uniforms.uScale_A.value = scales[idxA];
      uniforms.uScale_B.value = scales[idxB];

      uniforms.uOrbitWeightA.value = idxA === 3 ? 1.0 : 0.0;
      uniforms.uOrbitWeightB.value = idxB === 3 ? 1.0 : 0.0;

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      timer.dispose();
      sectionResizeObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', updateLayoutMetrics);
      morphGeo.dispose();
      morphMat.dispose();
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
