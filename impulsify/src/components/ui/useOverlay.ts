"use client";

import { useEffect, useRef } from "react";

/** Scroll lock, Escape-to-close, focus capture and focus restore for modal overlays. */
export function useOverlay<T extends HTMLElement>(open: boolean, onClose: () => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const sbw = window.innerWidth - html.clientWidth;
    html.style.overflow = "hidden";
    if (sbw) html.style.paddingRight = `${sbw}px`;
    const t = setTimeout(() => ref.current?.querySelector<HTMLElement>("[data-autofocus], button, a, input")?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && ref.current) {
        const f = ref.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      html.style.overflow = "";
      html.style.paddingRight = "";
      document.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [open, onClose]);
  return ref;
}
