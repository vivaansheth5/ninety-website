import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/data/categories";
import { products } from "@/data/catalog";
import { Img } from "@/components/ui/Img";

export const metadata: Metadata = { title: "Categories", description: "Shop Impulsify by category: tech, charging, desk setup, audio, travel, grooming, lighting and gifts.", alternates: { canonical: "/collections" } };

export default function CollectionsPage() {
  return (
    <div className="container-x pb-20 pt-8 lg:pt-12">
      <p className="eyebrow">Nine ways in</p>
      <h1 className="h-section mt-2">Categories</h1>
      <ul className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-6">
        {categories.map((c, i) => {
          const cover = products.find((p) => p.slug === c.coverProduct)!;
          const count = products.filter((p) => p.categories.includes(c.id)).length;
          return (
            <li key={c.handle} data-reveal style={{ ["--d" as string]: `${(i % 3) * 70}ms` }}>
              <Link href={`/collections/${c.handle}`} className="spotlight group relative block aspect-[4/5] overflow-hidden rounded-card bg-graphite lg:aspect-[5/4]">
                <Img src={cover.images[0].src} alt="" priority={i < 2} className="transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 lg:p-6">
                  <div>
                    <p className="font-display text-[19px] font-bold leading-tight tracking-tight lg:text-[28px]">{c.title}</p>
                    <p className="mt-1 hidden text-[14px] text-mist sm:block">{c.blurb}</p>
                    <p className="mt-1 font-mono text-[11px] text-volt">{count} finds</p>
                  </div>
                  <ArrowUpRight className="hidden shrink-0 text-volt transition-transform group-hover:rotate-45 sm:block" />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
