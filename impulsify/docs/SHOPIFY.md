# Connecting Shopify

The storefront already runs against a Shopify adapter (`src/lib/commerce/shopify.ts`). It switches on automatically once two environment variables are set.

## 1. In the Shopify admin (owner only)

1. Create the store (or use a development store for testing) and turn on **2-step verification** for the owner account.
2. **Products:** create one product per catalog entry. The **product handle must equal the slug** in `src/data/products-*.ts` (for example `glow-earbuds-case`). Variant titles should match the local variant titles (for example `Volt Green`, `Ice Blue`). Single-variant products use Shopify's default variant.
3. **Collections (optional):** create collections with the same handles as `src/data/categories.ts` if you want to manage them in Shopify.
4. **Payments:** Settings → Payments. Choose a payment provider for India (UPI, cards, net banking and so on). Bank and UPI details are entered **only here** and never in this codebase.
5. **Checkout:** Settings → Checkout. Enable guest checkout ("Customers can check out as guests") and add shipping rates, taxes and policies.
6. **Headless channel:** install Shopify's *Headless* sales channel, create a storefront, and copy the **public Storefront API access token**.

## 2. In the hosting environment

```
NEXT_PUBLIC_SITE_URL=https://your-domain.in
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=<public storefront token>
NEXT_PUBLIC_SHOPIFY_API_VERSION=2025-07
```

The public token is designed to be visible in browsers: it can read published products and create carts, nothing more. **Never** use an Admin API token here.

## 3. What changes when connected

| Concern | Mock mode | Shopify mode |
|---|---|---|
| Price, availability, variant IDs | Local placeholders | From Shopify (`mergeProduct`); `priceConfirmed` becomes true |
| Product schema `offers` | Omitted | Included with real price and availability |
| Checkout / Buy Now | Honest "demo mode" notice | `cartCreate`, then redirect to Shopify's hosted `checkoutUrl` |
| Announcement bar | "Preview store…" | "Shipping across India · Secure Shopify checkout" |

Product pages revalidate every 5 minutes (`revalidate = 300`), so price changes in Shopify show up without a redeploy.

## 4. Verify end-to-end before launch

- [ ] Every local slug has a matching Shopify handle (a missing one keeps placeholder data and can't be checked out; the server action returns an error message).
- [ ] Add to cart, then Checkout, lands on Shopify checkout with the right variants and quantities.
- [ ] Buy Now goes to checkout with a single line.
- [ ] A test order (Shopify Payments test mode or the provider's sandbox) completes, and the order appears in the admin.
- [ ] Sold-out variants show "Sold out" and can't be added.

## Optional next steps

- Cart sync: the client cart is local and only becomes a Shopify cart at checkout, which keeps the storefront fast and simple. If you want Shopify's abandoned-checkout emails earlier in the journey, persist a Shopify `cartId` in `src/lib/store.ts` and mirror `addToCart`/`setQuantity`/`remove` into `addCartLines`/`updateCartLines`/`removeCartLines` (already implemented in the adapter).
- Move editorial content into Shopify metafields if non-developers need to edit it. `mergeProduct` is the single place to map them.
