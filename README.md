# Ninety+

Premium football streetwear ecommerce site. React (Vite) frontend + a security-hardened Express backend, served together from a single process on **localhost:8083**.

## Stack

- **Frontend:** React 18, React Router, Tailwind CSS, Framer Motion
- **Backend:** Express, better-sqlite3 (order persistence), Razorpay SDK
- **Dev/prod serving:** one Express process on port 8083. In development it mounts Vite in middleware mode (HMR over the same port); in production it serves the static `dist/` build. There is no separate frontend dev server/port to juggle.

## Getting started

```bash
npm install
cp .env.example .env
# edit .env — at minimum set RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET (test keys
# from https://dashboard.razorpay.com/app/keys) and a random CSRF_SECRET:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

npm run dev
# → http://localhost:8083
```

Production build:

```bash
npm run build
npm start
```

## Project structure

```
server/                 Express API — the only place prices/orders are trusted
  data/products.js       Product catalog (source of truth for pricing)
  data/db.js              better-sqlite3 order store
  routes/                 products, orders, payment
  middleware/csrf.js       double-submit-cookie CSRF protection
  utils/razorpayClient.js
src/                     React app
  components/
    OpeningAnimation/     the bicycle-kick splash (see below)
    Nav, Collections, Reviews, History, Hero
  pages/                  Home, Collections, History, Cart
  context/CartContext.jsx localStorage-backed cart state
  data/                   display copy (products, history, reviews)
  lib/                    api client, Razorpay script loader
```

## Adding / replacing products

Products are intentionally split into two files that must stay in sync by `id`:

- `server/data/products.js` — the **only** place price is trusted. The client
  never sends a price; every order is re-priced from this file.
- `src/data/products.js` — display copy (name, blurb, accent colors, image path).

To add a product: add an entry to both files with the same `id`, then drop a
photo at `public/products/<id>.jpg` (falls back to a generated placeholder
plate if no photo exists yet — nothing breaks in the meantime).

## History timeline

`src/data/history.js` holds the chronological moments (1970 Pelé → 2022
Messi) sourced from the brand's moments document. `image: null` entries fall
back to a generated plate; drop a photo at `public/history/<id>.jpg` to
replace it.

## The opening animation

`src/components/OpeningAnimation/scene.js` is a framework-agnostic port of
the brand's bicycle-kick biomechanics study: a 19-joint rig, projected
through a hand-rolled perspective camera, drawn as depth-sorted SVG capsules
— no video, no 3D engine. `OpeningAnimation.jsx` drives it off
`requestAnimationFrame`, `Readouts.jsx` renders the live physics readouts,
`RevealLayer.jsx` handles the shockwave/logo reveal. It plays once per
session (`sessionStorage`) and is skipped for `prefers-reduced-motion`.

The exact authored joint coordinates from the original design file weren't
available in this handoff — only its written spec (timing, camera keyframes,
shading formula, bone radii). The pose data here is an original, faithful
reconstruction from that spec; swap `POSES` in `scene.js` if the real
coordinates become available. The wordmark is currently rendered as styled
type rather than the vector logo asset referenced in the design handoff —
swap `RevealLogo` in `RevealLayer.jsx` for an `<img>` once that SVG exists.

## Payments (Razorpay)

Flow, entirely server-verified:

1. Client sends `{ items: [{id, qty, size}] }` (no prices) to `POST /api/orders`.
2. Server re-prices from `server/data/products.js`, creates a Razorpay order, stores it in SQLite as `created`.
3. Client opens Razorpay Checkout with the returned `orderId`/`amount`/`keyId`.
4. On success, client posts the three `razorpay_*` fields to `POST /api/payment/verify`.
5. Server recomputes the HMAC signature from `RAZORPAY_KEY_SECRET` and only then marks the order `paid`.
6. Optional `POST /api/payment/webhook` (needs `RAZORPAY_WEBHOOK_SECRET` set + configured in the Razorpay dashboard) reconciles orders whose in-browser `/verify` call never landed (closed tab, dropped connection).

No card data ever touches this server — Razorpay Checkout handles that entirely; we only ever see order/payment ids and the signature.

## Security notes

- **Server-side pricing.** Orders are priced exclusively from `server/data/products.js`; client-sent prices are never read.
- **Signature verification.** Payments are marked paid only after recomputing the Razorpay HMAC signature server-side with a constant-time comparison.
- **CSRF.** Double-submit-cookie token (`/api/csrf-token`) required on every state-changing POST.
- **CORS.** Locked to `APP_ORIGIN` (defaults to `http://localhost:8083`), credentials-aware.
- **Headers.** `helmet` with a strict CSP in production (only `self` + `checkout.razorpay.com`/`api.razorpay.com`); relaxed only in dev so Vite's HMR client can run.
- **Rate limiting.** Per-route limits on order creation and payment verification, plus a global `/api` limiter.
- **Validation.** All request bodies validated with `zod`; unknown fields are stripped, not trusted.
- **Cookies.** `SameSite=Strict`, `Secure` in production.
- **Errors.** Generic JSON errors to the client; details only in server logs — no stack traces leak out.
- **No secrets in the frontend.** `RAZORPAY_KEY_SECRET`, `CSRF_SECRET`, and `RAZORPAY_WEBHOOK_SECRET` only ever exist in `server/`, read from `process.env`. Only the public `RAZORPAY_KEY_ID` reaches the browser (Razorpay's key ids are designed to be public — they can't authorize a charge without the secret).

### Known dependency note

`npm audit` currently flags `react-router-dom`'s transitive `react-router` for an open-redirect advisory that only applies when an app renders a user-controlled value into `<Link to>`/`useNavigate` or uses the SSR data APIs — neither of which this app does (every route is static, and there's no SSR). The fix requires the v7 major, which is a breaking API change; noting it here rather than silently upgrading. Re-evaluate if a future feature ever redirects based on user input.

## Environment variables

See `.env.example`. Never commit `.env`.
