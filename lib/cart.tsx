"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { resolveLines, type CartLine } from "./whatsapp";

const STORAGE_KEY = "ltc-pedido-v1";

type CartContextValue = {
  lines: CartLine[];
  count: number;
  total: number;
  qtyOf: (id: string) => number;
  add: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  /** Last product added, so the UI can confirm it without opening the drawer. */
  lastAdded: { id: string; at: number } | null;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStored(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is CartLine => typeof l?.id === "string" && Number.isInteger(l?.qty) && l.qty > 0 && l.qty < 100,
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<CartContextValue["lastAdded"]>(null);

  // The order survives a reload on this device; it is never sent anywhere but WhatsApp.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time restore after hydration
    setLines(readStored());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* private mode or blocked storage: the order still works for this visit */
    }
  }, [lines, hydrated]);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((prev) => {
      const next = Math.max(0, Math.min(99, Math.round(qty)));
      if (next === 0) return prev.filter((l) => l.id !== id);
      return prev.some((l) => l.id === id)
        ? prev.map((l) => (l.id === id ? { ...l, qty: next } : l))
        : [...prev, { id, qty: next }];
    });
  }, []);

  const add = useCallback((id: string) => {
    setLines((prev) =>
      prev.some((l) => l.id === id)
        ? prev.map((l) => (l.id === id ? { ...l, qty: Math.min(99, l.qty + 1) } : l))
        : [...prev, { id, qty: 1 }],
    );
    setLastAdded({ id, at: Date.now() });
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const resolved = resolveLines(lines);
    return {
      lines,
      count: resolved.reduce((n, l) => n + l.qty, 0),
      total: resolved.reduce((n, l) => n + l.subtotal, 0),
      qtyOf: (id) => lines.find((l) => l.id === id)?.qty ?? 0,
      add,
      setQty,
      clear,
      open,
      setOpen,
      lastAdded,
    };
  }, [lines, add, setQty, clear, open, lastAdded]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
