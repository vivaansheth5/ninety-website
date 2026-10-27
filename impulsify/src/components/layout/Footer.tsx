import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { site } from "@/lib/site";
import type { NavCategory } from "./Header";

export function Footer({ categories }: { categories: NavCategory[] }) {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink pt-16">
      <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-[15px] text-mist">{site.tagline} A curated store for unusual gadgets and clever everyday upgrades, made for India.</p>
          <p className="mt-6 text-[13px] text-mist">
            Questions? <Link href="/contact" className="link-underline text-snow">Contact us</Link>
          </p>
        </div>
        <FooterCol title="Shop" links={[{ href: "/products", label: "All products" }, { href: "/trending", label: "Trending" }, { href: "/collections", label: "All categories" }, { href: "/wishlist", label: "Wishlist" }, ...categories.slice(0, 4).map((c) => ({ href: `/collections/${c.handle}`, label: c.title }))]} />
        <FooterCol title="Help" links={[{ href: "/faq", label: "FAQ" }, { href: "/contact", label: "Contact" }, { href: "/policies/shipping", label: "Shipping policy" }, { href: "/policies/returns", label: "Return policy" }, { href: "/policies/payments", label: "Payments" }]} />
        <FooterCol title="Company" links={[{ href: "/about", label: "About Impulsify" }, { href: "/policies/privacy", label: "Privacy policy" }, { href: "/policies/terms", label: "Terms of service" }]} />
      </div>
      <div className="container-x mt-14 flex flex-col gap-3 border-t border-white/10 py-6 text-[12px] text-mist sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Impulsify. Prices in INR. Product imagery shown is concept art until launch photography is ready.</p>
        <p className="font-mono uppercase tracking-[0.14em]">Made in India · Curated worldwide</p>
      </div>
      {/* Decorative wordmark rendered via CSS content so it isn't exposed as text. */}
      <div aria-hidden className="pointer-events-none select-none whitespace-nowrap text-center font-display text-[25vw] font-bold leading-[0.75] tracking-tightest text-white/[0.035] before:content-['IMPULSIFY']" />
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="eyebrow">{title}</p>
      <ul className="mt-4 space-y-1">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-block py-1.5 text-[14.5px] text-snow/85 transition-colors hover:text-volt">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
