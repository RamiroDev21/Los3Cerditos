export type PerfTier = "high" | "low";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Coarse capability check. "low" = phones, small tablets and machines that
 * report little memory — they get a lighter frame cache and no WebGL.
 */
export function getPerfTier(): PerfTier {
  if (typeof window === "undefined") return "high";
  const nav = navigator as Navigator & { deviceMemory?: number };
  const small = window.matchMedia("(max-width: 900px)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const lowMem = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
  const fewCores = (navigator.hardwareConcurrency || 8) <= 4;
  return small || coarse || lowMem || fewCores ? "low" : "high";
}
