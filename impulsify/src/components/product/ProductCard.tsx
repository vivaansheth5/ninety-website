import Link from "next/link";
import type { Product } from "@/lib/commerce/types";
import { toLite } from "@/lib/lite";
import { cx, formatINR } from "@/lib/format";
import { Img } from "@/components/ui/Img";
import { QuickAdd } from "./QuickAdd";
import { WishlistButton } from "./WishlistButton";

/**
 * Server-rendered card. Only the wishlist + quick-add buttons hydrate.
 * Desktop: hover swaps to the in-action image and lifts the card (CSS only).
 */
export function ProductCard({ product, priority, tone = "dark", sizes, index = 0 }: { product: Product; priority?: boolean; tone?: "dark" | "light"; sizes?: string; index?: number }) {
  const lite = toLite(product);
  const light = tone === "light";
  return (
    <article data-reveal style={{ ["--d" as string]: `${(index % 4) * 60}ms` }} className="group relative">
      <Link href={`/products/${product.slug}`} className="block focus-visible:outline-offset-4">
        <div className={cx("spotlight relative aspect-square overflow-hidden rounded-card", light ? "bg-ink" : "bg-graphite")}>
          <Img src={product.images[0].src} alt={product.images[0].alt} blur={product.images[0].blur} priority={priority} sizes={sizes ?? "(min-width: 1024px) 25vw, 50vw"} className="transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
          <div className="absolute inset-0 hidden opacity-0 transition-opacity duration-500 [@media(hover:hover)]:block group-hover:opacity-100">
            <Img src={product.images[1].src} alt="" sizes={sizes ?? "(min-width: 1024px) 25vw, 50vw"} />
          </div>
          {product.launchPriority && <span className="absolute left-2.5 top-2.5 rounded-full bg-volt px-2 py-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.12em] text-ink sm:left-3 sm:top-3">New</span>}
          {product.availability === "sold_out" && <span className="absolute inset-x-0 bottom-0 bg-ink/80 py-1.5 text-center font-mono text-[11px] uppercase tracking-widest">Sold out</span>}
        </div>
        <div className="mt-3 pr-11">
          <h3 className={cx("line-clamp-2 text-[14px] font-semibold leading-snug sm:text-[15px]", light ? "text-ink" : "text-snow")}>{product.name}</h3>
          <p className={cx("mt-0.5 hidden truncate text-[13px] sm:block", light ? "text-ink/60" : "text-mist")}>{product.headline}</p>
          <p className={cx("mt-1.5 font-mono text-[14px] font-semibold", light ? "text-ink" : "text-snow")}>{formatINR(product.price.amount)}</p>
        </div>
      </Link>
      <WishlistButton slug={product.slug} name={product.name} className="absolute right-1.5 top-1.5 bg-ink/60 text-snow sm:right-2 sm:top-2" size={17} />
      {product.availability !== "sold_out" && <QuickAdd p={lite} className="absolute bottom-[6px] right-0" />}
    </article>
  );
}
