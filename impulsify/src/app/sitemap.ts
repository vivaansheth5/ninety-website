import type { MetadataRoute } from "next";
import { products } from "@/data/catalog";
import { categories } from "@/data/categories";
import { policies } from "@/data/policies";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const statics = ["/", "/products", "/trending", "/collections", "/about", "/faq", "/contact"];
  return [
    ...statics.map((p) => ({ url: absoluteUrl(p), lastModified: now, changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.7 })),
    ...categories.map((c) => ({ url: absoluteUrl(`/collections/${c.handle}`), lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...products.map((p) => ({ url: absoluteUrl(`/products/${p.slug}`), lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...Object.keys(policies).map((k) => ({ url: absoluteUrl(`/policies/${k}`), lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 })),
  ];
}
