"use client";

import Link from "next/link";
import { useCallback, useState, useTransition } from "react";
import { AnimatePresence, LazyMotion, domAnimation, m } from "motion/react";
import { ArrowRight, Info, Loader2, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { actions, MAX_QUANTITY, useStore } from "@/lib/store";
import { formatINR } from "@/lib/format";
import { startCheckout } from "@/app/actions/checkout";
import type { LiteProduct } from "@/lib/lite";
import { useOverlay } from "@/components/ui/useOverlay";

export function CartDrawer({ products }: { products: LiteProduct[] }) {
  const open = useStore((s) => s.cartOpen);
  const cart = useStore((s) => s.cart);
  const close = useCallback(() => actions.openCart(false), []);
  const ref = useOverlay<HTMLDivElement>(open, close);
  const [pending, startTransition] = useTransition();
  const [demo, setDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = cart.reduce((s, l) => s + l.price * l.quantity, 0);
  const count = cart.reduce((s, l) => s + l.quantity, 0);
  const suggestions = products.filter((p) => !cart.some((l) => l.productSlug === p.slug)).slice(0, 3);

  const checkout = () => {
    setError(null);
    startTransition(async () => {
      const res = await startCheckout(cart.map((l) => ({ productSlug: l.productSlug, variantId: l.variantId, quantity: l.quantity })));
      if (res.ok) window.location.href = res.url;
      else if (res.demo) setDemo(true);
      else setError(res.error);
    });
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence onExitComplete={() => setDemo(false)}>
        {open && (
          <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Shopping cart">
            <m.button
              type="button"
              aria-label="Close cart"
              tabIndex={-1}
              className="absolute inset-0 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={close}
            />
            <m.div
              ref={ref}
              className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-paper text-ink shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
            >
              <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
                <p className="font-display text-xl font-bold tracking-tight">
                  Your cart <span className="font-mono text-sm font-normal text-ink/60">({count})</span>
                </p>
                <button type="button" onClick={close} className="grid h-11 w-11 place-items-center rounded-full hover:bg-ink/5" aria-label="Close cart" data-autofocus>
                  <X size={20} />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="flex flex-1 flex-col overflow-y-auto px-5 py-8">
                  <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-ink text-volt">
                    <ShoppingBag size={30} />
                  </div>
                  <p className="mt-5 text-center font-display text-2xl font-bold tracking-tight">Nothing here. Yet.</p>
                  <p className="mt-1 text-center text-ink/60">Your next obsession is one tap away.</p>
                  <Link href="/products" onClick={close} className="btn-dark mx-auto mt-6">
                    Explore all products <ArrowRight size={16} />
                  </Link>
                  <p className="eyebrow mt-10 !text-ink/60">Trending right now</p>
                  <ul className="mt-3 space-y-2">
                    {suggestions.map((p) => (
                      <li key={p.slug}>
                        <Link href={`/products/${p.slug}`} onClick={close} className="flex items-center gap-3 rounded-xl p-2 hover:bg-ink/5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.image} alt="" width={56} height={56} className="h-14 w-14 rounded-lg bg-ink object-cover" loading="lazy" />
                          <span className="flex-1 text-[14px] font-medium leading-tight">{p.name}</span>
                          <span className="font-mono text-[13px]">{formatINR(p.price)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <>
                  <ul className="flex-1 divide-y divide-ink/10 overflow-y-auto px-5">
                    <AnimatePresence initial={false}>
                      {cart.map((l) => (
                        <m.li key={l.variantId} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 40 }} className="flex gap-3 py-4">
                          <Link href={`/products/${l.productSlug}`} onClick={close} className="h-[84px] w-[84px] shrink-0 overflow-hidden rounded-xl bg-ink">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={l.image} alt="" width={84} height={84} className="h-full w-full object-cover" />
                          </Link>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <Link href={`/products/${l.productSlug}`} onClick={close} className="line-clamp-2 text-[14.5px] font-semibold leading-snug">
                              {l.name}
                            </Link>
                            {l.variantTitle !== "Default" && <p className="text-[12.5px] text-ink/60">{l.variantTitle}</p>}
                            <div className="mt-auto flex items-center justify-between pt-2">
                              <div className="flex items-center rounded-full border border-ink/15">
                                <button type="button" className="grid h-9 w-9 place-items-center rounded-full hover:bg-ink/5" aria-label={`Decrease quantity of ${l.name}`} onClick={() => actions.setQuantity(l.variantId, l.quantity - 1)}>
                                  <Minus size={14} />
                                </button>
                                <span className="w-7 text-center font-mono text-[14px]" aria-live="polite">{l.quantity}</span>
                                <button type="button" className="grid h-9 w-9 place-items-center rounded-full hover:bg-ink/5 disabled:opacity-30" aria-label={`Increase quantity of ${l.name}`} disabled={l.quantity >= MAX_QUANTITY} onClick={() => actions.setQuantity(l.variantId, l.quantity + 1)}>
                                  <Plus size={14} />
                                </button>
                              </div>
                              <span className="font-mono text-[14px] font-semibold">{formatINR(l.price * l.quantity)}</span>
                            </div>
                          </div>
                          <button type="button" className="-mr-2 grid h-9 w-9 place-items-center self-start rounded-full text-ink/60 hover:bg-ink/5 hover:text-ink" aria-label={`Remove ${l.name}`} onClick={() => actions.remove(l.variantId)}>
                            <Trash2 size={16} />
                          </button>
                        </m.li>
                      ))}
                    </AnimatePresence>
                  </ul>

                  <div className="border-t border-ink/10 bg-white px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[15px] font-medium">Subtotal</span>
                      <span className="font-mono text-xl font-bold">{formatINR(subtotal)}</span>
                    </div>
                    <p className="mt-1 text-[12.5px] text-ink/60">Shipping and taxes are calculated at checkout. Prices shown are indicative in this preview.</p>
                    {demo ? (
                      <div className="mt-4 rounded-2xl border border-violet/40 bg-violet/10 p-4 text-[13.5px]" role="status">
                        <p className="flex items-center gap-2 font-semibold">
                          <Info size={16} className="text-violet" /> Checkout demo mode
                        </p>
                        <p className="mt-1 text-ink/70">
                          This preview isn&apos;t connected to Shopify yet, so no order was placed and no payment was taken. Once the store owner connects Shopify, this button opens Shopify&apos;s secure hosted checkout.
                        </p>
                      </div>
                    ) : (
                      <button type="button" onClick={checkout} disabled={pending} className="btn-dark mt-4 w-full !min-h-[54px] text-base">
                        {pending ? <Loader2 size={18} className="animate-spin" /> : null}
                        {pending ? "Starting checkout…" : "Checkout"}
                        {!pending && <ArrowRight size={18} />}
                      </button>
                    )}
                    {error && <p className="mt-2 text-[13px] text-red-600" role="alert">{error}</p>}
                    <button type="button" onClick={close} className="mt-2 w-full py-2 text-[13.5px] font-medium text-ink/60 underline-offset-4 hover:underline">
                      Continue shopping
                    </button>
                  </div>
                </>
              )}
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
