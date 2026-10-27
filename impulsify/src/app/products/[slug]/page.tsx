import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ClipboardList } from "lucide-react";
import { commerce } from "@/lib/commerce";
import { products } from "@/data/catalog";
import { getCategory } from "@/data/categories";
import { absoluteUrl, site } from "@/lib/site";
import { ProductHero } from "@/components/product/ProductHero";
import { ProductCard } from "@/components/product/ProductCard";
import { Faq } from "@/components/ui/Faq";
import { Reviews } from "@/components/product/Reviews";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cx } from "@/lib/format";
import { preload } from "react-dom";
import { isOptimized, srcSetFor } from "@/lib/images";

export const dynamicParams = false;
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = await commerce.getProductByHandle(slug);
  if (!p) return {};
  const title = `${p.name} — ${p.headline}`;
  return {
    title,
    description: `${p.benefit} ${p.shortDescription}`.slice(0, 158),
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: { type: "website", title, description: p.benefit, url: absoluteUrl(`/products/${p.slug}`), images: [{ url: "/og.png", width: 1200, height: 630 }] },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const p = await commerce.getProductByHandle(slug);
  if (!p) notFound();
  const primaryCat = getCategory(p.categories[0])!;
  // Start the LCP (first gallery image) download as early as possible.
  if (isOptimized(p.images[0].src))
    preload(p.images[0].src, { as: "image", imageSrcSet: srcSetFor(p.images[0].src, "avif"), imageSizes: "(min-width: 1024px) 50vw, 100vw", fetchPriority: "high", type: "image/avif" } as Parameters<typeof preload>[1]);
  const related = products
    .filter((x) => x.slug !== p.slug && x.categories.some((c) => p.categories.includes(c)))
    .sort((a, b) => b.categories.filter((c) => p.categories.includes(c)).length - a.categories.filter((c) => p.categories.includes(c)).length)
    .slice(0, 4);

  const faq = [
    ...p.faq,
    { q: "When will my order ship?", a: "Dispatch and delivery timelines will be confirmed in our shipping policy before launch and shown at checkout." },
    { q: "Can I return it?", a: "Our return window and conditions are being finalised and will be published on the Return Policy page before launch." },
  ];

  // Structured data: only verified facts. Offers are omitted until real prices are confirmed; no review schema without genuine reviews.
  const productLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.shortDescription,
    sku: p.id,
    url: absoluteUrl(`/products/${p.slug}`),
    category: primaryCat.title,
  };
  if (p.images.some((i) => i.source !== "concept")) productLd.image = p.images.filter((i) => i.source !== "concept").map((i) => absoluteUrl(i.src));
  if (p.priceConfirmed)
    productLd.offers = {
      "@type": "Offer",
      price: p.price.amount,
      priceCurrency: "INR",
      url: absoluteUrl(`/products/${p.slug}`),
      availability: p.availability === "available" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    };

  return (
    <>
      <JsonLd data={productLd} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: primaryCat.title, item: absoluteUrl(`/collections/${primaryCat.handle}`) },
            { "@type": "ListItem", position: 3, name: p.name, item: absoluteUrl(`/products/${p.slug}`) },
          ],
        }}
      />
      <div className="container-x pb-10 pt-3 lg:pt-6">
        <nav aria-label="Breadcrumb" className="mb-3 hidden items-center gap-1 text-[12.5px] text-mist sm:flex">
          <Link href="/" className="hover:text-snow">Home</Link>
          <ChevronRight size={14} />
          <Link href={`/collections/${primaryCat.handle}`} className="hover:text-snow">{primaryCat.title}</Link>
          <ChevronRight size={14} />
          <span className="truncate text-snow">{p.name}</span>
        </nav>
        <ProductHero
          categoryLabel={primaryCat.title}
          p={{
            slug: p.slug,
            name: p.name,
            headline: p.headline,
            benefit: p.benefit,
            accent: p.accent,
            priceConfirmed: p.priceConfirmed,
            optionName: p.optionName,
            variantsConfirmed: p.variantsConfirmed,
            availability: p.availability,
            images: p.images.map(({ src, alt, role, blur }) => ({ src, alt, role, blur })),
            variants: p.variants.map((v) => ({ id: v.id, title: v.title, previewHue: v.previewHue, swatch: v.swatch, price: v.price.amount, availability: v.availability })),
            features: p.features,
            shippingSummary: site.shipping.summary,
            returnsSummary: site.returns.summary,
          }}
        />
      </div>

      {/* Details */}
      <section className="surface-light">
        <div className="container-x grid grid-cols-1 gap-12 py-14 lg:grid-cols-[1.3fr_1fr] lg:gap-20 lg:py-20">
          <div>
            <p className="eyebrow !text-ink/60">The story</p>
            <h2 className="mt-2 font-display text-[clamp(2rem,6vw,3.75rem)] font-bold uppercase leading-[0.92] tracking-tightest">{p.headline}</h2>
            <div className="mt-6 space-y-4 text-[16.5px] leading-relaxed text-ink/80">
              {p.description.map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </div>

            <h3 className="mt-12 font-display text-[22px] font-bold tracking-tight">How to use</h3>
            <ol className="mt-4 space-y-3">
              {p.howToUse.map((s, i) => (
                <li key={s} className="flex gap-4 text-[15.5px] text-ink/80">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink font-mono text-[12px] text-volt">{i + 1}</span>
                  <span className="pt-0.5">{s}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-10">
            <div>
              <h3 className="font-display text-[22px] font-bold tracking-tight">Specifications</h3>
              <dl className="mt-4 divide-y divide-ink/10 border-y border-ink/10 text-[14.5px]">
                {p.specs.map((s) => (
                  <div key={s.label} className="grid grid-cols-[1fr_1.3fr] gap-4 py-3">
                    <dt className="text-ink/60">{s.label}</dt>
                    <dd className={cx(s.verified ? "font-medium text-ink" : "italic text-ink/60")}>{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <h3 className="font-display text-[22px] font-bold tracking-tight">What&apos;s included</h3>
              <ul className="mt-3 space-y-2 text-[15px] text-ink/80">
                {p.whatsIncluded.map((w) => (
                  <li key={w} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
            {p.compatibility && (
              <div>
                <h3 className="font-display text-[22px] font-bold tracking-tight">Compatibility</h3>
                <p className="mt-3 text-[15px] text-ink/80">{p.compatibility}</p>
              </div>
            )}
            <div className="rounded-2xl border border-dashed border-ink/20 p-5">
              <p className="flex items-center gap-2 text-[14px] font-semibold">
                <ClipboardList size={17} className="text-violet" /> Being verified with our supplier
              </p>
              <p className="mt-1 text-[13.5px] text-ink/60">We publish these details only once confirmed: {p.pendingVerification.join(", ")}.</p>
            </div>
            <div>
              <h3 className="font-display text-[22px] font-bold tracking-tight">Shipping &amp; returns</h3>
              <p className="mt-3 text-[15px] text-ink/80">
                {site.shipping.summary} {site.returns.summary} Read our{" "}
                <Link href="/policies/shipping" className="underline underline-offset-4">shipping</Link> and{" "}
                <Link href="/policies/returns" className="underline underline-offset-4">return</Link> policies.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x grid grid-cols-1 gap-10 py-14 lg:grid-cols-[1fr_1.6fr] lg:py-20" aria-labelledby="pfaq">
        <SectionHeader id="pfaq" eyebrow="Before you buy" title="Questions" />
        <Faq items={faq} />
      </section>

      {/* Reviews render only when genuine reviews exist — never placeholders. */}
      <Reviews reviews={p.reviews} />

      <section className="container-x pb-20" aria-labelledby="rel">
        <SectionHeader id="rel" eyebrow="Keep exploring" title="You might also want" href={`/collections/${primaryCat.handle}`} linkLabel={`More in ${primaryCat.title}`} />
        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-4 lg:gap-x-6">
          {related.map((r, i) => (
            <ProductCard key={r.slug} product={r} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}

export const revalidate = 300;
