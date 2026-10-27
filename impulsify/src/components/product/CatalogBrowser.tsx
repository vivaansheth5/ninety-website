"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cx, formatINR } from "@/lib/format";
import { searchProducts } from "@/lib/search";
import type { LiteProduct } from "@/lib/lite";

export interface BrowserItem extends LiteProduct {
  order: number;
  launch: boolean;
}

const PRICE = [
  { id: "all", label: "Any price", test: () => true },
  { id: "u1000", label: `Under ${formatINR(1000)}`, test: (p: number) => p < 1000 },
  { id: "1-2.5k", label: `${formatINR(1000)}–${formatINR(2500)}`, test: (p: number) => p >= 1000 && p <= 2500 },
  { id: "o2500", label: `Over ${formatINR(2500)}`, test: (p: number) => p > 2500 },
] as const;

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "name", label: "Name: A–Z" },
] as const;

/**
 * Filters server-rendered product cards on the client. Cards arrive pre-rendered
 * (passed as React nodes), so filtering only re-orders/hides them — no refetch.
 * State is mirrored to the URL (?q=&cat=&price=&sort=) for shareable links.
 */
export function CatalogBrowser({ items, cards, categories, lockedCategory }: { items: BrowserItem[]; cards: Record<string, React.ReactNode>; categories: { handle: string; title: string }[]; lockedCategory?: string }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>(lockedCategory ?? "all");
  const [price, setPrice] = useState<(typeof PRICE)[number]["id"]>("all");
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("featured");

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("q")) setQ(sp.get("q")!);
    if (!lockedCategory && sp.get("cat")) setCat(sp.get("cat")!);
    const pr = sp.get("price");
    if (pr && PRICE.some((x) => x.id === pr)) setPrice(pr as typeof price);
    const so = sp.get("sort");
    if (so && SORTS.some((x) => x.id === so)) setSort(so as typeof sort);
  }, [lockedCategory]);

  useEffect(() => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (!lockedCategory && cat !== "all") sp.set("cat", cat);
    if (price !== "all") sp.set("price", price);
    if (sort !== "featured") sp.set("sort", sort);
    const qs = sp.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [q, cat, price, sort, lockedCategory]);

  const visible = useMemo(() => {
    let list = q.trim() ? (searchProducts(items, q) as BrowserItem[]) : [...items];
    list = list.filter((p) => (cat === "all" || p.categories.includes(cat)) && PRICE.find((x) => x.id === price)!.test(p.price));
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (!q.trim()) list.sort((a, b) => a.order - b.order);
    return list;
  }, [items, q, cat, price, sort]);

  const active = (q ? 1 : 0) + (!lockedCategory && cat !== "all" ? 1 : 0) + (price !== "all" ? 1 : 0);
  const reset = () => {
    setQ("");
    if (!lockedCategory) setCat("all");
    setPrice("all");
    setSort("featured");
  };
  const select = "h-11 rounded-full border border-white/15 bg-ink px-4 pr-9 text-[14px] text-snow focus:border-volt focus:outline-none appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23A6ABB3%22 stroke-width=%222.5%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[right_14px_center] bg-no-repeat";

  return (
    <div>
      <div className="sticky top-[var(--header-h)] z-30 -mx-4 border-b border-white/10 bg-ink px-4 py-3 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative min-w-0 flex-1 basis-full sm:basis-auto">
            <span className="sr-only">Search products</span>
            <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mist" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search 32 finds…"
              className="h-11 w-full rounded-full border border-white/15 bg-transparent pl-11 pr-4 text-[15px] placeholder:text-mist/70 focus:border-volt focus:outline-none"
              enterKeyHint="search"
            />
          </label>
          <label className="flex-1 sm:flex-none">
            <span className="sr-only">Price range</span>
            <select value={price} onChange={(e) => setPrice(e.target.value as typeof price)} className={cx(select, "w-full")}>
              {PRICE.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex-1 sm:flex-none">
            <span className="sr-only">Sort by</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className={cx(select, "w-full")}>
              {SORTS.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        {!lockedCategory && (
          <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter by category">
            {[{ handle: "all", title: "All" }, ...categories].map((c) => (
              <button
                key={c.handle}
                type="button"
                aria-pressed={cat === c.handle}
                onClick={() => setCat(c.handle)}
                className={cx(
                  "min-h-[38px] shrink-0 rounded-full border px-4 text-[13.5px] font-medium transition-all duration-200",
                  cat === c.handle ? "border-volt bg-volt text-ink" : "border-white/15 text-snow/85 hover:border-white/40",
                )}
              >
                {c.title}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between text-[13px] text-mist">
        <p aria-live="polite">
          <SlidersHorizontal size={14} className="mr-1.5 inline" />
          {visible.length} {visible.length === 1 ? "product" : "products"}
        </p>
        {active > 0 && (
          <button type="button" onClick={reset} className="inline-flex min-h-[40px] items-center gap-1 text-snow underline-offset-4 hover:underline">
            <X size={14} /> Clear filters
          </button>
        )}
      </div>

      <h2 className="sr-only">Products</h2>
      {visible.length ? (
        <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12">
          {visible.map((p) => (
            <li key={p.slug}>{cards[p.slug]}</li>
          ))}
        </ul>
      ) : (
        <div className="py-20 text-center">
          <p className="font-display text-3xl font-bold tracking-tight">Nothing matches that. Yet.</p>
          <p className="mt-2 text-mist">Try a different word or clear your filters.</p>
          <button type="button" onClick={reset} className="btn-volt mt-6">
            Show everything
          </button>
        </div>
      )}
    </div>
  );
}
