import { categories } from "@/data/categories";
import { products as localProducts } from "@/data/catalog";
import type { Availability, Cart, CartLineInput, CartLineUpdate, CommerceAdapter, Product } from "./types";

/**
 * Shopify Storefront API adapter (hybrid model).
 *
 * - Editorial content (copy, five-image galleries, specs) stays in this repo.
 * - Shopify is the source of truth for price, availability, variant IDs, cart and checkout.
 * - Products are matched by handle: the Shopify product handle must equal the local slug.
 *
 * Uses the PUBLIC Storefront access token, which Shopify designs for browser use.
 * Never put Admin API tokens or payment credentials in NEXT_PUBLIC_* variables.
 */
const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
const version = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || "2025-07";

export const shopifyConfigured = Boolean(domain && token);

async function storefront<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!shopifyConfigured) throw new Error("Shopify is not configured");
  const res = await fetch(`https://${domain}/api/${version}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": token! },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 300 },
  } as RequestInit);
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error(`Shopify error: ${JSON.stringify(json.errors ?? res.status)}`);
  return json.data as T;
}

type SfVariant = { id: string; title: string; availableForSale: boolean; price: { amount: string } };
type SfProduct = { id: string; handle: string; variants: { nodes: SfVariant[] } };

const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($first: Int!) {
    products(first: $first) {
      nodes { id handle variants(first: 20) { nodes { id title availableForSale price { amount } } } }
    }
  }`;

const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id checkoutUrl
    lines(first: 100) { nodes { id quantity merchandise { ... on ProductVariant { id product { handle } } } } }
  }`;

type SfCart = {
  id: string;
  checkoutUrl: string;
  lines: { nodes: { id: string; quantity: number; merchandise: { id: string; product: { handle: string } } }[] };
};

function mergeProduct(local: Product, sf?: SfProduct): Product {
  if (!sf) return local;
  const variants = local.variants.map((v, i) => {
    const match = sf.variants.nodes.find((n) => n.title === v.title) ?? sf.variants.nodes[i];
    if (!match) return v;
    const availability: Availability = match.availableForSale ? "available" : "sold_out";
    return { ...v, shopifyVariantId: match.id, availability, price: { amount: Math.round(+match.price.amount), currencyCode: "INR" as const } };
  });
  return {
    ...local,
    shopifyProductId: sf.id,
    variants,
    price: variants[0].price,
    priceConfirmed: true,
    availability: variants.some((v) => v.availability === "available") ? "available" : "sold_out",
  };
}

const toVariantGid = (localVariantId: string) => {
  for (const p of localProducts) {
    const v = p.variants.find((x) => x.id === localVariantId);
    if (v) return v.shopifyVariantId;
  }
  return null;
};

function toCart(c: SfCart, all: Product[]): Cart {
  return {
    id: c.id,
    checkoutUrl: c.checkoutUrl,
    lines: c.lines.nodes.map((n) => {
      const p = all.find((x) => x.slug === n.merchandise.product.handle);
      const v = p?.variants.find((x) => x.shopifyVariantId === n.merchandise.id);
      return { id: n.id, productSlug: n.merchandise.product.handle, variantId: v?.id ?? n.merchandise.id, quantity: n.quantity };
    }),
  };
}

export const shopifyAdapter: CommerceAdapter = {
  name: "shopify",
  async getProducts() {
    const data = await storefront<{ products: { nodes: SfProduct[] } }>(PRODUCTS_QUERY, { first: 100 });
    return localProducts.map((p) => mergeProduct(p, data.products.nodes.find((n) => n.handle === p.slug)));
  },
  async getProductByHandle(handle) {
    const all = await this.getProducts();
    return all.find((p) => p.slug === handle) ?? null;
  },
  async getCollections() {
    return categories; // map to Shopify collections with the same handles when created
  },
  async createCart(lines: CartLineInput[] = []) {
    const all = await this.getProducts();
    const sfLines = lines.map((l) => ({ merchandiseId: all.flatMap((p) => p.variants).find((v) => v.id === l.variantId)?.shopifyVariantId, quantity: l.quantity }));
    if (sfLines.some((l) => !l.merchandiseId)) throw new Error("A cart item has no Shopify variant ID yet");
    const data = await storefront<{ cartCreate: { cart: SfCart } }>(
      `mutation($lines: [CartLineInput!]) { cartCreate(input: { lines: $lines }) { cart { ...CartFields } userErrors { message } } } ${CART_FRAGMENT}`,
      { lines: sfLines },
    );
    return toCart(data.cartCreate.cart, all);
  },
  async addCartLines(cartId, lines) {
    const all = await this.getProducts();
    const data = await storefront<{ cartLinesAdd: { cart: SfCart } }>(
      `mutation($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...CartFields } } } ${CART_FRAGMENT}`,
      { cartId, lines: lines.map((l) => ({ merchandiseId: toVariantGid(l.variantId), quantity: l.quantity })) },
    );
    return toCart(data.cartLinesAdd.cart, all);
  },
  async updateCartLines(cartId, lines: CartLineUpdate[]) {
    const all = await this.getProducts();
    const data = await storefront<{ cartLinesUpdate: { cart: SfCart } }>(
      `mutation($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ...CartFields } } } ${CART_FRAGMENT}`,
      { cartId, lines },
    );
    return toCart(data.cartLinesUpdate.cart, all);
  },
  async removeCartLines(cartId, lineIds) {
    const all = await this.getProducts();
    const data = await storefront<{ cartLinesRemove: { cart: SfCart } }>(
      `mutation($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ...CartFields } } } ${CART_FRAGMENT}`,
      { cartId, lineIds },
    );
    return toCart(data.cartLinesRemove.cart, all);
  },
  async getCheckoutUrl(cartId) {
    const data = await storefront<{ cart: { checkoutUrl: string } | null }>(`query($id: ID!) { cart(id: $id) { checkoutUrl } }`, { id: cartId });
    return data.cart?.checkoutUrl ?? null;
  },
};
