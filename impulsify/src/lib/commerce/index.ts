import { mockAdapter } from "./mock";
import { shopifyAdapter, shopifyConfigured } from "./shopify";
import type { CommerceAdapter } from "./types";

/** Active adapter: Shopify when its env vars are set, otherwise the local mock. */
export const commerce: CommerceAdapter = shopifyConfigured ? shopifyAdapter : mockAdapter;
export const isDemoCheckout = !shopifyConfigured;
export * from "./types";
