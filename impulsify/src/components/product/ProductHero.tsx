"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { ChevronLeft, ChevronRight, Info, Loader2, Minus, Plus, Truck, RotateCcw, Zap } from "lucide-react";
import { actions, MAX_QUANTITY } from "@/lib/store";
import { cx, formatINR } from "@/lib/format";
import { startCheckout } from "@/app/actions/checkout";
import { WishlistButton } from "./WishlistButton";
import { Picture } from "@/components/ui/Picture";
import { thumb } from "@/lib/images";

export interface HeroProduct {
  slug: string;
  name: string;
  headline: string;
  benefit: string;
  accent: string;
  priceConfirmed: boolean;
  optionName: string | null;
  variantsConfirmed: boolean;
  availability: "available" | "sold_out" | "coming_soon";
  images: { src: string; alt: string; role: string; blur?: string }[];
  variants: { id: string; title: string; previewHue?: number; swatch?: string; price: number; availability: string }[];
  features: string[];
  shippingSummary: string;
  returnsSummary: string;
}

const ROLE_LABEL: Record<string, string> = { hook: "Hook", "in-action": "In action", benefit: "Benefit", detail: "Detail", lifestyle: "Lifestyle" };

export function ProductHero({ p, categoryLabel }: { p: HeroProduct; categoryLabel: string }) {
  const [vIdx, setVIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [slide, setSlide] = useState(0);
  const [demo, setDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [showBar, setShowBar] = useState(false);
  const rail = useRef<HTMLDivElement>(null);
  const buyRef = useRef<HTMLDivElement>(null);
  const v = p.variants[vIdx];
  const hue = v.previewHue ?? 0;
  const soldOut = v.availability !== "available";

  // Sync active dot/thumbnail with swipe position.
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setSlide(Number((e.target as HTMLElement).dataset.i))),
      { root: el, threshold: 0.6 },
    );
    el.querySelectorAll("[data-i]").forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Sticky mobile purchase bar once the main buttons have been scrolled past.
  useEffect(() => {
    const el = buyRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setShowBar(el.getBoundingClientRect().bottom < 0));
    };
    update();
    addEventListener("scroll", update, { passive: true });
    return () => {
      removeEventListener("scroll", update);
      cancelAnimationFrame(raf);
    };
  }, []);

  const go = (i: number) => {
    const el = rail.current;
    if (!el) return;
    const n = (i + p.images.length) % p.images.length;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: el.clientWidth * n, behavior: reduce ? "auto" : "smooth" });
  };

  const item = { variantId: v.id, productSlug: p.slug, name: p.name, variantTitle: v.title, price: v.price, image: thumb(p.images[0].src) };
  const add = (open = true) => actions.addToCart(item, qty, open);
  const buyNow = () => {
    setError(null);
    start(async () => {
      const res = await startCheckout([{ productSlug: p.slug, variantId: v.id, quantity: qty }]);
      if (res.ok) window.location.href = res.url;
      else if (res.demo) setDemo(true);
      else setError(res.error);
    });
  };

  return (
    <div className="grid grid-cols-1 gap-x-14 gap-y-4 lg:grid-cols-[1.15fr_1fr] lg:grid-rows-[auto_1fr] lg:gap-y-6">
      {/* Name + price: above the gallery on mobile, top of the right column on desktop */}
      <div className="lg:col-start-2 lg:row-start-1">
        <p className="eyebrow">{categoryLabel}</p>
        <div className="mt-1.5 flex items-start justify-between gap-3">
          <h1 className="font-display text-[clamp(1.6rem,6vw,3rem)] font-bold leading-[0.98] tracking-tighter2">{p.name}</h1>
          <WishlistButton slug={p.slug} name={p.name} className="-mr-2 shrink-0 border border-white/15 text-snow hover:border-white/40" />
        </div>
        <p className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
          <span className="font-display text-[26px] font-bold tabular-nums tracking-tight lg:text-[30px]">{formatINR(v.price)}</span>
          <span className="text-[12px] text-mist">incl. of taxes{!p.priceConfirmed && " · indicative price, confirmed at launch"}</span>
        </p>
      </div>

      {/* Gallery */}
      <div className="lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-start">
        <div className="relative -mx-4 sm:mx-0">
          <div
            ref={rail}
            className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto sm:rounded-[24px]"
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label={`${p.name} images`}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") go(slide + 1);
              if (e.key === "ArrowLeft") go(slide - 1);
            }}
          >
            {p.images.map((img, i) => (
              <div key={img.src} data-i={i} className="relative aspect-square w-full shrink-0 snap-center bg-graphite" role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${p.images.length}: ${ROLE_LABEL[img.role]}`}>
                <Picture
                  src={img.src}
                  alt={img.alt}
                  blur={img.blur}
                  priority={i === 0}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  draggable={false}
                  className="transition-[filter] duration-700"
                  style={{ filter: hue ? `hue-rotate(${hue}deg)` : undefined }}
                />
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-x-3 top-1/2 hidden -translate-y-1/2 justify-between lg:flex">
            <button type="button" onClick={() => go(slide - 1)} className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-ink/60 text-snow backdrop-blur hover:bg-ink" aria-label="Previous image">
              <ChevronLeft size={20} />
            </button>
            <button type="button" onClick={() => go(slide + 1)} className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-ink/60 text-snow backdrop-blur hover:bg-ink" aria-label="Next image">
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-ink/50 px-2.5 py-2 lg:hidden" aria-hidden>
            {p.images.map((_, i) => (
              <span key={i} className={cx("h-1.5 rounded-full transition-all duration-300", slide === i ? "w-5 bg-volt" : "w-1.5 bg-white/50")} />
            ))}
          </div>
        </div>
        <div className="mt-3 hidden grid-cols-5 gap-3 sm:grid">
          {p.images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show image ${i + 1}: ${ROLE_LABEL[img.role]}`}
              aria-current={slide === i}
              className={cx("relative aspect-square overflow-hidden rounded-xl bg-graphite ring-2 transition-all", slide === i ? "ring-volt" : "ring-transparent opacity-60 hover:opacity-100")}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumb(img.src)} alt="" width={160} height={160} loading="lazy" className="h-full w-full object-cover" style={{ filter: hue ? `hue-rotate(${hue}deg)` : undefined }} />
            </button>
          ))}
        </div>
        <p className="mt-2 hidden text-center font-mono text-[10.5px] uppercase tracking-[0.14em] text-mist/70 sm:block">Concept illustrations · launch photography in production</p>
      </div>

      {/* Purchase panel — kept high on mobile, no animation gating */}
      <div className="lg:col-start-2 lg:row-start-2">
        <p className="text-[16px] font-medium leading-snug text-snow lg:text-[17px]">{p.benefit}</p>

        {p.variants.length > 1 && (
          <fieldset className="mt-4 lg:mt-6">
            <legend className="flex w-full justify-between text-[14px]">
              <span>
                <span className="text-mist">{p.optionName}:</span> <span className="font-semibold">{v.title}</span>
              </span>
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.variants.map((x, i) => (
                <button
                  key={x.id}
                  type="button"
                  aria-pressed={vIdx === i}
                  onClick={() => setVIdx(i)}
                  className={cx(
                    "flex min-h-[44px] items-center gap-2 rounded-full border px-4 text-[14px] font-medium transition-all duration-200",
                    vIdx === i ? "border-volt bg-volt/10 text-snow" : "border-white/15 text-snow/80 hover:border-white/40",
                  )}
                >
                  {x.swatch && <span className="h-4 w-4 rounded-full ring-1 ring-white/30" style={{ background: x.swatch }} />}
                  {x.title}
                </button>
              ))}
            </div>
            {!p.variantsConfirmed && <p className="mt-2 text-[12px] text-mist">Options shown are indicative until confirmed by our supplier.</p>}
          </fieldset>
        )}

        <div ref={buyRef} className="mt-4 flex flex-wrap items-stretch gap-3 lg:mt-6">
          <div className="flex items-center rounded-full border border-white/15" role="group" aria-label="Quantity">
            <button type="button" className="grid h-12 w-12 place-items-center rounded-full hover:bg-white/5 disabled:opacity-30" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Decrease quantity">
              <Minus size={16} />
            </button>
            <span className="w-8 text-center font-mono text-[16px]" aria-live="polite" aria-label={`Quantity ${qty}`}>
              {qty}
            </span>
            <button type="button" className="grid h-12 w-12 place-items-center rounded-full hover:bg-white/5 disabled:opacity-30" onClick={() => setQty((q) => Math.min(MAX_QUANTITY, q + 1))} disabled={qty >= MAX_QUANTITY} aria-label="Increase quantity">
              <Plus size={16} />
            </button>
          </div>
          <button type="button" disabled={soldOut} onClick={() => add()} className="btn-volt flex-1 !min-h-[52px] text-[16px]">
            {soldOut ? "Sold out" : "Add to Cart"}
          </button>
          <button type="button" disabled={soldOut || pending} onClick={buyNow} className="btn-ghost w-full !min-h-[52px] text-[16px]">
            {pending ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} className="text-volt" />} Buy Now
          </button>
        </div>
        {demo && (
          <div className="mt-4 rounded-2xl border border-violet/40 bg-violet/10 p-4 text-[13.5px]" role="status">
            <p className="flex items-center gap-2 font-semibold">
              <Info size={16} className="text-violet" /> Checkout demo mode
            </p>
            <p className="mt-1 text-snow/75">This preview isn&apos;t connected to Shopify yet — no order was placed and no payment was taken. Once connected, Buy Now goes straight to Shopify&apos;s secure checkout.</p>
          </div>
        )}
        {error && <p className="mt-3 text-[13px] text-red-400" role="alert">{error}</p>}

        <ul className="mt-7 space-y-2.5">
          {p.features.map((f) => (
            <li key={f} className="flex gap-3 text-[15px] leading-snug text-snow/90">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-volt" />
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-7 grid gap-px overflow-hidden rounded-2xl bg-white/10 text-[13.5px]">
          <p className="flex gap-3 bg-ink p-4">
            <Truck size={18} className="shrink-0 text-volt" /> <span className="text-snow/85">{p.shippingSummary}</span>
          </p>
          <p className="flex gap-3 bg-ink p-4">
            <RotateCcw size={18} className="shrink-0 text-volt" /> <span className="text-snow/85">{p.returnsSummary}</span>
          </p>
        </div>
      </div>

      {/* Sticky purchase bar (mobile) */}
      <div
        className={cx(
          "fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink pb-[env(safe-area-inset-bottom)] transition-transform duration-300 ease-out lg:hidden",
          showBar ? "translate-y-0" : "translate-y-full",
        )}
        aria-hidden={!showBar}
      >
        <div className="flex items-center gap-3 px-4 py-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={thumb(p.images[0].src)} alt="" width={44} height={44} className="h-11 w-11 rounded-lg object-cover" loading="lazy" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold">{p.name}</p>
            <p className="font-mono text-[13px] text-mist">
              {formatINR(v.price)}
              {p.variants.length > 1 && ` · ${v.title}`}
            </p>
          </div>
          <button type="button" tabIndex={showBar ? 0 : -1} disabled={soldOut} onClick={() => add()} className="btn-volt !min-h-[46px] !px-5 text-[14px]">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
