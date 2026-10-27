"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * One set of delegated listeners for the whole site instead of per-component hydration:
 * - [data-reveal]  → fades in when scrolled into view (IntersectionObserver)
 * - [data-animate] → animations pause while off-screen
 * - .spotlight     → pointer-follow glow (fine pointers only)
 * - [data-magnetic]→ magnetic pull towards the cursor (fine pointers only)
 * All effects respect prefers-reduced-motion and pause while the tab is hidden.
 */
export function useInteractionEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) {
            e.target.classList.add("in");
            reveal.unobserve(e.target);
          }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.01 },
    );
    const anim = new IntersectionObserver((entries) => {
      for (const e of entries) e.target.classList.toggle("paused", !e.isIntersecting);
    });
    const scan = () => {
      if (!reduce)
        document.querySelectorAll("[data-reveal]").forEach((el) => {
          if (el.classList.contains("pre")) {
            if (!el.classList.contains("in")) reveal.observe(el);
            return;
          }
          if (el.hasAttribute("data-rv")) return; // already decided: visible
          el.setAttribute("data-rv", "");
          if (el.getBoundingClientRect().top > window.innerHeight) {
            el.classList.add("pre");
            reveal.observe(el);
          }
        });
      document.querySelectorAll("[data-animate]").forEach((el) => anim.observe(el));
    };
    scan();
    // Catch content rendered after navigation / streaming.
    let pending = 0;
    const mo = new MutationObserver(() => {
      if (pending) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        scan();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    const onVis = () => document.documentElement.classList.toggle("paused", document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      reveal.disconnect();
      anim.disconnect();
      mo.disconnect();
      cancelAnimationFrame(pending);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [pathname]);

  useEffect(() => {
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    let raf = 0;
    let magnet: HTMLElement | null = null;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const t = e.target as HTMLElement;
        const spot = t.closest<HTMLElement>(".spotlight");
        if (spot) {
          const r = spot.getBoundingClientRect();
          spot.style.setProperty("--mx", `${e.clientX - r.left}px`);
          spot.style.setProperty("--my", `${e.clientY - r.top}px`);
        }
        const m = t.closest<HTMLElement>("[data-magnetic]");
        if (magnet && magnet !== m) {
          magnet.style.transform = "";
          magnet = null;
        }
        if (m) {
          const r = m.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) * 0.22;
          const dy = (e.clientY - (r.top + r.height / 2)) * 0.32;
          m.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
          magnet = m;
        }
      });
    };
    const onLeave = () => {
      if (magnet) magnet.style.transform = "";
      magnet = null;
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);
}
