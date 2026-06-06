"use client";

import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import { gsap } from "@/lib/gsap";
import { sceneState } from "@/lib/sceneState";
import { caseStudies } from "@/lib/data";

const MIN_MS = 1500; // keep the loader on screen at least this long (no flash)
const MAX_MS = 12000; // hard safety: never trap the user if something stalls

export default function Preloader() {
  // Real asset progress from the THREE default loading manager (the GLB load).
  const { progress } = useProgress();
  const [done, setDone] = useState(false);
  const [shown, setShown] = useState(0); // smoothed 0–100 for the counter/bar

  const root = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLImageElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const start = useRef(0);
  const revealed = useRef(false);
  const progressRef = useRef(0);
  const fontsReady = useRef(false);

  progressRef.current = progress;

  // lock scroll while loading (same mechanism the Navbar uses)
  useEffect(() => {
    start.current = performance.now();
    document.documentElement.classList.add("lenis-stopped");
    return () => document.documentElement.classList.remove("lenis-stopped");
  }, []);

  // Kick off the other "must be ready" work in parallel with the 3D load:
  //  • fonts (so text never reflows after reveal)
  //  • below-the-fold case-study images (so scrolling to Work doesn't pop in)
  useEffect(() => {
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        fontsReady.current = true;
      });
    } else {
      fontsReady.current = true;
    }

    // fire-and-forget: warm the browser cache for the remote work thumbnails
    caseStudies.forEach((c) => {
      const seed = c.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const img = new Image();
      img.src = `https://picsum.photos/seed/${seed}/800/1000`;
    });
  }, []);

  // smooth the displayed value toward real progress + decide when to reveal
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let display = 0;

    const reveal = () => {
      if (revealed.current) return;
      revealed.current = true;
      cancelAnimationFrame(raf);
      setShown(100);

      const finish = () => {
        document.documentElement.classList.remove("lenis-stopped");
        setDone(true);
      };

      if (reduced || !root.current) {
        finish();
        return;
      }

      gsap
        .timeline({ onComplete: finish })
        .to(logo.current, { y: -14, opacity: 0, duration: 0.5, ease: "power2.in" })
        .to(root.current, { opacity: 0, duration: 0.6, ease: "power2.inOut" }, "-=0.2");
    };

    const tick = () => {
      const target = progressRef.current;
      display += (target - display) * 0.12; // lerp
      if (target - display < 0.5) display = target;
      setShown(display);

      const elapsed = performance.now() - start.current;
      // truly ready: model downloaded AND shaders compiled AND fonts loaded
      const assetsReady =
        progressRef.current >= 100 && sceneState.ready && fontsReady.current;
      if ((assetsReady && elapsed >= MIN_MS) || elapsed >= MAX_MS) {
        reveal();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // drive the bar width imperatively to avoid per-frame React layout work
  useEffect(() => {
    if (fill.current) fill.current.style.transform = `scaleX(${shown / 100})`;
  }, [shown]);

  if (done) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-[#050505]"
    >
      <img
        ref={logo}
        src="/vs-logo.png"
        alt="VS Agency"
        className="h-16 w-auto invert"
      />

      <div className="flex w-56 flex-col gap-3">
        <span className="h-px w-full overflow-hidden bg-white/15">
          <span
            ref={fill}
            className="block h-full w-full origin-left bg-white"
            style={{ transform: "scaleX(0)" }}
          />
        </span>
        <div className="flex items-center justify-between">
          <span className="eyebrow">Lädt</span>
          <span className="font-display text-sm tabular-nums text-white/80">
            {Math.round(shown)}%
          </span>
        </div>
      </div>
    </div>
  );
}
