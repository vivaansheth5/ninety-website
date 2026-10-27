import { isDemoCheckout } from "@/lib/commerce";

export function AnnouncementBar() {
  return (
    <div className="relative z-50 bg-volt text-ink">
      <p className="container-x py-2 text-center font-mono text-[10.5px] uppercase leading-tight tracking-[0.14em] sm:text-[11px]">
        {isDemoCheckout ? "Preview store · Prices are indicative · Checkout is in demo mode" : "Shipping across India · Secure Shopify checkout"}
      </p>
    </div>
  );
}
