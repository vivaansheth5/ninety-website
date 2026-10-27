import type { CategoryId } from "@/lib/commerce/types";

/**
 * Authoring format for catalog copy. `null` spec values render as
 * "Pending supplier confirmation" and are excluded from structured data.
 */
export interface ProductDraft {
  slug: string;
  name: string;
  categories: CategoryId[];
  headline: string;
  benefit: string;
  short: string;
  description: string[];
  features: string[];
  howToUse: string[];
  included: string[];
  compatibility: string | null;
  specs: [label: string, value: string | null][];
  faq: [q: string, a: string][];
  /** Placeholder INR price until the owner confirms selling prices. */
  price: number;
  accent: string;
  launch?: boolean;
  trending?: boolean;
  gift?: boolean;
  option?: { name: string; values: { title: string; hue?: number; swatch?: string }[] };
  pending: string[];
  tags: string[];
}

export const PENDING = "Pending supplier confirmation";

/** Spec rows every product should eventually have. */
export const baseSpecs = (extra: [string, string | null][] = []): [string, string | null][] => [
  ...extra,
  ["Dimensions", null],
  ["Weight", null],
  ["Materials", null],
  ["Warranty", null],
];
