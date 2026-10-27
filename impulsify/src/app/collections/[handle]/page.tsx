import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getCategory } from "@/data/categories";
import { products } from "@/data/catalog";
import { toLite } from "@/lib/lite";
import { ProductCard } from "@/components/product/ProductCard";
import { CatalogBrowser } from "@/components/product/CatalogBrowser";

export const dynamicParams = false;
export const generateStaticParams = () => categories.map((c) => ({ handle: c.handle }));
type Params = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const c = getCategory((await params).handle);
  if (!c) return {};
  return { title: c.title, description: `${c.blurb} Shop ${c.title.toLowerCase()} at Impulsify.`, alternates: { canonical: `/collections/${c.handle}` } };
}

export default async function CollectionPage({ params }: Params) {
  const c = getCategory((await params).handle);
  if (!c) notFound();
  const list = products.filter((p) => p.categories.includes(c.id));
  return (
    <div className="container-x pb-20 pt-8 lg:pt-12">
      <nav aria-label="Breadcrumb" className="text-[12.5px] text-mist">
        <Link href="/collections" className="hover:text-snow">Categories</Link> / <span className="text-snow">{c.title}</span>
      </nav>
      <h1 className="h-section mt-3">{c.title}</h1>
      <p className="mt-3 max-w-xl text-[15.5px] text-mist">{c.blurb}</p>
      <div className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        {categories.map((x) => (
          <Link key={x.handle} href={`/collections/${x.handle}`} aria-current={x.handle === c.handle ? "page" : undefined} className={`inline-flex min-h-[38px] shrink-0 items-center rounded-full border px-4 text-[13.5px] font-medium transition-colors ${x.handle === c.handle ? "border-volt bg-volt text-ink" : "border-white/15 text-snow/85 hover:border-white/40"}`}>
            {x.title}
          </Link>
        ))}
      </div>
      <div className="mt-4">
        <CatalogBrowser
          lockedCategory={c.id}
          items={list.map((p, i) => ({ ...toLite(p), order: i, launch: p.launchPriority }))}
          cards={Object.fromEntries(list.map((p, i) => [p.slug, <ProductCard key={p.slug} product={p} priority={i < 2} index={i} />]))}
          categories={[]}
        />
      </div>
    </div>
  );
}
