import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { policies } from "@/data/policies";

export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(policies).map((policy) => ({ policy }));
type Params = { params: Promise<{ policy: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = policies[(await params).policy];
  return p ? { title: p.title, description: p.intro, alternates: { canonical: `/policies/${(await params).policy}` } } : {};
}

export default async function PolicyPage({ params }: Params) {
  const key = (await params).policy;
  const p = policies[key];
  if (!p) notFound();
  return (
    <article className="container-x max-w-3xl pb-20 pt-10 lg:pt-16">
      <p className="eyebrow">Policies</p>
      <h1 className="h-section mt-2">{p.title}</h1>
      <p className="mt-4 text-[17px] text-mist">{p.intro}</p>
      <p className="mt-6 rounded-xl border border-dashed border-volt/40 bg-volt/5 p-4 text-[13.5px] text-snow/80">
        Draft template. Items in [brackets] must be completed by the store owner and reviewed before launch.
      </p>
      {p.sections.map((s) => (
        <section key={s.h} className="mt-10">
          <h2 className="font-display text-[22px] font-bold tracking-tight">{s.h}</h2>
          {s.body.map((b) => (
            <p key={b} className="mt-3 text-[16px] leading-relaxed text-snow/80">{b}</p>
          ))}
        </section>
      ))}
      <nav className="mt-14 flex flex-wrap gap-2" aria-label="Other policies">
        {Object.entries(policies).filter(([k]) => k !== key).map(([k, v]) => (
          <Link key={k} href={`/policies/${k}`} className="rounded-full border border-white/15 px-4 py-2 text-[14px] hover:border-volt hover:text-volt">{v.title}</Link>
        ))}
      </nav>
    </article>
  );
}
