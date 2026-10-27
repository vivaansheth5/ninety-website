"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny dependency-free client store for cart, wishlist and UI overlays.
 * Cart lines carry a snapshot of display data so the cart drawer never needs
 * the full catalog in the client bundle. Persisted to localStorage.
 */
export interface CartItem {
  variantId: string;
  productSlug: string;
  name: string;
  variantTitle: string;
  price: number;
  image: string;
  quantity: number;
}

interface State {
  cart: CartItem[];
  wishlist: string[];
  cartOpen: boolean;
  searchOpen: boolean;
  menuOpen: boolean;
  toast: { id: number; text: string } | null;
  hydrated: boolean;
  /** Increments on every add — used to trigger the cart badge bounce. */
  bump: number;
}

const KEY = "impulsify:v1";
const MAX_QTY = 10;

let state: State = { cart: [], wishlist: [], cartOpen: false, searchOpen: false, menuOpen: false, toast: null, hydrated: false, bump: 0 };
const listeners = new Set<() => void>();
const serverState = state;

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify({ cart: state.cart, wishlist: state.wishlist }));
  } catch {
    /* storage unavailable (private mode) — cart still works for this session */
  }
}

function set(patch: Partial<State>, save = false) {
  state = { ...state, ...patch };
  if (save) persist();
  listeners.forEach((l) => l());
}

export function hydrateStore() {
  if (state.hydrated) return;
  let saved: Partial<State> = {};
  try {
    saved = JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    /* ignore corrupt storage */
  }
  const cart = Array.isArray(saved.cart) ? saved.cart.filter((l) => l && typeof l.variantId === "string" && l.quantity > 0) : [];
  const wishlist = Array.isArray(saved.wishlist) ? saved.wishlist.filter((s) => typeof s === "string") : [];
  set({ cart, wishlist, hydrated: true });
  window.addEventListener("storage", (e) => {
    if (e.key !== KEY || !e.newValue) return;
    try {
      const next = JSON.parse(e.newValue);
      set({ cart: next.cart ?? [], wishlist: next.wishlist ?? [] });
    } catch {
      /* ignore */
    }
  });
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(serverState),
  );
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;
export function toast(text: string) {
  clearTimeout(toastTimer);
  set({ toast: { id: Date.now(), text } });
  toastTimer = setTimeout(() => set({ toast: null }), 2600);
}

export const actions = {
  addToCart(item: Omit<CartItem, "quantity">, quantity = 1, open = true) {
    const existing = state.cart.find((l) => l.variantId === item.variantId);
    const cart = existing
      ? state.cart.map((l) => (l === existing ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + quantity) } : l))
      : [...state.cart, { ...item, quantity: Math.min(MAX_QTY, quantity) }];
    set({ cart, bump: state.bump + 1, cartOpen: open ? true : state.cartOpen }, true);
    if (!open) toast(`Added ${item.name}`);
  },
  setQuantity(variantId: string, quantity: number) {
    const q = Math.max(0, Math.min(MAX_QTY, Math.floor(quantity)));
    set({ cart: q === 0 ? state.cart.filter((l) => l.variantId !== variantId) : state.cart.map((l) => (l.variantId === variantId ? { ...l, quantity: q } : l)) }, true);
  },
  remove(variantId: string) {
    set({ cart: state.cart.filter((l) => l.variantId !== variantId) }, true);
  },
  clearCart() {
    set({ cart: [] }, true);
  },
  toggleWishlist(slug: string, name?: string) {
    const has = state.wishlist.includes(slug);
    set({ wishlist: has ? state.wishlist.filter((s) => s !== slug) : [...state.wishlist, slug] }, true);
    if (name) toast(has ? `Removed ${name} from wishlist` : `Saved ${name} to wishlist`);
  },
  openCart: (open = true) => set({ cartOpen: open, searchOpen: false, menuOpen: false }),
  openSearch: (open = true) => set({ searchOpen: open, cartOpen: false, menuOpen: false }),
  openMenu: (open = true) => set({ menuOpen: open, cartOpen: false, searchOpen: false }),
};

export const MAX_QUANTITY = MAX_QTY;
