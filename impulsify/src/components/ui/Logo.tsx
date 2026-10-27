import { cx } from "@/lib/format";

/** Wordmark: the dot over the "i" becomes a volt spark — the "impulse". */
export function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <span className={cx("inline-flex items-baseline font-display text-[22px] font-bold tracking-[-0.06em] lg:text-[26px]", dark ? "text-ink" : "text-snow", className)}>
      <span>IMPULS</span>
      <span className="relative">
        I
        <span aria-hidden className="absolute -right-[0.18em] -top-[0.08em] h-[0.26em] w-[0.26em] rounded-full bg-volt shadow-[0_0_12px_rgba(199,255,70,0.8)]" />
      </span>
      <span>FY</span>
    </span>
  );
}
