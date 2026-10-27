const LINES = ["WEIRDLY USEFUL. SERIOUSLY COOL.", "SMALL THINGS. BIG WANT.", "NOT NECESSARY. TOTALLY IRRESISTIBLE.", "YOUR NEXT OBSESSION IS HERE."];

export function Marquee({ tone = "volt" }: { tone?: "volt" | "violet" }) {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {LINES.map((l) => (
        <span key={l} className="flex items-center whitespace-nowrap px-5 font-display text-[22px] font-bold uppercase tracking-tighter2 lg:text-[34px]">
          {l}
          <span className="ml-10 text-[0.7em]" aria-hidden>✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <div data-animate className={`marquee overflow-hidden py-3 lg:py-4 ${tone === "volt" ? "bg-volt text-ink" : "bg-violet text-ink"}`}>
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
