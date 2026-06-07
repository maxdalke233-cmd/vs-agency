"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { reduced } from "@/lib/motion";
import { portalState } from "@/lib/portalState";
import founderPortrait from "../../../public/founder-portrait.png";

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
  const photoRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced()) return;

    const debug =
      typeof window !== "undefined" && window.location.search.includes("portal-debug");

    let raf = 0;
    const loop = () => {
      const { cover, progress, cameraZ, glassZ } = portalState;
      // Start clearing the moment the dive reaches the glass (cover is full by
      // ~0.55) and finish by ~0.85 so the last stretch of the runway holds on the
      // framed photo — you come straight out of the portal onto it, no dead white.
      const reveal = smoothstep((progress - 0.6) / 0.25);

      // whiteout: full while diving to the glass, warps + cross-fades into the photo
      const flash = flashRef.current;
      if (flash) {
        flash.style.opacity = String(cover * (1 - reveal));
        flash.style.transform = `scale(${1 + reveal * 0.4})`;
      }

      // The founder portrait fades in exactly as the whiteout clears, so the
      // dissolve lands directly on the framed photo instead of on blank white.
      const photo = photoRef.current;
      if (photo) photo.style.opacity = String(reveal);

      // Solid white underlay behind the radial whiteout. Gated to the TOP of the
      // cover range (only the last stretch of the dive) so it never grey-veils the
      // crisp lens dive earlier on, but still fully fills the corners the round
      // bloom can't reach at the whiteout peak. `reveal` then keeps it white
      // through the photo crossfade and the un-stick tail at the end.
      const section = sectionRef.current;
      if (section) {
        const fill = Math.max(smoothstep((cover - 0.75) / 0.25), reveal);
        section.style.backgroundColor = `rgba(255,255,255,${fill})`;
      }

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
    <section id="portal-runway" ref={sectionRef} className="relative h-[210vh]">
      <div
        className="sticky top-0 flex h-svh items-center justify-center overflow-hidden"
      >
        {/* Founder portrait the whiteout dissolves into. Sits behind the flash;
            its opacity is driven by `reveal`. Bottom is masked so it melts into
            the white About section below instead of leaving a hard seam. */}
        <div ref={photoRef} aria-hidden className="absolute inset-0 opacity-0">
          <Image
            src={founderPortrait}
            alt="VS Agency"
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, #000 0%, #000 62%, rgba(0,0,0,0.5) 82%, rgba(0,0,0,0.12) 94%, transparent 100%)",
              maskImage:
                "linear-gradient(to bottom, #000 0%, #000 62%, rgba(0,0,0,0.5) 82%, rgba(0,0,0,0.12) 94%, transparent 100%)",
            }}
          />
        </div>

        {/* white-blue whiteout — fully covers from the centre outward */}
        <div
          ref={flashRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 opacity-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, #ffffff 0%, #ffffff 44%, #eaf2ff 62%, #9dc0ff 80%, #3b82f6 92%, rgba(59,130,246,0) 100%)",
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
