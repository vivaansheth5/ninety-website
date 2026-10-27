import type { Product } from "./commerce/types";
import { thumb } from "./images";

/** Minimal product shape shipped to client components (search, cart, menus). */
export interface LiteProduct {
  slug: string;
  name: string;
  headline: string;
  price: number;
  image: string;
  imageAlt: string;
  categories: string[];
  tags: string[];
  firstVariantId: string;
  firstVariantTitle: string;
  hasOptions: boolean;
}

export const toLite = (p: Product): LiteProduct => ({
  slug: p.slug,
  name: p.name,
  headline: p.headline,
  price: p.price.amount,
  image: thumb(p.images[0].src),
  imageAlt: p.images[0].alt,
  categories: p.categories,
  tags: p.tags,
  firstVariantId: p.variants[0].id,
  firstVariantTitle: p.variants[0].title,
  hasOptions: p.variants.length > 1,
});
