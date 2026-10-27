"use client";

import Link from "next/link";
import { useCallback } from "react";
import { AnimatePresence, LazyMotion, domAnimation, m } from "motion/react";
import { ArrowRight, X } from "lucide-react";
import { actions, useStore } from "@/lib/store";
import { Logo } from "@/components/ui/Logo";
import type { NavCategory } from "./Header";
import { useOverlay } from "@/components/ui/useOverlay";

const PRIMARY = [
  { href: "/products", label: "All Products" },
  { href: "/trending", label: "Trending" },
  { href: "/collections", label: "Categories" },
  { href: "/wishlist", label: "Wishlist" },
];
const SECONDARY = [
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/policies/shipping", label: "Shipping" },
  { href: "/policies/returns", label: "Returns" },
];

export function MobileMenu({ categories }: { categories: NavCategory[] }) {
  const open = useStore((s) => s.menuOpen);
  const close = useCallback(() => actions.openMenu(false), []);
  const ref = useOverlay<HTMLDivElement>(open, close);
  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence>
        {open && (
          <m.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-ink"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="container-x flex h-[var(--header-h)] shrink-0 items-center justify-between">
              <Logo />
              <button type="button" onClick={close} className="icon-btn -mr-2" aria-label="Close menu" data-autofocus>
                <X size={24} />
              </button>
            </div>
            <nav className="container-x flex-1 pb-10 pt-4" aria-label="Mobile">
              <ul>
                {PRIMARY.map((l, i) => (
                  <m.li key={l.href} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                    <Link href={l.href} onClick={close} className="flex items-center justify-between border-b border-white/10 py-3.5 font-display text-[34px] font-bold uppercase leading-none tracking-tightest active:text-volt">
                      {l.label} <ArrowRight size={22} className="text-volt" />
                    </Link>
                  </m.li>
                ))}
              </ul>
              <p className="eyebrow mt-8">Shop by category</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {categories.map((c) => (
                  <li key={c.handle}>
                    <Link href={`/collections/${c.handle}`} onClick={close} className="inline-flex min-h-[40px] items-center rounded-full border border-white/15 px-4 text-[14px] active:border-volt active:text-volt">
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="mt-8 grid grid-cols-2 gap-y-1 text-[15px] text-mist">
                {SECONDARY.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} onClick={close} className="inline-block py-2 hover:text-snow">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
