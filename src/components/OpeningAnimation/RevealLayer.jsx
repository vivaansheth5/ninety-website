import { CUES, Easing, animate } from './scene.js';

const GREEN = '#1e5632';
const LIVE = '#4aa870';
const CREAM = '#f4f4ef';

// SVG-space pieces of the reveal: green ring, cream disc, cream panel.
// Fired from a fixed screen-space origin (the ball's projected impact point).
export function RevealSvgLayer({ t, originX, originY }) {
  if (t < CUES.Reveal) return null;

  const ringR = animate({ from: 0, to: 3600, start: CUES.Reveal, end: CUES.Reveal + 0.36, ease: Easing.easeOutQuart })(t);
  const ringVisible = t <= CUES.Reveal + 0.42;

  const discR = animate({ from: 0, to: 3200, start: CUES.Reveal, end: CUES.Reveal + 0.4, ease: Easing.easeOutQuart })(t);

  const panelH = animate({ from: 0, to: 1080, start: CUES.Reveal + 0.42, end: CUES.Reveal + 0.7, ease: Easing.easeOutQuart })(t);

  return (
    <g>
      {ringVisible && (
        <circle cx={originX} cy={originY} r={ringR} fill="none" stroke={LIVE} strokeWidth={26} opacity={0.55} />
      )}
      <circle cx={originX} cy={originY} r={discR} fill={CREAM} />
      {panelH > 0 && <rect x={0} y={(1080 - panelH) / 2} width={1920} height={panelH} fill={CREAM} />}
    </g>
  );
}

// The logo wordmark — an HTML overlay (mirrors the original design's single
// SVG + absolutely-positioned <img>). We ship the brand wordmark as styled
// type rather than a raster asset; the source design notes the shipped
// screenshot logo needs replacing with a vector original before production
// anyway (see design handoff), so swap this for an <img> once that exists.
export function RevealLogo({ t }) {
  if (t < CUES.Reveal + 0.42) return null;

  const wipe = animate({ from: 100, to: 0, start: CUES.Reveal + 0.62, end: CUES.Reveal + 1.0, ease: Easing.easeOutQuart })(t);
  const scale = animate({ from: 1.035, to: 1, start: CUES.Reveal + 0.62, end: CUES.Reveal + 1.4, ease: Easing.easeInOutCubic })(t);
  const opacity = t >= CUES.Reveal + 0.62 ? 1 : 0;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ opacity, transition: 'opacity 0.05s linear' }}
    >
      <div
        style={{
          clipPath: `inset(0 ${wipe}% 0 0)`,
          transform: `scale(${scale})`,
        }}
      >
        <span
          className="font-display font-extrabold"
          style={{ color: '#0b0b0a', fontSize: 'clamp(48px, 9vw, 128px)', letterSpacing: '0.01em' }}
        >
          NINETY<span style={{ color: GREEN }}>+</span>
        </span>
      </div>
    </div>
  );
}
