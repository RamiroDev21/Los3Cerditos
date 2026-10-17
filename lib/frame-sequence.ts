/**
 * Decodes the burger video once into an in-memory frame cache so scroll can
 * scrub it with zero seek latency.
 *
 * Why not just set `video.currentTime` on scroll? The source file is encoded
 * with a single keyframe, so every seek re-decodes from frame 0 — stuttering
 * forward and painful in reverse. Instead the video is played through once,
 * muted and hidden behind the canvas, and each presented frame is grabbed with
 * `requestVideoFrameCallback` + `createImageBitmap`. The visitor never sees it
 * play; the canvas only ever shows the frame their scroll position asks for.
 */

export type Crop = { x: number; y: number; w: number; h: number };

export type FrameSequenceOptions = {
  fps: number;
  /** Seconds of video to capture, starting at 0. */
  endTime: number;
  /** Keep every n-th frame (1 = all). Neighbouring frames are cross-faded when drawn. */
  step: number;
  /** Max bitmap width; height follows the crop's aspect. */
  maxWidth: number;
  crop: Crop;
  /** Capture playback rate. Higher is faster but more likely to skip frames. */
  captureRate?: number;
};

type VideoWithRVFC = HTMLVideoElement & {
  requestVideoFrameCallback?: (cb: (now: number, meta: { mediaTime: number }) => void) => number;
  cancelVideoFrameCallback?: (handle: number) => void;
};

export function supportsFrameCapture(video: HTMLVideoElement): boolean {
  return (
    typeof (video as VideoWithRVFC).requestVideoFrameCallback === "function" &&
    typeof window.createImageBitmap === "function"
  );
}

export class FrameSequence {
  readonly count: number;
  readonly width: number;
  readonly height: number;
  private frames: (ImageBitmap | null)[];
  private captured = 0;
  private disposed = false;
  private rvfcHandle = 0;

  constructor(
    private video: VideoWithRVFC,
    private opts: FrameSequenceOptions,
  ) {
    const total = Math.floor(opts.endTime * opts.fps);
    this.count = Math.floor(total / opts.step) + 1;
    this.frames = new Array(this.count).fill(null);
    const scale = Math.min(1, opts.maxWidth / opts.crop.w);
    this.width = Math.round(opts.crop.w * scale);
    this.height = Math.round(opts.crop.h * scale);
  }

  get progress() {
    return this.captured / this.count;
  }

  get complete() {
    return this.captured >= this.count;
  }

  /** Nearest captured frame to `index` (captures arrive in order, so search backwards first). */
  get(index: number): ImageBitmap | null {
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

  private async grab(slot: number) {
    if (this.disposed || this.frames[slot] || slot < 0 || slot >= this.count) return false;
    const { crop } = this.opts;
    const bmp = await createImageBitmap(this.video, crop.x, crop.y, crop.w, crop.h, {
      resizeWidth: this.width,
      resizeHeight: this.height,
      resizeQuality: "high",
    });
    if (this.disposed || this.frames[slot]) {
      bmp.close();
      return false;
    }
    this.frames[slot] = bmp;
    this.captured++;
    return true;
  }

  /**
   * Plays the video through `endTime` (muted, invisible) and caches frames.
   * `onFrame` fires after every newly cached slot so the canvas can repaint.
   */
  async capture(onFrame: (slot: number) => void): Promise<void> {
    const v = this.video;
    const { fps, step, endTime } = this.opts;
    v.muted = true;
    v.playsInline = true;

    await waitForData(v);
    if (v.currentTime !== 0) await seek(v, 0);
    if (await this.grab(0)) onFrame(0);

    await this.playPass(onFrame, this.opts.captureRate ?? 2);

    // A fast pass can skip presented frames; fill any holes with a real-time pass.
    const missing = this.frames.filter((f) => !f).length;
    if (!this.disposed && missing > this.count * 0.08) {
      await seek(v, 0);
      await this.playPass(onFrame, 1);
    }

    // Final fallback for any stragglers: exact seeks (slow with one keyframe, so only a few).
    for (let slot = 0; slot < this.count && !this.disposed; slot++) {
      if (this.frames[slot]) continue;
      await seek(v, Math.min(endTime, (slot * step) / fps));
      if (await this.grab(slot)) onFrame(slot);
    }
  }

  private playPass(onFrame: (slot: number) => void, rate: number) {
    const v = this.video;
    const { fps, step, endTime } = this.opts;
    const lastTime = endTime - 0.5 / fps;

    return new Promise<void>((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        // A disposed sequence must not touch playback: a newer capture may own the element now.
        if (!this.disposed) v.pause();
        if (this.rvfcHandle) v.cancelVideoFrameCallback?.(this.rvfcHandle);
        v.removeEventListener("ended", finish);
        clearTimeout(watchdog);
        resolve();
      };
      // Never hang the page on a stalled decoder.
      const watchdog = window.setTimeout(finish, (endTime / rate) * 1000 + 6000);

      const onVideoFrame = (_now: number, meta: { mediaTime: number }) => {
        if (this.disposed) return finish();
        const frame = Math.round(meta.mediaTime * fps);
        const slot = Math.round(frame / step);
        // Only take frames that land on (or right next to) a slot we keep.
        if (Math.abs(frame - slot * step) <= Math.floor(step / 2)) {
          this.grab(slot).then((added) => added && onFrame(slot));
        }
        if (meta.mediaTime >= lastTime) return finish();
        this.rvfcHandle = v.requestVideoFrameCallback!(onVideoFrame);
      };

      this.rvfcHandle = v.requestVideoFrameCallback!(onVideoFrame);
      v.addEventListener("ended", finish);
      v.playbackRate = rate;
      v.play().catch(finish);
    });
  }

  dispose() {
    this.disposed = true;
    if (this.rvfcHandle) this.video.cancelVideoFrameCallback?.(this.rvfcHandle);
    this.video.pause();
    for (const f of this.frames) f?.close();
    this.frames.fill(null);
  }
}

function waitForData(v: HTMLVideoElement) {
  if (v.readyState >= 2) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const ok = () => {
      cleanup();
      resolve();
    };
    const fail = () => {
      cleanup();
      reject(new Error("Video failed to load"));
    };
    const cleanup = () => {
      v.removeEventListener("loadeddata", ok);
      v.removeEventListener("error", fail);
    };
    v.addEventListener("loadeddata", ok);
    v.addEventListener("error", fail);
    if (v.preload !== "auto") v.preload = "auto";
    if (v.networkState === HTMLMediaElement.NETWORK_EMPTY) v.load();
  });
}

function seek(v: HTMLVideoElement, t: number) {
  return new Promise<void>((resolve) => {
    if (Math.abs(v.currentTime - t) < 1e-3 && v.readyState >= 2) return resolve();
    const done = () => {
      v.removeEventListener("seeked", done);
      resolve();
    };
    v.addEventListener("seeked", done);
    v.currentTime = t;
  });
}
