"use client";

import { useRef } from "react";
import { featured, findItem, formatPrice, fullName } from "@/lib/menu";
import { useReveals } from "@/lib/use-reveals";
import { askMessage, whatsappUrl } from "@/lib/whatsapp";
import { AddToOrder } from "@/components/order/AddToOrder";
import { MaskedLines, Stars } from "@/components/ui/Heading";
import { WhatsApp } from "@/components/ui/icons";
import { Photo } from "@/components/ui/Photo";

const cards = featured.flatMap((f) => {
  const found = findItem(f.itemId);
  return found ? [{ ...found, image: f.image }] : [];
});

export function Featured() {
  const ref = useRef<HTMLElement>(null);
  useReveals(ref);

  return (
    <section id="destacados" ref={ref} aria-labelledby="destacados-title" className="relative bg-navy">
      <div className="mx-auto max-w-[1400px] px-4 pt-24 pb-24 md:px-8 md:pt-32 md:pb-32">
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <h2 id="destacados-title" className="font-display text-[clamp(3rem,8vw,6rem)]">
            <MaskedLines lines={["Para abrir", "el apetito"]} />
          </h2>
          <p data-reveal className="max-w-[38ch] text-base leading-relaxed text-lilac md:text-lg">
            Un plato de cada rincón de la carta, de la hamburguesa costeña al cerdo a la llanera del fin de semana.
          </p>
        </div>

        <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:snap-none md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-3">
          {cards.map(({ item, category, image }, i) => (
            <li
              key={item.id}
              data-reveal
              data-reveal-delay={String((i % 3) * 0.08)}
              className="w-[82vw] max-w-[24rem] shrink-0 snap-start md:w-auto md:max-w-none"
            >
              <article
                aria-labelledby={`dest-${item.id}`}
                className="group/card flex h-full flex-col overflow-hidden rounded-2xl bg-navy-raised shadow-[0_24px_48px_-28px_rgba(4,3,24,0.95)] transition-transform duration-500 ease-(--ease-out-expo) hover:-translate-y-1"
              >
                <div className="relative">
                  <Photo
                    src={image.src}
                    alt={image.alt}
                    sizes="(min-width: 1024px) 30vw, (min-width: 768px) 46vw, 82vw"
                    className="aspect-[4/3]"
                    imgClassName="transition-transform duration-[1200ms] ease-(--ease-out-expo) group-hover/card:scale-[1.05]"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-paper px-3 py-1 text-[0.8125rem] font-bold text-navy">
                    {category.name}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 id={`dest-${item.id}`} className="font-item text-[1.0625rem] leading-snug text-paper md:text-lg">
                      {fullName(item)}
                    </h3>
                    <p className="font-display shrink-0 text-[1.75rem] leading-none text-pink tabular-nums">
                      <span className="sr-only">Precio: </span>
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-lilac">
                    {item.description ?? category.description ?? category.note}
                  </p>
                  {category.note && item.description && (
                    <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-pink-soft">
                      <Stars size={9} className="gap-[2px]" />
                      {category.note}
                    </p>
                  )}

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
                    <AddToOrder itemId={item.id} itemName={fullName(item)} tone="navy" size="full" />
                    <a
                      href={whatsappUrl(askMessage(item.id))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full py-2 text-sm font-semibold text-lilac underline-offset-4 transition-colors hover:text-paper hover:underline"
                    >
                      <WhatsApp size={16} />
                      Preguntar
                      <span className="sr-only"> por {fullName(item)} por WhatsApp (se abre en otra pestaña)</span>
                    </a>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
