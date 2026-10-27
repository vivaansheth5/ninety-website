import { BadgeCheck, Star } from "lucide-react";
import type { Review } from "@/lib/commerce/types";

/**
 * Genuine reviews only. Returns nothing when there are none — the store never shows
 * placeholder ratings or invented reviewers. Connect Shopify's review app or another
 * provider and pass its data here.
 */
export function Reviews({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) return null;
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  return (
    <section className="container-x pb-16" aria-labelledby="reviews-title">
      <h2 id="reviews-title" className="h-section">Reviews</h2>
      <p className="mt-2 flex items-center gap-2 text-mist">
        <Star size={16} className="fill-volt text-volt" /> {avg.toFixed(1)} from {reviews.length} review{reviews.length > 1 ? "s" : ""}
      </p>
      <ul className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {reviews.map((r) => (
          <li key={r.id} className="rounded-card bg-graphite p-5">
            <p className="flex gap-0.5" aria-label={`${r.rating} out of 5`}>
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={14} className={i < r.rating ? "fill-volt text-volt" : "text-white/20"} />
              ))}
            </p>
            <p className="mt-3 font-semibold">{r.title}</p>
            <p className="mt-1 text-[14.5px] text-mist">{r.body}</p>
            <p className="mt-4 flex items-center gap-1.5 text-[12.5px] text-mist">
              {r.author} · {new Date(r.date).toLocaleDateString("en-IN")}
              {r.verifiedPurchase && (
                <span className="inline-flex items-center gap-1 text-volt">
                  <BadgeCheck size={14} /> Verified purchase
                </span>
              )}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
