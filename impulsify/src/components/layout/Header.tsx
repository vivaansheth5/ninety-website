"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Heart, Menu, Search, ShoppingBag } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { actions, useStore } from "@/lib/store";
import { cx } from "@/lib/format";

export interface NavCategory {
  handle: string;
  title: string;
  blurb: string;
  image: string;
  count: number;
}

const LINKS = [
  { href: "/trending", label: "Trending" },
  { href: "/collections", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

export function Header({ categories }: { categories: NavCategory[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);
  const [hoverCat, setHoverCat] = useState(0);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const count = useStore((s) => s.cart.reduce((n, l) => n + l.quantity, 0));
  const wish = useStore((s) => s.wishlist.length);
  const bump = useStore((s) => s.bump);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setMega(false), [pathname]);

  const open = () => {
    clearTimeout(closeTimer.current);
    setMega(true);
  };
  const close = () => {
    closeTimer.current = setTimeout(() => setMega(false), 140);
  };
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      className={cx(
        "sticky top-0 z-40 h-[var(--header-h)] border-b transition-colors duration-300",
        scrolled || mega ? "border-white/10 bg-ink lg:bg-ink/85 lg:backdrop-blur-xl" : "border-transparent bg-ink",
      )}
      onKeyDown={(e) => e.key === "Escape" && setMega(false)}
    >
      <div className="container-x flex h-full items-center gap-2">
        <button type="button" className="icon-btn -ml-2 lg:hidden" aria-label="Open menu" onClick={() => actions.openMenu()}>
          <Menu size={22} />
        </button>
        <Link href="/" aria-label="Impulsify home" className="mr-auto lg:mr-0">
          <Logo />
        </Link>

        <nav aria-label="Primary" className="mx-auto hidden items-center gap-1 lg:flex">
          <div onMouseEnter={open} onMouseLeave={close}>
            <Link
              href="/products"
              className={cx("group flex items-center gap-1 rounded-full px-4 py-2 text-[14px] font-medium transition-colors hover:text-volt", isActive("/products") && "text-volt")}
              aria-expanded={mega}
              aria-haspopup="true"
              onFocus={open}
            >
              All Products <ChevronDown size={14} className={cx("transition-transform duration-300", mega && "rotate-180")} />
            </Link>
          </div>
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cx("relative rounded-full px-4 py-2 text-[14px] font-medium transition-colors hover:text-volt", isActive(l.href) ? "text-volt" : "text-snow")}
              aria-current={isActive(l.href) ? "page" : undefined}
            >
              {l.label}
              {isActive(l.href) && <span className="absolute inset-x-4 -bottom-0.5 h-px bg-volt" />}
            </Link>
          ))}
        </nav>

        <div className="flex items-center lg:ml-0">
          <button type="button" className="icon-btn" aria-label="Search products" onClick={() => actions.openSearch()}>
            <Search size={20} />
          </button>
          <Link href="/wishlist" className="icon-btn hidden sm:inline-flex" aria-label={`Wishlist (${wish} items)`}>
            <Heart size={20} />
            {wish > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-violet" />}
          </Link>
          <button type="button" className="icon-btn -mr-2" aria-label={`Open cart (${count} items)`} onClick={() => actions.openCart()}>
            <ShoppingBag size={20} />
            {count > 0 && (
              <span key={bump} className="absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] animate-pop place-items-center rounded-full bg-volt px-1 font-mono text-[10px] font-bold text-ink">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mega menu — only mounted while open so its thumbnails never load up front */}
      {mega && (
        <div onMouseEnter={open} onMouseLeave={close} className="absolute inset-x-0 top-full hidden border-b border-white/10 bg-ink shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)] lg:block">
          <div className="container-x grid grid-cols-[1fr_1.1fr] gap-10 py-8 animate-fade-up [animation-duration:400ms]">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
              {categories.map((c, i) => (
                <li key={c.handle}>
                  <Link
                    href={`/collections/${c.handle}`}
                    onMouseEnter={() => setHoverCat(i)}
                    onFocus={() => setHoverCat(i)}
                    className={cx("group flex items-center justify-between rounded-xl px-3 py-3 transition-colors", hoverCat === i ? "bg-white/[0.06]" : "hover:bg-white/[0.04]")}
                  >
                    <span>
                      <span className="block font-display text-[17px] font-semibold tracking-tight">{c.title}</span>
                      <span className="block text-[12.5px] text-mist">{c.count} finds</span>
                    </span>
                    <ArrowUpRight size={16} className="text-mist transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-volt" />
                  </Link>
                </li>
              ))}
              <li className="col-span-2 mt-2">
                <Link href="/products" className="link-underline font-mono text-[12px] uppercase tracking-[0.16em] text-volt">
                  Shop all 32 products →
                </Link>
              </li>
            </ul>
            <Link href={`/collections/${categories[hoverCat].handle}`} className="relative overflow-hidden rounded-card bg-graphite" tabIndex={-1}>
              {categories.map((c, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={c.handle}
                  src={c.image}
                  alt=""
                  width={1200}
                  height={1200}
                  loading="lazy"
                  className={cx("absolute inset-0 h-full w-full object-cover transition-all duration-500", hoverCat === i ? "scale-100 opacity-100" : "scale-105 opacity-0")}
                />
              ))}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-6">
                <p className="eyebrow text-volt">Collection</p>
                <p className="font-display text-3xl font-bold tracking-tight">{categories[hoverCat].title}</p>
                <p className="text-sm text-mist">{categories[hoverCat].blurb}</p>
              </div>
              <div className="aspect-[16/10]" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
