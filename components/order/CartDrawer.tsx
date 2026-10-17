"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart";
import { findItem, formatPrice, fullName } from "@/lib/menu";
import { orderMessage, resolveLines, whatsappUrl } from "@/lib/whatsapp";
import { contact } from "@/lib/content";
import { AddToOrder } from "./AddToOrder";
import { Bag, Check, Close, Trash, WhatsApp } from "@/components/ui/icons";

/** The order review: a native modal dialog sliding in from the right. */
export function CartDrawer() {
  const { lines, total, count, open, setOpen, clear } = useCart();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [note, setNote] = useState("");
  const resolved = resolveLines(lines);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="pedido-title"
      onClose={() => setOpen(false)}
      onClick={(e) => {
        // A click on the backdrop (the dialog box itself, outside the panel) closes it.
        if (e.target === e.currentTarget) setOpen(false);
      }}
      className="on-paper fixed inset-y-0 right-0 left-auto m-0 h-full max-h-none w-full max-w-[28rem] bg-paper p-0 text-navy backdrop:bg-navy-deep/75 backdrop:backdrop-blur-[2px] open:motion-safe:animate-[drawer-in_0.45s_var(--ease-out-expo)]"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-4 border-b-2 border-dotted border-navy/15 px-5 py-4 md:px-6">
          <h2 id="pedido-title" className="font-script text-[2.1rem] text-navy">
            Tu pedido
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="grid size-11 place-items-center rounded-full text-navy ring-2 ring-inset ring-navy/15 transition-colors hover:bg-navy hover:text-paper"
          >
            <Close size={20} />
            <span className="sr-only">Cerrar pedido</span>
          </button>
        </div>

        {resolved.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-pink-soft text-navy">
              <Bag size={28} />
            </span>
            <p className="font-item text-lg">Tu pedido está vacío</p>
            <p className="max-w-[28ch] text-[0.9375rem] text-navy/70">Agrega productos desde la carta con el botón +.</p>
            <a
              href="#carta"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex h-12 items-center rounded-full bg-navy px-6 font-bold text-paper transition-colors hover:bg-navy-raised"
            >
              Ver la carta
            </a>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-5 md:px-6">
              {resolved.map((l) => (
                <li key={l.id} className="flex items-center gap-3 border-b-2 border-dotted border-navy/15 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-item text-[0.9375rem] leading-snug">{fullName(l.item)}</p>
                    <p className="mt-1 text-sm text-navy/65 tabular-nums">
                      {formatPrice(l.item.price)} c/u · <span className="font-bold text-navy">{formatPrice(l.subtotal)}</span>
                    </p>
                  </div>
                  <AddToOrder itemId={l.id} itemName={fullName(l.item)} tone="paper" />
                </li>
              ))}
            </ul>

            <div className="border-t-2 border-navy/10 bg-paper-2 px-5 pt-4 pb-5 md:px-6">
              <label htmlFor="pedido-nota" className="text-sm font-bold">
                Nota para el restaurante <span className="font-normal text-navy/60">(opcional)</span>
              </label>
              <textarea
                id="pedido-nota"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                maxLength={300}
                placeholder="Ej.: sin cebolla, salsa aparte"
                className="mt-2 w-full resize-none rounded-xl bg-paper px-3.5 py-2.5 text-[0.9375rem] text-navy ring-2 ring-navy/10 placeholder:text-navy/45 focus:ring-navy focus:outline-none"
              />

              <div className="mt-4 flex items-baseline justify-between">
                <span className="font-bold">
                  Total <span className="font-normal text-navy/60">({count} {count === 1 ? "producto" : "productos"})</span>
                </span>
                <span className="font-display text-[2rem] leading-none tabular-nums">{formatPrice(total)}</span>
              </div>
              <p className="mt-1 text-xs text-navy/60">El valor del domicilio se confirma por WhatsApp.</p>

              <a
                href={whatsappUrl(orderMessage(lines, note))}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex h-13 w-full items-center justify-center gap-2.5 rounded-full bg-navy text-base font-bold text-paper transition-[background-color,transform] duration-300 hover:bg-navy-raised active:scale-[0.98]"
              >
                <WhatsApp size={20} />
                Enviar pedido por WhatsApp
                <span className="sr-only"> (se abre en otra pestaña)</span>
              </a>
              <p className="mt-2 text-center text-xs text-navy/60">
                Se envía al {contact.phones.find((p) => p.whatsapp)?.display}. Ahí indicas tu nombre y dirección.
              </p>
              <button
                type="button"
                onClick={clear}
                className="mx-auto mt-3 flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-navy/70 transition-colors hover:text-navy"
              >
                <Trash size={16} />
                Vaciar pedido
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}

/**
 * Confirms each addition. On phones it stays as a bottom bar with the running
 * total while there is an order; on larger screens it is a brief toast.
 */
export function OrderBar() {
  const { count, total, open, setOpen, lastAdded } = useCart();
  const [toast, setToast] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- order restored from localStorage, client only
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!lastAdded) return;
    const found = findItem(lastAdded.id);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- transient confirmation driven by the cart
    setToast(found ? fullName(found.item) : null);
    const t = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(t);
  }, [lastAdded]);

  if (!mounted || count === 0 || open) return <div aria-live="polite" className="sr-only" />;

  return (
    <>
      <div aria-live="polite" className="sr-only">
        {toast ? `Agregado: ${toast}. Total ${formatPrice(total)}.` : ""}
      </div>

      {/* Phones: persistent bar */}
      <div className="fixed inset-x-3 bottom-3 z-40 md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-15 w-full items-center gap-3 rounded-full bg-pink pr-2 pl-5 text-left text-navy shadow-[0_14px_32px_-12px_rgba(4,3,24,0.85)] active:bg-pink-deep"
        >
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-semibold">
              {toast ? (
                <span className="inline-flex items-center gap-1">
                  <Check size={13} />
                  Agregado: {toast}
                </span>
              ) : (
                `${count} ${count === 1 ? "producto" : "productos"}`
              )}
            </span>
            <span className="block text-lg leading-tight font-extrabold tabular-nums">{formatPrice(total)}</span>
          </span>
          <span className="inline-flex h-11 items-center gap-2 rounded-full bg-navy px-4 text-sm font-bold text-paper">
            <Bag size={17} />
            Ver pedido
          </span>
        </button>
      </div>

      {/* Larger screens: transient toast */}
      {toast && (
        <div
          key={lastAdded?.at}
          className="fixed right-6 bottom-6 z-40 hidden items-center gap-4 rounded-full bg-paper py-2 pr-2 pl-5 text-navy shadow-[0_18px_40px_-14px_rgba(4,3,24,0.9)] motion-safe:animate-[toast-in_0.5s_var(--ease-out-expo)] md:flex"
        >
          <span className="grid size-7 place-items-center rounded-full bg-pink text-navy">
            <Check size={16} />
          </span>
          <span className="max-w-[16rem] truncate text-[0.9375rem] font-semibold">Agregado: {toast}</span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="h-10 rounded-full bg-navy px-4 text-sm font-bold text-paper transition-colors hover:bg-navy-raised"
          >
            Ver pedido · {formatPrice(total)}
          </button>
        </div>
      )}
    </>
  );
}
