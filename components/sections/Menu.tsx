"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { formatPrice, fullName, menu, type MenuCategory } from "@/lib/menu";
import { useReveals } from "@/lib/use-reveals";
import { AddToOrder } from "@/components/order/AddToOrder";
import { MaskedLines, StarredTitle } from "@/components/ui/Heading";
import { Clock } from "@/components/ui/icons";
import { Photo } from "@/components/ui/Photo";

function CategoryPanel({ category }: { category: MenuCategory }) {
  const weekendOnly = /sábados|domingos/i.test(category.note ?? "");

  return (
    <div className="grid grid-cols-1 gap-8 md:gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
      <div className="min-w-0 lg:sticky lg:top-[11rem] lg:self-start">
        <Photo
          key={category.id}
          src={category.image.src}
          alt={category.image.alt}
          sizes="(min-width: 1024px) 38vw, 100vw"
          className="aspect-[16/10] rounded-2xl motion-safe:animate-[fade-in_0.6s_ease-out_both] lg:aspect-[4/5]"
        />
      </div>

      <div className="min-w-0">
        <h3 className="text-center text-[clamp(2.1rem,7vw,3.5rem)] text-navy lg:text-left">
          <StarredTitle className="lg:justify-start" starSize={16}>
            {category.name}
          </StarredTitle>
        </h3>

        {category.note && (
          <p
            className={`mt-4 text-center text-[0.9375rem] font-bold text-navy lg:text-left ${weekendOnly ? "flex items-center justify-center gap-2 lg:justify-start" : ""}`}
          >
            {weekendOnly && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-soft px-3 py-1 text-navy">
                <Clock size={16} />
                {category.note}
              </span>
            )}
            {!weekendOnly && category.note}
          </p>
        )}
        {category.description && (
          <p className="mx-auto mt-4 max-w-[60ch] text-center text-base leading-relaxed text-navy/75 lg:mx-0 lg:text-left">
            {category.description}
          </p>
        )}

        <ul className="mt-8 border-t-2 border-dotted border-navy/20">
          {category.items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 border-b-2 border-dotted border-navy/20 py-5 sm:gap-6">
              <div className="min-w-0 flex-1">
                <p className="flex items-baseline gap-2 text-navy">
                  <span className="font-item text-[0.9375rem] leading-snug sm:text-base">{item.name}</span>
                  <span className="leader" aria-hidden />
                  <span className="shrink-0 text-[1.0625rem] font-extrabold tabular-nums sm:text-lg">
                    <span className="sr-only">, precio </span>
                    {formatPrice(item.price)}
                  </span>
                </p>
                {item.description && <p className="mt-1.5 max-w-[62ch] text-[0.9375rem] leading-relaxed text-navy/70">{item.description}</p>}
              </div>
              <AddToOrder itemId={item.id} itemName={fullName(item)} tone="paper" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * The carta, set as the printed sheet it comes from: white paper, navy ink,
 * hand-lettered category titles between stars and dotted price leaders.
 * One category at a time behind an ARIA tablist keeps a long carta short.
 */
export function Menu() {
  const ref = useRef<HTMLElement>(null);
  useReveals(ref);
  const [activeId, setActiveId] = useState(menu[0].id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const sheetRef = useRef<HTMLDivElement>(null);
  const active = menu.find((c) => c.id === activeId) ?? menu[0];

  const select = (id: string, focus = false) => {
    setActiveId(id);
    const tab = tabRefs.current[id];
    tab?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    if (focus) tab?.focus();
    // When the tab bar is stuck mid-carta, bring the new category's start back into view.
    const sheet = sheetRef.current;
    if (sheet && sheet.getBoundingClientRect().top < 0) sheet.scrollIntoView({ block: "start" });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const i = menu.findIndex((c) => c.id === activeId);
    const go = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: menu.length - 1 }[e.key];
    if (go === undefined) return;
    e.preventDefault();
    select(menu[(go + menu.length) % menu.length].id, true);
  };

  return (
    <section id="carta" ref={ref} aria-labelledby="carta-title" className="relative bg-navy pb-24 md:pb-32">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between">
          <h2 id="carta-title" className="font-display text-[clamp(3rem,8vw,6rem)]">
            <MaskedLines lines={["La carta"]} />
          </h2>
          <p data-reveal className="max-w-[40ch] text-base leading-relaxed text-lilac md:text-lg">
            Toda la carta, con sus precios. Elige una categoría, agrega lo que se te antoje y envía tu pedido por WhatsApp.
          </p>
        </div>

        <div ref={sheetRef} className="on-paper sheet-corners scroll-mt-[4.5rem] rounded-[1.75rem] md:scroll-mt-[5.25rem] bg-paper text-navy shadow-[0_40px_80px_-40px_rgba(4,3,24,0.9)]">
          {/* Category tabs — stick under the header while the carta scrolls. */}
          <div className="sticky top-[4.5rem] z-20 rounded-t-[1.75rem] bg-paper/95 backdrop-blur-sm md:top-[5.25rem]">
            <div
              role="tablist"
              aria-label="Categorías de la carta"
              className="no-scrollbar flex gap-2 overflow-x-auto px-5 pt-6 pb-4 md:px-10 md:pt-9 lg:flex-wrap lg:justify-center"
            >
              {menu.map((c) => {
                const selected = c.id === activeId;
                return (
                  <button
                    key={c.id}
                    ref={(el) => {
                      tabRefs.current[c.id] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`tab-${c.id}`}
                    aria-selected={selected}
                    aria-controls="carta-panel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => select(c.id)}
                    onKeyDown={onKeyDown}
                    className={`h-10 shrink-0 rounded-full px-4 text-[0.9375rem] font-bold whitespace-nowrap transition-colors duration-300 ${
                      selected ? "bg-navy text-paper" : "bg-paper-2 text-navy hover:bg-pink-soft"
                    }`}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
            <div className="mx-5 border-b-2 border-dotted border-navy/15 md:mx-10" aria-hidden />
          </div>

          <div
            id="carta-panel"
            role="tabpanel"
            aria-labelledby={`tab-${active.id}`}
            tabIndex={0}
            className="px-5 pt-8 pb-12 md:px-10 md:pt-12 md:pb-16"
          >
            <CategoryPanel key={active.id} category={active} />
          </div>
        </div>
      </div>
    </section>
  );
}
