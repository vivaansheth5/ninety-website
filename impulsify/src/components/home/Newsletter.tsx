"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

/**
 * Newsletter UI only. It does NOT store emails yet — connect Shopify Customer
 * marketing or a retention provider (see docs/RETENTION.md) before launch.
 */
export function Newsletter() {
  const [state, setState] = useState<"idle" | "invalid" | "notice">("idle");
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const email = new FormData(e.currentTarget).get("email")?.toString() ?? "";
        setState(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "notice" : "invalid");
      }}
      className="w-full max-w-md"
    >
      <label htmlFor="nl-email" className="sr-only">
        Email address
      </label>
      <div className="flex rounded-full bg-ink p-1.5 focus-within:ring-2 focus-within:ring-ink/40">
        <input id="nl-email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@email.com" className="min-w-0 flex-1 bg-transparent px-4 text-[15px] text-snow placeholder:text-mist focus:outline-none" aria-invalid={state === "invalid"} aria-describedby="nl-msg" />
        <button type="submit" className="btn-volt !min-h-[44px] !px-5">
          Join <ArrowRight size={16} />
        </button>
      </div>
      <p id="nl-msg" role="status" className="mt-3 min-h-[20px] text-[13px] text-ink/70">
        {state === "invalid" && "Please enter a valid email address."}
        {state === "notice" && "Thanks! Signups open with our launch — this preview hasn't saved your email."}
        {state === "idle" && "New drops and restocks. No spam. Unsubscribe anytime."}
      </p>
    </form>
  );
}
