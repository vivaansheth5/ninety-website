import type { Metadata } from "next";
import { generalFaq } from "@/data/faq";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/ui/JsonLd";

export const metadata: Metadata = { title: "FAQ", description: "Answers about Impulsify orders, shipping, returns, checkout and product information.", alternates: { canonical: "/faq" } };

export default function FaqPage() {
  return (
    <div className="container-x grid grid-cols-1 gap-10 pb-20 pt-10 lg:grid-cols-[1fr_1.6fr] lg:pt-16">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: generalFaq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
      <div>
        <p className="eyebrow">Help centre</p>
        <h1 className="h-section mt-2">Frequently asked</h1>
        <p className="mt-3 text-mist">Can&apos;t find what you need? <a href="/contact" className="text-volt underline underline-offset-4">Contact us</a>.</p>
      </div>
      <Faq items={generalFaq} />
    </div>
  );
}
