"use client";

import { Heart } from "lucide-react";
import { actions, useStore } from "@/lib/store";
import { cx } from "@/lib/format";

export function WishlistButton({ slug, name, className, size = 18 }: { slug: string; name: string; className?: string; size?: number }) {
  const saved = useStore((s) => s.wishlist.includes(slug));
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        actions.toggleWishlist(slug, name);
      }}
      className={cx("grid h-10 w-10 place-items-center rounded-full transition-transform active:scale-90", className)}
    >
      <Heart key={String(saved)} size={size} className={cx(saved ? "animate-pop fill-violet text-violet" : "")} />
    </button>
  );
}
