import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/commerce/types";
import { cx, formatINR } from "@/lib/format";
import { Img } from "@/components/ui/Img";

/** Editorial bento of the eight launch products. Big tiles get the most surprising products. */
export function LaunchBento({ products }: { products: Product[] }) {
  const layout = [
    "col-span-2 row-span-2 lg:col-span-2 lg:row-span-2",
    "col-span-1 lg:col-span-1",
    "col-span-1 lg:col-span-1",
    "col-span-2 lg:col-span-2",
    "col-span-1 lg:col-span-1",
    "col-span-1 lg:col-span-1",
    "col-span-2 lg:col-span-1",
    "col-span-2 lg:col-span-1",
  ];
  return (
    <div className="grid grid-cols-2 gap-3 lg:auto-rows-[calc((min(100vw,1440px)-140px)/4)] lg:grid-cols-4 lg:gap-5">
      {products.map((p, i) => {
        const big = i === 0;
        const wide = /(^| )col-span-2/.test(layout[i]) && !big;
        return (
          <Link
            key={p.slug}
            href={`/products/${p.slug}`}
            data-reveal
            style={{ ["--d" as string]: `${(i % 4) * 70}ms` }}
            className={cx("spotlight group relative overflow-hidden rounded-card bg-ink text-snow", layout[i], wide ? "aspect-[2/1] lg:aspect-auto" : "aspect-square lg:aspect-auto")}
          >
            <Img
              src={p.images[0].src}
              alt={p.images[0].alt}
              sizes={big ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
              className={cx("transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]", wide && "object-[center_45%]")}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3 sm:p-5">
              <div className="min-w-0">
                <p className={cx("font-display font-bold uppercase leading-[0.95] tracking-tighter2", big ? "text-[clamp(1.6rem,5vw,3rem)]" : "text-[15px] sm:text-[20px]")}>{p.headline}</p>
                <p className="mt-1 truncate text-[12px] text-mist sm:text-[13px]">
                  {p.name} · <span className="font-mono text-snow">{formatINR(p.price.amount)}</span>
                </p>
              </div>
              <span className="hidden h-10 w-10 shrink-0 place-items-center rounded-full bg-volt text-ink transition-transform duration-300 group-hover:rotate-45 sm:grid">
                <ArrowUpRight size={18} />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
