import Link from "next/link";
import { BadgeIndianRupee, Eye, ShieldCheck, Sparkles } from "lucide-react";
import { LAUNCH_ORDER, products } from "@/data/catalog";
import { categories } from "@/data/categories";
import { generalFaq } from "@/data/faq";
import { site } from "@/lib/site";
import { formatINR } from "@/lib/format";
import { thumb } from "@/lib/images";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { LaunchBento } from "@/components/home/LaunchBento";
import { CategoryExplorer } from "@/components/home/CategoryExplorer";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { LookTwice } from "@/components/home/LookTwice";
import { GiftTabs } from "@/components/home/GiftTabs";
import { GlowDemo } from "@/components/home/GlowDemo";
import { Newsletter } from "@/components/home/Newsletter";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductRail } from "@/components/product/ProductRail";
import { ProductCard } from "@/components/product/ProductCard";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/ui/JsonLd";

const bySlug = (s: string) => products.find((p) => p.slug === s)!;

export default function HomePage() {
  const launch = LAUNCH_ORDER.map(bySlug);
  const trending = products.filter((p) => p.trending && !["levitating-racing-display"].includes(p.slug)).slice(0, 8);
  const desk = products.filter((p) => p.categories.includes("desk-setup") && !p.launchPriority).slice(0, 4);
  const lookTwice = ["surface-conduction-speaker", "led-flashlight-gloves", "display-charging-cable", "literary-quote-clock", "origami-wireless-mouse", "fluorescent-orb-lamp", "sonic-audio-glasses"].map(bySlug);
  const under999 = products.filter((p) => p.price.amount < 999);
  const glow = bySlug("glow-earbuds-case");
  const navCats = categories.map((c) => ({
    handle: c.handle,
    title: c.title,
    blurb: c.blurb,
    image: bySlug(c.coverProduct).images[0].src,
    count: products.filter((p) => p.categories.includes(c.id)).length,
  }));
  const gifts = [
    { id: "desk", label: "For desk lovers", list: products.filter((p) => p.giftable && p.categories.includes("desk-setup")) },
    { id: "music", label: "For music lovers", list: products.filter((p) => p.giftable && p.categories.includes("audio-speakers")) },
    { id: "night", label: "For night owls", list: products.filter((p) => p.giftable && p.categories.includes("lights-decor")) },
    { id: "travel", label: "For travellers", list: products.filter((p) => p.giftable && p.categories.includes("travel-edc")) },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: site.name,
          url: site.url,
          potentialAction: { "@type": "SearchAction", target: `${site.url}/products?q={search_term_string}`, "query-input": "required name=search_term_string" },
        }}
      />
      <Hero focal={bySlug("levitating-racing-display")} satellites={[bySlug("glow-earbuds-case"), bySlug("rgb-cloud-lamp"), bySlug("cute-character-charger")]} />
      <Marquee />

      {/* 2 · Trending */}
      <section className="container-x py-16 lg:py-24" aria-labelledby="trending-title">
        <SectionHeader id="trending-title" eyebrow="Right now" title="Trending now" href="/trending" />
        <div className="mt-8">
          <ProductRail products={trending.slice(0, 4)} />
        </div>
      </section>

      {/* 3 · Launch bento */}
      <section className="surface-light py-16 lg:py-24" aria-labelledby="needed-title">
        <div className="container-x">
          <SectionHeader id="needed-title" light eyebrow="The launch eight" title={<>Things you didn&apos;t<br className="hidden sm:block" /> know you needed</>} href="/products" linkLabel="Shop all 32" />
          <div className="mt-8 lg:mt-12">
            <LaunchBento products={launch} />
          </div>
        </div>
      </section>

      {/* 4 · Categories */}
      <section className="container-x py-16 lg:py-24" aria-labelledby="cat-title">
        <SectionHeader id="cat-title" eyebrow="Nine ways in" title="Shop by category" href="/collections" linkLabel="All categories" />
        <div className="mt-8 lg:mt-12">
          <CategoryGrid categories={navCats} />
          <CategoryExplorer categories={navCats} />
        </div>
      </section>

      {/* 5 · Under ₹999 — only rendered once real selling prices are confirmed */}
      {site.pricesConfirmed && under999.length >= 4 && (
        <section className="container-x pb-16 lg:pb-24" aria-labelledby="u999-title">
          <SectionHeader id="u999-title" eyebrow="Small price. Big want." title={`Under ${formatINR(999)}`} href="/products?max=999" />
          <div className="mt-8">
            <ProductRail products={under999.slice(0, 4)} />
          </div>
        </section>
      )}

      {/* 6 · Desk setup */}
      <section className="surface-light py-16 lg:py-24" aria-labelledby="desk-title">
        <div className="container-x">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_2fr] lg:gap-14">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeader id="desk-title" light eyebrow="Workspace" title="Desk setup upgrades">
                <p className="mt-4 max-w-sm text-[16px] text-ink/65">The place you spend all day deserves better than a tangle of cables. Small upgrades, big difference.</p>
              </SectionHeader>
              <Link href="/collections/desk-setup" className="btn-dark mt-6">
                Shop desk setup
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 lg:gap-x-6">
              {desk.map((p, i) => (
                <ProductCard key={p.slug} product={p} tone="light" index={i} sizes="(min-width: 1024px) 30vw, 50vw" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7 · Look twice — scroll-linked on desktop */}
      <section className="bg-ink pt-16 lg:pt-24" aria-labelledby="twice-title">
        <div className="container-x mb-8 lg:mb-4">
          <SectionHeader id="twice-title" eyebrow="Wait, how does that work?" title="Gadgets that make you look twice" />
        </div>
        <LookTwice
          items={lookTwice.map((p) => ({ slug: p.slug, name: p.name, headline: p.headline, benefit: p.benefit, image: p.images[0].src, alt: p.images[0].alt, price: formatINR(p.price.amount) }))}
        />
        <div className="h-16 lg:h-8" />
      </section>

      {/* 8 · Gifts */}
      <section className="surface-light py-16 lg:py-24" aria-labelledby="gift-title">
        <div className="container-x">
          <SectionHeader id="gift-title" light eyebrow="Gift-worthy finds" title="For people who have everything" href="/collections/gifts-unusual" />
          <div className="mt-8">
            <GiftTabs
              tabs={gifts.map((g) => ({
                id: g.id,
                label: g.label,
                panel: (
                  <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
                    {g.list.slice(0, 4).map((p, i) => (
                      <ProductCard key={p.slug} product={p} tone="light" index={i} />
                    ))}
                  </div>
                ),
              }))}
            />
          </div>
        </div>
      </section>

      {/* 9 · Featured demonstration */}
      <section className="container-x py-16 lg:py-24" aria-label="Featured product demonstration">
        <GlowDemo slug={glow.slug} name={glow.name} price={glow.price.amount} image={thumb(glow.images[0].src)} variantId={glow.variants[0].id} variantTitle={glow.variants[0].title} />
      </section>

      {/* 10 · Why Impulsify */}
      <section className="container-x pb-16 lg:pb-24" aria-labelledby="why-title">
        <SectionHeader id="why-title" eyebrow="Why shop with us" title="Curated. Honest. Easy." />
        <ul className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-card bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Sparkles, t: "Curated, not crowded", d: "32 objects we think are genuinely interesting — not ten thousand listings." },
            { icon: Eye, t: "Honest listings", d: "Specs are verified or clearly marked as pending. No fake reviews, timers or stock counts." },
            { icon: ShieldCheck, t: "Secure checkout", d: "Checkout will run on Shopify's secure hosted checkout, with guest checkout — no account required." },
            { icon: BadgeIndianRupee, t: "Made for India", d: "Prices in rupees and policies written for Indian shoppers." },
          ].map(({ icon: Icon, t, d }, i) => (
            <li key={t} data-reveal style={{ ["--d" as string]: `${i * 70}ms` }} className="bg-ink p-6 lg:p-8">
              <Icon className="text-volt" size={26} />
              <p className="mt-6 font-display text-[22px] font-bold tracking-tight">{t}</p>
              <p className="mt-2 text-[14.5px] leading-relaxed text-mist">{d}</p>
            </li>
          ))}
        </ul>
        {/* 11 · Customer reviews: intentionally not rendered until genuine reviews exist. */}
      </section>

      <Marquee tone="violet" />

      {/* 12 · FAQ */}
      <section className="container-x grid grid-cols-1 gap-10 py-16 lg:grid-cols-[1fr_1.4fr] lg:py-24" aria-labelledby="faq-title">
        <SectionHeader id="faq-title" eyebrow="Good questions" title="FAQ" href="/faq" linkLabel="All FAQs" />
        <Faq items={generalFaq.slice(0, 5)} />
      </section>

      {/* 13 · Newsletter */}
      <section className="bg-volt text-ink" aria-labelledby="nl-title">
        <div className="container-x grid grid-cols-1 items-end gap-8 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="eyebrow !text-ink/60">The drop list</p>
            <h2 id="nl-title" className="h-section mt-2">
              Be first to the
              <br />
              next obsession.
            </h2>
          </div>
          <Newsletter />
        </div>
      </section>
    </>
  );
}
