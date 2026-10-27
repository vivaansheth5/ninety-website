"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { cx } from "@/lib/format";
import { Picture } from "@/components/ui/Picture";

interface Cat {
  handle: string;
  title: string;
  blurb: string;
  image: string;
  count: number;
}

/**
 * Desktop only: oversized type list; hovering a row cross-fades the preview.
 * (The mobile tile grid is CategoryGrid — a server component, so phones hydrate nothing here.)
 */
export function CategoryExplorer({ categories }: { categories: Cat[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="hidden grid-cols-[1.2fr_1fr] gap-12 lg:grid">
        <ul>
          {categories.map((c, i) => (
            <li key={c.handle}>
              <Link
                href={`/collections/${c.handle}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group flex items-baseline justify-between gap-6 border-b border-white/10 py-3"
              >
                <span className={cx("font-display text-[clamp(2rem,3.6vw,3.5rem)] font-bold uppercase leading-none tracking-tightest transition-all duration-500 ease-out", active === i ? "translate-x-3 text-volt" : "text-snow/35")}>
                  {c.title}
                </span>
                <span className={cx("flex items-center gap-2 font-mono text-[12px] transition-opacity", active === i ? "opacity-100" : "opacity-0")}>
                  {c.count} finds <ArrowUpRight size={16} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="sticky top-24 aspect-square self-start overflow-hidden rounded-[28px] bg-graphite">
          {categories.map((c, i) => (
            <span key={c.handle} className={cx("absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out", active === i ? "scale-100 opacity-100" : "scale-110 opacity-0")}>
              <Picture src={c.image} alt="" sizes="40vw" />
            </span>
          ))}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-8">
            <p className="text-[18px] text-snow">{categories[active].blurb}</p>
          </div>
        </div>
      </div>
  );
}
