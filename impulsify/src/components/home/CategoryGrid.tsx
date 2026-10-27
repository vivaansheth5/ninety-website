import Link from "next/link";
import { Picture } from "@/components/ui/Picture";

/** Mobile/tablet category tiles. Server-rendered, zero JS. */
export function CategoryGrid({ categories }: { categories: { handle: string; title: string; image: string; count: number }[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 lg:hidden">
        {categories.map((c, i) => (
          <li key={c.handle} data-reveal style={{ ["--d" as string]: `${(i % 2) * 60}ms` }}>
            <Link href={`/collections/${c.handle}`} className="group relative block aspect-[4/5] overflow-hidden rounded-card bg-graphite">
              <Picture src={c.image} alt="" sizes="50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <p className="font-display text-[17px] font-bold leading-tight tracking-tight">{c.title}</p>
                <p className="font-mono text-[11px] text-mist">{c.count} finds</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
  );
}
