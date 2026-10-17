import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "pink" | "outline" | "navy" | "paper";

const variants: Record<Variant, string> = {
  pink: "bg-pink text-navy shadow-[0_10px_28px_-12px_rgba(242,140,168,0.75)] hover:bg-pink-soft active:bg-pink-deep",
  outline: "text-paper ring-2 ring-inset ring-paper/40 hover:ring-paper hover:bg-paper/[0.07] active:bg-paper/[0.12]",
  navy: "bg-navy text-paper hover:bg-navy-raised active:bg-navy-deep",
  paper: "bg-paper text-navy hover:bg-pink-soft active:bg-pink",
};

const base =
  "group/btn inline-flex h-12 shrink-0 items-center justify-center gap-2.5 rounded-full px-6 text-[0.9375rem] font-bold tracking-[0.01em] transition-[background-color,box-shadow,color,transform] duration-300 ease-(--ease-out-expo) active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45";

type Common = { variant?: Variant; icon?: ReactNode; children: ReactNode; className?: string };

/** Link styled as a button: every CTA that navigates (anchors, WhatsApp, phone). */
export function ButtonLink({ variant = "pink", icon, className = "", children, ...rest }: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a {...rest} className={`${base} ${variants[variant]} ${className}`}>
      {icon}
      <span>{children}</span>
    </a>
  );
}

/** Real <button> for actions that change state on the page (add to order, open the order). */
export function Button({ variant = "pink", icon, className = "", children, type = "button", ...rest }: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} {...rest} className={`${base} ${variants[variant]} ${className}`}>
      {icon}
      <span>{children}</span>
    </button>
  );
}
