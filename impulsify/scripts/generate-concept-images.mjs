#!/usr/bin/env node
/**
 * Generates the 160-image CONCEPT library (32 products × 5 roles) as lightweight SVGs,
 * plus src/data/image-manifest.json mapping every image to product, role, alt text,
 * source status and a photography brief for the real shoot / AI generation.
 *
 * Output: vector masters in assets/masters/<slug>/0N-<role>.svg. Run `npm run images:optimize`
 * afterwards to export responsive AVIF/WebP web variants into public/images/products.
 *
 * These are art-directed vector concept illustrations — NOT product photography and
 * NOT depictions of verified supplier inventory. Replace them by dropping real masters
 * (≥1200×1200) at assets/masters/<slug>/0N-<role>.(jpg|png|webp|avif) and re-running
 * `npm run images:optimize` — a raster master always wins over the SVG concept.
 *
 * Usage: node scripts/generate-concept-images.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { drawings, poses } from "./products-art.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "assets/masters"); // masters; web variants are produced by optimize-images.mjs
const MANIFEST = join(ROOT, "src/data/image-manifest.json");
const S = 1200;

const INK = "#111318", VOLT = "#C7FF46", VIOLET = "#8A76FF", PAPER = "#F6F7F3";

// slug, name, accent, benefit line (image 3), hook brief, in-use brief, variant hues for image 5
const P = [
  ["glow-earbuds-case", "Glow-in-the-Dark Earbuds Case", VOLT, "GLOWS AFTER DARK.", "the case glowing softly on a dark nightstand", "a hand holding the glowing case in a dim room", [0, 105]],
  ["levitating-racing-display", "Magnetic Levitating Racing Car Display", VIOLET, "FLOATS. SERIOUSLY.", "the unbranded racing car hovering above its base with a visible gap", "a hand lowering the car onto the field above the base", []],
  ["trackable-tripod-wallet", "Magnetic Trackable Tripod Wallet", VOLT, "WALLET. STAND. FINDER.", "the wallet unfolded as a phone stand", "a hand snapping the wallet onto the back of a phone", []],
  ["pocket-epaper-reader", "Pocket E-Paper Reader & Note Device", PAPER, "READ WITHOUT THE GLARE.", "the device with a crisp page of text on screen", "a person reading on the device on a metro commute", []],
  ["sonic-audio-glasses", "Sonic Audio Glasses", VIOLET, "SOUND. NO EARBUDS.", "the glasses with subtle sound waves from the temples", "a person wearing the glasses on a city walk", []],
  ["electric-fabric-shaver", "Rechargeable Electric Fabric Shaver", VOLT, "PILLS OUT. FRESH IN.", "the shaver on a half-refreshed knit sweater", "a hand gliding the shaver over a pilled hoodie", []],
  ["foldable-travel-bag", "Ultra-Compact Foldable Travel Bag", VIOLET, "FOLDS FLAT. GOES ANYWHERE.", "the open bag next to its tiny folded pouch", "a traveller carrying the bag at an airport", [0, 40]],
  ["compact-smart-charger", "Compact Smart Charging Adapter", VOLT, "SMALL BRICK. SMART POWER.", "the compact adapter in dramatic side light", "a hand plugging the adapter into a wall socket", []],
  ["origami-wireless-mouse", "Foldable Origami Wireless Mouse", PAPER, "UNFOLD YOUR WORKSPACE.", "the mouse mid-unfold, flat and curved states", "a hand using the unfolded mouse beside a laptop", []],
  ["modular-magnetic-power-bank", "Modular Magnetic Power Bank", VIOLET, "SNAP ON. STACK UP.", "stacked modules snapping together", "a hand snapping the module onto a phone", []],
  ["touch-control-bar", "External Touch Control Bar", VOLT, "SHORTCUTS, ONE TAP AWAY.", "the lit touch bar above a keyboard", "a finger tapping a control on the bar", []],
  ["surface-conduction-speaker", "Surface-Conduction Speaker", VIOLET, "ANY TABLE. NOW A SPEAKER.", "the puck on a wooden table with ripple lines", "a hand placing the speaker on a table", []],
  ["electric-heated-gloves", "Electric Heated Gloves", VOLT, "WARM HANDS. COLD RIDES.", "the glove with warm heating-element glow", "a rider wearing the gloves on a cold morning", []],
  ["steam-straightening-brush", "Steam Hair Straightening Brush", VIOLET, "BRUSH. STEAM. SMOOTH.", "the brush with soft steam rising", "a person brushing a section of hair", []],
  ["cute-character-charger", "Cute Character Charging Adapter", VOLT, "CHARGING, BUT CUTE.", "the character charger on a pastel desk", "a hand plugging a cable into the charger", [0, 160]],
  ["led-flashlight-gloves", "LED Flashlight Gloves", VOLT, "LIGHT AT YOUR FINGERTIPS.", "fingertip beams cutting through darkness", "hands repairing a bicycle chain by fingertip light", []],
  ["display-charging-cable", "Digital Display Charging Cable", VOLT, "POWER AT A GLANCE.", "the connector display lit, close-up", "a hand plugging the cable into a phone", []],
  ["self-heating-coffee-mug", "Electric Self-Heating Coffee Mug", VIOLET, "STAYS WARM. STAYS PUT.", "the steaming mug on its glowing base", "a hand lifting the mug at a work desk", []],
  ["compact-power-bank", "Compact High-Capacity Power Bank", VOLT, "POCKET-SIZED BACKUP.", "the power bank with indicator lights", "a hand pulling the power bank from a jeans pocket", []],
  ["aluminium-laptop-stand", "Premium Aluminium Laptop Stand", PAPER, "RAISE YOUR SCREEN.", "the stand lifting a laptop in profile", "a person typing with the laptop raised", []],
  ["portable-lint-remover", "Portable Lint Remover", VIOLET, "SMALL TOOL. BIG DIFFERENCE.", "the remover beside a cleaned coat sleeve", "a hand sweeping lint from a coat", []],
  ["smartphone-controlled-airplane", "Smartphone-Controlled Flying Airplane", VIOLET, "YOUR PHONE IS THE COCKPIT.", "the airplane in flight against open sky", "a person steering the plane from a phone in a park", []],
  ["inkless-photo-label-printer", "Portable Inkless Photo & Label Printer", VOLT, "NO INK. EVER.", "a print emerging from the printer", "a hand peeling a fresh label for a jar", []],
  ["literary-quote-clock", "Literary Quote Clock", PAPER, "TELL TIME WITH A SENTENCE.", "the clock showing a highlighted line of text", "a hand placing the clock on a bookshelf", []],
  ["fluorescent-orb-lamp", "Glowing Fluorescent Orb Lamp", VIOLET, "A SMALL PLANET OF LIGHT.", "the orb glowing in a dark room", "a hand switching the orb on", []],
  ["interactive-digital-cube", "Interactive Digital Cube", VOLT, "A CUBE THAT REACTS.", "the cube with lit pixel faces", "a hand turning the cube on a desk", []],
  ["frog-bluetooth-speaker", "Cute Frog Bluetooth Speaker", VOLT, "SMALL FROG. BIG TUNES.", "the frog speaker on a study table", "a hand pressing play on the frog", []],
  ["sculptural-wireless-speaker", "Sculptural Wireless Speaker", VIOLET, "SOUND THAT LOOKS LIKE ART.", "the speaker lit like a gallery sculpture", "a hand adjusting the speaker on a shelf", []],
  ["rgb-cloud-lamp", "Interactive RGB Cloud Lamp", VIOLET, "LIGHT UP YOUR SETUP.", "the cloud glowing above a desk setup", "a hand changing the cloud's colour", [0, 120, 230]],
  ["retro-bluetooth-radio", "Retro Bluetooth Radio Speaker", VOLT, "VINTAGE LOOKS. MODERN PLAYLISTS.", "the radio in warm window light", "a hand turning the radio dial", [0, 90]],
  ["sculptural-charging-stand", "Unique Sculptural Wireless Charging Stand", VIOLET, "CHARGE IT. DISPLAY IT.", "the stand holding a phone, sculptural silhouette", "a hand placing a phone on the stand", []],
  ["3-in-1-charging-station", "3-in-1 Wireless Charging Station", VOLT, "ONE SPOT. EVERY DEVICE.", "the station charging phone, watch and earbuds", "a hand placing a watch on the station", []],
];

const shade = (hex, f) => {
  const n = parseInt(hex.slice(1), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(f > 0 ? v + (255 - v) * f : v * (1 + f)))));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

const defs = (A) => `<defs>
  <linearGradient id="gAccent" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="${shade(A, 0.35)}"/><stop offset="1" stop-color="${shade(A, -0.28)}"/></linearGradient>
  <linearGradient id="gDark" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stop-color="#3B404A"/><stop offset="1" stop-color="#14161B"/></linearGradient>
  <linearGradient id="gMetal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F1F3F5"/><stop offset="1" stop-color="#8F959E"/></linearGradient>
  <linearGradient id="gPaper" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#C9CDC6"/></linearGradient>
  <linearGradient id="gViolet" x1="0" y1="0" x2="0.6" y2="1"><stop offset="0" stop-color="#C3B8FF"/><stop offset="1" stop-color="#4A35C8"/></linearGradient>
  <linearGradient id="gCream" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBF5E6"/><stop offset="1" stop-color="#D9CDB3"/></linearGradient>
  <linearGradient id="gLens" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4B3F8F"/><stop offset="1" stop-color="#0B0C0F"/></linearGradient>
  <linearGradient id="gScreen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${VIOLET}"/><stop offset="1" stop-color="#1B1640"/></linearGradient>
  <linearGradient id="gFrog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A8E06A"/><stop offset="1" stop-color="#4E9A2E"/></linearGradient>
  <linearGradient id="gBeam" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".85"/><stop offset="1" stop-color="${A}" stop-opacity="0"/></linearGradient>
  <linearGradient id="gCloud" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFD1F0"/><stop offset=".5" stop-color="#B9A8FF"/><stop offset="1" stop-color="#7FE7FF"/></linearGradient>
  <radialGradient id="gOrb" cx=".42" cy=".38" r=".7"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".35" stop-color="${shade(A, 0.4)}"/><stop offset="1" stop-color="${shade(A, -0.45)}"/></radialGradient>
  <radialGradient id="gHalo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${A}" stop-opacity=".55"/><stop offset=".55" stop-color="${A}" stop-opacity=".12"/><stop offset="1" stop-color="${A}" stop-opacity="0"/></radialGradient>
  <radialGradient id="gBgDark" cx=".5" cy=".42" r=".75"><stop offset="0" stop-color="#262A32"/><stop offset="1" stop-color="#0A0B0E"/></radialGradient>
  <linearGradient id="gSkin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9A27C"/><stop offset="1" stop-color="#B7805C"/></linearGradient>
  <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="28" stdDeviation="26" flood-color="#000" flood-opacity=".35"/></filter>
</defs>`;

const tag = (dark) => `
  <text x="64" y="96" font-family="Space Grotesk, Arial, Helvetica, sans-serif" font-weight="700" font-size="30" letter-spacing="4" fill="${dark ? PAPER : INK}" opacity=".85">IMPULSIFY</text>
  <g transform="translate(${S - 64},${S - 64})"><rect x="-196" y="-44" width="196" height="44" rx="22" fill="${dark ? "#ffffff" : INK}" fill-opacity="${dark ? 0.08 : 0.06}"/>
  <text x="-98" y="-15" text-anchor="middle" font-family="Geist Mono, ui-monospace, Menlo, monospace" font-size="18" letter-spacing="2" fill="${dark ? "#A6ABB3" : "#5C626C"}">CONCEPT ART</text></g>`;

const svg = (A, body, bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="${S}" height="${S}">${defs(A)}${bg}${body}</svg>`;

const product = (slug, A, x, y, s, extra = "") =>
  `<g transform="translate(${x},${y}) scale(${s})" ${extra}><g filter="url(#soft)">${drawings[slug](A)}</g></g>`;

// ---- hands (stylised, flat) ----
const handHoldBack = (x, y) => `<g transform="translate(${x},${y})">
  <path d="M-120,120 L-150,700 H150 L120,120Z" fill="url(#gSkin)"/>
  <path d="M-130,440 H130 L150,700 H-150Z" fill="${VIOLET}"/>
  <ellipse cx="0" cy="60" rx="190" ry="130" fill="url(#gSkin)"/></g>`;
const handHoldFront = (x, y) => `<g transform="translate(${x},${y})">
  ${[-120, -45, 30, 105].map((fx, i) => `<rect x="${fx}" y="${-80 + Math.abs(i - 1.5) * 14}" width="66" height="150" rx="33" fill="url(#gSkin)" stroke="#A9714F" stroke-opacity=".35" stroke-width="3"/>`).join("")}
  <rect x="-250" y="-120" width="70" height="200" rx="35" fill="url(#gSkin)" transform="rotate(-40 -215 -20)" stroke="#A9714F" stroke-opacity=".35" stroke-width="3"/></g>`;
const handReach = (x, y) => `<g transform="translate(${x},${y})">
  <path d="M40,-60 L700,-120 L700,120 L40,70Z" fill="${VIOLET}"/>
  <ellipse cx="0" cy="0" rx="120" ry="90" fill="url(#gSkin)"/>
  <rect x="-260" y="-36" width="220" height="56" rx="28" fill="url(#gSkin)" stroke="#A9714F" stroke-opacity=".35" stroke-width="3"/>
  ${[0, 1, 2].map((i) => `<rect x="${-120 + i * 10}" y="${10 + i * 26}" width="120" height="50" rx="25" fill="url(#gSkin)" stroke="#A9714F" stroke-opacity=".35" stroke-width="3"/>`).join("")}
  <rect x="-60" y="-110" width="130" height="50" rx="25" fill="url(#gSkin)" transform="rotate(20 0 -85)" stroke="#A9714F" stroke-opacity=".35" stroke-width="3"/></g>`;

const wrapWords = (t, max = 14) => {
  const lines = []; let cur = "";
  for (const w of t.split(" ")) { if ((cur + " " + w).trim().length > max && cur) { lines.push(cur); cur = w; } else cur = (cur + " " + w).trim(); }
  if (cur) lines.push(cur); return lines;
};

// ---- role compositions ----
function hook(slug, A) {
  const bg = `<rect width="${S}" height="${S}" fill="url(#gBgDark)"/>
    <circle cx="600" cy="560" r="520" fill="url(#gHalo)"/>
    <ellipse cx="600" cy="1000" rx="380" ry="40" fill="#000" opacity=".45"/>
    <g stroke="#ffffff" stroke-opacity=".04">${[...Array(13)].map((_, i) => `<path d="M${i * 100},0 V${S}"/>`).join("")}</g>`;
  let body = product(slug, A, 600, 580, 1.25);
  if (slug === "smartphone-controlled-airplane")
    body = `<g stroke="${A}" stroke-opacity=".5" stroke-width="6" stroke-linecap="round">${[0, 1, 2, 3].map((i) => `<path d="M${330 + i * 180},${1000 - i * 10} L${380 + i * 170},${820}" />`).join("")}</g>` + product(slug, A, 600, 520, 1.15, `transform-origin="0 0"`).replace(`scale(1.15)`, `scale(1.15) rotate(28)`);
  return svg(A, body + tag(true), bg);
}

function inAction(slug, A) {
  const bg = `<rect width="${S}" height="${S}" fill="#E7E4DC"/><rect y="${S * 0.7}" width="${S}" height="${S * 0.3}" fill="#D6D1C5"/>
    <circle cx="980" cy="220" r="260" fill="${A}" opacity=".18"/>`;
  const pose = poses[slug];
  let body;
  if (pose === "hold") body = handHoldBack(600, 760) + product(slug, A, 600, 560, 0.95) + handHoldFront(600, 790);
  else if (pose === "reach") body = product(slug, A, 520, 640, 0.95) + handReach(900, 480);
  else if (pose === "pilot")
    body = `<rect width="${S}" height="${S * 0.7}" fill="#CFE3F7"/>` + product(slug, A, 760, 300, 0.55).replace("scale(0.55)", "scale(0.55) rotate(-62)") +
      handHoldBack(420, 900) + `<g transform="translate(420,760) rotate(-8)"><rect x="-95" y="-190" width="190" height="380" rx="30" fill="${INK}"/><rect x="-82" y="-176" width="164" height="352" rx="22" fill="#2A2E36"/>
      <circle cx="-30" cy="100" r="40" fill="none" stroke="${A}" stroke-width="8"/><circle cx="40" cy="100" r="40" fill="none" stroke="${A}" stroke-width="8"/>
      <path d="M-50,-100 L0,-150 L50,-100" stroke="${A}" stroke-width="10" fill="none" stroke-linecap="round"/></g>` + handHoldFront(420, 930);
  else body = `<g transform="translate(0,0)">${product(slug, A, 600, 620, 1.05)}</g>`; // wearables: worn-glove view
  return svg(A, body + tag(false), bg);
}

function benefit(slug, A, line) {
  const dark = true;
  const bg = `<rect width="${S}" height="${S}" fill="${INK}"/><circle cx="900" cy="860" r="460" fill="url(#gHalo)"/>`;
  const lines = wrapWords(line, 12);
  const fs = lines.length > 3 ? 96 : 112;
  const txt = lines.map((l, i) => `<text x="64" y="${230 + i * fs * 0.98}" font-family="Space Grotesk, Arial, Helvetica, sans-serif" font-weight="700" font-size="${fs}" letter-spacing="-4" fill="${i === lines.length - 1 ? VOLT : PAPER}">${l}</text>`).join("");
  const rule = `<rect x="64" y="${260 + lines.length * fs * 0.98 - fs * 0.6}" width="120" height="8" rx="4" fill="${VIOLET}"/>`;
  return svg(A, txt + rule + product(slug, A, 780, 820, 0.82) + tag(dark), bg);
}

// Point (in drawing coordinates) the zoom lens focuses on.
const FOCUS = {
  "3-in-1-charging-station": [150, -110], "aluminium-laptop-stand": [60, 60], "levitating-racing-display": [-20, 40],
  "fluorescent-orb-lamp": [-60, -120], "sculptural-wireless-speaker": [0, 150], "trackable-tripod-wallet": [100, 125],
  "self-heating-coffee-mug": [0, 180], "sonic-audio-glasses": [-260, -50], "display-charging-cable": [-20, -75],
  "smartphone-controlled-airplane": [0, -230], "rgb-cloud-lamp": [-80, -40], "retro-bluetooth-radio": [150, -100],
  "touch-control-bar": [180, -31], "electric-fabric-shaver": [0, -150], "inkless-photo-label-printer": [0, -260],
  "compact-power-bank": [0, 140], "modular-magnetic-power-bank": [-40, 10], "glow-earbuds-case": [0, -60],
  "origami-wireless-mouse": [10, -110], "literary-quote-clock": [-60, 0], "led-flashlight-gloves": [-35, -254],
  "electric-heated-gloves": [0, -150], "sculptural-charging-stand": [60, -40], "surface-conduction-speaker": [0, -60],
};
function detail(slug, A) {
  const [fx, fy] = FOCUS[slug] || [0, 0];
  const bg = `<rect width="${S}" height="${S}" fill="#E9EAE5"/>
    <g stroke="${INK}" stroke-opacity=".06">${[...Array(25)].map((_, i) => `<path d="M${i * 50},0 V${S} M0,${i * 50} H${S}"/>`).join("")}</g>`;
  const dim = `<g stroke="${INK}" stroke-width="3" fill="${INK}" font-family="Geist Mono, ui-monospace, Menlo, monospace" font-size="26">
    <path d="M200,1010 H760 M200,990 V1030 M760,990 V1030"/><text x="480" y="1070" text-anchor="middle" stroke="none">W — TBC</text>
    <path d="M110,260 V880 M90,260 H130 M90,880 H130"/><text x="80" y="570" text-anchor="middle" stroke="none" transform="rotate(-90 80 570)">H — TBC</text></g>`;
  const lens = `<defs><clipPath id="lensClip"><circle cx="940" cy="330" r="190"/></clipPath></defs>
    <circle cx="940" cy="330" r="196" fill="#fff"/>
    <g clip-path="url(#lensClip)"><rect x="740" y="130" width="400" height="400" fill="#F6F7F3"/>${product(slug, A, 940 - fx * 1.9, 330 - fy * 1.9, 1.9)}</g>
    <circle cx="940" cy="330" r="196" fill="none" stroke="${INK}" stroke-width="6"/>
    <path d="M800,470 L620,560" stroke="${INK}" stroke-width="3" stroke-dasharray="8 8"/><circle cx="620" cy="560" r="10" fill="${VIOLET}"/>`;
  const note = `<text x="${S - 64}" y="1150" text-anchor="end" font-family="Geist Mono, ui-monospace, Menlo, monospace" font-size="20" fill="#5C626C">DIMENSIONS PENDING SUPPLIER CONFIRMATION</text>`;
  return svg(A, product(slug, A, 480, 600, 0.95) + dim + lens + note + `<text x="64" y="96" font-family="Space Grotesk, Arial, sans-serif" font-weight="700" font-size="30" letter-spacing="4" fill="${INK}" opacity=".85">IMPULSIFY</text>`, bg);
}

function lifestyle(slug, A, hues) {
  const bg = `<rect width="${S}" height="${S}" fill="#1B1E24"/>
    <rect width="${S}" height="760" fill="url(#lsWall)"/>
    <rect y="760" width="${S}" height="440" fill="#2B2620"/><rect y="760" width="${S}" height="18" fill="#3A332B"/>
    <rect x="90" y="610" width="70" height="150" rx="8" fill="#3A3F48"/><path d="M125,610 C60,470 90,420 125,380 C160,420 190,470 125,610Z" fill="#4E7A45"/>
    <rect x="930" y="690" width="200" height="34" rx="4" fill="${VIOLET}"/><rect x="950" y="656" width="170" height="34" rx="4" fill="#E9EAE5"/><rect x="940" y="724" width="190" height="36" rx="4" fill="#5C626C"/>
    <defs><linearGradient id="lsWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(A, -0.72)}"/><stop offset="1" stop-color="#22252C"/></linearGradient></defs>
    <circle cx="600" cy="520" r="420" fill="url(#gHalo)" opacity=".7"/>`;
  let body;
  if (hues.length > 1) {
    const n = hues.length, sc = n === 2 ? 0.62 : 0.48;
    body = hues.map((h, i) => {
      const x = 600 + (i - (n - 1) / 2) * (n === 2 ? 380 : 340);
      return `<defs><filter id="hue${i}"><feColorMatrix type="hueRotate" values="${h}"/></filter></defs><g filter="url(#hue${i})">${product(slug, A, x, 640, sc)}</g>`;
    }).join("");
    body += `<text x="600" y="1060" text-anchor="middle" font-family="Geist Mono, ui-monospace, Menlo, monospace" font-size="24" letter-spacing="2" fill="#A6ABB3">OPTIONS SHOWN ARE INDICATIVE</text>`;
  } else body = product(slug, A, 560, 600, 0.82);
  return svg(A, body + tag(true), bg);
}

// ---- briefs for real photography / AI generation ----
const brief = {
  hook: (n, h) => `Commercial product photograph of the ${n}: ${h}. Dark graphite (#111318) studio set, single hard key light plus soft rim, subtle lime (#C7FF46) or violet (#8A76FF) accent glow, 1:1, product centred with generous negative space, no logos, no text, no watermarks.`,
  "in-action": (n, a) => `Lifestyle photograph: ${a}. Natural window light, realistic hand anatomy and correct product scale, Indian urban setting, shallow depth of field, 1:1, no logos or brand names.`,
  benefit: (n, l) => `Infographic layout: headline "${l}" set in Space Grotesk 800 on #111318, product cut-out bottom-right, single violet rule; only verified claims; 1:1.`,
  detail: (n) => `Macro detail photograph of the ${n}: materials, ports, buttons and mechanisms in raking light on #E9EAE5, plus an in-hand scale shot; add dimension callouts only once supplier dimensions are confirmed.`,
  lifestyle: (n) => `Lifestyle scene with the ${n} on a styled desk or shelf (Indian home or dorm), warm evening light, show only confirmed colour variants and included accessories, 1:1.`,
};

const ROLES = [
  ["01-hook", "hook"], ["02-in-action", "in-action"], ["03-benefit", "benefit"], ["04-detail", "detail"], ["05-lifestyle", "lifestyle"],
];

const manifest = {};
for (const [slug, name, A, line, hookB, actB, hues] of P) {
  if (!drawings[slug]) throw new Error(`No drawing for ${slug}`);
  const dir = join(OUT, slug);
  mkdirSync(dir, { recursive: true });
  const files = {
    hook: hook(slug, A),
    "in-action": inAction(slug, A),
    benefit: benefit(slug, A, line),
    detail: detail(slug, A),
    lifestyle: lifestyle(slug, A, hues),
  };
  manifest[slug] = ROLES.map(([file, role]) => {
    writeFileSync(join(dir, `${file}.svg`), files[role].replace(/\n\s+/g, "\n"));
    const alt = {
      hook: `Concept illustration of the ${name}: ${hookB}`,
      "in-action": `Concept illustration of the ${name} in use: ${actB}`,
      benefit: `Infographic reading "${line}" alongside the ${name}`,
      detail: `Close-up concept view of the ${name} with dimension guides (dimensions pending confirmation)`,
      lifestyle: hues.length > 1 ? `The ${name} shown in indicative colour options on a desk` : `Lifestyle concept scene with the ${name} on a desk`,
    }[role];
    return {
      src: `/images/products/${slug}/${file}-800.webp`,
      master: `assets/masters/${slug}/${file}.svg`,
      role,
      alt,
      width: S,
      height: S,
      source: "concept",
      status: "concept-placeholder: replace with art-directed photography before launch",
      photoBrief: brief[role](name, role === "hook" ? hookB : role === "in-action" ? actB : line),
    };
  });
}
mkdirSync(dirname(MANIFEST), { recursive: true });
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Generated ${Object.keys(manifest).length * 5} concept images for ${Object.keys(manifest).length} products.`);
