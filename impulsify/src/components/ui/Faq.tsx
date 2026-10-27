import { Plus } from "lucide-react";
import { cx } from "@/lib/format";

/** Native <details> accordion: accessible, works without JS, zero hydration. */
export function Faq({ items, light }: { items: { q: string; a: string }[]; light?: boolean }) {
  return (
    <div className={cx("divide-y border-y", light ? "divide-ink/10 border-ink/10" : "divide-white/10 border-white/10")}>
      {items.map((f) => (
        <details key={f.q} className="group">
          <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 py-4 text-[16px] font-semibold [&::-webkit-details-marker]:hidden">
            {f.q}
            <Plus size={20} className={cx("shrink-0 transition-transform duration-300 group-open:rotate-45", light ? "text-violet" : "text-volt")} />
          </summary>
          <p className={cx("pb-5 pr-8 text-[15px] leading-relaxed", light ? "text-ink/70" : "text-mist")}>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
