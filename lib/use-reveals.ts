"use client";

import type { RefObject } from "react";
import { gsap, useGSAP } from "./gsap";
import { prefersReducedMotion } from "./device";

/**
 * Declarative entrance animations for a section. Mark elements with:
 *  - data-reveal-lines : children `.line-mask > span` rise out of their masks
 *  - data-reveal       : fade + lift (optional data-reveal-delay="0.1")
 *  - data-reveal-img   : clip-path wipe with the inner <img> settling from a slight zoom
 *  - data-parallax     : inner image drifts with scroll (value = travel in %)
 *
 * Content is visible by default; with prefers-reduced-motion nothing is animated.
 * Every tween and trigger is scoped and reverted on unmount by useGSAP.
 */
export function useReveals(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(scope);
      const trigger = (el: Element, start = "top 86%") => ({ trigger: el, start, once: true });

      q("[data-reveal-lines]").forEach((el) => {
        gsap.from(el.querySelectorAll(".line-mask > span"), {
          yPercent: 115,
          duration: 1.4,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: trigger(el),
        });
      });

      q("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 36,
          duration: 1.2,
          delay: Number((el as HTMLElement).dataset.revealDelay ?? 0),
          ease: "expo.out",
          scrollTrigger: trigger(el, "top 90%"),
        });
      });

      q("[data-reveal-img]").forEach((el) => {
        const img = el.querySelector("img");
        const tl = gsap.timeline({ scrollTrigger: trigger(el, "top 88%") });
        tl.fromTo(
          el,
          { clipPath: "inset(18% 12% 18% 12%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" },
        );
        if (img) tl.from(img, { scale: 1.28, duration: 2, ease: "expo.out" }, 0.1);
      });

      q("[data-parallax]").forEach((el) => {
        const travel = Number((el as HTMLElement).dataset.parallax || 8);
        const target = el.querySelector("[data-parallax-target]") ?? el.firstElementChild;
        if (!target) return;
        gsap.fromTo(
          target,
          { yPercent: -travel },
          {
            yPercent: travel,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    { scope },
  );
}
