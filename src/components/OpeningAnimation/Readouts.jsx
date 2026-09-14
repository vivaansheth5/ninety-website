import { CUES, CONTACT_T, Easing } from './scene.js';

const CREAM = '#f4f4ef';
const LIVE = '#4aa870';

function Rule({ x, y, width = 330 }) {
  return <rect x={x} y={y} width={width} height={2} fill={CREAM} fillOpacity={0.35} />;
}

export default function Readouts({ t, angularVelocity, height, ballVelocity, visible }) {
  if (!visible) return null;

  const orbitToVolley = t >= CUES.Orbit && t <= CONTACT_T + 0.3;
  const duringContact = t >= CONTACT_T && t <= CUES.Impact;
  const fadeStart = CUES.Reveal;
  const fadeOpacity = t < fadeStart ? 1 : Math.max(0, 1 - Easing.easeOutQuart(Math.min(1, (t - fadeStart) / 0.3)));

  return (
    <g style={{ opacity: fadeOpacity }} fontFamily="Archivo, sans-serif" fill={CREAM}>
      {/* Title block — always visible */}
      <text x={96} y={142} fontSize={26} fontWeight={600} letterSpacing={3.5}>
        NINETY+ / BIOMECHANICS
      </text>
      <text x={96} y={180} fontSize={24} fontWeight={400} letterSpacing={2} fillOpacity={0.55}>
        {`BICYCLE VOLLEY · TC ${t.toFixed(2)}`}
      </text>

      {/* Angular velocity — Orbit -> Volley+0.3 */}
      {orbitToVolley && (
        <>
          <Rule x={1494} y={942} />
          <text x={1494} y={958} fontSize={24} letterSpacing={2} fillOpacity={0.55}>
            ANGULAR VELOCITY
          </text>
          <text x={1494} y={1006} fontSize={44} fontWeight={600} fill={LIVE}>
            {angularVelocity.toFixed(2)} rad/s
          </text>
        </>
      )}

      {/* Height readout on the axis line — Orbit -> Volley+0.3 */}
      {orbitToVolley && (
        <text x={200} y={420} fontSize={34} fontWeight={600} fill={LIVE}>
          h {height.toFixed(2)} m
        </text>
      )}

      {/* Ball velocity — contact -> impact */}
      {duringContact && (
        <>
          <Rule x={1494} y={126} />
          <text x={1494} y={142} fontSize={24} letterSpacing={2} fillOpacity={0.55}>
            BALL VELOCITY
          </text>
          <text x={1494} y={190} fontSize={44} fontWeight={600} fill={LIVE}>
            {ballVelocity.toFixed(1)} m/s
          </text>
          <text x={1494} y={238} fontSize={24} letterSpacing={1} fillOpacity={0.6}>
            {'θ 31° · e 0.78'}
          </text>
        </>
      )}

      {/* Equation — Orbit -> Volley+0.3 */}
      {orbitToVolley && (
        <text x={96} y={1058} fontSize={24} fontWeight={400} letterSpacing={1} fillOpacity={0.6}>
          {'y = x·tanθ − g x² / (2 v₀² cos²θ)'}
        </text>
      )}
    </g>
  );
}
