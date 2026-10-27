"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { hydrateStore, useStore } from "@/lib/store";
import type { LiteProduct } from "@/lib/lite";
import type { NavCategory } from "./Header";
import { BottomNav } from "./BottomNav";
import { Toast } from "@/components/ui/Toast";
import { useInteractionEffects } from "@/components/ui/useInteractionEffects";

// Overlays are code-split and only downloaded the first time they are opened.
const CartDrawer = dynamic(() => import("@/components/cart/CartDrawer").then((m) => m.CartDrawer), { ssr: false });
const SearchOverlay = dynamic(() => import("./SearchOverlay").then((m) => m.SearchOverlay), { ssr: false });
const MobileMenu = dynamic(() => import("./MobileMenu").then((m) => m.MobileMenu), { ssr: false });

/** Mounts once the overlay has been opened, then stays mounted so exit animations run. */
function useOnceTrue(v: boolean) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (v) setSeen(true);
  }, [v]);
  return seen || v;
}

export function AppShell({ products, categories }: { products: LiteProduct[]; categories: NavCategory[] }) {
  const cartOpen = useStore((s) => s.cartOpen);
  const searchOpen = useStore((s) => s.searchOpen);
  const menuOpen = useStore((s) => s.menuOpen);
  const showCart = useOnceTrue(cartOpen);
  const showSearch = useOnceTrue(searchOpen);
  const showMenu = useOnceTrue(menuOpen);

  useEffect(() => hydrateStore(), []);
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) first.current = false;
    else document.documentElement.classList.add("navigated");
  }, [pathname]);
  useInteractionEffects();

  return (
    <>
      <BottomNav />
      <Toast />
      {showCart && <CartDrawer products={products} />}
      {showSearch && <SearchOverlay products={products} categories={categories} />}
      {showMenu && <MobileMenu categories={categories} />}
    </>
  );
}
