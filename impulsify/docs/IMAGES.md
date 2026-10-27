# Product image system

## Five roles per product (32 × 5 = 160)

| File | Role | Used as |
|---|---|---|
| `01-hook` | The surprising feature (glow, levitation, flight…) | Card, hero, search, menus, LCP image |
| `02-in-action` | A person using it | Card hover image, gallery |
| `03-benefit` | One verified benefit headline + product | Gallery |
| `04-detail` | Close-up, controls, dimensions (marked TBC) | Gallery |
| `05-lifestyle` | In a setting; indicative variants where they exist | Gallery |

## Current status: concept art

No image-generation tool was available during the build, so the library is **procedural vector concept art** (`scripts/products-art.mjs` draws each product; `scripts/generate-concept-images.mjs` composes the five roles). Each image is marked "CONCEPT ART", and its `src/data/image-manifest.json` entry includes:

- `alt`: descriptive alt text
- `source: "concept"` and `status`: the replacement requirement
- `photoBrief`: an art-direction brief for the real shoot or AI generation (lighting, set, palette, what to show, and "no logos / only verified claims")

Concept images are excluded from Product structured data.

## Replacing with photography

1. Shoot or generate a master of at least **1200×1200**, square, with no manufacturer logos, watermarks or invented features.
2. Save it as `assets/masters/<slug>/0N-<role>.jpg` (or png/webp/avif) next to the SVG.
3. Run `npm run images:optimize` (or `node scripts/optimize-images.mjs <slug>` for one product).
4. The script exports `400/800/1200` AVIF + WebP, a 16 px blur placeholder, sets `source: "photo"` and warns if a master is under 1200 px.
5. Update the `alt` text in the manifest if the photo differs from the brief.

## Delivery

`<picture>`: AVIF `srcset`, then WebP `srcset` with `sizes`. Lazy-loaded below the fold. The LCP image uses `fetchpriority="high"` plus a `<link rel=preload>`. Galleries load the first image eagerly and the rest lazily. Thumbnails (cart, search, menus) use the 400 px WebP. Remote Shopify CDN images fall back to `next/image`.

Typical sizes for the concept set: 2–5 KB (400 px) and 5–10 KB (800 px). Expect 30–120 KB per 800 px photo.
