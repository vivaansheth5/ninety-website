import type { Metadata } from "next";
import { products } from "@/data/catalog";
import { toLite } from "@/lib/lite";
import { WishlistView } from "@/components/product/WishlistView";

export const metadata: Metadata = { title: "Wishlist", robots: { index: false } };

export default function WishlistPage() {
  return (
    <div className="container-x pb-20 pt-8 lg:pt-12">
      <p className="eyebrow">Saved for later</p>
      <h1 className="h-section mt-2">Wishlist</h1>
      <WishlistView products={products.map(toLite)} />
    </div>
  );
}
