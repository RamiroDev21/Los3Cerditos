"use client";

import { useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/device";

/**
 * One delegated listener for every in-page anchor: eased scroll with GSAP
 * (ScrollTrigger-aware, so pinned spacers are respected) and focus hand-off
 * to the target for keyboard and screen-reader users.
 */
export function SmoothAnchors() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element).closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!link) return;
      const id = link.getAttribute("href")!.slice(1);
      const target = id ? document.getElementById(id) : document.body;
      if (!target) return;
      e.preventDefault();

      const focusTarget = () => {
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        history.replaceState(null, "", id ? `#${id}` : location.pathname);
      };

      if (prefersReducedMotion()) {
        target.scrollIntoView();
        focusTarget();
        return;
      }
      const distance = Math.abs(target.getBoundingClientRect().top);
      gsap.to(window, {
        duration: Math.min(2.2, 0.9 + distance / 4000),
        ease: "power3.inOut",
        scrollTo: { y: id ? target : 0, autoKill: true },
        onComplete: focusTarget,
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
