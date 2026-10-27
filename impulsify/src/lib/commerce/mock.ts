import { categories } from "@/data/categories";
import { products } from "@/data/catalog";
import type { Cart, CartLineInput, CartLineUpdate, CommerceAdapter } from "./types";

/**
 * Local adapter for development and preview deployments.
 * Cart state is kept in memory here; the browser cart persists to localStorage
 * (see components/cart/CartProvider). Checkout returns null => demo state.
 */
const carts = new Map<string, Cart>();
const uid = () => Math.random().toString(36).slice(2, 10);

function merge(cart: Cart, lines: CartLineInput[]): Cart {
  const next = { ...cart, lines: [...cart.lines] };
  for (const l of lines) {
    const existing = next.lines.find((x) => x.variantId === l.variantId);
    if (existing) existing.quantity += l.quantity;
    else next.lines.push({ id: `line-${uid()}`, ...l });
  }
  return next;
}

export const mockAdapter: CommerceAdapter = {
  name: "mock",
  async getProducts() {
    return products;
  },
  async getProductByHandle(handle) {
    return products.find((p) => p.slug === handle) ?? null;
  },
  async getCollections() {
    return categories;
  },
  async createCart(lines = []) {
    const cart = merge({ id: `mock-cart-${uid()}`, lines: [], checkoutUrl: null }, lines);
    carts.set(cart.id, cart);
    return cart;
  },
  async addCartLines(cartId, lines) {
    const cart = merge(carts.get(cartId) ?? { id: cartId, lines: [], checkoutUrl: null }, lines);
    carts.set(cartId, cart);
    return cart;
  },
  async updateCartLines(cartId, updates: CartLineUpdate[]) {
    const cart = carts.get(cartId) ?? { id: cartId, lines: [], checkoutUrl: null };
    const lines = cart.lines
      .map((l) => ({ ...l, quantity: updates.find((u) => u.id === l.id)?.quantity ?? l.quantity }))
      .filter((l) => l.quantity > 0);
    const next = { ...cart, lines };
    carts.set(cartId, next);
    return next;
  },
  async removeCartLines(cartId, lineIds) {
    const cart = carts.get(cartId) ?? { id: cartId, lines: [], checkoutUrl: null };
    const next = { ...cart, lines: cart.lines.filter((l) => !lineIds.includes(l.id)) };
    carts.set(cartId, next);
    return next;
  },
  async getCheckoutUrl() {
    return null; // no real checkout in mock mode
  },
};
