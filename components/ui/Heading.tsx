import { Star } from "./icons";

/** Heading whose lines rise out of masks (see useReveals). */
export function MaskedLines({ lines, className = "" }: { lines: readonly string[]; className?: string }) {
  return (
    <span data-reveal-lines className={`block ${className}`}>
      {lines.map((line) => (
        <span key={line} className="line-mask">
          <span>{line}</span>
        </span>
      ))}
    </span>
  );
}

/** The carta's ★★★ flourish. Decorative only. */
export function Stars({ className = "", size = 14 }: { className?: string; size?: number }) {
  return (
    <span aria-hidden className={`inline-flex shrink-0 items-center gap-[0.3em] text-pink ${className}`}>
      <Star size={size} />
      <Star size={size} />
      <Star size={size} />
    </span>
  );
}

/** Script title framed by stars on both sides, exactly the carta's category heading. */
export function StarredTitle({ children, className = "", starSize = 14 }: { children: React.ReactNode; className?: string; starSize?: number }) {
  return (
    <span className={`flex min-w-0 flex-col items-center justify-center gap-2 sm:flex-row sm:gap-[0.5em] ${className}`}>
      <Stars size={starSize} className="max-sm:hidden" />
      <span className="font-script min-w-0 text-balance">{children}</span>
      <Stars size={starSize} />
    </span>
  );
}
