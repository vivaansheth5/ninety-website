// Commerce domain types. These are deliberately close to the Shopify Storefront API
// shapes so that swapping the mock adapter for Shopify does not touch any UI code.

export type CategoryId =
  | "tech-gadgets"
  | "charging-power"
  | "desk-setup"
  | "audio-speakers"
  | "lifestyle-essentials"
  | "travel-edc"
  | "grooming-care"
  | "lights-decor"
  | "gifts-unusual";

export interface Category {
  id: CategoryId;
  /** URL handle used in /collections/[handle] */
  handle: CategoryId;
  title: string;
  blurb: string;
  /** Product slug whose hook image represents this collection */
  coverProduct: string;
}

export type ImageRole = "hook" | "in-action" | "benefit" | "detail" | "lifestyle";

export interface ProductImage {
  src: string;
  alt: string;
  role: ImageRole;
  width: number;
  height: number;
  /** "concept" = procedural concept illustration, "photo" = real photography, "supplier" = supplier-provided */
  source: "concept" | "photo" | "supplier";
  /** Tiny base64 placeholder shown while the image loads. */
  blur?: string;
}

export type Availability = "available" | "sold_out" | "coming_soon";

export interface Money {
  amount: number; // whole rupees
  currencyCode: "INR";
}

export interface ProductVariant {
  id: string;
  title: string;
  /** Optional CSS hue rotation used to preview colour options on concept art. */
  previewHue?: number;
  swatch?: string;
  price: Money;
  availability: Availability;
  /** Filled in once the product is created in Shopify: gid://shopify/ProductVariant/... */
  shopifyVariantId: string | null;
}

export interface SpecRow {
  label: string;
  value: string;
  verified: boolean;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categories: CategoryId[];
  /** 5–7 word benefit headline */
  headline: string;
  /** One-line reason to buy */
  benefit: string;
  shortDescription: string;
  /** Paragraphs of crawlable long-form copy */
  description: string[];
  features: string[];
  howToUse: string[];
  whatsIncluded: string[];
  compatibility: string | null;
  specs: SpecRow[];
  faq: FaqItem[];
  price: Money;
  /** Only set when a genuine previous selling price exists. */
  compareAtPrice: Money | null;
  /** True once the owner confirms the real selling price. */
  priceConfirmed: boolean;
  variants: ProductVariant[];
  /** Variant options shown are indicative until supplier confirms. */
  variantsConfirmed: boolean;
  optionName: string | null;
  images: ProductImage[];
  availability: Availability;
  tags: string[];
  launchPriority: boolean;
  trending: boolean;
  giftable: boolean;
  /** Brand colour used for accents on the product page. */
  accent: string;
  /** Genuine reviews only. Empty until real reviews exist. */
  reviews: Review[];
  shopifyProductId: string | null;
  /** Things the owner must confirm with the supplier before launch. */
  pendingVerification: string[];
}

export interface CartLine {
  id: string; // line id
  productSlug: string;
  variantId: string;
  quantity: number;
}

export interface Cart {
  id: string;
  lines: CartLine[];
  checkoutUrl: string | null;
}

export interface CartLineInput {
  productSlug: string;
  variantId: string;
  quantity: number;
}

export interface CartLineUpdate {
  id: string;
  quantity: number;
}

/**
 * The single seam between UI and commerce backend.
 * - MockCommerceAdapter: local catalog + local cart (development / preview)
 * - ShopifyCommerceAdapter: Storefront API (production)
 */
export interface CommerceAdapter {
  readonly name: "mock" | "shopify";
  getProducts(): Promise<Product[]>;
  getProductByHandle(handle: string): Promise<Product | null>;
  getCollections(): Promise<Category[]>;
  createCart(lines?: CartLineInput[]): Promise<Cart>;
  addCartLines(cartId: string, lines: CartLineInput[]): Promise<Cart>;
  updateCartLines(cartId: string, lines: CartLineUpdate[]): Promise<Cart>;
  removeCartLines(cartId: string, lineIds: string[]): Promise<Cart>;
  getCheckoutUrl(cartId: string): Promise<string | null>;
}
