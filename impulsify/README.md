# IMPULSIFY

**Things You Didn't Know You Needed.** A mobile-first, frontend-only gadget storefront for India, ready to connect to Shopify.

- Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Motion (overlays only) · Lucide icons
- 32 products, 32 static product pages, 9 collections, search, filters, wishlist, persistent cart
- 160 product images (32 × 5 roles) as responsive AVIF/WebP. **These are concept illustrations, not product photography** (see [Images](#images))
- No backend, no database, no payment code. Checkout goes to Shopify's hosted checkout once connected, and runs in an honest demo mode until then

---

## Quick start

```bash
cd impulsify
npm install
cp .env.example .env.local     # optional: leave Shopify vars blank for demo mode
npm run dev                    # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

| Script | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Next.js dev server / production build / production server |
| `npm run lint` · `npm run typecheck` | ESLint · TypeScript |
| `npm run images:concepts` | Regenerates the 160 vector concept masters in `assets/masters/` and the manifest |
| `npm run images:optimize` | Exports every master to `public/images/products/<slug>/0N-role-{400,800,1200}.{avif,webp}` plus blur placeholders (a photo master always wins over concept art) |
| `npm run test:e2e` | Smoke test against a running server: 56 routes, 160 images, overflow at 7 widths, console errors, cart, search, filters, variants, Buy Now, wishlist, menus, reduced motion. Set `BASE_URL` if it isn't `http://localhost:3000` |

## Project structure

```
impulsify/
├─ assets/masters/<slug>/0N-<role>.svg   high-res masters (replace with photos ≥1200px)
├─ public/images/products/<slug>/        generated AVIF/WebP web variants (400/800/1200)
├─ scripts/                              image generation/optimisation, smoke test, fonts for rendering
├─ docs/                                 Shopify, images, retention, design, launch checklist, verification list
└─ src/
   ├─ app/                               routes (home, products, collections, trending, wishlist, about, faq, contact, policies, sitemap, robots)
   │  └─ actions/checkout.ts             server action → commerce adapter → hosted checkout URL (or demo)
   ├─ components/{layout,home,product,cart,ui}
   ├─ data/                              catalog copy (products-a/b.ts), categories, policies, FAQ, image-manifest.json
   └─ lib/
      ├─ commerce/                       adapter interface + mock + Shopify Storefront implementations
      ├─ store.ts                        tiny client store: cart, wishlist, overlays (localStorage)
      └─ images.ts · search.ts · site.ts · format.ts
```

## Commerce architecture

All UI talks to one interface, `CommerceAdapter` (`src/lib/commerce/types.ts`):

`getProducts()` · `getProductByHandle()` · `getCollections()` · `createCart()` · `addCartLines()` · `updateCartLines()` · `removeCartLines()` · `getCheckoutUrl()`

- **Mock adapter** (default): local catalog, and checkout returns "demo". The cart drawer and Buy Now then explain that no order was placed and no payment was taken. There is no fake success screen and no fake payment UI.
- **Shopify adapter**: turns on automatically when `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` and `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` are set. Shopify supplies price, availability, variant IDs, cart and the hosted checkout URL. Editorial content (copy, galleries, specs) stays in this repo, and products are matched by handle (Shopify handle = local slug).

The browser cart stores display snapshots in `localStorage`, so it works instantly and needs no catalog in the client bundle. At checkout, the server action `startCheckout` creates a Shopify cart from those lines and redirects to `checkoutUrl`. Full guide: [docs/SHOPIFY.md](docs/SHOPIFY.md).

## Security and ownership

- The storefront is public. All merchant control (products, prices, payments, payouts, staff accounts) lives in the **Shopify admin**, protected by the owner's Shopify login and 2FA.
- This repo only ever holds the **public** Storefront API token, which Shopify designs for browser use (it can read products and create carts). Never put Admin API tokens, payment keys, UPI IDs or bank details in env vars, code or commits.
- Payments happen on Shopify's hosted checkout. This site never sees card, UPI or bank data.
- For a private pre-launch preview, use **hosting-level protection** (e.g. Vercel Deployment Protection / password protection, or Cloudflare Access), not a frontend password screen.

## Images

There was no image-generation tool available while building this, so instead of broken placeholders the project ships a **complete, consistent concept-art library**: a procedural vector illustration per product composed into the five required roles (Hook, In action, Benefit, Detail & scale, Lifestyle / variants). Every image carries a small "CONCEPT ART" mark, and its manifest entry has `source: "concept"`, alt text, and a **photography brief** for the real shoot or AI generation.

**These are not photographs and do not depict verified supplier inventory.** To swap in real photography, add a master (≥1200×1200) at `assets/masters/<slug>/0N-<role>.jpg|png|webp|avif`, then run `npm run images:optimize`. Details: [docs/IMAGES.md](docs/IMAGES.md).

## Honesty rules built into the data

- Specs without verified values render as *"Pending supplier confirmation"* and are excluded from structured data. See [docs/SUPPLIER_VERIFICATION.md](docs/SUPPLIER_VERIFICATION.md) for the full per-product list.
- Prices are **indicative placeholders** (`priceConfirmed: false`). The "Under ₹999" homepage section stays hidden until `site.pricesConfirmed` is true. Product schema omits `offers` until prices are real.
- No compare-at prices, reviews, ratings, purchase counts, countdowns or stock counts are invented. The reviews component renders only when real reviews exist.
- Variant options (colours, sizes, connectors) are marked "indicative until confirmed".
- Policy pages are templates with `[bracketed]` items for the owner to complete.

## Performance (measured)

Lighthouse 12, mobile preset (simulated slow 4G, 4× CPU throttling), local production build (`next start`), 27 Oct 2026:

| Page | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| `/` | 80–91 (3 runs, median 85) | 100 | 100 | 100 | 3.2–3.9 s | 180–330 ms | 0 |
| `/products` | 95 | 100 | 100 | 100 | 2.7 s | 150 ms | 0 |
| `/products/glow-earbuds-case` | 97 | 100 | 100 | 100 | 2.4 s | 150 ms | 0 |
| `/collections/desk-setup` | 95 | 100 | 100 | 100 | 2.6 s | 140 ms | 0 |

Re-measure on the real production deployment (CDN, HTTP/2, real TTFB), and again after adding Shopify, analytics or any third-party script. Simulated LCP is still above the 2.5 s target on the homepage and borderline elsewhere; real-device field data (CrUX / PageSpeed Insights) is the number that matters.

What keeps it fast:
- Every page is statically generated. Product cards are server components; only the heart and quick-add buttons hydrate.
- Images are pre-optimised AVIF/WebP with `srcset`/`sizes`, lazy below the fold, and preloaded at high priority for the LCP image. Typical card image: 2–5 KB.
- Self-hosted fonts subset to Latin + ₹ (≈63 KB total).
- Cart, search and the mobile menu are code-split and load the first time they're opened. Motion is only used inside them.
- Effects (reveal, spotlight, magnetic buttons, parallax) share one set of delegated listeners. Animations pause off-screen and in hidden tabs. Scroll-reveal never hides above-the-fold content. `prefers-reduced-motion` disables motion.

## Deployment

**Vercel (recommended):** import the repo, set **Root Directory** to `impulsify`, add the env vars from `.env.example` (at least `NEXT_PUBLIC_SITE_URL`) and deploy. No other config is needed.

Any Node host works too: `npm ci && npm run build && npm start` (Node 18.18+; 20+ recommended).

## Known limitations

- **Imagery is concept art.** The 160 images still need real product photography (briefs are in the manifest).
- **Product facts are largely unverified.** Specs, compatibility, package contents and variants are pending supplier confirmation, so descriptions are shorter than 200–400 words where the facts aren't known yet.
- **Prices are placeholders.**
- **Shopify adapter is untested against a live store**, since no store credentials were available. It follows the Storefront API cart shape and should be verified end-to-end with a development store.
- The newsletter and back-in-stock flows are UI only and store nothing (see [docs/RETENTION.md](docs/RETENTION.md)).
- Reviews are not shown because none exist yet.
- Contact details are placeholders.
- The reference sites in the brief were not browsed live during this build. The design draws on general knowledge of those patterns (see [docs/DESIGN.md](docs/DESIGN.md)).

## Launch checklist

See [docs/LAUNCH_CHECKLIST.md](docs/LAUNCH_CHECKLIST.md).
