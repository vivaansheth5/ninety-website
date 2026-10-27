"use client";

import { Check } from "lucide-react";
import { useStore } from "@/lib/store";

export function Toast() {
  const toast = useStore((s) => s.toast);
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-[84px] z-[70] flex justify-center px-4 lg:bottom-8">
      {toast && (
        <p key={toast.id} className="flex animate-fade-up items-center gap-2 rounded-full bg-snow px-4 py-2.5 text-[14px] font-medium text-ink shadow-2xl [animation-duration:300ms]">
          <Check size={16} className="text-violet" /> {toast.text}
        </p>
      )}
    </div>
  );
}
