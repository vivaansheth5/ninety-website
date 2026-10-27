"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatINR } from "@/lib/format";
import type { LiteProduct } from "@/lib/lite";
import { QuickAdd } from "./QuickAdd";
import { WishlistButton } from "./WishlistButton";

export function WishlistView({ products }: { products: LiteProduct[] }) {
  const slugs = useStore((s) => s.wishlist);
  const hydrated = useStore((s) => s.hydrated);
  const list = slugs.map((s) => products.find((p) => p.slug === s)).filter(Boolean) as LiteProduct[];
  if (!hydrated) return <div className="mt-10 h-40" />;
  if (!list.length)
    return (
      <div className="mt-10 rounded-card border border-dashed border-white/15 p-10 text-center">
        <Heart className="mx-auto text-violet" size={32} />
        <p className="mt-4 font-display text-2xl font-bold tracking-tight">No saved finds yet</p>
        <p className="mt-1 text-mist">Tap the heart on anything that catches your eye. It&apos;s saved on this device.</p>
        <Link href="/products" className="btn-volt mt-6">Start exploring</Link>
      </div>
    );
  return (
    <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
      {list.map((p) => (
        <li key={p.slug} className="relative">
          <Link href={`/products/${p.slug}`} className="block">
            <div className="aspect-square overflow-hidden rounded-card bg-graphite">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt={p.imageAlt} width={600} height={600} className="h-full w-full object-cover" />
            </div>
            <p className="mt-3 pr-11 text-[14.5px] font-semibold leading-snug">{p.name}</p>
            <p className="mt-1 font-mono text-[14px]">{formatINR(p.price)}</p>
          </Link>
          <WishlistButton slug={p.slug} name={p.name} className="absolute right-1.5 top-1.5 bg-ink/50 text-snow" size={17} />
          <QuickAdd p={p} className="absolute bottom-0 right-0" />
        </li>
      ))}
    </ul>
  );
}
