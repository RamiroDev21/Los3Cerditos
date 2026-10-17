"use client";

import { useRef } from "react";
import { brand } from "@/lib/content";
import { useReveals } from "@/lib/use-reveals";
import { Stars } from "@/components/ui/Heading";
import { Logo } from "@/components/ui/Logo";

/**
 * Who they are, told only with what the restaurant itself prints: the four
 * specialties that head the carta (alternating white and colour, as on the
 * printed header), the logo and the slogan.
 */
export function About() {
  const ref = useRef<HTMLElement>(null);
  useReveals(ref);

  return (
    <section id="nosotros" ref={ref} aria-labelledby="nosotros-title" className="relative overflow-hidden bg-navy">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-4 pt-24 pb-24 md:px-8 md:pt-32 md:pb-32 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="lg:col-span-7">
          <h2 id="nosotros-title" className="sr-only">
            Nosotros
          </h2>
          <ul className="font-display text-[clamp(3.25rem,11vw,8.5rem)] leading-[0.88]" data-reveal-lines>
            {brand.specialties.map((s, i) => (
              <li key={s} className="line-mask">
                <span className={i % 2 === 0 ? "text-paper" : "text-pink"}>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-start gap-8 lg:col-span-5">
          <div data-reveal>
            <Logo width={220} className="md:w-[260px]!" />
          </div>
          <p data-reveal className="font-script text-[clamp(1.6rem,3vw,2.25rem)] leading-[1.15] text-pink-soft">
            “{brand.slogan}”
          </p>
          <p data-reveal className="max-w-[46ch] text-base leading-relaxed text-lilac md:text-lg">
            En {brand.fullName} encuentras hamburguesas de carne artesanal, chuzos desgranados, salchipapas y perros
            calientes, además de chuzopanes, picadas para compartir y asados al carbón. Los sábados y domingos hay cerdo
            a la llanera.
          </p>
          <p data-reveal className="flex items-center gap-3 text-sm font-bold tracking-[0.08em] text-paper uppercase">
            <Stars size={12} />
            Atendemos a domicilio
          </p>
        </div>
      </div>
    </section>
  );
}
