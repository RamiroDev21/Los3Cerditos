"use client";

import Image from "next/image";
import { useRef } from "react";
import { contact, mapsUrl, video as videoConfig } from "@/lib/content";
import { useReveals } from "@/lib/use-reveals";
import { greetingMessage, whatsappUrl } from "@/lib/whatsapp";
import { ButtonLink } from "@/components/ui/Button";
import { MaskedLines } from "@/components/ui/Heading";
import { Clock, Phone, Pin, WhatsApp } from "@/components/ui/icons";

/**
 * Orders, delivery and where to find them. Bookends the hero with the burger
 * fully exploded — a still cut from the same footage (no video to load or decode).
 */
export function Contact() {
  const ref = useRef<HTMLElement>(null);
  useReveals(ref);

  const hours = [contact.hours.days, `${contact.hours.open} a ${contact.hours.close}`].filter(Boolean).join(", ");

  return (
    <section id="contacto" ref={ref} aria-labelledby="contacto-title" className="relative isolate overflow-hidden bg-night">
      <div className="absolute inset-0 -z-10 overflow-hidden bg-[#100f0e]" aria-hidden>
        {/* Oversized and top-anchored so the source's bottom strip stays out of frame. */}
        <Image
          src={videoConfig.exploded}
          alt=""
          width={videoConfig.crop.w}
          height={videoConfig.crop.h}
          unoptimized
          loading="lazy"
          className="absolute top-[2%] left-1/2 h-auto w-[190%] max-w-none -translate-x-1/2 md:w-[130%] lg:left-[68%] lg:w-[95%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,15,14,0.15)_0%,rgba(16,15,14,0.35)_25%,rgba(16,15,14,0.98)_42%)] md:bg-[linear-gradient(180deg,rgba(16,15,14,0.15)_0%,rgba(16,15,14,0.4)_35%,rgba(16,15,14,0.98)_55%)] lg:bg-[linear-gradient(90deg,rgba(16,15,14,0.97)_0%,rgba(16,15,14,0.85)_38%,rgba(16,15,14,0.1)_70%)]" />
        <div className="absolute inset-0 bg-[#000038] mix-blend-screen" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-navy to-transparent" />
      </div>

      <div className="mx-auto max-w-[1400px] px-4 pt-[100vw] pb-24 md:px-8 md:pt-[62vw] md:pb-32 lg:pt-36 lg:pb-36">
        <div className="max-w-[40rem]">
          <h2 id="contacto-title" className="font-display text-[clamp(3rem,8.5vw,6.5rem)]">
            <MaskedLines lines={["Te lo llevamos", "a domicilio"]} />
          </h2>
          <p data-reveal className="mt-6 max-w-[42ch] text-base leading-relaxed text-lilac md:text-lg">
            Arma tu pedido desde la carta y envíalo por WhatsApp, o llámanos a cualquiera de nuestras líneas de domicilio.
          </p>

          <div data-reveal className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={whatsappUrl(greetingMessage)} target="_blank" rel="noopener noreferrer" icon={<WhatsApp size={19} />}>
              Escribir por WhatsApp<span className="sr-only"> (se abre en otra pestaña)</span>
            </ButtonLink>
            <ButtonLink href="#carta" variant="outline">
              Armar mi pedido
            </ButtonLink>
          </div>

          <dl className="mt-14 grid gap-x-10 gap-y-9 sm:grid-cols-2">
            <div data-reveal className="sm:col-span-2">
              <dt className="label flex items-center gap-2 text-pink-soft">
                <Phone size={16} />
                Domicilios
              </dt>
              <dd className="mt-3">
                <ul className="flex flex-wrap gap-2.5">
                  {contact.phones.map((p) => (
                    <li key={p.tel}>
                      <a
                        href={`tel:${p.tel}`}
                        className="inline-flex h-12 items-center gap-2 rounded-full bg-paper/[0.08] px-5 text-lg font-bold text-paper tabular-nums ring-1 ring-inset ring-paper/15 transition-colors hover:bg-paper hover:text-navy"
                      >
                        {p.display}
                        {p.whatsapp && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-pink px-2 py-0.5 text-xs font-bold text-navy">
                            <WhatsApp size={12} />
                            WhatsApp
                          </span>
                        )}
                        <span className="sr-only">, llamar</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>

            <div data-reveal>
              <dt className="label flex items-center gap-2 text-pink-soft">
                <Clock size={16} />
                Horario
              </dt>
              <dd className="mt-3 text-xl font-bold text-paper">{hours}</dd>
              <dd className="mt-1 text-[0.9375rem] text-lilac">Cerdo a la llanera: sábados y domingos.</dd>
            </div>

            <div data-reveal>
              <dt className="label flex items-center gap-2 text-pink-soft">
                <Pin size={16} />
                Dirección
              </dt>
              <dd className="mt-3 text-xl font-bold text-paper">{contact.address}</dd>
              <dd className="mt-1 text-[0.9375rem] text-lilac">
                {contact.reference}
                {contact.city && `, ${contact.city}`}
              </dd>
              <dd className="mt-3">
                <a
                  href={mapsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.9375rem] font-bold text-pink underline decoration-2 underline-offset-4 hover:text-pink-soft"
                >
                  Cómo llegar<span className="sr-only"> (abre Google Maps en otra pestaña)</span>
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
