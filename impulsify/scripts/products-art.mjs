// Vector product drawings used by generate-concept-images.mjs.
// Every drawing is centred on (0,0) and fits roughly inside a 560×560 box.
// These are concept illustrations, not depictions of verified supplier inventory.

const INK = "#111318";
const GRAPH = "#202329";

const dots = (cx, cy, cols, rows, gap, r, fill, op = 1) => {
  let s = "";
  for (let i = 0; i < cols; i++)
    for (let j = 0; j < rows; j++)
      s += `<circle cx="${cx + i * gap}" cy="${cy + j * gap}" r="${r}" fill="${fill}" opacity="${op}"/>`;
  return s;
};

export const glove = (fill, cuff, extra = "") => `
  <g>
    <rect x="-120" y="40" width="240" height="190" rx="40" fill="${cuff}"/>
    <path d="M-130,-40 Q-130,90 -110,120 L110,120 Q130,90 130,-40 Z" fill="${fill}"/>
    <rect x="-130" y="-230" width="58" height="230" rx="29" fill="${fill}"/>
    <rect x="-64" y="-270" width="58" height="270" rx="29" fill="${fill}"/>
    <rect x="2" y="-262" width="58" height="262" rx="29" fill="${fill}"/>
    <rect x="68" y="-210" width="56" height="210" rx="28" fill="${fill}"/>
    <rect x="-210" y="-60" width="56" height="170" rx="28" fill="${fill}" transform="rotate(-38 -182 25)"/>
    ${extra}
  </g>`;

/** @type {Record<string, (A:string)=>string>} */
export const drawings = {
  "glow-earbuds-case": (A) => `
    <rect x="-160" y="-130" width="320" height="270" rx="118" fill="url(#gAccent)"/>
    <path d="M-158,-40 H158" stroke="#000" stroke-opacity=".18" stroke-width="5"/>
    <rect x="-14" y="-52" width="28" height="10" rx="5" fill="#fff" opacity=".7"/>
    <rect x="-26" y="128" width="52" height="8" rx="4" fill="#000" opacity=".35"/>
    <ellipse cx="-70" cy="-92" rx="70" ry="20" fill="#fff" opacity=".35"/>
    <path d="M-150,40 Q0,150 150,40" stroke="#fff" stroke-opacity=".15" stroke-width="8" fill="none"/>`,

  "levitating-racing-display": (A) => `
    <ellipse cx="0" cy="250" rx="230" ry="42" fill="#000" opacity=".35"/>
    <path d="M-220,170 V215 A220,40 0 0 0 220,215 V170 Z" fill="url(#gDark)"/>
    <ellipse cx="0" cy="170" rx="220" ry="40" fill="#2E323B"/>
    <ellipse cx="0" cy="170" rx="140" ry="24" fill="none" stroke="${A}" stroke-width="5" opacity=".9"/>
    <ellipse cx="0" cy="170" rx="70" ry="12" fill="${A}" opacity=".35"/>
    <ellipse cx="0" cy="110" rx="130" ry="16" fill="none" stroke="${A}" stroke-dasharray="6 10" stroke-width="3" opacity=".5"/>
    <ellipse cx="0" cy="62" rx="150" ry="18" fill="none" stroke="${A}" stroke-dasharray="6 10" stroke-width="3" opacity=".35"/>
    <g transform="translate(0,-60)">
      <ellipse cx="0" cy="60" rx="200" ry="10" fill="#000" opacity=".25"/>
      <path d="M-215,14 L-190,-14 L-70,-26 L-28,-58 L36,-58 L74,-26 L188,-20 L222,0 L222,22 L-215,22 Z" fill="url(#gAccent)"/>
      <path d="M-24,-56 Q8,-86 40,-56 Z" fill="${INK}"/>
      <rect x="-238" y="-56" width="58" height="12" rx="3" fill="${GRAPH}"/>
      <rect x="-214" y="-46" width="10" height="44" fill="${GRAPH}"/>
      <path d="M200,10 L250,14 L250,24 L200,24Z" fill="${GRAPH}"/>
      <circle cx="-128" cy="24" r="36" fill="#0B0C0F"/><circle cx="-128" cy="24" r="14" fill="#5C626C"/>
      <circle cx="138" cy="24" r="36" fill="#0B0C0F"/><circle cx="138" cy="24" r="14" fill="#5C626C"/>
      <path d="M-60,-6 H150" stroke="#fff" stroke-opacity=".35" stroke-width="5"/>
    </g>`,

  "trackable-tripod-wallet": (A) => `
    <path d="M-60,150 L-150,250 M60,150 L150,250 M0,150 L0,260" stroke="#4A4F59" stroke-width="16" stroke-linecap="round"/>
    <rect x="-150" y="-210" width="300" height="230" rx="18" fill="${A}" transform="rotate(-6)"/>
    <rect x="-170" y="-190" width="340" height="380" rx="34" fill="url(#gDark)"/>
    <rect x="-150" y="-170" width="300" height="340" rx="22" fill="none" stroke="#5C626C" stroke-dasharray="10 8" stroke-width="3"/>
    <circle cx="0" cy="-20" r="96" fill="none" stroke="#6B717C" stroke-width="10"/>
    <circle cx="0" cy="-20" r="96" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="2"/>
    <circle cx="100" cy="125" r="26" fill="#15171C"/><circle cx="100" cy="125" r="9" fill="${A}"/>
    <path d="M-120,120 H40" stroke="#fff" stroke-opacity=".08" stroke-width="18" stroke-linecap="round"/>`,

  "pocket-epaper-reader": (A) => `
    <rect x="-140" y="-250" width="280" height="500" rx="36" fill="url(#gDark)"/>
    <rect x="-116" y="-218" width="232" height="400" rx="10" fill="#E6E7E1"/>
    ${[...Array(11)].map((_, i) => `<rect x="-96" y="${-190 + i * 32}" width="${i % 4 === 3 ? 120 : 190}" height="10" rx="5" fill="#9EA1A6"/>`).join("")}
    <rect x="-96" y="-190" width="140" height="18" rx="6" fill="#55585E"/>
    <circle cx="0" cy="218" r="12" fill="#3A3F48"/>
    <rect x="170" y="-230" width="16" height="420" rx="8" fill="${A}" transform="rotate(8 178 -20)"/>`,

  "sonic-audio-glasses": (A) => `
    <path d="M-300,-50 H-230 M300,-50 H230" stroke="${GRAPH}" stroke-width="26" stroke-linecap="round"/>
    <rect x="-296" y="-66" width="70" height="32" rx="16" fill="#2E323B"/>
    <rect x="226" y="-66" width="70" height="32" rx="16" fill="#2E323B"/>
    ${dots(-280, -56, 4, 2, 12, 3, A)}${dots(244, -56, 4, 2, 12, 3, A)}
    <rect x="-240" y="-80" width="210" height="150" rx="58" fill="url(#gLens)" stroke="${GRAPH}" stroke-width="18"/>
    <rect x="30" y="-80" width="210" height="150" rx="58" fill="url(#gLens)" stroke="${GRAPH}" stroke-width="18"/>
    <path d="M-30,-40 Q0,-62 30,-40" stroke="${GRAPH}" stroke-width="16" fill="none"/>
    <path d="M-200,-50 Q-150,-70 -110,-55" stroke="#fff" stroke-opacity=".35" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M70,-50 Q120,-70 160,-55" stroke="#fff" stroke-opacity=".35" stroke-width="10" fill="none" stroke-linecap="round"/>
    <g fill="none" stroke="${A}" stroke-linecap="round" stroke-width="7">
      <path d="M-330,-110 Q-370,-50 -330,10" opacity=".9"/><path d="M-360,-140 Q-420,-50 -360,40" opacity=".5"/>
      <path d="M330,-110 Q370,-50 330,10" opacity=".9"/><path d="M360,-140 Q420,-50 360,40" opacity=".5"/>
    </g>`,

  "electric-fabric-shaver": (A) => `
    <rect x="-80" y="-60" width="160" height="300" rx="70" fill="url(#gPaper)"/>
    <rect x="-80" y="-60" width="160" height="70" fill="#C9D0D6" opacity=".6"/>
    <circle cx="0" cy="-150" r="120" fill="url(#gPaper)"/>
    <circle cx="0" cy="-150" r="96" fill="#D6DADF"/>
    ${[...Array(7)].map((_, i) => [...Array(7)].map((__, j) => {
      const x = -72 + i * 24, y = -222 + j * 24; return Math.hypot(x, y + 150) < 86 ? `<circle cx="${x}" cy="${y}" r="7" fill="#8E949C"/>` : ""; }).join("")).join("")}
    <circle cx="0" cy="110" r="22" fill="${A}"/>
    <rect x="-56" y="-10" width="112" height="44" rx="14" fill="${A}" opacity=".25"/>`,

  "foldable-travel-bag": (A) => `
    <path d="M-150,-60 Q-150,-170 -40,-170 M150,-60 Q150,-170 40,-170" stroke="${GRAPH}" stroke-width="18" fill="none" stroke-linecap="round"/>
    <path d="M-250,-60 Q-260,160 -200,190 H200 Q260,160 250,-60 Q0,-110 -250,-60Z" fill="url(#gAccent)"/>
    <path d="M-240,-30 Q0,-80 240,-30" stroke="#000" stroke-opacity=".22" stroke-width="6" fill="none" stroke-dasharray="14 8"/>
    <rect x="-60" y="30" width="120" height="70" rx="16" fill="#000" opacity=".12"/>
    <g transform="translate(250,170) rotate(-8)">
      <rect x="-80" y="-60" width="160" height="120" rx="32" fill="url(#gDark)"/>
      <path d="M-70,-20 H70" stroke="${A}" stroke-width="5"/>
    </g>`,

  "compact-smart-charger": (A) => `
    <path d="M-130,-130 L-80,-180 H170 L120,-130 Z" fill="#E8EAE5"/>
    <path d="M120,-130 L170,-180 V80 L120,130 Z" fill="#B9BEC4"/>
    <rect x="-130" y="-130" width="250" height="260" rx="30" fill="url(#gPaper)"/>
    <rect x="-70" y="-50" width="40" height="110" rx="14" fill="${INK}"/>
    <rect x="10" y="-50" width="40" height="110" rx="14" fill="${INK}"/>
    <rect x="-62" y="-42" width="24" height="94" rx="10" fill="#3A3F48"/>
    <rect x="18" y="-42" width="24" height="94" rx="10" fill="#3A3F48"/>
    <circle cx="-5" cy="98" r="7" fill="${A}"/>`,

  "origami-wireless-mouse": (A) => `
    <polygon points="-120,180 0,-200 40,180" fill="#E9ECEF"/>
    <polygon points="0,-200 40,180 140,170" fill="#BFC4CA"/>
    <polygon points="-120,180 0,-200 -150,40" fill="#D4D8DD"/>
    <polygon points="0,-200 140,170 150,40" fill="#9EA4AC"/>
    <polygon points="-120,180 40,180 140,170 30,215" fill="#7E848D"/>
    <path d="M0,-200 L20,0" stroke="${A}" stroke-width="8" stroke-linecap="round"/>
    <circle cx="10" cy="-110" r="10" fill="${INK}"/>`,

  "modular-magnetic-power-bank": (A) => `
    ${[2, 1, 0].map((i) => `<g transform="translate(${i * 34},${i * 64 - 40})">
      <rect x="-170" y="-110" width="300" height="200" rx="40" fill="${i === 0 ? "url(#gAccent)" : "url(#gDark)"}"/>
      <rect x="-170" y="60" width="300" height="30" rx="15" fill="#000" opacity=".2"/>
    </g>`).join("")}
    <circle cx="-20" cy="-50" r="70" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="10"/>
    ${dots(-80, 30, 4, 1, 22, 6, INK, 0.7)}`,

  "touch-control-bar": (A) => `
    ${[...Array(3)].map((_, r) => [...Array(12)].map((__, c) => `<rect x="${-290 + c * 50}" y="${40 + r * 50}" width="42" height="42" rx="9" fill="#2A2E36"/>`).join("")).join("")}
    <rect x="-310" y="-70" width="620" height="78" rx="22" fill="url(#gDark)" stroke="#3A3F48" stroke-width="3"/>
    <rect x="-292" y="-56" width="52" height="50" rx="12" fill="${A}"/>
    ${[0, 1, 2, 3, 4].map((i) => `<rect x="${-220 + i * 62}" y="-56" width="52" height="50" rx="12" fill="#3A3F48"/>`).join("")}
    <rect x="100" y="-42" width="180" height="22" rx="11" fill="#3A3F48"/>
    <rect x="100" y="-42" width="110" height="22" rx="11" fill="${A}"/>
    <circle cx="210" cy="-31" r="17" fill="#fff"/>`,

  "surface-conduction-speaker": (A) => `
    ${[1, 2, 3, 4].map((i) => `<ellipse cx="0" cy="150" rx="${120 + i * 70}" ry="${26 + i * 16}" fill="none" stroke="${A}" stroke-width="5" opacity="${1 - i * 0.2}"/>`).join("")}
    <path d="M-120,-60 V140 A120,30 0 0 0 120,140 V-60 Z" fill="url(#gDark)"/>
    <ellipse cx="0" cy="-60" rx="120" ry="30" fill="#3A3F48"/>
    ${[...Array(9)].map((_, i) => `<circle cx="${-64 + i * 16}" cy="-60" r="4" fill="#15171C"/>`).join("")}
    <rect x="-120" y="60" width="240" height="14" fill="${A}" opacity=".85"/>`,

  "electric-heated-gloves": (A) => glove("url(#gDark)", "#2A2E36", `
    <g fill="none" stroke="${A}" stroke-width="7" stroke-linecap="round" opacity=".95">
      <path d="M-101,-200 q14,25 0,50 q-14,25 0,50 q14,25 0,50"/>
      <path d="M-35,-240 q14,25 0,50 q-14,25 0,50 q14,25 0,50 q-14,25 0,50"/>
      <path d="M31,-232 q14,25 0,50 q-14,25 0,50 q14,25 0,50 q-14,25 0,50"/>
      <path d="M96,-180 q14,25 0,50 q-14,25 0,50 q14,25 0,50"/>
    </g>
    <rect x="-60" y="140" width="120" height="70" rx="16" fill="#15171C"/><circle cx="0" cy="175" r="14" fill="${A}"/>`),

  "steam-straightening-brush": (A) => `
    <g fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".55">
      <path d="M-70,-300 q30,-30 0,-60 q-30,-30 0,-60"/><path d="M0,-310 q30,-30 0,-60 q-30,-30 0,-60"/><path d="M70,-300 q30,-30 0,-60 q-30,-30 0,-60"/>
    </g>
    <rect x="-45" y="60" width="90" height="250" rx="40" fill="url(#gDark)"/>
    <rect x="-120" y="-260" width="240" height="330" rx="90" fill="url(#gAccent)"/>
    <rect x="-96" y="-236" width="192" height="282" rx="72" fill="${GRAPH}"/>
    ${dots(-72, -210, 7, 9, 24, 6, "#E8EAE5")}
    <rect x="-20" y="150" width="40" height="40" rx="12" fill="${A}"/>`,

  "cute-character-charger": (A) => `
    <circle cx="-110" cy="-150" r="52" fill="url(#gAccent)"/><circle cx="110" cy="-150" r="52" fill="url(#gAccent)"/>
    <circle cx="-110" cy="-150" r="26" fill="#000" opacity=".12"/><circle cx="110" cy="-150" r="26" fill="#000" opacity=".12"/>
    <rect x="-180" y="-170" width="360" height="340" rx="110" fill="url(#gAccent)"/>
    <circle cx="-70" cy="-30" r="26" fill="${INK}"/><circle cx="70" cy="-30" r="26" fill="${INK}"/>
    <circle cx="-62" cy="-40" r="9" fill="#fff"/><circle cx="78" cy="-40" r="9" fill="#fff"/>
    <ellipse cx="-118" cy="30" rx="28" ry="16" fill="#FF8FB1" opacity=".75"/><ellipse cx="118" cy="30" rx="28" ry="16" fill="#FF8FB1" opacity=".75"/>
    <path d="M-22,20 Q-11,38 0,22 Q11,38 22,20" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <rect x="-50" y="110" width="100" height="26" rx="13" fill="${INK}" opacity=".8"/>`,

  "led-flashlight-gloves": (A) => `
    ${[[-101, -232], [-35, -272], [31, -264], [96, -212]].map(([x, y]) => `<polygon points="${x - 12},${y} ${x + 12},${y} ${x + 70},${y - 300} ${x - 70},${y - 300}" fill="url(#gBeam)"/>`).join("")}
    ${glove("url(#gDark)", "#2A2E36", [[-101, -214], [-35, -254], [31, -246], [96, -194]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="16" fill="#fff"/><circle cx="${x}" cy="${y}" r="24" fill="none" stroke="${A}" stroke-width="5"/>`).join(""))}`,

  "display-charging-cable": (A) => `
    <path d="M-280,240 C-200,60 -320,-80 -110,-90" stroke="${GRAPH}" stroke-width="30" fill="none" stroke-linecap="round"/>
    <path d="M110,-30 C260,-40 220,200 320,240" stroke="${GRAPH}" stroke-width="30" fill="none" stroke-linecap="round"/>
    <rect x="-130" y="-140" width="250" height="130" rx="34" fill="url(#gDark)" stroke="#3A3F48" stroke-width="3"/>
    <rect x="-100" y="-114" width="160" height="78" rx="10" fill="#0B0C0F"/>
    <text x="-20" y="-58" text-anchor="middle" font-family="Geist Mono, ui-monospace, Menlo, monospace" font-size="44" font-weight="700" fill="${A}">--.-W</text>
    <rect x="120" y="-100" width="80" height="50" rx="12" fill="url(#gMetal)"/>`,

  "self-heating-coffee-mug": (A) => `
    <g fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".45">
      <path d="M-50,-250 q25,-30 0,-60 q-25,-30 0,-60"/><path d="M30,-240 q25,-30 0,-60 q-25,-30 0,-60"/>
    </g>
    <ellipse cx="0" cy="210" rx="230" ry="48" fill="url(#gDark)"/>
    <ellipse cx="0" cy="200" rx="200" ry="36" fill="none" stroke="${A}" stroke-width="7"/>
    <path d="M140,-90 q110,0 110,110 q0,100 -110,100" stroke="url(#gPaper)" stroke-width="40" fill="none"/>
    <path d="M-150,-170 H150 V140 Q150,200 90,200 H-90 Q-150,200 -150,140 Z" fill="url(#gPaper)"/>
    <ellipse cx="0" cy="-170" rx="150" ry="28" fill="#4B3426"/>
    <rect x="-150" y="60" width="300" height="14" fill="${A}" opacity=".7"/>`,

  "compact-power-bank": (A) => `
    <rect x="-130" y="-210" width="260" height="420" rx="58" fill="url(#gDark)"/>
    <rect x="-130" y="-210" width="260" height="420" rx="58" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="4"/>
    <rect x="-34" y="-200" width="68" height="16" rx="8" fill="#0B0C0F"/>
    ${[0, 1, 2, 3].map((i) => `<circle cx="${-45 + i * 30}" cy="140" r="9" fill="${i < 3 ? A : "#3A3F48"}"/>`).join("")}
    <path d="M-90,-150 V100" stroke="#fff" stroke-opacity=".08" stroke-width="22" stroke-linecap="round"/>`,

  "aluminium-laptop-stand": (A) => `
    <path d="M-260,200 L180,40" stroke="url(#gMetal)" stroke-width="22" stroke-linecap="round"/>
    <path d="M-40,120 L40,200 M120,62 L200,200" stroke="url(#gMetal)" stroke-width="18" stroke-linecap="round"/>
    <path d="M-250,170 L190,10" stroke="#C7CCD2" stroke-width="20" stroke-linecap="round"/>
    <path d="M190,10 L-40,-280" stroke="#2A2E36" stroke-width="22" stroke-linecap="round"/>
    <path d="M168,-6 L-50,-282" stroke="${A}" stroke-width="4" opacity=".7"/>
    <rect x="-300" y="198" width="560" height="16" rx="8" fill="#000" opacity=".2"/>`,

  "portable-lint-remover": (A) => `
    <rect x="-40" y="-20" width="80" height="300" rx="36" fill="url(#gDark)"/>
    <rect x="-180" y="-170" width="360" height="160" rx="40" fill="url(#gAccent)"/>
    <rect x="-160" y="-60" width="320" height="56" rx="14" fill="${GRAPH}"/>
    ${[...Array(16)].map((_, i) => `<path d="M${-150 + i * 20},-56 l10,48" stroke="#fff" stroke-opacity=".25" stroke-width="5"/>`).join("")}`,

  "smartphone-controlled-airplane": (A) => `
    <path d="M0,-260 C30,-240 34,-120 30,180 L0,250 L-30,180 C-34,-120 -30,-240 0,-260Z" fill="url(#gPaper)"/>
    <path d="M-30,-40 L-320,90 L-320,130 L-30,60Z M30,-40 L320,90 L320,130 L30,60Z" fill="url(#gPaper)"/>
    <path d="M-28,170 L-130,230 L-130,250 L0,230 L130,250 L130,230 L28,170Z" fill="#D2D6DB"/>
    <path d="M-320,100 L-30,-20 M320,100 L30,-20" stroke="${A}" stroke-width="10" stroke-linecap="round"/>
    <rect x="-24" y="-230" width="48" height="90" rx="14" fill="${GRAPH}"/>
    <ellipse cx="0" cy="-262" rx="90" ry="12" fill="#5C626C" opacity=".55"/>`,

  "inkless-photo-label-printer": (A) => `
    <g transform="translate(0,-210)">
      <rect x="-90" y="-150" width="180" height="170" rx="6" fill="#fff"/>
      <rect x="-70" y="-130" width="140" height="90" rx="4" fill="#C9CCC4"/>
      <path d="M-70,-40 L-20,-95 L10,-65 L35,-90 L70,-40Z" fill="#7A7E78"/>
      <circle cx="40" cy="-110" r="12" fill="#7A7E78"/>
      <rect x="-70" y="-26" width="100" height="10" rx="5" fill="#9EA1A6"/>
    </g>
    <rect x="-170" y="-200" width="340" height="320" rx="80" fill="url(#gPaper)"/>
    <rect x="-110" y="-206" width="220" height="16" rx="8" fill="#9EA4AC"/>
    <circle cx="0" cy="20" r="42" fill="${A}"/>
    <circle cx="0" cy="20" r="18" fill="#fff" opacity=".6"/>`,

  "literary-quote-clock": (A) => `
    <rect x="-260" y="-170" width="520" height="340" rx="22" fill="url(#gDark)"/>
    <rect x="-226" y="-136" width="452" height="272" rx="6" fill="#E9EAE4"/>
    ${[0, 1, 3, 4].map((i) => `<rect x="-196" y="${-104 + i * 46}" width="${i === 4 ? 230 : 392}" height="14" rx="7" fill="#9EA1A6"/>`).join("")}
    <rect x="-196" y="-12" width="300" height="26" rx="8" fill="${INK}"/>
    <rect x="-196" y="-12" width="300" height="26" rx="8" fill="none" stroke="${A}" stroke-width="5"/>
    <rect x="-60" y="170" width="120" height="40" rx="10" fill="#15171C"/>`,

  "fluorescent-orb-lamp": (A) => `
    <circle cx="0" cy="-40" r="230" fill="url(#gOrb)"/>
    <ellipse cx="-70" cy="-140" rx="80" ry="44" fill="#fff" opacity=".35"/>
    <path d="M-150,170 Q0,120 150,170 L120,250 H-120 Z" fill="url(#gDark)"/>`,

  "interactive-digital-cube": (A) => {
    const face = (pts, shade, seed) => {
      const [o, u, v] = pts; let s = `<polygon points="${o[0]},${o[1]} ${o[0] + u[0]},${o[1] + u[1]} ${o[0] + u[0] + v[0]},${o[1] + u[1] + v[1]} ${o[0] + v[0]},${o[1] + v[1]}" fill="${shade}"/>`;
      for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) {
        const on = ((i * 7 + j * 3 + seed) % 5 === 0) || (seed === 1 && (i === j || i + j === 5));
        const a = (i + 0.15) / 6, b = (j + 0.15) / 6, c = 0.7 / 6;
        const p = (x, y) => `${o[0] + u[0] * x + v[0] * y},${o[1] + u[1] * x + v[1] * y}`;
        s += `<polygon points="${p(a, b)} ${p(a + c, b)} ${p(a + c, b + c)} ${p(a, b + c)}" fill="${on ? A : "#000"}" opacity="${on ? 1 : 0.35}"/>`;
      }
      return s;
    };
    return face([[0, -230], [200, 115], [-200, 115]], "#2E323B", 1) + face([[-200, -115], [200, 115], [0, 230]], "#1A1D23", 2) + face([[0, 0], [200, -115], [0, 230]], "#24282F", 3);
  },

  "frog-bluetooth-speaker": (A) => `
    <ellipse cx="0" cy="200" rx="240" ry="34" fill="#000" opacity=".25"/>
    <circle cx="-110" cy="-150" r="78" fill="url(#gFrog)"/><circle cx="110" cy="-150" r="78" fill="url(#gFrog)"/>
    <circle cx="-110" cy="-150" r="42" fill="#fff"/><circle cx="110" cy="-150" r="42" fill="#fff"/>
    <circle cx="-100" cy="-145" r="22" fill="${INK}"/><circle cx="100" cy="-145" r="22" fill="${INK}"/>
    <ellipse cx="0" cy="40" rx="240" ry="180" fill="url(#gFrog)"/>
    <path d="M-90,-40 Q0,10 90,-40" stroke="${INK}" stroke-width="9" fill="none" stroke-linecap="round"/>
    <ellipse cx="0" cy="90" rx="130" ry="96" fill="#E6F7C9"/>
    ${[...Array(8)].map((_, i) => [...Array(6)].map((__, j) => { const x = -84 + i * 24, y = 30 + j * 24; return ((x / 120) ** 2 + ((y - 90) / 86) ** 2) < 0.8 ? `<circle cx="${x}" cy="${y}" r="6" fill="#4C7D2A"/>` : ""; }).join("")).join("")}
    <ellipse cx="-170" cy="200" rx="60" ry="22" fill="url(#gFrog)"/><ellipse cx="170" cy="200" rx="60" ry="22" fill="url(#gFrog)"/>`,

  "sculptural-wireless-speaker": (A) => `
    <path d="M-40,-280 C120,-300 170,-120 120,0 C80,100 190,190 110,250 C40,300 -150,290 -160,200 C-170,110 -60,80 -110,-40 C-160,-160 -150,-260 -40,-280Z" fill="url(#gViolet)"/>
    <path d="M-40,-280 C60,-290 100,-200 80,-120" stroke="#fff" stroke-opacity=".35" stroke-width="12" fill="none" stroke-linecap="round"/>
    ${[...Array(7)].map((_, i) => [...Array(4)].map((__, j) => `<circle cx="${-60 + i * 22}" cy="${120 + j * 22}" r="6" fill="#15171C" opacity=".6"/>`).join("")).join("")}`,

  "rgb-cloud-lamp": (A) => `
    <g>
      <circle cx="-170" cy="40" r="110" fill="url(#gCloud)"/>
      <circle cx="-50" cy="-60" r="150" fill="url(#gCloud)"/>
      <circle cx="110" cy="-30" r="130" fill="url(#gCloud)"/>
      <circle cx="210" cy="60" r="90" fill="url(#gCloud)"/>
      <rect x="-250" y="40" width="480" height="110" rx="55" fill="url(#gCloud)"/>
    </g>
    <ellipse cx="-80" cy="-120" rx="90" ry="40" fill="#fff" opacity=".35"/>`,

  "retro-bluetooth-radio": (A) => `
    <path d="M-150,-170 Q0,-300 150,-170" stroke="${GRAPH}" stroke-width="18" fill="none" stroke-linecap="round"/>
    <path d="M200,-170 L300,-330" stroke="#9EA4AC" stroke-width="8" stroke-linecap="round"/>
    <rect x="-280" y="-180" width="560" height="360" rx="44" fill="url(#gCream)"/>
    <rect x="-250" y="-140" width="280" height="280" rx="24" fill="#3A3226"/>
    ${[...Array(10)].map((_, i) => `<rect x="-236" y="${-124 + i * 26}" width="252" height="10" rx="5" fill="#57493A"/>`).join("")}
    <rect x="60" y="-140" width="190" height="80" rx="12" fill="#F7F1E3" stroke="#3A3226" stroke-width="4"/>
    ${[...Array(9)].map((_, i) => `<rect x="${76 + i * 19}" y="-120" width="3" height="${i % 2 ? 22 : 36}" fill="#3A3226"/>`).join("")}
    <rect x="150" y="-138" width="4" height="76" fill="#E25B3B"/>
    <circle cx="105" cy="40" r="42" fill="#3A3226"/><circle cx="105" cy="40" r="28" fill="#6B5B48"/>
    <circle cx="210" cy="40" r="30" fill="#3A3226"/><circle cx="210" cy="40" r="18" fill="#6B5B48"/>`,

  "sculptural-charging-stand": (A) => `
    <path d="M-220,240 C-220,-80 -60,-260 120,-200 C260,-150 220,60 120,120" stroke="url(#gMetal)" stroke-width="56" fill="none" stroke-linecap="round"/>
    <ellipse cx="-40" cy="250" rx="230" ry="30" fill="url(#gDark)"/>
    <g transform="rotate(12 60 -40)">
      <rect x="-30" y="-250" width="190" height="380" rx="34" fill="${INK}"/>
      <rect x="-18" y="-238" width="166" height="356" rx="26" fill="url(#gScreen)"/>
      <circle cx="65" cy="-60" r="44" fill="none" stroke="${A}" stroke-width="7" opacity=".9"/>
    </g>`,

  "3-in-1-charging-station": (A) => `
    <path d="M-300,160 L300,160 L260,230 H-260Z" fill="url(#gDark)"/>
    <rect x="-300" y="140" width="600" height="30" rx="15" fill="#2E323B"/>
    <path d="M-170,140 L-170,-40" stroke="#3A3F48" stroke-width="36" stroke-linecap="round"/>
    <rect x="-260" y="-260" width="180" height="340" rx="30" fill="${INK}"/>
    <rect x="-248" y="-248" width="156" height="316" rx="22" fill="url(#gScreen)"/>
    <path d="M150,140 V-50" stroke="#3A3F48" stroke-width="24" stroke-linecap="round"/>
    <rect x="100" y="-170" width="100" height="120" rx="30" fill="${GRAPH}"/>
    <rect x="114" y="-156" width="72" height="92" rx="20" fill="#0B0C0F"/>
    <circle cx="150" cy="-110" r="22" fill="none" stroke="${A}" stroke-width="5"/>
    <rect x="10" y="60" width="110" height="80" rx="34" fill="url(#gPaper)"/>
    <circle cx="65" cy="150" r="6" fill="${A}"/>`,
};

/** Which hand pose to use for the in-action image. */
export const poses = {
  "glow-earbuds-case": "hold", "levitating-racing-display": "reach", "trackable-tripod-wallet": "hold",
  "pocket-epaper-reader": "hold", "sonic-audio-glasses": "hold", "electric-fabric-shaver": "hold",
  "foldable-travel-bag": "reach", "compact-smart-charger": "hold", "origami-wireless-mouse": "reach",
  "modular-magnetic-power-bank": "hold", "touch-control-bar": "reach", "surface-conduction-speaker": "reach",
  "electric-heated-gloves": "none", "steam-straightening-brush": "hold", "cute-character-charger": "reach",
  "led-flashlight-gloves": "none", "display-charging-cable": "hold", "self-heating-coffee-mug": "reach",
  "compact-power-bank": "hold", "aluminium-laptop-stand": "reach", "portable-lint-remover": "hold",
  "smartphone-controlled-airplane": "pilot", "inkless-photo-label-printer": "hold", "literary-quote-clock": "reach",
  "fluorescent-orb-lamp": "reach", "interactive-digital-cube": "hold", "frog-bluetooth-speaker": "reach",
  "sculptural-wireless-speaker": "reach", "rgb-cloud-lamp": "reach", "retro-bluetooth-radio": "reach",
  "sculptural-charging-stand": "reach", "3-in-1-charging-station": "reach",
};
