"use client";

import { useEffect, useRef } from "react";

/**
 * Feeds pointer position (--px/--py, -1..1) and scroll offset (--sy) into CSS variables.
 * Children with the `.parallax` class + a `--depth` move on the compositor only.
 * Desktop pointer only; respects reduced motion; stops when the hero is off-screen.
 */
export function HeroParallax({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const onMove = (e: PointerEvent) => {
      if (!visible) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--px", ((e.clientX / innerWidth) * 2 - 1).toFixed(3));
        el.style.setProperty("--py", ((e.clientY / innerHeight) * 2 - 1).toFixed(3));
      });
    };
    const onScroll = () => {
      if (!visible) return;
      el.style.setProperty("--sy", `${Math.min(scrollY, 800) * -0.12}px`);
    };
    if (fine) addEventListener("pointermove", onMove, { passive: true });
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      removeEventListener("pointermove", onMove);
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
