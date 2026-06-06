"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import CyclingWord from "./CyclingWord";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from("[data-hero='eyebrow']", { y: 20, opacity: 0, duration: 0.6 }, 0.1)
        .from(
          "[data-hero='line']",
          { yPercent: 120, opacity: 0, duration: 1.1, stagger: 0.12 },
          0.2,
        )
        .from("[data-hero='sub']", { y: 20, opacity: 0, duration: 0.7 }, "-=0.6")
        .from(
          "[data-hero='cta']",
          { y: 16, opacity: 0, duration: 0.6, stagger: 0.1 },
          "-=0.4",
        )
        .from("[data-hero='scroll']", { opacity: 0, duration: 0.8 }, "-=0.2");

      // Fade the scroll indicator out as the user starts scrolling
      gsap.to("[data-hero='scroll']", {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "15% top",
          scrub: true,
        },
      });
    },
    { scope: root },
  );

  return (
    <section
      id="top"
      ref={root}
      className="relative flex min-h-svh items-center px-6 md:px-10"
    >
      {/* legibility gradient under the left-aligned copy.
          A vertical mask fades the top + bottom edges to zero so the panel
          never leaves a hard horizontal line at the Hero → Capture boundary. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-[1]"
        style={{
          background:
            "linear-gradient(90deg, rgba(5,5,5,0.85) 0%, rgba(5,5,5,0.4) 45%, transparent 70%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 18%, black 70%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 18%, black 70%, transparent 100%)",
        }}
      />

      <div className="mx-auto w-full max-w-[1400px]">
        <p data-hero="eyebrow" className="eyebrow mb-6">
          Videoagentur für Marken mit Anspruch
        </p>

        <h1 className="max-w-[15ch] font-display text-[length:var(--fs-hero)] font-semibold leading-[0.98] tracking-[-0.03em] text-white">
          <span className="reveal-line">
            <span data-hero="line" className="block">
              Wir verwandeln
            </span>
          </span>
          <span className="reveal-line">
            <span data-hero="line" className="block">
              Aufmerksamkeit in
            </span>
          </span>
          <span className="reveal-line">
            <span data-hero="line" className="block">
              <CyclingWord className="text-gradient" />
            </span>
          </span>
        </h1>

        <p
          data-hero="sub"
          className="mt-7 max-w-[46ch] text-[length:var(--fs-body)] text-white/70"
        >
          VS Agency produziert cinematische Short-Form-Videos für Creator,
          Instagram-Seiten und lokale Unternehmen, die online auffallen wollen.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <a data-hero="cta" href="#cta" className="btn btn-primary">
            Projekt starten
          </a>
          <a data-hero="cta" href="#work" className="btn btn-secondary">
            Arbeiten ansehen
          </a>
        </div>
      </div>

      {/* scroll indicator */}
      <div
        data-hero="scroll"
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[var(--text-muted)]"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scrollen</span>
        <span className="h-10 w-px animate-pulse bg-gradient-to-b from-white/60 to-transparent" />
      </div>
    </section>
  );
}
