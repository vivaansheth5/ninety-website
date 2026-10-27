"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, LayoutGrid, Search, ShoppingBag } from "lucide-react";
import { actions, useStore } from "@/lib/store";
import { cx } from "@/lib/format";

/** Thumb-zone navigation for phones. Hidden on product pages, where the sticky buy bar takes this slot. */
export function BottomNav() {
  const pathname = usePathname();
  const count = useStore((s) => s.cart.reduce((n, l) => n + l.quantity, 0));
  const bump = useStore((s) => s.bump);
  if (pathname.startsWith("/products/")) return null;
  const item = "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10.5px] font-medium min-h-[56px]";
  const active = (p: string) => (p === "/" ? pathname === "/" : pathname.startsWith(p));
  return (
    <nav aria-label="Quick navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="flex">
        <Link href="/" className={cx(item, active("/") ? "text-volt" : "text-mist")}>
          <Home size={20} /> Home
        </Link>
        <Link href="/products" className={cx(item, active("/products") ? "text-volt" : "text-mist")}>
          <LayoutGrid size={20} /> Shop
        </Link>
        <button type="button" className={cx(item, "text-mist")} onClick={() => actions.openSearch()}>
          <Search size={20} /> Search
        </button>
        <Link href="/wishlist" className={cx(item, active("/wishlist") ? "text-volt" : "text-mist")}>
          <Heart size={20} /> Saved
        </Link>
        <button type="button" className={cx(item, "relative text-mist")} onClick={() => actions.openCart()}>
          <span className="relative">
            <ShoppingBag size={20} />
            {count > 0 && (
              <span key={bump} className="absolute -right-2.5 -top-1.5 grid h-4 min-w-4 animate-pop place-items-center rounded-full bg-volt px-1 font-mono text-[9.5px] font-bold text-ink">
                {count}
              </span>
            )}
          </span>
          Cart
        </button>
      </div>
    </nav>
  );
}
