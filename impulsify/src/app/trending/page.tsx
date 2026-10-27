import type { Metadata } from "next";
import { products } from "@/data/catalog";
import { ProductCard } from "@/components/product/ProductCard";
import { Marquee } from "@/components/home/Marquee";

export const metadata: Metadata = { title: "Trending", description: "The Impulsify finds everyone is talking about right now.", alternates: { canonical: "/trending" } };

export default function TrendingPage() {
  // Curated by the Impulsify team — not based on sales or popularity data.
  const list = products.filter((p) => p.trending);
  return (
    <>
      <div className="container-x pb-8 pt-8 lg:pt-12">
        <p className="eyebrow text-volt">Staff picks</p>
        <h1 className="display mt-2 text-[clamp(3rem,13vw,9rem)] uppercase">
          Trending<span className="text-volt">.</span>
        </h1>
        <p className="mt-3 max-w-xl text-[15.5px] text-mist">Our team&apos;s current favourites — the finds that make people stop scrolling. Curated by hand, not ranked by fake sales numbers.</p>
      </div>
      <Marquee />
      <h2 className="sr-only">Trending products</h2>
      <div className="container-x grid grid-cols-2 gap-x-3 gap-y-8 py-12 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12">
        {list.map((p, i) => (
          <ProductCard key={p.slug} product={p} priority={i < 2} index={i} />
        ))}
      </div>
    </>
  );
}
