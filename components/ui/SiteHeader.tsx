"use client";

import { useEffect, useRef, useState } from "react";
import { contact, nav } from "@/lib/content";
import { useCart } from "@/lib/cart";
import { greetingMessage, whatsappUrl } from "@/lib/whatsapp";
import { Logo } from "./Logo";
import { Bag, Close, MenuIcon, WhatsApp } from "./icons";

/**
 * Solid navy bar — the exact ground of the logo, so the logo reads as printed on it.
 * The order button turns into "Mi pedido" (with a live count) as soon as something is added.
 */
export function SiteHeader() {
  const { count, setOpen, lastAdded } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string>("#top");
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- the count comes from localStorage, client only
  useEffect(() => setMounted(true), []);

  // Highlight the section in view.
  useEffect(() => {
    const ids = nav.map((n) => n.href.slice(1));
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const hasOrder = mounted && count > 0;

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-navy shadow-[0_8px_24px_-16px_rgba(4,3,24,0.9)]">
      <div className="mx-auto flex h-[4.5rem] max-w-[1400px] items-center justify-between gap-4 px-4 md:h-[5.25rem] md:px-8">
        <a href="#top" className="-my-1 shrink-0 rounded-md" aria-label="Los Tres Cerditos Restaurante, ir al inicio">
          <Logo width={74} priority className="md:w-[88px]!" />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={active === item.href ? "true" : undefined}
                  className="relative block rounded-full px-4 py-2 text-[0.9375rem] font-semibold text-lilac transition-colors duration-300 hover:text-paper aria-[current]:text-paper"
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={`absolute inset-x-4 -bottom-0.5 h-[3px] rounded-full bg-pink transition-transform duration-500 ease-(--ease-out-expo) ${active === item.href ? "scale-x-100" : "scale-x-0"}`}
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {hasOrder ? (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-pink pr-2 pl-4 text-[0.9375rem] font-bold text-navy transition-colors duration-300 hover:bg-pink-soft active:bg-pink-deep md:h-12 md:pl-5"
            >
              <Bag size={19} />
              <span className="max-sm:sr-only">Mi pedido</span>
              <span
                key={lastAdded?.at}
                className="grid h-7 min-w-7 place-items-center rounded-full bg-navy px-1.5 text-[0.8125rem] text-paper tabular-nums motion-safe:animate-[pop_0.45s_var(--ease-out-expo)]"
              >
                <span className="sr-only">Productos: </span>
                {count}
              </span>
            </button>
          ) : (
            <a
              href={whatsappUrl(greetingMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-pink px-4 text-[0.9375rem] font-bold text-navy transition-colors duration-300 hover:bg-pink-soft active:bg-pink-deep md:h-12 md:px-5"
            >
              <WhatsApp size={19} />
              <span className="max-sm:sr-only">Pedir por WhatsApp</span>
              <span className="sr-only"> (se abre en otra pestaña)</span>
            </a>
          )}

          <button
            ref={toggleRef}
            type="button"
            className="grid size-11 place-items-center rounded-full text-paper ring-2 ring-inset ring-paper/25 transition-colors hover:bg-paper/10 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="sr-only">{menuOpen ? "Cerrar menú" : "Abrir menú"}</span>
            {menuOpen ? <Close size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="menu-movil"
        hidden={!menuOpen}
        className="max-h-[calc(100svh-4.5rem)] overflow-y-auto border-t border-navy-line bg-navy lg:hidden"
      >
        <nav aria-label="Principal (móvil)" className="px-4 pt-3 pb-6">
          <ul>
            {nav.map((item) => (
              <li key={item.href} className="border-b border-navy-line/70">
                <a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active === item.href ? "true" : undefined}
                  className="font-display flex items-center justify-between py-4 text-[2rem] text-paper aria-[current]:text-pink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="label mt-6 text-lilac-dim">Domicilios</p>
          <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
            {contact.phones.map((p) => (
              <li key={p.tel}>
                <a href={`tel:${p.tel}`} className="text-lg font-semibold text-paper tabular-nums underline-offset-4 hover:underline">
                  {p.display}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
