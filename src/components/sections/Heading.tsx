"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

/**
 * Shared section heading with line-by-line reveal on scroll.
 * Eyebrow + multi-line H2 + body paragraph.
 */
export function Heading({
  eyebrow,
  lines,
  body,
}: {
  eyebrow: string;
  lines: string[];
  body: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      gsap.from(el.querySelectorAll("[data-line]"), {
        yPercent: 120,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: el,
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });
      gsap.from(el.querySelectorAll("[data-fade]"), {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: el,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref}>
      <p data-fade data-lumen className="eyebrow mb-5">
        {eyebrow}
      </p>
      <h2 className="max-w-[18ch] text-balance font-display font-semibold leading-[1.02] tracking-[-0.02em] text-[length:var(--fs-h2)]">
        {lines.map((l, i) => (
          <span key={i} className="reveal-line">
            <span data-line data-lumen className="block">
              {l}
            </span>
          </span>
        ))}
      </h2>
      <p
        data-fade
        data-lumen
        className="mt-6 max-w-[44ch] text-[length:var(--fs-body)] text-[var(--text-2)]"
      >
        {body}
      </p>
    </div>
  );
}
