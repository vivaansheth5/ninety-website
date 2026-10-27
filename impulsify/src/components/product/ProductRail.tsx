import type { Product } from "@/lib/commerce/types";
import { ProductCard } from "./ProductCard";

/** Mobile: swipeable scroll-snap rail. Desktop: 4-column grid. No JS. */
export function ProductRail({ products, tone = "dark" }: { products: Product[]; tone?: "dark" | "light" }) {
  return (
    <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0">
      {products.map((p, i) => (
        <div key={p.slug} className="w-[64vw] max-w-[300px] shrink-0 snap-start xs:w-[46vw] lg:w-auto lg:max-w-none">
          <ProductCard product={p} tone={tone} index={i} sizes="(min-width: 1024px) 25vw, 64vw" />
        </div>
      ))}
    </div>
  );
}
