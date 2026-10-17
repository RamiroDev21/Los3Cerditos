/**
 * Exploded-view callouts: the burger's layers, top to bottom, drawn in as the
 * scroll separates them.
 */
export function LayerLegend({ items }: { items: readonly string[] }) {
  return (
    <div
      data-legend
      className="invisible absolute top-1/2 right-4 hidden -translate-y-1/2 md:right-8 min-[900px]:block min-[1400px]:right-[calc(50vw-700px+2rem)]"
    >
      <p className="font-script mb-6 text-right text-[1.5rem] text-pink-soft">Capa por capa</p>
      <ol className="flex flex-col gap-[clamp(0.9rem,2.4vh,1.6rem)]">
        {items.map((name, i) => (
          <li key={`${name}-${i}`} data-legend-item className="flex items-center justify-end gap-4">
            <span
              data-legend-rule
              className="h-[2px] w-[clamp(2rem,5vw,5.5rem)] origin-right rounded-full bg-gradient-to-l from-pink/80 to-pink/0"
              aria-hidden
            />
            <span className="text-right text-base font-semibold text-paper">{name}</span>
            <span className="grid size-6 place-items-center rounded-full bg-pink text-[0.6875rem] font-bold text-navy tabular-nums">
              {i + 1}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
