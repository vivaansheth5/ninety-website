import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cx } from "@/lib/format";

export function SectionHeader({ eyebrow, title, href, linkLabel = "See all", light, id, children }: { eyebrow?: string; title: React.ReactNode; href?: string; linkLabel?: string; light?: boolean; id?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3" data-reveal>
      <div className="max-w-3xl">
        {eyebrow && <p className={cx("eyebrow", light ? "!text-ink/60" : "")}>{eyebrow}</p>}
        <h2 id={id} className={cx("h-section mt-2", light ? "text-ink" : "text-snow")}>
          {title}
        </h2>
        {children}
      </div>
      {href && (
        <Link href={href} className={cx("group inline-flex min-h-[44px] items-center gap-1.5 font-mono text-[12px] uppercase tracking-[0.16em]", light ? "text-ink" : "text-volt")}>
          <span className="link-underline">{linkLabel}</span>
          <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
