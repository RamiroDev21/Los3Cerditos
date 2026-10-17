import type { FrameSequence } from "./frame-sequence";

export type Rect = { x: number; y: number; w: number; h: number };

/** Page ink — sampled from the slate at the bottom of the video so edges dissolve cleanly. */
export const INK = "#100f0e";

/** The burger is ~56% of the source frame's width, centred. */
const BURGER_W = 0.56;

/** Horizontal position of the burger's axis as a fraction of stage width (shared with the embers). */
export function burgerFocus(W: number, H: number) {
  return isWide(W, H) ? 0.58 : 0.5;
}

function isWide(W: number, H: number) {
  return W / H >= 1.15 && W >= 900;
}

/**
 * Where the video frame sits inside the stage. The frame is scaled by the
 * burger, not by the screen: it is sized so the burger reads as the hero at
 * any aspect ratio, and whatever edge falls inside the stage is feathered into
 * the page ink — a lit plate floating in a dark room.
 */
export function computeFrameRect(W: number, H: number, fw: number, fh: number): Rect {
  if (isWide(W, H)) {
    // Burger ≈ 45% of the width (leaves room for the headline left and the anatomy legend right),
    // but never so short that the explosion feels cramped.
    const s = Math.min(Math.max((0.45 * W) / (fw * BURGER_W), (0.7 * H) / fh), (0.98 * H) / fh);
    const w = fw * s;
    const h = fh * s;
    return { x: W * burgerFocus(W, H) - w / 2, y: H * 0.07, w, h };
  }
  // Portrait / narrow: the exploded burger (bacon tips included) spans ~88% of the width.
  const s = Math.min((0.88 * W) / (fw * BURGER_W), (0.62 * H) / fh);
  const w = fw * s;
  const h = fh * s;
  return { x: (W - w) / 2, y: H * 0.5 - h / 2, w, h };
}

export class ScrubRenderer {
  private ctx: CanvasRenderingContext2D;
  private cssW = 0;
  private cssH = 0;
  private dpr = 1;
  private rect: Rect = { x: 0, y: 0, w: 0, h: 0 };
  private lastPos = -1;

  constructor(
    private canvas: HTMLCanvasElement,
    private seq: FrameSequence,
    private maxDpr = 1.5,
  ) {
    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!ctx) throw new Error("2D canvas unavailable");
    this.ctx = ctx;
  }

  resize() {
    const box = this.canvas.getBoundingClientRect();
    this.cssW = Math.max(1, box.width);
    this.cssH = Math.max(1, box.height);
    this.dpr = Math.min(window.devicePixelRatio || 1, this.maxDpr);
    this.canvas.width = Math.round(this.cssW * this.dpr);
    this.canvas.height = Math.round(this.cssH * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = "high";
    this.rect = computeFrameRect(this.cssW, this.cssH, this.seq.width, this.seq.height);
    this.buildFeather();
    this.render(Math.max(0, this.lastPos), true);
  }

  /** `pos` is a fractional frame index; neighbouring frames are cross-faded for sub-frame smoothness. */
  render(pos: number, force = false) {
    const clamped = Math.max(0, Math.min(this.seq.count - 1, pos));
    if (!force && Math.abs(clamped - this.lastPos) < 0.004) return;
    const a = Math.floor(clamped);
    const t = clamped - a;
    const fa = this.seq.get(a);
    if (!fa) return;
    this.lastPos = clamped;

    const { ctx, rect } = this;
    ctx.fillStyle = INK;
    ctx.fillRect(0, 0, this.cssW, this.cssH);
    ctx.globalAlpha = 1;
    ctx.drawImage(fa, rect.x, rect.y, rect.w, rect.h);

    if (t > 0.02 && this.seq.has(a + 1)) {
      const fb = this.seq.get(a + 1);
      if (fb && fb !== fa) {
        ctx.globalAlpha = t;
        ctx.drawImage(fb, rect.x, rect.y, rect.w, rect.h);
        ctx.globalAlpha = 1;
      }
    }

    // Pre-rendered edge dissolve: one extra blit per frame.
    if (this.featherLayer) ctx.drawImage(this.featherLayer, 0, 0, this.cssW, this.cssH);
  }

  private featherLayer: HTMLCanvasElement | null = null;

  /**
   * Paints (once per resize) eased gradients that melt every frame edge lying
   * inside the stage into the page ink, so the studio backdrop reads as light
   * falling on a dark room rather than a rectangle.
   */
  private buildFeather() {
    const { rect, cssW: W, cssH: H } = this;
    const layer = this.featherLayer ?? document.createElement("canvas");
    layer.width = Math.round(W * this.dpr);
    layer.height = Math.round(H * this.dpr);
    const c = layer.getContext("2d")!;
    c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    c.clearRect(0, 0, W, H);

    const ease = (g: CanvasGradient, fromInk: boolean) => {
      // Smoothstep-shaped ramp to avoid visible banding.
      for (let i = 0; i <= 8; i++) {
        const u = i / 8;
        const a = fromInk ? 1 - u * u * (3 - 2 * u) : u * u * (3 - 2 * u);
        g.addColorStop(u, `rgba(16,15,14,${a.toFixed(3)})`);
      }
    };
    const edge = (x0: number, y0: number, x1: number, y1: number, fromInk: boolean, box: [number, number, number, number]) => {
      const g = c.createLinearGradient(x0, y0, x1, y1);
      ease(g, fromInk);
      c.fillStyle = g;
      c.fillRect(...box);
    };

    const bandX = rect.w * 0.2;
    const top = rect.h * 0.12;
    const bottom = rect.h * 0.3;
    if (rect.x > 0) edge(rect.x, 0, rect.x + bandX, 0, true, [rect.x - 1, 0, bandX + 1, H]);
    if (rect.x + rect.w < W) edge(rect.x + rect.w - bandX, 0, rect.x + rect.w, 0, false, [rect.x + rect.w - bandX, 0, bandX + 1, H]);
    if (rect.y > 0) edge(0, rect.y, 0, rect.y + top, true, [0, rect.y - 1, W, top + 1]);
    if (rect.y + rect.h < H) edge(0, rect.y + rect.h - bottom, 0, rect.y + rect.h, false, [0, rect.y + rect.h - bottom, W, bottom + 1]);

    this.featherLayer = layer;
  }
}
