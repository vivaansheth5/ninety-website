import type { Metadata } from "next";
import { Clock, Mail } from "lucide-react";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Contact", description: "Get in touch with the Impulsify team.", alternates: { canonical: "/contact" } };

export default function ContactPage() {
  return (
    <div className="container-x max-w-3xl pb-20 pt-10 lg:pt-16">
      <p className="eyebrow">Say hello</p>
      <h1 className="h-section mt-2">Contact</h1>
      <p className="mt-4 text-[17px] text-mist">Questions about a product, an order or a partnership? We&apos;d love to hear from you.</p>
      <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-card bg-white/10 sm:grid-cols-2">
        <a href={`mailto:${site.contact.email}`} className="bg-graphite p-6 hover:bg-graphite2">
          <Mail className="text-volt" />
          <p className="mt-4 font-semibold">Email</p>
          <p className="text-mist">{site.contact.email}</p>
        </a>
        <div className="bg-graphite p-6">
          <Clock className="text-volt" />
          <p className="mt-4 font-semibold">Support hours</p>
          <p className="text-mist">{site.contact.hours}</p>
        </div>
      </div>
      {site.contact.placeholder && (
        <p className="mt-4 rounded-xl border border-dashed border-white/20 p-4 text-[13px] text-mist">
          Placeholder contact details — the store owner will add a real support email, phone number and registered business address before launch.
        </p>
      )}
    </div>
  );
}
