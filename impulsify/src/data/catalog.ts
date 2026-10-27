import type { Product, ProductImage } from "@/lib/commerce/types";
import { PENDING, type ProductDraft } from "./draft";
import manifest from "./image-manifest.json";
import { productsA } from "./products-a";
import { productsB } from "./products-b";

type ManifestEntry = { src: string; role: ProductImage["role"]; alt: string; width: number; height: number; source: ProductImage["source"]; blur?: string };
const imageManifest = manifest as Record<string, ManifestEntry[]>;

function build(d: ProductDraft, index: number): Product {
  const id = `imp-${String(index + 1).padStart(3, "0")}`;
  const price = { amount: d.price, currencyCode: "INR" as const };
  const variants = d.option
    ? d.option.values.map((v, i) => ({
        id: `${id}-v${i + 1}`,
        title: v.title,
        previewHue: v.hue,
        swatch: v.swatch,
        price,
        availability: "available" as const,
        shopifyVariantId: null,
      }))
    : [{ id: `${id}-v1`, title: "Default", price, availability: "available" as const, shopifyVariantId: null }];

  const images = (imageManifest[d.slug] ?? []).map(({ src, role, alt, width, height, source, blur }) => ({ src, role, alt, width, height, source, blur }));
  if (images.length !== 5) throw new Error(`Product ${d.slug} must have exactly 5 images (has ${images.length}). Run npm run images:concepts.`);

  return {
    id,
    slug: d.slug,
    name: d.name,
    categories: d.categories,
    headline: d.headline,
    benefit: d.benefit,
    shortDescription: d.short,
    description: d.description,
    features: d.features,
    howToUse: d.howToUse,
    whatsIncluded: d.included,
    compatibility: d.compatibility,
    specs: d.specs.map(([label, value]) => ({ label, value: value ?? PENDING, verified: value !== null })),
    faq: d.faq.map(([q, a]) => ({ q, a })),
    price,
    compareAtPrice: null, // set only when a genuine previous price exists
    priceConfirmed: false,
    variants,
    variantsConfirmed: false,
    optionName: d.option?.name ?? null,
    images,
    availability: "available",
    tags: d.tags,
    launchPriority: !!d.launch,
    trending: !!d.trending,
    giftable: !!d.gift,
    accent: d.accent,
    reviews: [], // genuine reviews only — none collected yet
    shopifyProductId: null,
    pendingVerification: d.pending,
  };
}

export const products: Product[] = [...productsA, ...productsB].map(build);

/** Priority launch products in the order the brief specifies. */
export const LAUNCH_ORDER = [
  "glow-earbuds-case",
  "smartphone-controlled-airplane",
  "cute-character-charger",
  "levitating-racing-display",
  "trackable-tripod-wallet",
  "rgb-cloud-lamp",
  "inkless-photo-label-printer",
  "interactive-digital-cube",
];
