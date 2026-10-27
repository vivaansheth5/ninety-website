"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { AnimatePresence, LazyMotion, domAnimation, m } from "motion/react";
import { ArrowUpRight, Search, X } from "lucide-react";
import { actions, useStore } from "@/lib/store";
import { formatINR } from "@/lib/format";
import { searchProducts } from "@/lib/search";
import type { LiteProduct } from "@/lib/lite";
import type { NavCategory } from "./Header";
import { useOverlay } from "@/components/ui/useOverlay";

const SUGGESTED = ["glow", "levitating", "charger", "lamp", "speaker", "printer", "desk", "gift"];

export function SearchOverlay({ products, categories }: { products: LiteProduct[]; categories: NavCategory[] }) {
  const open = useStore((s) => s.searchOpen);
  const close = useCallback(() => actions.openSearch(false), []);
  const ref = useOverlay<HTMLDivElement>(open, close);
  const [q, setQ] = useState("");
  const dq = useDeferredValue(q);
  const results = useMemo(() => searchProducts(products, dq).slice(0, 8), [products, dq]);
  const router = useRouter();

  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence onExitComplete={() => setQ("")}>
        {open && (
          <m.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
            className="fixed inset-0 z-[60] overflow-y-auto bg-ink/[0.98]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="container-x max-w-3xl pb-24 pt-4 lg:pt-16">
              <form
                role="search"
                className="flex items-center gap-3 border-b-2 border-white/15 pb-3 focus-within:border-volt"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (results[0]) {
                    router.push(`/products/${results[0].slug}`);
                    close();
                  } else if (q.trim()) {
                    router.push(`/products?q=${encodeURIComponent(q.trim())}`);
                    close();
                  }
                }}
              >
                <Search size={24} className="shrink-0 text-volt" />
                <m.input
                  data-autofocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search gadgets, gifts, vibes…"
                  aria-label="Search products"
                  className="min-w-0 flex-1 bg-transparent font-display text-[26px] font-semibold tracking-tight placeholder:text-white/25 focus:outline-none lg:text-[40px]"
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  enterKeyHint="search"
                  autoComplete="off"
                />
                <button type="button" onClick={close} className="icon-btn shrink-0" aria-label="Close search">
                  <X size={22} />
                </button>
              </form>

              {dq.trim() ? (
                <div className="mt-6">
                  <p className="eyebrow" aria-live="polite">
                    {results.length ? `${results.length} result${results.length > 1 ? "s" : ""}` : "No matches — try another word"}
                  </p>
                  <ul className="mt-3 divide-y divide-white/10">
                    {results.map((p, i) => (
                      <m.li key={p.slug} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                        <Link href={`/products/${p.slug}`} onClick={close} className="group flex items-center gap-4 py-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.image} alt="" width={64} height={64} className="h-16 w-16 shrink-0 rounded-xl bg-graphite object-cover" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-semibold group-hover:text-volt">{p.name}</span>
                            <span className="block truncate text-[13px] text-mist">{p.headline}</span>
                          </span>
                          <span className="font-mono text-[14px]">{formatINR(p.price)}</span>
                        </Link>
                      </m.li>
                    ))}
                  </ul>
                  {results.length > 0 && (
                    <Link href={`/products?q=${encodeURIComponent(dq.trim())}`} onClick={close} className="btn-ghost mt-4">
                      See all results <ArrowUpRight size={16} />
                    </Link>
                  )}
                </div>
              ) : (
                <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2">
                  <div>
                    <p className="eyebrow">Popular searches</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {SUGGESTED.map((s) => (
                        <button key={s} type="button" onClick={() => setQ(s)} className="rounded-full border border-white/15 px-4 py-2 text-[14px] transition-colors hover:border-volt hover:text-volt">
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="eyebrow">Browse categories</p>
                    <ul className="mt-3 grid grid-cols-1 gap-1 xs:grid-cols-2">
                      {categories.map((c) => (
                        <li key={c.handle}>
                          <Link href={`/collections/${c.handle}`} onClick={close} className="block rounded-lg px-2 py-2 text-[15px] hover:bg-white/5 hover:text-volt">
                            {c.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
