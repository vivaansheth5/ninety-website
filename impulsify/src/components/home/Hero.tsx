import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/commerce/types";
import { formatINR } from "@/lib/format";
import { Img } from "@/components/ui/Img";
import { HeroParallax } from "./HeroParallax";

const WORDS = ["THINGS", "YOU", "DIDN'T", "KNOW", "YOU", "NEEDED."];

export function Hero({ focal, satellites }: { focal: Product; satellites: Product[] }) {
  return (
    <section className="relative overflow-hidden bg-ink pb-10 pt-6 lg:pb-20 lg:pt-10" aria-labelledby="hero-title">
      {/* Grid + glow backdrop (pure CSS, no image cost) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_60%_40%,black,transparent_75%)]" />
      <div aria-hidden className="pointer-events-none absolute right-[-25%] top-[5%] h-[90vw] w-[90vw] rounded-full bg-[radial-gradient(closest-side,rgba(138,118,255,0.28),transparent)] lg:right-[-8%] lg:h-[56vw] lg:w-[56vw]" />

      <HeroParallax className="container-x relative grid grid-cols-1 items-center gap-6 lg:grid-cols-[1.05fr_1fr] lg:gap-4">
        <div className="relative z-10">
          <p className="eyebrow animate-fade-up text-volt">Impulsify · Unexpected finds. Instant obsession.</p>
          <h1 id="hero-title" className="display mt-4 text-[clamp(2.75rem,12.5vw,8.25rem)] lg:text-[clamp(4rem,7.4vw,8.25rem)]">
            {WORDS.map((w, i) => (
              <span key={i} className="word-mask mr-[0.22em]">
                <span style={{ ["--d" as string]: `${120 + i * 70}ms` }} className={i === 5 ? "text-volt" : undefined}>
                  {w}
                </span>
              </span>
            ))}
          </h1>
          <p className="mt-5 max-w-md animate-fade-up text-[16px] leading-relaxed text-mist [animation-delay:500ms] lg:text-[18px]">
            Unusual gadgets. Clever everyday upgrades. Your next favourite find.
          </p>
          <div className="mt-6 flex animate-fade-up flex-wrap gap-3 [animation-delay:600ms]">
            <span data-magnetic className="inline-block transition-transform duration-300 ease-out">
              <Link href="/products" className="btn-volt">
                Explore All Products <ArrowRight size={18} />
              </Link>
            </span>
            <span data-magnetic className="inline-block transition-transform duration-300 ease-out">
              <Link href="/trending" className="btn-ghost">
                See What&apos;s Trending
              </Link>
            </span>
          </div>
        </div>

        {/* Product composition */}
        <div className="relative mx-auto aspect-square w-full max-w-[640px]">
          <div className="parallax absolute inset-[6%]" style={{ ["--depth" as string]: "-14px" }}>
            <div className="h-full w-full animate-float overflow-hidden rounded-[28px] shadow-[0_40px_120px_-30px_rgba(138,118,255,0.55)]" data-animate>
              <Img src={focal.images[0].src} alt={focal.images[0].alt} blur={focal.images[0].blur} priority sizes="(min-width: 1024px) 45vw, 92vw" />
            </div>
          </div>
          {satellites.slice(0, 3).map((p, i) => {
            const pos = ["left-[-2%] top-[4%] w-[30%]", "right-[-3%] top-[38%] w-[27%]", "left-[4%] bottom-[2%] w-[25%]"][i];
            return (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className={`parallax absolute ${pos} hidden xs:block`}
                style={{ ["--depth" as string]: `${18 + i * 10}px` }}
                aria-label={`${p.name}, ${formatINR(p.price.amount)}`}
              >
                <span className="block animate-float-slow overflow-hidden rounded-2xl border border-white/10 shadow-2xl transition-transform duration-300 hover:scale-105" style={{ animationDelay: `${-i * 2.2}s` }} data-animate>
                  <Img src={p.images[0].src} alt="" blur={p.images[0].blur} sizes="(min-width: 1024px) 13vw, 28vw" />
                </span>
              </Link>
            );
          })}
          <Link
            href={`/products/${focal.slug}`}
            className="group absolute bottom-[8%] right-[2%] flex max-w-[78%] items-center gap-3 rounded-full bg-snow py-1.5 pl-4 pr-1.5 text-ink shadow-2xl transition-transform hover:-translate-y-0.5 sm:right-[6%]"
          >
            <span className="min-w-0">
              <span className="block truncate text-[12.5px] font-semibold leading-tight">{focal.headline}</span>
              <span className="block font-mono text-[12px] text-ink/60">{formatINR(focal.price.amount)}</span>
            </span>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-volt transition-transform group-hover:rotate-45">
              <ArrowUpRight size={16} />
            </span>
          </Link>
        </div>
      </HeroParallax>
    </section>
  );
}
