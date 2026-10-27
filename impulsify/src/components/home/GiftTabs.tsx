"use client";

import { useState } from "react";
import { cx } from "@/lib/format";

/**
 * Tabs that cross-fade between server-rendered panels. Panels arrive pre-rendered
 * in the RSC payload, so switching needs no fetch.
 */
export function GiftTabs({ tabs }: { tabs: { id: string; label: string; panel: React.ReactNode }[] }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div role="tablist" aria-label="Gift ideas" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={active === i}
            aria-controls={active === i ? `panel-${t.id}` : undefined}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") setActive((active + 1) % tabs.length);
              if (e.key === "ArrowLeft") setActive((active - 1 + tabs.length) % tabs.length);
            }}
            className={cx(
              "relative min-h-[44px] shrink-0 rounded-full px-5 text-[14px] font-semibold transition-colors duration-300",
              active === i ? "bg-ink text-volt" : "bg-ink/5 text-ink hover:bg-ink/10",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      {/* Only the active panel is mounted: hidden panels cost no DOM or hydration on load. */}
      <div key={tabs[active].id} role="tabpanel" id={`panel-${tabs[active].id}`} aria-labelledby={`tab-${tabs[active].id}`} className="mt-8 animate-fade-up [animation-duration:500ms]">
        {tabs[active].panel}
      </div>
    </div>
  );
}
