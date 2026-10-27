/**
 * Helpers for locally optimised product images (see scripts/optimize-images.mjs).
 * Every local product image exists as <base>-{400,800,1200}.{avif,webp}.
 * Client-safe: no manifest import.
 */
export const WIDTHS = [400, 800, 1200] as const;
const RE = /-(400|800|1200)\.(webp|avif)$/;

export const isOptimized = (src: string) => src.startsWith("/images/products/") && RE.test(src);
export const baseOf = (src: string) => src.replace(RE, "");
export const srcSetFor = (src: string, fmt: "avif" | "webp") => WIDTHS.map((w) => `${baseOf(src)}-${w}.${fmt} ${w}w`).join(", ");
/** Small variant for thumbnails (cart, search, menus). */
export const thumb = (src: string) => (isOptimized(src) ? `${baseOf(src)}-400.webp` : src);
