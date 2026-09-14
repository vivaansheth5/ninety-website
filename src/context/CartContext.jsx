import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { PRODUCTS } from '../data/products.js';

const CartContext = createContext(null);
const STORAGE_KEY = 'ninety_cart_v1';

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { id, size, qty = 1 } = action;
      const idx = state.findIndex((l) => l.id === id && l.size === size);
      if (idx >= 0) {
        const next = [...state];
        next[idx] = { ...next[idx], qty: Math.min(10, next[idx].qty + qty) };
        return next;
      }
      return [...state, { id, size, qty: Math.min(10, qty) }];
    }
    case 'REMOVE':
      return state.filter((l) => !(l.id === action.id && l.size === action.size));
    case 'SET_QTY': {
      const qty = Math.max(1, Math.min(10, action.qty));
      return state.map((l) => (l.id === action.id && l.size === action.size ? { ...l, qty } : l));
    }
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(reducer, undefined, loadInitial);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  const enriched = useMemo(
    () =>
      lines
        .map((line) => {
          const product = PRODUCTS.find((p) => p.id === line.id);
          if (!product) return null;
          return { ...line, product, lineTotal: product.price * line.qty };
        })
        .filter(Boolean),
    [lines]
  );

  const subtotal = useMemo(() => enriched.reduce((sum, l) => sum + l.lineTotal, 0), [enriched]);
  const count = useMemo(() => enriched.reduce((sum, l) => sum + l.qty, 0), [enriched]);

  const value = {
    lines: enriched,
    subtotal,
    count,
    addItem: (id, size, qty = 1) => dispatch({ type: 'ADD', id, size, qty }),
    removeItem: (id, size) => dispatch({ type: 'REMOVE', id, size }),
    setQty: (id, size, qty) => dispatch({ type: 'SET_QTY', id, size, qty }),
    clear: () => dispatch({ type: 'CLEAR' }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
