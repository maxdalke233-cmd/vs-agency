"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Heading } from "./Heading";
import { resultsStats } from "@/lib/data";

function Counter({
  value,
  suffix,
  decimals = 0,
}: {
  value: number;
  suffix: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const obj = { v: 0 };
      gsap.to(obj, {
        v: value,
        duration: 1.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
        onUpdate: () => {
          if (ref.current) ref.current.textContent = obj.v.toFixed(decimals);
        },
      });
    },
    { scope: ref },
  );

  return (
    <span className="font-display font-semibold tracking-tight text-[length:var(--fs-hero)] leading-none">
      <span ref={ref}>0</span>
      <span className="text-blue">{suffix}</span>
    </span>
  );
}

export default function Results() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from("[data-stat]", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: "[data-stat-grid]",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: ref },
  );

  return (
    <section
      id="results"
      ref={ref}
      className="relative flex min-h-svh items-center px-6 py-24 md:px-10"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <Heading
          eyebrow="Ergebnisse"
          lines={["Content, der gut", "aussieht und liefert."]}
          body="Von lokalen Unternehmen bis Creator: Unsere Videos sind dafür gebaut, dass Menschen stehen bleiben, schauen und handeln."
        />

        <div
          data-stat-grid
          className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {resultsStats.map((s) => (
            <div
              key={s.label}
              data-stat
              className="glass flex flex-col justify-between rounded-3xl p-7 transition-shadow hover:shadow-[0_0_40px_-8px_var(--glow)]"
            >
              <Counter value={s.value} suffix={s.suffix} decimals={s.decimals} />
              <p className="mt-5 text-sm text-[var(--text-2)]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
