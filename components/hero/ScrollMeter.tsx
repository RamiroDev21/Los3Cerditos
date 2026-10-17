export const STAGES = [
  { at: 0, label: "Armada" },
  { at: 0.22, label: "Se separa" },
  { at: 0.47, label: "Capa por capa" },
  { at: 0.72, label: "Casi lista" },
  { at: 0.97, label: "Desarmada" },
] as const;

/**
 * The hero's progress strip: stage name, percentage and a line that fills
 * with scroll. Written directly by the hero timeline (no React state).
 */
export function ScrollMeter() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
      <div className="mx-auto max-w-[1400px] px-4 pb-6 md:px-8 md:pb-8">
        <div className="mb-3 flex items-end justify-between gap-6">
          <p className="label flex items-center gap-3 text-lilac" aria-hidden>
            <span data-readout className="text-paper tabular-nums">
              000
            </span>
            <span className="text-lilac-dim">/</span>
            <span data-stage-label>{STAGES[0].label}</span>
          </p>

          <p data-cue className="label flex items-center gap-3 text-lilac">
            <span className="max-sm:sr-only">Desliza para desarmarla</span>
            <span className="relative block h-7 w-[2px] overflow-hidden rounded-full bg-paper/20" aria-hidden>
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[cue_1.8s_var(--ease-in-out-quart)_infinite] bg-pink" />
            </span>
          </p>
        </div>

        <div className="relative h-[2px] w-full rounded-full bg-paper/15" aria-hidden>
          <div data-meter-fill className="absolute inset-0 origin-left scale-x-0 rounded-full bg-pink" />
          {STAGES.map((s) => (
            <span
              key={s.label}
              data-stage-tick
              style={{ left: `${s.at * 100}%` }}
              className="absolute top-1/2 size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper/30 transition-colors duration-300 data-active:bg-pink"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
