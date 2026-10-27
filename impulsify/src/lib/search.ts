import type { LiteProduct } from "./lite";

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9₹ ]/g, " ");

/** Lightweight ranked search across name, headline, tags and categories. */
export function searchProducts(products: LiteProduct[], query: string): LiteProduct[] {
  const terms = norm(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return products
    .map((p) => {
      const name = norm(p.name), rest = norm(`${p.headline} ${p.tags.join(" ")} ${p.categories.join(" ").replace(/-/g, " ")}`);
      let score = 0;
      for (const t of terms) {
        if (name.split(" ").some((w) => w.startsWith(t))) score += 3;
        else if (name.includes(t)) score += 2;
        else if (rest.includes(t)) score += 1;
        else return { p, score: 0 };
      }
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);
}
