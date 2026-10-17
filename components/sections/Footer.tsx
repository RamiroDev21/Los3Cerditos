import { brand, contact, imageCredits, nav } from "@/lib/content";
import { Stars } from "@/components/ui/Heading";
import { Logo } from "@/components/ui/Logo";
import { ArrowRight } from "@/components/ui/icons";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-navy">
      <div className="mx-auto max-w-[1400px] px-4 pt-12 pb-6 md:px-8 md:pt-14">
        <div className="grid gap-9 md:grid-cols-12 md:items-start md:gap-8">
          <div className="flex items-center gap-5 md:col-span-5">
            <Logo width={96} className="shrink-0" />
            <p className="font-script max-w-[26ch] text-[1.2rem] leading-[1.2] text-pink-soft">{brand.slogan}</p>
          </div>

          <nav aria-label="Pie de página" className="md:col-span-3 md:col-start-7">
            <p className="label mb-3 text-lilac-dim">Explorar</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="font-semibold text-paper transition-colors hover:text-pink">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="label mb-3 text-lilac-dim">Domicilios</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
              {contact.phones.map((p) => (
                <li key={p.tel}>
                  <a href={`tel:${p.tel}`} className="font-semibold text-paper tabular-nums transition-colors hover:text-pink">
                    {p.display}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[0.9375rem] text-lilac">
              {contact.address}, {contact.reference.charAt(0).toLowerCase() + contact.reference.slice(1)}
            </p>
            {contact.social.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-4">
                {contact.social.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="font-semibold text-paper hover:text-pink">
                      {s.label}
                      <span className="sr-only"> (se abre en otra pestaña)</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t-2 border-dotted border-navy-line pt-5 text-sm text-lilac-dim md:flex-row md:items-center md:justify-between">
          <p className="flex items-center gap-3">
            <Stars size={10} />© {year} {brand.fullName}
          </p>
          <p>{imageCredits}</p>
          <a href="#top" className="inline-flex w-fit items-center gap-1.5 font-semibold text-lilac transition-colors hover:text-paper">
            Volver arriba
            <ArrowRight size={16} className="-rotate-90" />
          </a>
        </div>
      </div>
    </footer>
  );
}
