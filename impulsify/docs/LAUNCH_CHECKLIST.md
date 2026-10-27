# Production launch checklist

## Content & accuracy
- [ ] Work through `docs/SUPPLIER_VERIFICATION.md`: confirm specs, compatibility, package contents and variants for all 32 products.
- [ ] Replace all 160 concept images with real photography (`docs/IMAGES.md`).
- [ ] Set real prices (in Shopify), then set `site.pricesConfirmed = true` in `src/lib/site.ts` to show "Under ₹999".
- [ ] Confirm plug types and electrical safety certifications (BIS where applicable) for chargers, power banks, the hair tool, heated items and lamps.
- [ ] Remove or confirm any claim still marked "pending".

## Legal & policies
- [ ] Complete every `[bracketed]` item in `src/data/policies.ts` (shipping, returns, privacy, terms, payments) and have them reviewed (Consumer Protection (E-Commerce) Rules 2020, DPDP Act 2023).
- [ ] Add the legal business name, address, GSTIN and grievance officer details.
- [ ] Replace placeholder contact details in `src/lib/site.ts` (`contact.placeholder = false`).

## Commerce
- [ ] Follow `docs/SHOPIFY.md`: products with matching handles, payments, guest checkout, shipping, taxes.
- [ ] Set the env vars on the host and run a real test order end-to-end.
- [ ] Owner Shopify account has 2FA; staff accounts have least-privilege permissions.

## Technical
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the production domain (canonical URLs, sitemap, Open Graph).
- [ ] `npm run lint && npm run typecheck && npm run build`
- [ ] `npm start` then `npm run test:e2e`, with all checks passing.
- [ ] Lighthouse mobile on the deployed URL for `/`, `/products`, a product page and a collection page (target ≥80 performance); check PageSpeed Insights field data after launch.
- [ ] Submit `sitemap.xml` in Google Search Console.
- [ ] If a private preview is needed: hosting-level protection (Vercel Deployment Protection / Cloudflare Access), removed at launch.
- [ ] Add analytics only with consent handling, and re-run Lighthouse afterwards.

## Retention (optional)
- [ ] Connect the newsletter, back-in-stock and reviews providers (`docs/RETENTION.md`).
