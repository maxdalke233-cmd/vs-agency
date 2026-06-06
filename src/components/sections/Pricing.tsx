"use client";

import { useEffect, useRef } from "react";
import { reduced } from "@/lib/motion";
import { portalState } from "@/lib/portalState";

const smoothstep = (x: number) => {
  const c = Math.min(Math.max(x, 0), 1);
  return c * c * (3 - 2 * c);
};

/**
 * The lens portal runway — a tall scroll region whose inner panel is pinned (CSS
 * sticky). Everything is driven by portalState (written by the R3F frame loop) via
 * one rAF, so the whiteout is locked to the camera's distance to the lens glass, NOT
 * to a laggy scroll-scrub. The whiteout completes before the glass (the interior is
 * never seen), then clears at the end of the runway — and the pricing tiers
 * (PricingTiers, in normal flow below) emerge on the other side.
 */
export default function Pricing() {
  const flashRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced()) return;

    const debug =
      typeof window !== "undefined" && window.location.search.includes("portal-debug");

    let raf = 0;
    const loop = () => {
      const { cover, progress, cameraZ, glassZ } = portalState;
      const reveal = smoothstep((progress - 0.85) / 0.15);

      // whiteout: full while diving to the glass, warps + clears at the very end
      const flash = flashRef.current;
      if (flash) {
        flash.style.opacity = String(cover * (1 - reveal));
        flash.style.transform = `scale(${1 + reveal * 0.4})`;
      }

      // As the dive completes, fade the whole runway section to solid white so
      // the whiteout dissolves into the white post-portal region — covering the
      // dark fixed background even after the sticky panel un-sticks at the end.
      const section = sectionRef.current;
      if (section) section.style.backgroundColor = `rgba(255,255,255,${reveal})`;

      // 3D canvas dissolves exactly as the whiteout fills.
      // Only take over opacity once the portal is actually running — before that,
      // BgTransition owns the canvas fade for the light-bg scroll phase.
      const canvas = document.getElementById("scene-canvas");
      if (canvas && progress > 0) canvas.style.opacity = String(1 - cover);

      if (debug && hudRef.current) {
        hudRef.current.textContent =
          `progress ${progress.toFixed(3)} · cover ${cover.toFixed(3)} · ` +
          `reveal ${reveal.toFixed(3)} · camZ ${cameraZ.toFixed(2)} · glassZ ${glassZ.toFixed(2)}`;
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="portal-runway" ref={sectionRef} className="relative h-[200vh]">
      <div
        className="sticky top-0 flex h-svh items-center justify-center overflow-hidden px-6 md:px-10"
      >
        {/* white-blue whiteout — fully covers from the centre outward */}
        <div
          ref={flashRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 opacity-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, #ffffff 0%, #eaf2ff 34%, #9dc0ff 56%, #3b82f6 78%, rgba(8,8,12,0) 100%)",
          }}
        />

        {/* dev-only readout: append ?portal-debug to the URL */}
        <div
          ref={hudRef}
          className="pointer-events-none absolute left-4 top-24 z-30 font-mono text-[11px] text-white/70"
        />
      </div>
    </section>
  );
}
