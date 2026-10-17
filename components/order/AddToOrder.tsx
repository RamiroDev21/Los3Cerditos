"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { Minus, Plus } from "@/components/ui/icons";

type Props = {
  itemId: string;
  itemName: string;
  /** `paper`: navy controls on the white carta. `navy`: pink controls on dark surfaces. */
  tone?: "paper" | "navy";
  /** `full` shows "Agregar al pedido"; `compact` is a round + for dense lists. */
  size?: "full" | "compact";
};

/** Add button that becomes a quantity stepper once the product is in the order. */
export function AddToOrder({ itemId, itemName, tone = "paper", size = "compact" }: Props) {
  const { qtyOf, add, setQty } = useCart();
  // Quantities come from localStorage; render the empty state on the server and first paint.
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only hydration guard
  useEffect(() => setMounted(true), []);
  const qty = mounted ? qtyOf(itemId) : 0;

  const solid =
    tone === "paper"
      ? "bg-navy text-paper hover:bg-navy-raised active:bg-navy-deep"
      : "bg-pink text-navy hover:bg-pink-soft active:bg-pink-deep";
  const ghost =
    tone === "paper"
      ? "text-navy ring-2 ring-inset ring-navy/20 hover:ring-navy hover:bg-navy/5"
      : "text-paper ring-2 ring-inset ring-paper/30 hover:ring-paper hover:bg-paper/10";

  if (qty === 0) {
    return size === "full" ? (
      <button
        type="button"
        onClick={() => add(itemId)}
        className={`inline-flex h-11 items-center gap-2 rounded-full pr-5 pl-4 text-[0.9375rem] font-bold transition-[background-color,transform] duration-300 active:scale-[0.97] ${solid}`}
      >
        <Plus size={18} />
        Agregar al pedido
        <span className="sr-only">: {itemName}</span>
      </button>
    ) : (
      <button
        type="button"
        onClick={() => add(itemId)}
        aria-label={`Agregar ${itemName} al pedido`}
        className={`grid size-11 shrink-0 place-items-center rounded-full transition-[background-color,transform] duration-300 active:scale-90 ${solid}`}
      >
        <Plus size={20} />
      </button>
    );
  }

  return (
    <div role="group" aria-label={`Cantidad de ${itemName}`} className="inline-flex h-11 shrink-0 items-center gap-1">
      <button
        type="button"
        onClick={() => setQty(itemId, qty - 1)}
        aria-label={qty === 1 ? `Quitar ${itemName} del pedido` : `Quitar uno de ${itemName}`}
        className={`grid size-11 place-items-center rounded-full transition-[background-color,transform] duration-300 active:scale-90 ${ghost}`}
      >
        <Minus size={18} />
      </button>
      <span
        key={qty}
        aria-live="polite"
        className={`min-w-8 text-center text-lg font-bold tabular-nums motion-safe:animate-[pop_0.35s_var(--ease-out-expo)] ${tone === "paper" ? "text-navy" : "text-paper"}`}
      >
        {qty}
      </span>
      <button
        type="button"
        onClick={() => add(itemId)}
        aria-label={`Agregar otro ${itemName}`}
        className={`grid size-11 place-items-center rounded-full transition-[background-color,transform] duration-300 active:scale-90 ${solid}`}
      >
        <Plus size={18} />
      </button>
    </div>
  );
}
