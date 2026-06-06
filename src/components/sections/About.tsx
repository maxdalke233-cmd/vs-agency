"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { reduced } from "@/lib/motion";
import { agencyBio } from "@/lib/data";

/**
 * Agency intro that fills the dark beat between the lens portal and the pricing.
 * A vertical "VS AGENCY" wordmark runs down the left; on the right a short bio
 * lights up word-by-word as you scroll (ScrollTrigger scrub + pin — the section
 * stays put while the words come into focus).
 */
export default function About() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      const words = el.querySelectorAll<HTMLElement>("[data-word]");

      if (reduced()) {
        gsap.set(words, { opacity: 1 });
        return;
      }

      gsap.fromTo(
        words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.4,
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=120%",
            scrub: 0.5,
            pin: true,
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <section id="about" ref={ref} className="relative overflow-hidden">
      <div className="mx-auto flex min-h-svh w-full max-w-[1400px] items-center gap-6 px-6 md:gap-16 md:px-10">
        {/* vertical wordmark */}
        <div
          aria-hidden
          className="shrink-0 select-none font-display font-semibold leading-none tracking-[-0.02em] text-[length:var(--fs-h2)]"
          style={{ writingMode: "vertical-rl" }}
        >
          <span className="text-gradient">VS</span>{" "}
          <span className="text-gradient">AGENCY</span>
        </div>

        {/* read-through bio */}
        <div className="max-w-[24ch]">
          <p className="eyebrow mb-6">Über uns</p>
          <p className="font-display font-medium leading-[1.35] tracking-[-0.01em] text-[length:var(--fs-h3)]">
            {agencyBio.split(" ").map((word, i) => (
              <span key={i} data-word className="inline-block">
                {word}&nbsp;
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
