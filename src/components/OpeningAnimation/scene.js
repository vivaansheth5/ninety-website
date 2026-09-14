// Ninety+ opening scene — biomechanics study of a bicycle-kick volley.
//
// Pure, framework-agnostic module: everything here is a function of a single
// time value T (seconds). No DOM, no React, no animation-loop coupling —
// see OpeningAnimation.jsx for the rAF clock and SVG emit that drive it.
//
// Coordinate frame: right-handed, metres. X = along the pitch (ball travels
// toward -X, the goal), Y = up (0 = ground), Z = lateral.

export const DURATION = 6.3;

export const CUES = {
  Load: 0,
  Launch: 0.9,
  Orbit: 1.7,
  Volley: 3.6,
  Impact: 4.5,
  Reveal: 5.0,
};

export const CONTACT_T = 3.85;

// ---------------------------------------------------------------------------
// Easing
// ---------------------------------------------------------------------------
export const Easing = {
  linear: (t) => t,
  easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  easeOutQuart: (t) => 1 - Math.pow(1 - t, 4),
  // A falling ball accelerates under gravity (starts slow, speeds up).
  easeInQuad: (t) => t * t,
  // A struck ball leaves the foot near its peak speed and only then settles.
  easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
};

const clamp01 = (v) => Math.max(0, Math.min(1, v));

// Scalar keyframe interpolation over a sparse [t, value] table.
export function kf(table, t, ease = Easing.easeInOutCubic) {
  if (t <= table[0][0]) return table[0][1];
  const last = table[table.length - 1];
  if (t >= last[0]) return last[1];
  for (let i = 0; i < table.length - 1; i++) {
    const [t0, v0] = table[i];
    const [t1, v1] = table[i + 1];
    if (t >= t0 && t <= t1) {
      const s = ease(clamp01((t - t0) / (t1 - t0)));
      return v0 + (v1 - v0) * s;
    }
  }
  return last[1];
}

// `animate({ from, to, start, end, ease })` -> function of T -> value
export function animate({ from, to, start, end, ease = Easing.easeInOutCubic }) {
  return (t) => {
    if (t <= start) return from;
    if (t >= end) return to;
    const s = ease(clamp01((t - start) / (end - start)));
    return from + (to - from) * s;
  };
}

// ---------------------------------------------------------------------------
// The rig
// ---------------------------------------------------------------------------
export const JOINTS = [
  'pelvis', 'spine', 'chest', 'neck', 'head',
  'shoulderL', 'shoulderR', 'elbowL', 'elbowR', 'wristL', 'wristR',
  'hipL', 'hipR', 'kneeL', 'kneeR', 'ankleL', 'ankleR', 'toeL', 'toeR',
];

// Five authored poses, literal joint positions in the body-local frame
// (origin at pelvis, +Y toward the head). Right leg (R) is the striking
// leg; left leg (L) is the support/counterbalance leg.
export const POSES = {
  STAND: {
    pelvis: [0, 0, 0], spine: [0, 0.2, 0], chest: [0, 0.4, 0], neck: [0, 0.52, 0], head: [0, 0.67, 0],
    shoulderL: [0, 0.46, -0.19], shoulderR: [0, 0.46, 0.19],
    elbowL: [0.03, 0.22, -0.21], elbowR: [0.03, 0.22, 0.21],
    wristL: [0.05, 0.0, -0.22], wristR: [0.05, 0.0, 0.22],
    hipL: [0, 0, -0.1], hipR: [0, 0, 0.1],
    kneeL: [0.02, -0.44, -0.11], kneeR: [0.02, -0.44, 0.11],
    ankleL: [0, -0.88, -0.11], ankleR: [0, -0.88, 0.11],
    toeL: [-0.16, -0.88, -0.11], toeR: [-0.16, -0.88, 0.11],
  },
  LOAD: {
    pelvis: [0, 0, 0], spine: [0.02, 0.19, 0], chest: [0.05, 0.37, 0], neck: [0.06, 0.48, 0], head: [0.07, 0.62, 0],
    shoulderL: [0.05, 0.43, -0.2], shoulderR: [0.05, 0.43, 0.2],
    elbowL: [0.2, 0.3, -0.24], elbowR: [0.2, 0.3, 0.24],
    wristL: [0.3, 0.2, -0.2], wristR: [0.3, 0.2, 0.2],
    hipL: [0, 0, -0.1], hipR: [0, 0, 0.1],
    kneeL: [-0.16, -0.3, -0.14], kneeR: [0.1, -0.32, 0.13],
    ankleL: [-0.1, -0.62, -0.13], ankleR: [0.16, -0.6, 0.14],
    toeL: [-0.24, -0.62, -0.13], toeR: [0.26, -0.58, 0.14],
  },
  AIR: {
    pelvis: [0, 0, 0], spine: [0, 0.2, 0], chest: [0, 0.38, 0.02], neck: [0, 0.5, 0.02], head: [0, 0.64, 0.03],
    shoulderL: [0, 0.44, -0.22], shoulderR: [0, 0.44, 0.22],
    elbowL: [-0.1, 0.6, -0.34], elbowR: [-0.1, 0.6, 0.34],
    wristL: [-0.18, 0.78, -0.4], wristR: [-0.18, 0.78, 0.4],
    hipL: [0, 0, -0.1], hipR: [0, 0, 0.1],
    kneeL: [0.28, -0.3, -0.11], kneeR: [-0.05, 0.42, 0.1],
    ankleL: [0.46, -0.1, -0.12], ankleR: [-0.12, 0.86, 0.09],
    toeL: [0.58, -0.06, -0.12], toeR: [-0.1, 1.06, 0.07],
  },
  STRIKE: {
    pelvis: [0, 0, 0], spine: [0, 0.2, 0], chest: [0.02, 0.38, 0.01], neck: [0.02, 0.5, 0.01], head: [0.02, 0.64, 0.02],
    shoulderL: [0, 0.44, -0.22], shoulderR: [0.02, 0.44, 0.22],
    elbowL: [-0.06, 0.58, -0.3], elbowR: [-0.14, 0.62, 0.32],
    wristL: [-0.1, 0.74, -0.34], wristR: [-0.24, 0.8, 0.36],
    hipL: [0, 0, -0.1], hipR: [0, 0, 0.1],
    kneeL: [0.3, -0.28, -0.11], kneeR: [-0.3, 0.22, 0.1],
    ankleL: [0.48, -0.06, -0.12], ankleR: [-0.52, 0.3, 0.08],
    toeL: [0.6, -0.02, -0.12], toeR: [-0.68, 0.2, 0.06],
  },
  FOLLOW: {
    pelvis: [0, 0, 0], spine: [0, 0.2, 0], chest: [0.04, 0.37, 0], neck: [0.05, 0.48, 0], head: [0.06, 0.61, 0],
    shoulderL: [0.02, 0.43, -0.22], shoulderR: [0.05, 0.43, 0.22],
    elbowL: [-0.02, 0.52, -0.28], elbowR: [-0.1, 0.5, 0.3],
    wristL: [-0.02, 0.66, -0.3], wristR: [-0.16, 0.6, 0.34],
    hipL: [0, 0, -0.1], hipR: [0, 0, 0.1],
    kneeL: [0.32, -0.24, -0.11], kneeR: [-0.42, -0.02, 0.09],
    ankleL: [0.5, 0.02, -0.12], ankleR: [-0.66, 0.02, 0.07],
    toeL: [0.62, 0.06, -0.12], toeR: [-0.78, -0.06, 0.05],
  },
};

// Pose keyframes: [t, poseName]. Blends linearly (per-joint) between the
// bracketing named poses, eased the same way as every other channel.
const POSE_KF = [
  [0, 'STAND'], [0.9, 'LOAD'], [1.7, 'AIR'], [3.6, 'AIR'],
  [3.85, 'STRIKE'], [4.2, 'FOLLOW'], [DURATION, 'FOLLOW'],
];

function lerpV3(a, b, s) {
  return [a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s, a[2] + (b[2] - a[2]) * s];
}

export function kfPose(t) {
  if (t <= POSE_KF[0][0]) return POSES[POSE_KF[0][1]];
  const last = POSE_KF[POSE_KF.length - 1];
  if (t >= last[0]) return POSES[last[1]];

  for (let i = 0; i < POSE_KF.length - 1; i++) {
    const [t0, nameA] = POSE_KF[i];
    const [t1, nameB] = POSE_KF[i + 1];
    if (t >= t0 && t <= t1) {
      if (nameA === nameB) return POSES[nameA];
      const s = Easing.easeInOutCubic(clamp01((t - t0) / (t1 - t0)));
      const a = POSES[nameA];
      const b = POSES[nameB];
      const out = {};
      for (const j of JOINTS) out[j] = lerpV3(a[j], b[j], s);
      return out;
    }
  }
  return POSES[last[1]];
}

// Global somersault (about Z) + pelvis position keyframes
const TILT_KF = [
  [0, 0], [0.9, -8], [1.7, -46], [3.6, -104], [3.85, -112], [4.5, -150], [5.0, -186],
];
const ROOT_Y_KF = [
  [0, 0.95], [0.9, 0.7], [1.7, 1.3], [2.6, 1.46], [3.85, 1.2], [5.0, 0.56],
];
const ROOT_X_KF = [
  [0, 0], [0.9, 0.05], [1.7, -0.3], [3.6, -0.62], [5.0, -1.0],
];

export function tiltAt(t) {
  return kf(TILT_KF, t);
}

export function rootAt(t) {
  return { x: kf(ROOT_X_KF, t), y: kf(ROOT_Y_KF, t), z: 0 };
}

function rotZ(p, deg) {
  const rad = (deg * Math.PI) / 180;
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]];
}

// World-space joint positions at time t.
export function worldPoseAt(t) {
  const local = kfPose(t);
  const tilt = tiltAt(t);
  const root = rootAt(t);
  const world = {};
  for (const j of JOINTS) {
    const [x, y, z] = rotZ(local[j], tilt);
    world[j] = [x + root.x, y + root.y, z + root.z];
  }
  return { world, tilt, root };
}

// ---------------------------------------------------------------------------
// Bones (17) + spheres
// ---------------------------------------------------------------------------
export const BONES = [
  ['pelvis', 'spine', 0.125, 0.132],
  ['spine', 'chest', 0.132, 0.148],
  ['chest', 'neck', 0.148, 0.078],
  ['chest', 'shoulderL', 0.1, 0.062],
  ['chest', 'shoulderR', 0.1, 0.062],
  ['pelvis', 'hipL', 0.115, 0.086],
  ['pelvis', 'hipR', 0.115, 0.086],
  ['shoulderL', 'elbowL', 0.058, 0.042],
  ['shoulderR', 'elbowR', 0.058, 0.042],
  ['elbowL', 'wristL', 0.042, 0.03],
  ['elbowR', 'wristR', 0.042, 0.03],
  ['hipL', 'kneeL', 0.088, 0.062],
  ['hipR', 'kneeR', 0.088, 0.062],
  ['kneeL', 'ankleL', 0.062, 0.04],
  ['kneeR', 'ankleR', 0.062, 0.04],
  ['ankleL', 'toeL', 0.046, 0.028],
  ['ankleR', 'toeR', 0.046, 0.028],
];

export const HEAD_RADIUS = 0.118;
export const HAND_RADIUS = 0.046;

// ---------------------------------------------------------------------------
// Camera
// ---------------------------------------------------------------------------
export const FOCAL_LENGTH = 1750;
export const SCREEN_W = 1920;
export const SCREEN_H = 1080;

const AZ_KF = [[0, 62], [0.9, 74], [1.7, 96], [3.6, 424], [4.2, 431], [4.5, 434], [5.0, 437]];
const EL_KF = [[0, 9], [1.7, 2], [2.6, -7], [3.6, 6], [4.5, 11], [5.0, 10]];
const DIST_KF = [[0, 6.4], [0.9, 5.6], [1.7, 4.3], [3.6, 4.6], [4.2, 9.6], [4.5, 13.2], [5.0, 12.6]];

function shakeOffset(t) {
  const s = t - CUES.Impact;
  if (s < 0 || s > 0.45) return { daz: 0, del: 0 };
  const decay = Math.exp(-s * 10);
  return {
    daz: Math.sin(s * 70) * 1.4 * decay,
    del: Math.cos(s * 58) * 0.9 * decay,
  };
}

export function cameraTargetAt(t, world) {
  const pelvis = world.pelvis;
  const near = [pelvis[0], pelvis[1] + 0.18, pelvis[2]];
  const far = [-4.2, 1.5, 0.6];
  const ease = animate({ from: 0, to: 1, start: CUES.Impact, end: CUES.Reveal, ease: Easing.easeInOutCubic });
  const s = ease(t);
  return lerpV3(near, far, s);
}

export function buildCam(t, target) {
  const { daz, del } = shakeOffset(t);
  const az = kf(AZ_KF, t) + daz;
  const el = kf(EL_KF, t) + del;
  const dist = kf(DIST_KF, t);

  const azRad = (az * Math.PI) / 180;
  const elRad = (el * Math.PI) / 180;

  const pos = [
    target[0] + dist * Math.sin(azRad) * Math.cos(elRad),
    target[1] + dist * Math.sin(elRad),
    target[2] + dist * Math.cos(azRad) * Math.cos(elRad),
  ];

  const f = normalize(sub(target, pos));
  const r = normalize([-f[2], 0, f[0]]);
  const u = cross(r, f);

  return { pos, f, r, u, az, el, dist };
}

function sub(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function cross(a, b) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}
function normalize(a) {
  const len = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / len, a[1] / len, a[2] / len];
}

// Returns null if the point is behind the near plane (culled).
export function proj(p, cam) {
  const rel = sub(p, cam.pos);
  const z = dot(rel, cam.f);
  if (z < 0.2) return null;
  const x = SCREEN_W / 2 + (FOCAL_LENGTH * dot(rel, cam.r)) / z;
  const y = SCREEN_H / 2 - (FOCAL_LENGTH * dot(rel, cam.u)) / z;
  return { x, y, z };
}

// Screen-space projected circle for a sphere (head / hands / ball).
export function sphereScreen(p, radius, cam) {
  const pr = proj(p, cam);
  if (!pr) return null;
  return { cx: pr.x, cy: pr.y, r: radius * (FOCAL_LENGTH / pr.z), depth: pr.z };
}

// ---------------------------------------------------------------------------
// Capsule path (tapered, projected)
// ---------------------------------------------------------------------------
export function capsulePath(pA, pB, r0, r1, cam) {
  const a = proj(pA, cam);
  const b = proj(pB, cam);
  if (!a || !b) return null;

  const pxA = Math.max(1.2, r0 * (FOCAL_LENGTH / a.z));
  const pxB = Math.max(1.2, r1 * (FOCAL_LENGTH / b.z));

  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  // Normal to the bone axis (dx/len, dy/len); the B-end arc bulges outward
  // along +d (away from A), the A-end arc along -d (away from B), so the
  // two semicircles plus their shared tangent points form one closed,
  // non-self-intersecting capsule outline.
  const nx = -dy / len;
  const ny = dx / len;
  const angleN = Math.atan2(ny, nx);

  const arcPts = (center, radius, startAngle) => {
    const out = [];
    for (let i = 0; i <= 12; i++) {
      const ang = startAngle - Math.PI * (i / 12);
      out.push([center.x + Math.cos(ang) * radius, center.y + Math.sin(ang) * radius]);
    }
    return out;
  };

  const ptsB = arcPts(b, pxB, angleN);
  const ptsA = arcPts(a, pxA, angleN - Math.PI);
  const all = [...ptsB, ...ptsA];

  const d = all.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ') + ' Z';
  const depth = (a.z + b.z) / 2;
  return { d, depth };
}

// ---------------------------------------------------------------------------
// Shading — depth-based luminance. Do not replace with a flat fill.
// ---------------------------------------------------------------------------
export function shade(z, zRef) {
  const L = Math.max(50, Math.min(96, 84 - (z - zRef) * 30));
  return `hsl(44 6% ${L.toFixed(1)}%)`;
}

// ---------------------------------------------------------------------------
// Ground, axis, goal, net
// ---------------------------------------------------------------------------
export const GROUND_RADIUS = 1.55;
export const GOAL = { x: -10.2, zMin: -3.66, zMax: 3.66, yMax: 2.44 };

export function groundRingPoints() {
  const pts = [];
  for (let i = 0; i <= 60; i++) {
    const ang = (i / 60) * Math.PI * 2;
    pts.push([Math.cos(ang) * GROUND_RADIUS, 0, Math.sin(ang) * GROUND_RADIUS]);
  }
  return pts;
}

export function netGrid() {
  const cols = Math.round((GOAL.zMax - GOAL.zMin) / 0.42);
  const rows = Math.round(GOAL.yMax / 0.42);
  const verts = [];
  for (let i = 0; i <= cols; i++) {
    for (let j = 0; j <= rows; j++) {
      verts.push({
        x: GOAL.x - 0.5,
        y: (j / rows) * GOAL.yMax,
        z: GOAL.zMin + (i / cols) * (GOAL.zMax - GOAL.zMin),
      });
    }
  }
  return { verts, cols, rows };
}

export function netRippleOffset(vertex, impactPoint, t, impactT) {
  const s = t - impactT;
  if (s < 0 || s > 0.9) return 0;
  const d = Math.hypot(vertex.y - impactPoint[1], vertex.z - impactPoint[2]);
  return 0.55 * Math.exp(-d / 1.1) * Math.sin(d * 5 - s * 26) * Math.exp(-s * 5);
}

// ---------------------------------------------------------------------------
// Ball
// ---------------------------------------------------------------------------
export const BALL_RADIUS = 0.112;
const BALL_START = [2.3, 4.1, 0.35];
const BALL_DROP_START_T = CUES.Launch;
const BALL_POST_TARGET = [-9.95, 1.18, 0.42];
const BALL_POST_DURATION = 0.65;

function parabolicLerp(a, b, s, bulge, sign) {
  const p = lerpV3(a, b, s);
  p[1] += sign * bulge * 4 * s * (1 - s);
  return p;
}

export function ballContactPoint(world) {
  const toe = world.toeR;
  return [toe[0] - 0.12, toe[1] + 0.1, toe[2]];
}

export function ballPositionAt(t, contactPoint) {
  if (t <= CONTACT_T) {
    const s = clamp01((t - BALL_DROP_START_T) / (CONTACT_T - BALL_DROP_START_T));
    // Falling under gravity: slow to start, accelerating into contact.
    const eased = Easing.easeInQuad(s);
    return parabolicLerp(BALL_START, contactPoint, eased, 2.1, -1);
  }
  const postEnd = CONTACT_T + BALL_POST_DURATION;
  if (t <= postEnd) {
    const s = clamp01((t - CONTACT_T) / BALL_POST_DURATION);
    // Struck ball: leaves the boot near peak speed, then settles into the net.
    const eased = Easing.easeOutCubic(s);
    return parabolicLerp(contactPoint, BALL_POST_TARGET, eased, 2.0, 1);
  }
  // settle inside the net for the remainder
  const settleEnd = postEnd + 0.35;
  const s = clamp01((t - postEnd) / (settleEnd - postEnd));
  return lerpV3(BALL_POST_TARGET, [BALL_POST_TARGET[0] - 0.3, BALL_POST_TARGET[1] - 0.5, BALL_POST_TARGET[2]], s);
}

export function ballSpinDeg(t) {
  const s = Math.max(0, t - BALL_DROP_START_T);
  return (s * 520) % 360;
}

// The strike contact point is fixed once — the striking toe's world
// position at the instant of contact — not re-evaluated every frame.
export const CONTACT_POINT = ballContactPoint(worldPoseAt(CONTACT_T).world);
