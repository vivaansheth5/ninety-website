"use server";

import { commerce } from "@/lib/commerce";

export type CheckoutResult = { ok: true; url: string } | { ok: false; demo: true } | { ok: false; demo: false; error: string };

/**
 * Creates a cart with the commerce adapter and returns its hosted checkout URL.
 * In demo mode (no Shopify env vars) this returns { demo: true } — no payment
 * is ever processed by this site.
 */
export async function startCheckout(lines: { productSlug: string; variantId: string; quantity: number }[]): Promise<CheckoutResult> {
  if (!Array.isArray(lines) || lines.length === 0 || lines.length > 50) return { ok: false, demo: false, error: "Your cart is empty." };
  const clean = lines
    .filter((l) => typeof l.variantId === "string" && typeof l.productSlug === "string")
    .map((l) => ({ productSlug: l.productSlug, variantId: l.variantId, quantity: Math.max(1, Math.min(10, Math.floor(Number(l.quantity) || 1))) }));
  if (commerce.name === "mock") return { ok: false, demo: true };
  try {
    const cart = await commerce.createCart(clean);
    const url = cart.checkoutUrl ?? (await commerce.getCheckoutUrl(cart.id));
    return url ? { ok: true, url } : { ok: false, demo: false, error: "Checkout is unavailable right now." };
  } catch {
    return { ok: false, demo: false, error: "We couldn't start checkout. Please try again." };
  }
}
