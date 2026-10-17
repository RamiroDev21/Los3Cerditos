"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { layers, mapsUrl, video as videoConfig } from "@/lib/content";
import { formatPrice, menu } from "@/lib/menu";
import { greetingMessage, whatsappUrl } from "@/lib/whatsapp";
import { getPerfTier, prefersReducedMotion } from "@/lib/device";
import { FrameSequence, supportsFrameCapture } from "@/lib/frame-sequence";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { heroState } from "@/lib/scroll-store";
import { ImageSequence } from "@/lib/image-sequence";
import { computeFrameRect, NIGHT, ScrubRenderer } from "@/lib/scrub-renderer";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight, Pin, WhatsApp } from "@/components/ui/icons";
import { LayerLegend } from "./LayerLegend";
import { ScrollMeter, STAGES } from "./ScrollMeter";

const burgerFrom = Math.min(...(menu.find((c) => c.id === "hamburguesas")?.items.map((i) => i.price) ?? [0]));

// WebGL is optional garnish: split into its own chunk and only loaded on capable desktops.
const Embers = dynamic(() => import("./Embers").then((m) => m.Embers), { ssr: false });

const { fps, crop, timeline: TIMELINE } = videoConfig;

/** Scroll progress (0–1) → video time in seconds, piecewise-linear through the timeline keyframes. */
function timeAt(p: number) {
  for (let i = 1; i < TIMELINE.length; i++) {
    const [p1, t1] = TIMELINE[i];
    if (p <= p1) {
      const [p0, t0] = TIMELINE[i - 1];
      return t0 + ((p - p0) / (p1 - p0)) * (t1 - t0);
    }
  }
  return TIMELINE[TIMELINE.length - 1][1];
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [embers, setEmbers] = useState(false);

  useGSAP(
    (_ctx, contextSafe) => {
      const video = videoRef.current!;
      const canvas = canvasRef.current!;
      const stageEl = stage.current!;
      const q = gsap.utils.selector(root);
      const reduced = prefersReducedMotion();
      const tier = getPerfTier();

      // Position the native <video> exactly where the canvas paints, so its first frame
      // doubles as a pixel-identical poster while frames are being cached.
      const placeVideo = () => {
        const W = stageEl.clientWidth;
        const H = stageEl.clientHeight;
        const r = computeFrameRect(W, H, crop.w, crop.h);
        const s = r.w / crop.w;
        Object.assign(video.style, {
          left: `${r.x - crop.x * s}px`,
          top: `${r.y - crop.y * s}px`,
          width: `${videoConfig.width * s}px`,
          height: `${videoConfig.height * s}px`,
        });
      };
      placeVideo();

      // ——— Intro: type rises out of its masks ———
      gsap.set(q("[data-intro]"), { autoAlpha: 1 });
      if (!reduced) {
        gsap
          .timeline({ delay: 0.15 })
          .from(q(".hero-line > span"), { yPercent: 110, duration: 1.3, stagger: 0.09, ease: "expo.out" })
          .from(q("[data-intro-fade]"), { autoAlpha: 0, y: 18, duration: 1, stagger: 0.08, ease: "expo.out" }, 0.35)
          .from(stageEl, { autoAlpha: 0, scale: 1.04, duration: 1.8, ease: "expo.out" }, 0);
      }

      if (reduced) {
        // Static composition: assembled burger (the video's poster), legend visible, no pin.
        gsap.set(q("[data-legend], [data-legend-scrim]"), { autoAlpha: 1 });
        return;
      }

      // ——— Scroll-driven explosion ———
      const step = 2;
      const proxy = { p: 0 };
      let seq: FrameSequence | null = null;
      let phoneSeq: ImageSequence | null = null;
      let renderer: ScrubRenderer | null = null;
      let disposed = false;

      const paint = () => renderer?.render((timeAt(proxy.p) * fps) / step);

      const meterFill = q("[data-meter-fill]")[0] as HTMLElement | undefined;
      const readout = q("[data-readout]")[0] as HTMLElement | undefined;
      const stageLabel = q("[data-stage-label]")[0] as HTMLElement | undefined;
      const ticks = q("[data-stage-tick]") as HTMLElement[];
      let lastStage = -1;
      let lastPct = -1;

      const updateHud = (p: number) => {
        if (meterFill) meterFill.style.transform = `scaleX(${p})`;
        const pct = Math.round(p * 100);
        if (readout && pct !== lastPct) {
          readout.textContent = String(pct).padStart(3, "0");
          lastPct = pct;
        }
        const s = STAGES.findLastIndex((st) => p >= st.at);
        if (s !== lastStage) {
          lastStage = s;
          if (stageLabel) stageLabel.textContent = STAGES[s].label;
          ticks.forEach((t, i) => t.toggleAttribute("data-active", i <= s));
        }
      };

      const distance = () => window.innerHeight * (tier === "low" ? 1.7 : 2.6);

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: tier === "low" ? 0.35 : 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        proxy,
        {
          p: 1,
          duration: 1,
          onUpdate: () => {
            heroState.progress = proxy.p;
            paint();
            updateHud(proxy.p);
          },
        },
        0,
      )
        // The headline yields the stage to the burger as separation begins.
        .to(q("[data-copy-top]"), { autoAlpha: 0, y: -48, duration: 0.2, ease: "power1.in" }, 0.08)
        .to(q("[data-copy-bottom]"), { autoAlpha: 0, y: 32, duration: 0.18, ease: "power1.in" }, 0.06)
        .to(q("[data-cue]"), { autoAlpha: 0, duration: 0.08 }, 0.02)
        // Exploded-view callouts arrive as the layers part.
        .to(q("[data-legend], [data-legend-scrim]"), { autoAlpha: 1, duration: 0.08 }, 0.22)
        .fromTo(
          q("[data-legend-item]"),
          { autoAlpha: 0, x: 24 },
          { autoAlpha: 1, x: 0, duration: 0.12, stagger: 0.06, ease: "power2.out" },
          0.26,
        )
        .fromTo(
          q("[data-legend-rule]"),
          { scaleX: 0 },
          { scaleX: 1, duration: 0.14, stagger: 0.06, ease: "power2.out" },
          0.28,
        )
        .fromTo(q("[data-caption] > *"), { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.12, stagger: 0.04, ease: "power2.out" }, 0.84);

      // ——— Frames ———
      // Phones, tablets and browsers that cannot hand over video frames (iOS Safari) scrub
      // pre-rendered stills: no video decoding, one draw per frame, tint already baked in.
      const startPhoneFrames = contextSafe!(() => {
        const { count, width, height, url } = videoConfig.phoneFrames;
        const ps = new ImageSequence(Array.from({ length: count }, (_, i) => url(i)), width, height);
        phoneSeq = ps;
        ps.load(() => {
          if (disposed) return;
          if (!renderer) {
            renderer = new ScrubRenderer(canvas, ps, 1.25, NIGHT, false);
            renderer.resize();
            canvas.style.visibility = "visible";
            video.style.visibility = "hidden";
            // Frames carry the tint: drop the live blend layer and switch the scrims to the tinted ground.
            root.current!.dataset.tier = "low";
          }
          renderer.render((timeAt(proxy.p) * fps) / step, true);
        });
      });

      const start = contextSafe!(() => {
        if (tier === "low" || !supportsFrameCapture(video)) {
          startPhoneFrames();
          return;
        }
        // Desktop: decode the video once into an in-memory frame cache.
        video.preload = "auto";
        video.src = videoConfig.src;
        seq = new FrameSequence(video, {
          fps,
          endTime: videoConfig.explodeEnd,
          step,
          maxWidth: 1280,
          crop,
        });
        const s = seq;
        s.capture((slot) => {
          if (disposed) return;
          if (slot === 0 && !renderer) {
            renderer = new ScrubRenderer(canvas, s, 1.5);
            renderer.resize();
            canvas.style.visibility = "visible";
          }
          paint();
          renderer?.render((timeAt(proxy.p) * fps) / step, true);
        })
          .then(() => {
            if (disposed) return;
            // Every frame lives in memory now — release the decoder and the network stream.
            video.removeAttribute("src");
            video.load();
            video.style.visibility = "hidden";
            if (tier === "high") setEmbers(true);
          })
          .catch(() => {
            if (disposed) return;
            // Capture failed (e.g. playback blocked by power saving): use the stills instead.
            seq?.dispose();
            seq = null;
            renderer = null;
            video.removeAttribute("src");
            video.load();
            startPhoneFrames();
          });
      });
      start();

      // ——— Housekeeping ———
      const ro = new ResizeObserver(() => {
        placeVideo();
        renderer?.resize();
      });
      ro.observe(stageEl);

      const io = new IntersectionObserver(([entry]) => {
        heroState.visible = entry.isIntersecting;
      });
      io.observe(root.current!);

      return () => {
        disposed = true;
        ro.disconnect();
        io.disconnect();
        seq?.dispose();
        phoneSeq?.dispose();
        renderer = null;
        heroState.progress = 0;
      };
    },
    { scope: root },
  );

  return (
    <section
      id="top"
      ref={root}
      aria-labelledby="hero-title"
      style={{ "--slate": "16,15,14" } as React.CSSProperties}
      className="group/hero relative isolate h-svh min-h-[600px] w-full overflow-hidden bg-night data-[tier=low]:[--slate:16,15,67]"
    >
      {/* Stage: the burger. Starts below the fixed header so the top bun is never hidden. */}
      <div ref={stage} className="absolute inset-x-0 top-[4.5rem] bottom-0 -z-10 bg-[rgb(var(--slate))] md:top-[5.25rem]" aria-hidden>
        <video
          ref={videoRef}
          className="absolute max-w-none [mask-composite:intersect] [mask-image:linear-gradient(90deg,transparent,#000_20%,#000_80%,transparent),linear-gradient(180deg,transparent,#000_11%,#000_62%,transparent_92%)]"
          poster={videoConfig.poster}
          muted
          playsInline
          preload="none"
          disablePictureInPicture
          disableRemotePlayback
          tabIndex={-1}
        />
        <canvas ref={canvasRef} className="invisible absolute inset-0 h-full w-full" />
        {embers && <Embers />}
        {/* Scrims: keep type legible over the studio backdrop and melt the stage into the page. */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(var(--slate),0.72)_0%,rgba(var(--slate),0.35)_32%,rgba(var(--slate),0)_52%)] max-[899px]:hidden" />
        <div
          data-legend-scrim
          className="invisible absolute inset-0 bg-[linear-gradient(270deg,rgba(var(--slate),0.85)_0%,rgba(var(--slate),0.45)_18%,rgba(var(--slate),0)_34%)] max-[899px]:hidden"
        />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[rgba(var(--slate),0.7)] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[rgb(var(--slate))] via-[rgba(var(--slate),0.6)] to-transparent" />
        {/* Night tint: screens the video's grey slate into the brand's deep blue while barely touching the food's highlights. */}
        <div className="absolute inset-0 bg-[#000038] mix-blend-screen group-data-[tier=low]/hero:hidden" />
        {/* Hand-off to the navy page below. */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-navy" />
      </div>

      {/* Copy */}
      <div className="mx-auto flex h-full max-w-[1400px] flex-col justify-between px-4 pt-[6.5rem] pb-24 md:px-8 min-[900px]:justify-center min-[900px]:gap-9 min-[900px]:pt-28 min-[900px]:pb-28">
        <div data-copy-top data-intro className="max-w-[40rem]">
          <h1 id="hero-title" className="font-display text-[clamp(3rem,13.5vw,4.6rem)] text-balance min-[900px]:text-[clamp(3.75rem,5.4vw,6rem)]">
            <span className="hero-line line-mask">
              <span>Los Tres</span>
            </span>
            <span className="hero-line line-mask">
              <span className="text-pink">Cerditos</span>
            </span>
            <span className="sr-only"> Restaurante</span>
          </h1>
          <p data-intro-fade className="font-script mt-4 text-[clamp(1.35rem,4.6vw,2rem)] text-pink-soft min-[900px]:mt-6">
            Sabemos lo que es comer bien.
          </p>
        </div>

        <div data-copy-bottom data-intro>
          <div data-intro-fade className="flex flex-wrap gap-3 sm:flex-nowrap lg:gap-2.5">
            <ButtonLink href="#carta" icon={<ArrowRight size={19} />} className="flex-row-reverse pr-5 pl-6 lg:pr-4 lg:pl-5">
              Ver la carta
            </ButtonLink>
            <ButtonLink
              href={whatsappUrl(greetingMessage)}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              icon={<WhatsApp size={19} />}
              className="bg-navy-deep/55 backdrop-blur-sm max-sm:order-3 lg:px-5"
            >
              Pedir por WhatsApp<span className="sr-only"> (se abre en otra pestaña)</span>
            </ButtonLink>
            <ButtonLink
              href={mapsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              icon={<Pin size={19} />}
              className="bg-navy-deep/55 backdrop-blur-sm max-sm:order-2 lg:px-5"
            >
              Cómo llegar<span className="sr-only"> (abre Google Maps en otra pestaña)</span>
            </ButtonLink>
          </div>
        </div>
      </div>

      <LayerLegend items={layers} />

      {/* Closing caption, revealed at full explosion */}
      <div
        data-caption
        className="pointer-events-none absolute bottom-28 left-4 max-w-[24rem] md:left-8 min-[900px]:bottom-auto min-[900px]:top-1/2 min-[900px]:-translate-y-1/2 min-[1400px]:left-[calc(50vw-700px+2rem)]"
      >
        <p className="font-script invisible mb-3 text-[1.6rem] text-pink">Capa por capa</p>
        <p className="font-display invisible text-[clamp(2.6rem,5vw,4.5rem)]">
          Hamburguesas
          <br />
          desde <span className="text-pink">{formatPrice(burgerFrom)}</span>
        </p>
      </div>

      <ScrollMeter />
    </section>
  );
}

// Keep ScrollTrigger's measurements honest once web fonts swap in.
if (typeof window !== "undefined") {
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
