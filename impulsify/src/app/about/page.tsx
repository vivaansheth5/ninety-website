import type { Metadata } from "next";
import Link from "next/link";
import { products } from "@/data/catalog";
import { Img } from "@/components/ui/Img";

export const metadata: Metadata = { title: "About", description: "Impulsify is a curated Indian store for things you didn't know you needed.", alternates: { canonical: "/about" } };

export default function AboutPage() {
  const tiles = ["levitating-racing-display", "rgb-cloud-lamp", "frog-bluetooth-speaker", "interactive-digital-cube"].map((s) => products.find((p) => p.slug === s)!);
  return (
    <>
      <section className="container-x pb-14 pt-10 lg:pt-16">
        <p className="eyebrow text-volt">About Impulsify</p>
        <h1 className="display mt-3 max-w-5xl text-[clamp(2.6rem,9vw,7rem)] uppercase">Small things. Big want.</h1>
        <div className="mt-8 grid grid-cols-1 gap-8 text-[17px] leading-relaxed text-mist lg:grid-cols-2 lg:gap-16">
          <p>
            Impulsify started with a simple feeling: the internet is full of brilliant little objects, but finding them means wading through endless listings, copy-paste descriptions and suspiciously perfect reviews.
          </p>
          <p>
            So we&apos;re doing the opposite. A small, curated collection of unusual, clever and beautiful gadgets — each one picked because it made us say &ldquo;wait, how does that work?&rdquo; Every listing tells you exactly what we know, and clearly says what we&apos;re still confirming.
          </p>
        </div>
      </section>
      <section className="container-x grid grid-cols-2 gap-3 pb-16 lg:grid-cols-4 lg:gap-6">
        {tiles.map((p, i) => (
          <Link key={p.slug} href={`/products/${p.slug}`} data-reveal style={{ ["--d" as string]: `${i * 70}ms` }} className="aspect-square overflow-hidden rounded-card">
            <Img src={p.images[0].src} alt={p.images[0].alt} sizes="(min-width:1024px) 25vw, 50vw" />
          </Link>
        ))}
      </section>
      <section className="surface-light">
        <div className="container-x grid grid-cols-1 gap-10 py-16 lg:grid-cols-3 lg:py-24">
          {[
            ["Curated, not crowded", "We'd rather sell 32 things we love than 3,000 we don't."],
            ["Honest by default", "No fake reviews, fake timers or fake stock counts. Unverified details are labelled as pending."],
            ["Built for phones", "Fast pages, big buttons and a checkout that doesn't make you create an account."],
          ].map(([t, d]) => (
            <div key={t} data-reveal>
              <p className="font-display text-[28px] font-bold leading-tight tracking-tight">{t}</p>
              <p className="mt-3 text-[16px] text-ink/65">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
