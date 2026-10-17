/**
 * Tiny mutable store shared between the hero's ScrollTrigger and the WebGL
 * embers. Written every frame, read every frame — deliberately outside React
 * so scroll never triggers a re-render.
 */
export const heroState = {
  /** 0 → 1 explosion progress. */
  progress: 0,
  /** Whether the hero is on screen (WebGL pauses when false). */
  visible: true,
};
