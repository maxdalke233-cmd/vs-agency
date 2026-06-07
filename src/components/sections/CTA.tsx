"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

export default function CTA() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        scrollTrigger: {
          trigger: ref.current,
          start: "top 65%",
          toggleActions: "play none none reverse",
        },
      });
      tl.from("[data-cta='line']", {
        y: 28,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
      })
        .from("[data-cta='sub']", { y: 20, opacity: 0, duration: 0.7 }, "-=0.5")
        .from(
          "[data-cta='btn']",
          { y: 16, opacity: 0, duration: 0.6, stagger: 0.1 },
          "-=0.3",
        );
    },
    { scope: ref },
  );

  return (
    <section
      id="cta"
      ref={ref}
      className="relative flex min-h-svh items-center justify-center px-6 text-center md:px-10"
    >
      {/* expanding glow behind the camera as it returns to center */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-[1] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.35), rgba(139,92,246,0.18) 50%, transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-[40ch]">
        <h2 className="mx-auto max-w-[24ch] text-balance font-display font-semibold leading-[1.04] tracking-[-0.025em] text-[length:var(--fs-h2)]">
          <span data-cta="line" className="block">
            Bereit, Ihre Marke
          </span>
          <span data-cta="line" className="block text-blue">
            unübersehbar zu machen?
          </span>
        </h2>

        <p
          data-cta="sub"
          className="mx-auto mt-7 max-w-[48ch] text-[length:var(--fs-body)] text-white"
        >
          Lassen Sie uns ein Content-System bauen, das den Scroll stoppt, Ihre
          Marke im Kopf verankert und Menschen zum Handeln bringt.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a data-cta="btn" href="mailto:vladislavs.stolarevskis@gmail.com" className="btn btn-primary">
            Termin buchen
          </a>
          <a data-cta="btn" href="#work" className="btn btn-secondary">
            Arbeiten ansehen
          </a>
        </div>
      </div>
    </section>
  );
}
