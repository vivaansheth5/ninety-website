# Design system & motion notes

## Research note
The reference sites in the brief (nike-tiempo.vercel.app, Awwwards, Apple, Nothing, Cuberto, Lusion, Active Theory) were **not browsed live** during this build. The patterns below come from general, well-documented knowledge of premium product and motion sites, adapted for a fast mobile store.

## Tokens
- Colour: Midnight `#111318`, Volt `#C7FF46` (primary action, highlights), Violet `#8A76FF` (secondary, wishlist, focus accents), Soft White `#F6F7F3` (light shopping sections), Graphite `#202329`, Near White `#F8F9FA`, Cool Gray `#A6ABB3`.
- Rhythm: dark spectacle sections alternate with light shopping sections, punctuated by volt/violet kinetic marquees.
- Type: Space Grotesk (display, tight −0.055em tracking, uppercase section heads), Geist (body/UI), Geist Mono (labels, eyebrows). All self-hosted and subset.
- Shape: 18 px card radius, pill buttons ≥48 px tall, 44 px minimum tap targets.
- Breakpoints: 390 (xs), 640, 768, 1024 (desktop navigation), 1280, 1440.

## Motion language (see `globals.css`, `useInteractionEffects.ts`)
| Effect | Implementation | Budget |
|---|---|---|
| Kinetic hero headline | CSS word-mask rise | CSS only |
| Floating hero products + pointer/scroll parallax | CSS vars from one rAF listener | Desktop pointer only; stops off-screen |
| Scroll reveals | IntersectionObserver; below-the-fold only | Never delays LCP |
| Magnetic buttons, card spotlight | Delegated pointer listener | Fine pointers only |
| Card hover swap to in-action photo, image zoom | CSS | Not loaded on touch devices |
| Mega menu preview cross-fade, category explorer | CSS transitions | Mounted on hover |
| Scroll-linked horizontal "Look twice" story | Sticky stage plus translateX | Desktop only; native swipe on mobile |
| Cart drawer, search, mobile menu | Motion (LazyMotion `domAnimation`) | Code-split, loaded on first open |
| Variant colour change | CSS `hue-rotate` transition on gallery | Compositor |
| Wishlist and cart badge pops | CSS spring keyframes | n/a |
| Page transitions | CSS fade/rise after first navigation | n/a |
| Glow demo | Inline SVG + CSS | n/a |

No WebGL / Three.js: nothing in the catalog needed real 3D enough to justify the cost on mid-range Android phones. GSAP was left out for the same reason, since CSS and a few small listeners cover the motion with no extra library.
