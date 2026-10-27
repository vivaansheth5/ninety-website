import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { categories } from "@/data/categories";
import { products } from "@/data/catalog";
import { toLite } from "@/lib/lite";
import { site } from "@/lib/site";

// Self-hosted, subset (Latin + ₹ + punctuation) variable fonts: ~63 KB total instead of ~163 KB.
const display = localFont({ src: "../fonts/SpaceGrotesk-Variable.woff2", variable: "--font-display", weight: "300 700", display: "swap", preload: true });
const sans = localFont({ src: "../fonts/Geist-Variable-subset.woff2", variable: "--font-geist-sans", weight: "100 900", display: "swap", preload: true });
const mono = localFont({ src: "../fonts/GeistMono-Variable-subset.woff2", variable: "--font-geist-mono", weight: "100 900", display: "swap", preload: false, fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  openGraph: { type: "website", siteName: site.name, locale: "en_IN", title: `${site.name} — ${site.tagline}`, description: site.description, images: ["/og.png"] },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#111318", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const lite = products.map(toLite);
  const nav = categories.map((c) => {
    const p = products.find((x) => x.slug === c.coverProduct)!;
    return { handle: c.handle, title: c.title, blurb: c.blurb, image: p.images[0].src, count: products.filter((x) => x.categories.includes(c.id)).length };
  });
  return (
    <html lang="en-IN" className={`${sans.variable} ${mono.variable} ${display.variable}`}>
      <body className="min-h-dvh pb-[68px] lg:pb-0">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-volt focus:px-4 focus:py-2 focus:text-ink">
          Skip to content
        </a>
        <AnnouncementBar />
        <Header categories={nav} />
        <main id="main">{children}</main>
        <Footer categories={nav} />
        <AppShell products={lite} categories={nav} />
        {/* Runs right after the HTML is parsed, before hydration: marks only BELOW-the-fold elements
            for reveal, so on-screen content (and the LCP element) is never hidden. */}
        <script dangerouslySetInnerHTML={{ __html: "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.querySelectorAll('[data-reveal]').forEach(function(e){e.setAttribute('data-rv','');if(e.getBoundingClientRect().top>innerHeight)e.classList.add('pre')})" }} />
      </body>
    </html>
  );
}
