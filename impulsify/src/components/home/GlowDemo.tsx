"use client";

import Link from "next/link";
import { useState } from "react";
import { Lightbulb, LightbulbOff } from "lucide-react";
import { actions } from "@/lib/store";
import { cx, formatINR } from "@/lib/format";

interface Props {
  slug: string;
  name: string;
  price: number;
  image: string;
  variantId: string;
  variantTitle: string;
}

/**
 * Featured demonstration: flip the lights to see what the glow case actually does.
 * Pure inline SVG + CSS transitions — no images or animation libraries.
 */
export function GlowDemo({ slug, name, price, image, variantId, variantTitle }: Props) {
  const [dark, setDark] = useState(true);
  return (
    <div className={cx("relative overflow-hidden rounded-[28px] transition-colors duration-700", dark ? "bg-[#07080a]" : "bg-[#ECEAE4]")}>
      <div className="grid grid-cols-1 items-center gap-6 p-5 sm:p-8 lg:grid-cols-[1fr_1.1fr] lg:p-14">
        <div className={cx("relative z-10 transition-colors duration-700", dark ? "text-snow" : "text-ink")}>
          <p className={cx("eyebrow", dark ? "text-volt" : "!text-ink/60")}>Featured demo · Glow-in-the-Dark Earbuds Case</p>
          <h2 className="h-section mt-3">
            Your everyday case.
            <br />
            <span className={dark ? "text-volt" : "text-violet"}>After dark.</span>
          </h2>
          <p className={cx("mt-4 max-w-md text-[16px]", dark ? "text-mist" : "text-ink/65")}>
            Charge it under any light. Switch the lights off. It glows — no batteries needed for the glow. Try it:
          </p>
          <button
            type="button"
            aria-pressed={dark}
            onClick={() => setDark((d) => !d)}
            className={cx(
              "mt-6 inline-flex min-h-[52px] items-center gap-3 rounded-full border-2 px-2 pr-5 text-[15px] font-semibold transition-colors duration-500",
              dark ? "border-volt/50 text-snow" : "border-ink/20 text-ink",
            )}
          >
            <span className={cx("relative h-9 w-16 rounded-full transition-colors duration-500", dark ? "bg-graphite" : "bg-ink/10")}>
              <span className={cx("absolute top-1 grid h-7 w-7 place-items-center rounded-full transition-all duration-500 ease-spring", dark ? "left-8 bg-volt text-ink" : "left-1 bg-white text-ink shadow")}>
                {dark ? <LightbulbOff size={14} /> : <Lightbulb size={14} />}
              </span>
            </span>
            {dark ? "Lights off" : "Lights on"}
          </button>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="btn-volt"
              onClick={() => actions.addToCart({ variantId, productSlug: slug, name, variantTitle, price, image })}
            >
              Add to cart · {formatINR(price)}
            </button>
            <Link href={`/products/${slug}`} className={dark ? "btn-ghost" : "btn-ghost-dark"}>
              Details
            </Link>
          </div>
          <p className={cx("mt-4 text-[12px]", dark ? "text-mist/70" : "text-ink/60")}>Illustration. Glow duration and brightness are pending supplier confirmation.</p>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[520px]" aria-hidden>
          <svg viewBox="0 0 400 400" className="h-full w-full">
            <defs>
              <radialGradient id="gd-halo" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="#C7FF46" stopOpacity="0.55" />
                <stop offset="1" stopColor="#C7FF46" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="gd-case" x1="0" y1="0" x2="0.3" y2="1">
                <stop offset="0" stopColor={dark ? "#E8FFB0" : "#F4F6EE"} style={{ transition: "stop-color .7s" }} />
                <stop offset="1" stopColor={dark ? "#9BD621" : "#D7DCCB"} style={{ transition: "stop-color .7s" }} />
              </linearGradient>
              <filter id="gd-blur"><feGaussianBlur stdDeviation="18" /></filter>
            </defs>
            <circle cx="200" cy="200" r="190" fill="url(#gd-halo)" style={{ opacity: dark ? 1 : 0, transition: "opacity .7s" }} />
            <rect x="85" y="115" width="230" height="190" rx="85" fill="#C7FF46" filter="url(#gd-blur)" style={{ opacity: dark ? 0.8 : 0, transition: "opacity .7s" }} />
            <ellipse cx="200" cy="335" rx="120" ry="14" fill="#000" opacity={dark ? 0.6 : 0.15} style={{ transition: "opacity .7s" }} />
            <g className={dark ? "" : ""}>
              <rect x="90" y="120" width="220" height="185" rx="82" fill="url(#gd-case)" />
              <path d="M92 185 H308" stroke="#000" strokeOpacity="0.15" strokeWidth="3" />
              <rect x="190" y="176" width="20" height="7" rx="3.5" fill="#fff" opacity="0.7" />
              <ellipse cx="150" cy="145" rx="48" ry="13" fill="#fff" opacity="0.4" />
            </g>
          </svg>
          <span className={cx("absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors", dark ? "text-volt" : "text-ink/60")}>
            {dark ? "Glowing" : "Charging under light"}
          </span>
        </div>
      </div>
    </div>
  );
}
