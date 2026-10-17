"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { brand, contact, mapsUrl } from "@/lib/content";
import { detectPlatform, directionsFor, type DirectionsApp } from "@/lib/directions";
import { Apps, Car, Close, MapFold, Pin } from "./icons";

const appIcon: Record<string, ReactNode> = {
  google: <Pin size={22} />,
  waze: <Car size={22} />,
  apple: <MapFold size={22} />,
  geo: <Apps size={22} />,
};

/**
 * "Cómo llegar": opens a small sheet to pick the navigation app (Google Maps, Waze,
 * Apple Maps on Apple devices, any installed map app on Android), each pointed at the
 * restaurant's exact pin. Without JavaScript it is a plain Google Maps directions link.
 */
export function DirectionsButton({ className, children }: { className: string; children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [apps, setApps] = useState<DirectionsApp[]>([]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- the platform is only known in the browser
  useEffect(() => setApps(directionsFor(detectPlatform())), []);

  const close = () => dialogRef.current?.close();

  return (
    <>
      <a
        href={mapsUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-haspopup="dialog"
        onClick={(e) => {
          if (!apps.length) return;
          e.preventDefault();
          dialogRef.current?.showModal();
        }}
        className={className}
      >
        {children}
      </a>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        className="on-paper fixed inset-x-0 top-auto bottom-0 m-0 w-full max-w-none rounded-t-[1.75rem] bg-paper p-0 text-navy backdrop:bg-navy-deep/75 backdrop:backdrop-blur-[2px] open:motion-safe:animate-[sheet-in_0.4s_var(--ease-out-expo)] md:inset-0 md:m-auto md:h-fit md:max-w-sm md:rounded-[1.75rem] md:open:motion-safe:animate-[toast-in_0.35s_var(--ease-out-expo)]"
      >
        <div className="px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:px-6 md:pt-5 md:pb-6">
          <span className="mx-auto mb-3 block h-1.5 w-10 rounded-full bg-navy/15 md:hidden" aria-hidden />
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id={titleId} className="font-script text-[1.9rem] leading-tight">
                Cómo llegar
              </h2>
              <p className="mt-1 text-[0.9375rem] text-navy/70">
                {contact.address}, {contact.reference.charAt(0).toLowerCase() + contact.reference.slice(1)}
                <br />
                {contact.city}
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              className="grid size-11 shrink-0 place-items-center rounded-full ring-2 ring-inset ring-navy/15 transition-colors hover:bg-navy hover:text-paper"
            >
              <Close size={20} />
              <span className="sr-only">Cerrar</span>
            </button>
          </div>

          <p className="label mt-5 mb-2 text-navy/55">Abrir con</p>
          <ul className="space-y-2">
            {apps.map((app) => (
              <li key={app.id}>
                <a
                  href={app.href}
                  target={app.id === "geo" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  onClick={close}
                  className="flex min-h-14 items-center gap-4 rounded-2xl bg-paper-2 px-4 py-3 transition-colors hover:bg-pink-soft active:bg-pink"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-navy text-paper">{appIcon[app.id]}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold">{app.name}</span>
                    <span className="block text-sm text-navy/65">{app.hint}</span>
                  </span>
                  <span className="sr-only"> hacia {brand.fullName}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </dialog>
    </>
  );
}
