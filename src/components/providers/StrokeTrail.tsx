"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { reduced } from "@/lib/motion";

/**
 * The cinema camera "becomes" a königsblau living snake through the white
 * scroll phase (Capture → Edit → Distribute):
 *
 *   camera ──fade──▶ fat blob ──stretches──▶ snake (fat head → thin tail)
 *   that glides down the page, drifts gently + breathes (idle undulation),
 *   then fades out as the camera fades back in at Results.
 *
 * Rendered on a Canvas-2D layer (NOT SVG) — a tapered polygon rebuilt each
 * frame. This avoids the full-screen SVG repaint that made the page lag.
 *
 * Scroll → `p ∈ [0,1]` (white-phase progress) via a ScrollTrigger whose config
 * mirrors BgTransition. A rAF loop reads `p` + time and draws; it only runs
 * while the phase is on screen.
 */

const ROYAL = "#4f8bff"; // hellblau

// White-phase shape (head travels top→bottom of viewport as p: 0→1).
const HEAD_Y_START = 0.46; // ~where the camera sat → clean morph
const HEAD_Y_END = 0.82;
const HEAD_X = 0.5; // centre; gentle sine drift added on top
const DRIFT = 0.07; // horizontal drift amplitude (fraction of width) — "dezent"
const SNAKE_LEN = 0.34; // body length as fraction of viewport height
const HEAD_W = 86; // px (at dpr 1) — fat head
const SAMPLES = 48;

// Length grow-in (blob → snake) and alpha crossfade windows, in p-space.
const GROW = [0.1, 0.32] as const; // blob → full snake (start build-up)
const SHRINK = [0.78, 0.9] as const; // full snake → blob again (end teardown)
const FADE_IN = [0.1, 0.18] as const;
const FADE_OUT = [0.9, 0.95] as const; // blob disappears AFTER it shrank back

// The 3D camera (#scene-canvas) is faded out/in HERE — BgTransition's own
// camera tween is a no-op (the dynamic, ssr:false canvas isn't in the DOM when
// its timeline is built), so the snake owns the crossfade to stay in sync.
const CAM_OUT = [0.04, 0.12] as const; // camera disappears as the snake arrives
const CAM_IN = [0.95, 1.0] as const; // camera returns only once the bg is fully dark again

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);
// remap x in [a,b] → [0,1], smoothed
const ramp = (x: number, a: number, b: number) => smooth(clamp01((x - a) / (b - a)));

export default function StrokeTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rm = reduced();
    let w = 0;
    let h = 0;
    let dpr = 1;

    // Offscreen buffer: body + head drawn at opacity 1, then blitted
    // to the main canvas with globalAlpha = alpha. This avoids the
    // double-alpha triangle where the head circle overlaps the body.
    const buf = document.createElement("canvas");
    const bCtx = buf.getContext("2d")!;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buf.width = canvas.width;
      buf.height = canvas.height;
      bCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // White-phase progress. Driven through a SCRUBBED proxy tween so it lags
    // exactly like BgTransition's scrub:1 camera fade — otherwise the snake
    // (immediate) would appear while the camera (lagging 1s) is still visible.
    const proxy = { val: 0 };
    let p = 0;
    let active = false;
    let raf = 0;
    let sceneCanvas: HTMLElement | null = null;

    const setCameraOpacity = () => {
      sceneCanvas ||= document.getElementById("scene-canvas");
      if (!sceneCanvas) return;
      const o = clamp01(1 - ramp(p, CAM_OUT[0], CAM_OUT[1]) + ramp(p, CAM_IN[0], CAM_IN[1]));
      sceneCanvas.style.opacity = String(o);
    };

    // Text the snake passes behind lights up. We read all [data-lumen] rects in
    // one batch, then write each element's --lumen from how close the snake's
    // spine currently is (CSS handles the actual glow).
    const LUMEN_RADIUS = 150; // px falloff
    let lumenEls: HTMLElement[] = [];
    const gatherLumen = () => {
      lumenEls = Array.from(document.querySelectorAll<HTMLElement>("[data-lumen]"));
    };
    const clearLumen = () => {
      for (const el of lumenEls) el.style.setProperty("--lumen", "0");
    };
    const illuminate = (spine: { x: number; y: number }[], alpha: number) => {
      if (!lumenEls.length) return;
      const rects = lumenEls.map((el) => el.getBoundingClientRect()); // reads first
      for (let e = 0; e < lumenEls.length; e++) {
        const rc = rects[e];
        if (rc.width === 0 || rc.bottom < -LUMEN_RADIUS || rc.top > h + LUMEN_RADIUS) {
          lumenEls[e].style.setProperty("--lumen", "0");
          continue;
        }
        let best = 0;
        for (let i = 0; i < spine.length; i += 6) {
          const dx = Math.max(rc.left - spine[i].x, 0, spine[i].x - rc.right);
          const dy = Math.max(rc.top - spine[i].y, 0, spine[i].y - rc.bottom);
          const inten = 1 - Math.hypot(dx, dy) / LUMEN_RADIUS;
          if (inten > best) best = inten;
        }
        lumenEls[e].style.setProperty("--lumen", (smooth(clamp01(best)) * alpha).toFixed(3));
      }
    };

    // Spine point at body coordinate u ∈ [0,1] (0 = head, 1 = tail).
    // `time` drives the idle breathing wave that travels down the body.
    const pointAt = (u: number, headY: number, time: number) => {
      // head leads downward; the body trails UPWARD behind it
      const y = headY - u * SNAKE_LEN;
      // base centre + gentle scroll/idle drift, plus a travelling breathing wave
      const drift = Math.sin(p * Math.PI * 2 + u * 1.4) * DRIFT;
      const breathe = rm ? 0 : Math.sin(time * 1.1 - u * 6.0) * 0.012 * (1 - u * 0.5);
      const x = HEAD_X + drift + breathe;
      return { x: x * w, y: y * h };
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      setCameraOpacity();
      if (p <= 0.02 || p >= 0.99) {
        clearLumen();
        return;
      }

      const alpha = ramp(p, FADE_IN[0], FADE_IN[1]) * (1 - ramp(p, FADE_OUT[0], FADE_OUT[1]));
      if (alpha <= 0.001) {
        clearLumen();
        return;
      }

      const headY = lerp(HEAD_Y_START, HEAD_Y_END, smooth(p));
      // build up at the start, retract back to a blob at the end (mirror)
      const grow = ramp(p, GROW[0], GROW[1]) * (1 - ramp(p, SHRINK[0], SHRINK[1]));

      // Sample the spine head→tail; effective length grows from a blob.
      const spine: { x: number; y: number }[] = [];
      for (let i = 0; i <= SAMPLES; i++) {
        const u = (i / SAMPLES) * grow;
        spine.push(pointAt(u, headY, time));
      }

      // Build a tapered outline: down one side (head→tail), back the other.
      const widthAt = (i: number) => {
        const u = i / SAMPLES;
        // fat near head, taper to ~0 at tail; ease the taper
        const taper = Math.pow(1 - u, 1.25);
        // while growing, keep it rounder (blob) then thin out
        return HEAD_W * (0.45 + 0.55 * grow) * Math.max(taper, 0.02);
      };

      const left: { x: number; y: number }[] = [];
      const right: { x: number; y: number }[] = [];
      for (let i = 0; i < spine.length; i++) {
        const a = spine[Math.max(0, i - 1)];
        const b = spine[Math.min(spine.length - 1, i + 1)];
        let nx = -(b.y - a.y);
        let ny = b.x - a.x;
        const len = Math.hypot(nx, ny) || 1;
        nx /= len;
        ny /= len;
        const hw = widthAt(i) / 2;
        left.push({ x: spine[i].x + nx * hw, y: spine[i].y + ny * hw });
        right.push({ x: spine[i].x - nx * hw, y: spine[i].y - ny * hw });
      }

      const head = spine[0];
      const r = widthAt(0) / 2;

      // Draw at full opacity on offscreen buffer, then blit with globalAlpha.
      // This gives uniform transparency across the whole snake — no
      // double-alpha artifact where the head circle overlaps the body.
      bCtx.clearRect(0, 0, w, h);
      bCtx.fillStyle = ROYAL;
      bCtx.shadowColor = "rgba(79,139,255,0.45)";
      bCtx.shadowBlur = 24;

      bCtx.beginPath();
      bCtx.moveTo(left[0].x, left[0].y);
      for (let i = 1; i < left.length; i++) bCtx.lineTo(left[i].x, left[i].y);
      for (let i = right.length - 1; i >= 0; i--) bCtx.lineTo(right[i].x, right[i].y);
      bCtx.closePath();
      bCtx.fill();
      bCtx.beginPath();
      bCtx.arc(head.x, head.y, r, 0, Math.PI * 2);
      bCtx.fill();

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.drawImage(buf, 0, 0);
      ctx.restore();

      // light up the text the snake is currently passing behind
      illuminate(spine, alpha);
    };

    const tick = (t: number) => {
      p = proxy.val;
      draw(t / 1000);
      if (active && !rm) raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf) return;
      active = true;
      gatherLumen();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      active = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      ctx.clearRect(0, 0, w, h);
      clearLumen();
      // outside the white phase the camera is always fully visible
      sceneCanvas ||= document.getElementById("scene-canvas");
      if (sceneCanvas) sceneCanvas.style.opacity = "1";
    };

    const tween = gsap.to(proxy, {
      val: 1,
      ease: "none",
      scrollTrigger: {
        trigger: "#capture",
        start: "top 95%",
        endTrigger: "#results",
        end: "top 30%",
        scrub: 1, // match BgTransition so camera-fade ↔ snake stay in lockstep
        onUpdate: () => {
          // reduced-motion has no idle loop, so redraw on each update
          if (rm) {
            p = proxy.val;
            draw(0);
          }
        },
        onToggle: (self) => (self.isActive ? start() : stop()),
      },
    });

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 h-full w-full"
      style={{ zIndex: -10 }}
    />
  );
}
