/**
 * Pre-rendered frame sequence for phones and tablets. Decoding the video in the
 * browser is the expensive, fragile part (iOS Safari will not hand frames over,
 * mid-range Android stutters), so these devices get small stills instead:
 * frames are cut from the same video ahead of time (night tint baked in) and
 * loaded progressively — first frame first, then a coarse-to-fine fill so any
 * scroll position has a near neighbour almost immediately.
 */

export type Frames = {
  readonly count: number;
  readonly width: number;
  readonly height: number;
  get(index: number): CanvasImageSource | null;
  has(index: number): boolean;
};

export class ImageSequence implements Frames {
  readonly count: number;
  private frames: (HTMLImageElement | null)[];
  private disposed = false;

  constructor(
    private urls: string[],
    readonly width: number,
    readonly height: number,
  ) {
    this.count = urls.length;
    this.frames = new Array(this.count).fill(null);
  }

  get(index: number): HTMLImageElement | null {
    const i = Math.max(0, Math.min(this.count - 1, Math.round(index)));
    if (this.frames[i]) return this.frames[i];
    for (let d = 1; d < this.count; d++) {
      const lo = this.frames[i - d];
      if (lo) return lo;
      const hi = this.frames[i + d];
      if (hi) return hi;
    }
    return null;
  }

  has(index: number) {
    return !!this.frames[index];
  }

  /** Coarse-to-fine order: 0, last, middle, quarters, eighths… */
  private order() {
    const seen = new Set<number>([0, this.count - 1]);
    const out = [0, this.count - 1];
    for (let stride = Math.ceil(this.count / 2); stride >= 1; stride = Math.floor(stride / 2)) {
      for (let i = 0; i < this.count; i += stride) {
        if (!seen.has(i)) {
          seen.add(i);
          out.push(i);
        }
      }
      if (stride === 1) break;
    }
    return out;
  }

  private loadOne(i: number) {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.decoding = "async";
      img.src = this.urls[i];
      const done = () => {
        if (!this.disposed) this.frames[i] = img;
        resolve();
      };
      // decode() keeps the first draw of each frame off the scroll path.
      img
        .decode()
        .then(done)
        .catch(() => (img.complete && img.naturalWidth ? done() : resolve()));
    });
  }

  /** Loads frame 0, then the rest with limited concurrency. `onFrame` fires per loaded frame. */
  async load(onFrame: (index: number) => void, concurrency = 4) {
    const queue = this.order();
    const first = queue.shift()!;
    await this.loadOne(first);
    if (this.disposed) return;
    onFrame(first);
    const worker = async () => {
      while (queue.length && !this.disposed) {
        const i = queue.shift()!;
        await this.loadOne(i);
        if (!this.disposed && this.frames[i]) onFrame(i);
      }
    };
    await Promise.all(Array.from({ length: concurrency }, worker));
  }

  dispose() {
    this.disposed = true;
    this.frames.fill(null);
  }
}
