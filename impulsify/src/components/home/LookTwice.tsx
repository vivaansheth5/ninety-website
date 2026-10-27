"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Picture } from "@/components/ui/Picture";

interface Item {
  slug: string;
  name: string;
  headline: string;
  benefit: string;
  image: string;
  alt: string;
  price: string;
}

/**
 * Scroll-linked horizontal story on desktop (sticky stage, vertical scroll drives translateX).
 * Mobile and reduced-motion: a native swipe rail — no scroll hijacking on phones.
 */
export function LookTwice({ items }: { items: Item[] }) {
  const section = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wide = matchMedia("(min-width: 1024px)");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let raf = 0;
    const update = () => {
      const s = section.current, t = track.current;
      if (!s || !t) return;
      if (!wide.matches) {
        t.style.transform = "";
        s.style.height = "";
        return;
      }
      const distance = t.scrollWidth - window.innerWidth + 80;
      s.style.height = `${distance + window.innerHeight}px`;
      const r = s.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (s.offsetHeight - window.innerHeight)));
      t.style.transform = `translate3d(${-p * distance}px,0,0)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={section} className="relative">
      <div className="lg:sticky lg:top-[var(--header-h)] lg:flex lg:h-[calc(100vh-var(--header-h))] lg:items-center lg:overflow-hidden">
        <div ref={track} className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 will-change-transform sm:px-6 lg:snap-none lg:gap-8 lg:overflow-visible lg:px-10">
          {items.map((it, i) => (
            <Link
              key={it.slug}
              href={`/products/${it.slug}`}
              className="group relative flex w-[82vw] max-w-[420px] shrink-0 snap-center flex-col overflow-hidden rounded-[24px] bg-graphite lg:w-[min(36vw,520px)] lg:max-w-none"
            >
              <div className="relative aspect-square overflow-hidden">
                <Picture src={it.image} alt={it.alt} sizes="(min-width: 1024px) 36vw, 82vw" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute right-4 top-4 rounded-full bg-ink/70 px-2.5 py-1 font-mono text-[12px] text-volt">{String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
              </div>
              <div className="flex flex-1 flex-col p-5 lg:p-6">
                <p className="font-display text-[26px] font-bold uppercase leading-[0.95] tracking-tighter2 lg:text-[32px]">{it.headline}</p>
                <p className="mt-2 text-[14px] text-mist">{it.benefit}</p>
                <p className="mt-auto flex items-center justify-between pt-4 text-[14px]">
                  <span className="font-semibold">{it.name}</span>
                  <span className="font-mono">{it.price}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
