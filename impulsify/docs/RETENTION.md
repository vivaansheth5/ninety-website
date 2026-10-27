# Retention-ready components (not connected)

None of these send or store data yet. Each one is a UI seam for a provider.

| Component | Where | Connect to |
|---|---|---|
| Newsletter signup | `components/home/Newsletter.tsx` | Shopify Customer API (`customerCreate` with `acceptsMarketing`) or Shopify Email / Klaviyo / similar. Replace the `notice` branch with the API call, and add consent text as required by the DPDP Act. |
| Wishlist | `lib/store.ts` (`wishlist`, localStorage) | Optional: sync to customer metafields after login. |
| Back-in-stock | `ProductCard` / `ProductHero` show "Sold out" when `availability === "sold_out"` | Add a notify form posting to a back-in-stock app; the sold-out state comes from Shopify availability. |
| Cart recovery | Shopify hosted checkout | Shopify's abandoned-checkout emails work once checkout is live. Earlier recovery needs cart sync (see SHOPIFY.md). |
| Recommendations | "You might also want" (related by shared category) and empty-cart suggestions | Swap in Shopify `productRecommendations(productId)` inside the adapter. |
| Post-purchase cross-sell | n/a (on Shopify's thank-you page) | Shopify checkout extensibility / post-purchase apps. |
| Reviews | `components/product/Reviews.tsx` renders only real reviews | A Shopify review app; map its data to `Review[]`. Add `aggregateRating` schema only from real data. |
