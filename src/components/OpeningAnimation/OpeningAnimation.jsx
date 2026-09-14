import { useEffect, useMemo, useRef, useState } from 'react';
import {
  DURATION,
  CUES,
  CONTACT_POINT,
  SCREEN_W,
  SCREEN_H,
  worldPoseAt,
  cameraTargetAt,
  buildCam,
  proj,
  sphereScreen,
  capsulePath,
  shade,
  BONES,
  HEAD_RADIUS,
  HAND_RADIUS,
  groundRingPoints,
  GOAL,
  netGrid,
  netRippleOffset,
  ballPositionAt,
  ballSpinDeg,
  BALL_RADIUS,
  tiltAt,
  rootAt,
} from './scene.js';
import Readouts from './Readouts.jsx';
import { RevealSvgLayer, RevealLogo } from './RevealLayer.jsx';

const SESSION_KEY = 'ninety_seen_intro';
const CREAM = '#f4f4ef';

function computeFrame(t) {
  const { world } = worldPoseAt(t);
  const target = cameraTargetAt(t, world);
  const cam = buildCam(t, target);
  const zRefProj = proj(world.pelvis, cam);
  const zRef = zRefProj ? zRefProj.z : 5;
  const ballPos = ballPositionAt(t, CONTACT_POINT);
  return { world, cam, zRef, ballPos };
}

export default function OpeningAnimation({ onComplete }) {
  const prefersReduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    []
  );
  const alreadySeen = useMemo(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      return false;
    }
  }, []);
  const skip = prefersReduced || alreadySeen;

  const [t, setT] = useState(0);
  const [finished, setFinished] = useState(skip);
  const startRef = useRef(null);
  const rafRef = useRef(null);
  const completedRef = useRef(false);

  useEffect(() => {
    if (skip) {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete?.();
      }
      return;
    }
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // storage unavailable — animation still plays, just every visit
    }

    const tick = (ts) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = (ts - startRef.current) / 1000;
      const clamped = Math.min(DURATION, elapsed);
      setT(clamped);
      if (clamped >= DURATION) {
        if (!completedRef.current) {
          completedRef.current = true;
          setFinished(true);
          onComplete?.();
        }
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [skip, onComplete]);

  // Fixed reveal origin: the ball's projected screen position at the moment
  // the reveal fires, evaluated once.
  const revealOrigin = useMemo(() => {
    const frame = computeFrame(CUES.Reveal);
    const s = sphereScreen(frame.ballPos, BALL_RADIUS, frame.cam);
    return s ? { x: s.cx, y: s.cy } : { x: SCREEN_W / 2, y: SCREEN_H / 2 };
  }, []);

  if (skip || finished) return null;

  const { world, cam, zRef, ballPos } = computeFrame(t);
  const root = rootAt(t);

  // ---- draw list: bones + head + hands + ball, painter's algorithm ----
  const drawList = [];
  for (const [aName, bName, r0, r1] of BONES) {
    const cap = capsulePath(world[aName], world[bName], r0, r1, cam);
    if (cap) drawList.push({ kind: 'poly', depth: cap.depth, d: cap.d, fill: shade(cap.depth, zRef) });
  }
  const head = sphereScreen(world.head, HEAD_RADIUS, cam);
  if (head) drawList.push({ kind: 'circle', depth: head.depth, cx: head.cx, cy: head.cy, r: head.r, fill: shade(head.depth, zRef) });
  for (const wrist of ['wristL', 'wristR']) {
    const hand = sphereScreen(world[wrist], HAND_RADIUS, cam);
    if (hand) drawList.push({ kind: 'circle', depth: hand.depth, cx: hand.cx, cy: hand.cy, r: hand.r, fill: shade(hand.depth, zRef) });
  }
  const ball = sphereScreen(ballPos, BALL_RADIUS, cam);
  if (ball) {
    drawList.push({ kind: 'ball', depth: ball.depth, cx: ball.cx, cy: ball.cy, r: ball.r });
  }
  drawList.sort((a, b) => b.depth - a.depth);

  // ---- ground ring + axis, centred under the figure ----
  const ringPts = groundRingPoints()
    .map(([x, y, z]) => proj([x + root.x, y, z + root.z], cam))
    .filter(Boolean);
  const ringPath = ringPts.length > 2 ? ringPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z' : null;

  const axisBottom = proj([root.x, 0, root.z], cam);
  const axisTop = proj([root.x, 2.9, root.z], cam);

  // ---- goal frame + net ----
  const goalCorners = [
    [GOAL.x, 0, GOAL.zMin],
    [GOAL.x, 0, GOAL.zMax],
    [GOAL.x, GOAL.yMax, GOAL.zMax],
    [GOAL.x, GOAL.yMax, GOAL.zMin],
  ]
    .map((p) => proj(p, cam))
    .filter(Boolean);
  const goalPath =
    goalCorners.length === 4 ? goalCorners.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z' : null;

  const { verts, cols, rows } = netGrid();
  const rippledVerts = verts.map((v) => {
    const off = netRippleOffset(v, [0, ballPos[1], ballPos[2]], t, CUES.Impact);
    return { ...v, x: v.x - off };
  });
  const idx = (i, j) => i * (rows + 1) + j;
  const netLines = [];
  for (let i = 0; i <= cols; i++) {
    const pts = [];
    for (let j = 0; j <= rows; j++) {
      const p = proj([rippledVerts[idx(i, j)].x, rippledVerts[idx(i, j)].y, rippledVerts[idx(i, j)].z], cam);
      if (p) pts.push(p);
    }
    if (pts.length > 1) netLines.push(pts.map((p, k) => `${k === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '));
  }
  for (let j = 0; j <= rows; j++) {
    const pts = [];
    for (let i = 0; i <= cols; i++) {
      const p = proj([rippledVerts[idx(i, j)].x, rippledVerts[idx(i, j)].y, rippledVerts[idx(i, j)].z], cam);
      if (p) pts.push(p);
    }
    if (pts.length > 1) netLines.push(pts.map((p, k) => `${k === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '));
  }

  // ---- physics readout values ----
  const dt = 0.05;
  const angularVelocity = t > dt ? ((tiltAt(t) - tiltAt(t - dt)) / dt) * (Math.PI / 180) : 0;
  const height = root.y + 0.95;
  const bv = 0.02;
  let ballVelocity = 0;
  if (t > bv) {
    const p0 = ballPositionAt(t - bv, CONTACT_POINT);
    const p1 = ballPos;
    ballVelocity = Math.hypot(p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]) / bv;
  }

  const spin = ballSpinDeg(t);
  const readoutsVisible = t < CUES.Reveal + 0.3;

  return (
    <div className="fixed inset-0 z-[100]" style={{ background: '#0b0b0a' }} aria-hidden="true">
      <div className="relative w-full h-full">
        <svg viewBox={`0 0 ${SCREEN_W} ${SCREEN_H}`} className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          {/* ground + axis + goal + net (background layer) */}
          {ringPath && <path d={ringPath} fill="none" stroke={CREAM} strokeOpacity={0.26} strokeWidth={2} />}
          {axisBottom && axisTop && (
            <line
              x1={axisBottom.x}
              y1={axisBottom.y}
              x2={axisTop.x}
              y2={axisTop.y}
              stroke={CREAM}
              strokeOpacity={0.4}
              strokeWidth={2}
              strokeDasharray="10 12"
            />
          )}
          {goalPath && <path d={goalPath} fill="none" stroke={CREAM} strokeOpacity={0.55} strokeWidth={3.5} />}
          {netLines.map((d, i) => (
            <path key={i} d={d} fill="none" stroke={CREAM} strokeOpacity={0.2} strokeWidth={1.6} />
          ))}

          {/* the figure + ball, depth sorted */}
          {drawList.map((item, i) => {
            if (item.kind === 'poly') return <path key={i} d={item.d} fill={item.fill} />;
            if (item.kind === 'circle') return <circle key={i} cx={item.cx} cy={item.cy} r={item.r} fill={item.fill} />;
            return (
              <g key={i}>
                <circle cx={item.cx} cy={item.cy} r={item.r} fill="#fbfbf8" />
                <g transform={`rotate(${spin} ${item.cx} ${item.cy})`}>
                  <path
                    d={`M ${item.cx} ${item.cy - item.r * 0.5} L ${item.cx + item.r * 0.45} ${item.cy - item.r * 0.1} L ${item.cx + item.r * 0.28} ${item.cy + item.r * 0.42} L ${item.cx - item.r * 0.28} ${item.cy + item.r * 0.42} L ${item.cx - item.r * 0.45} ${item.cy - item.r * 0.1} Z`}
                    fill="#0b0b0a"
                    fillOpacity={0.72}
                  />
                </g>
              </g>
            );
          })}

          <Readouts
            t={t}
            azimuth={cam.az}
            angularVelocity={angularVelocity}
            height={height}
            ballVelocity={ballVelocity}
            visible={readoutsVisible}
          />

          <RevealSvgLayer t={t} originX={revealOrigin.x} originY={revealOrigin.y} />
        </svg>

        <RevealLogo t={t} />
      </div>
    </div>
  );
}
