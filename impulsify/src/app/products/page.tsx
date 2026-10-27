import type { Metadata } from "next";
import { products, LAUNCH_ORDER } from "@/data/catalog";
import { categories } from "@/data/categories";
import { toLite } from "@/lib/lite";
import { ProductCard } from "@/components/product/ProductCard";
import { CatalogBrowser } from "@/components/product/CatalogBrowser";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse all 32 Impulsify finds — levitating displays, glow-in-the-dark accessories, app-controlled planes, clever chargers and more.",
  alternates: { canonical: "/products" },
};

export default function AllProductsPage() {
  const ordered = [...products].sort((a, b) => {
    const ai = LAUNCH_ORDER.indexOf(a.slug), bi = LAUNCH_ORDER.indexOf(b.slug);
    return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
  });
  return (
    <div className="container-x pb-20 pt-8 lg:pt-12">
      <p className="eyebrow">The full collection</p>
      <h1 className="h-section mt-2">All products</h1>
      <p className="mt-3 max-w-xl text-[15.5px] text-mist">32 unusual gadgets and clever upgrades. Filter by category, price or vibe.</p>
      <div className="mt-6">
        <CatalogBrowser
          items={ordered.map((p, i) => ({ ...toLite(p), order: i, launch: p.launchPriority }))}
          cards={Object.fromEntries(ordered.map((p, i) => [p.slug, <ProductCard key={p.slug} product={p} priority={i < 2} index={i} />]))}
          categories={categories.map((c) => ({ handle: c.handle, title: c.title }))}
        />
      </div>
    </div>
  );
}
