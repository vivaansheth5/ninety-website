"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { actions } from "@/lib/store";
import type { LiteProduct } from "@/lib/lite";
import { cx } from "@/lib/format";

/** Quick add from a card. Products with options link to the page so the shopper picks one. */
export function QuickAdd({ p, className }: { p: LiteProduct; className?: string }) {
  const base = cx("grid h-10 w-10 place-items-center rounded-full bg-volt text-ink shadow-lg transition-transform hover:scale-105 active:scale-90", className);
  if (p.hasOptions)
    return (
      <Link href={`/products/${p.slug}`} className={base} aria-label={`Choose options for ${p.name}`}>
        <Plus size={18} strokeWidth={2.5} />
      </Link>
    );
  return (
    <button
      type="button"
      className={base}
      aria-label={`Add ${p.name} to cart`}
      onClick={(e) => {
        e.preventDefault();
        actions.addToCart({ variantId: p.firstVariantId, productSlug: p.slug, name: p.name, variantTitle: p.firstVariantTitle, price: p.price, image: p.image }, 1, false);
      }}
    >
      <Plus size={18} strokeWidth={2.5} />
    </button>
  );
}
