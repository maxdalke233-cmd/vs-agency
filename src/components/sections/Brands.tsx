"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { brandRows } from "@/lib/data";

const SPEED = 0.09; // px per ms

export default function Brands() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);

  useEffect(() => {
    const rows = rowRefs.current;
    const baseDirs = [1, -1, 1]; // left, right, left
    const xOffsets = [0, 0, 0];
    let totalWs = [0, 0, 0];
    let targetMul = 1;
    let currentMul = 1;

    // Measure after the browser paints so scrollWidth is accurate
    const raf = requestAnimationFrame(() => {
      totalWs = rows.map((r) => (r ? r.scrollWidth / 2 : 0));
    });

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        // Scrolling down → reverse all rows; scrolling up → restore base dirs
        targetMul = self.direction === 1 ? -1 : 1;
      },
    });

    const tick = (_: number, delta: number) => {
      currentMul += (targetMul - currentMul) * 0.05;

      rows.forEach((row, i) => {
        if (!row || totalWs[i] === 0) return;
        xOffsets[i] -= baseDirs[i] * currentMul * SPEED * delta;

        // Modular normalisation — keeps offset in (-totalW, 0]
        const t = totalWs[i];
        xOffsets[i] = ((xOffsets[i] % t) + t) % t;
        if (xOffsets[i] > 0) xOffsets[i] -= t;

        row.style.transform = `translateX(${xOffsets[i]}px)`;
      });
    };

    gsap.ticker.add(tick);

    return () => {
      cancelAnimationFrame(raf);
      gsap.ticker.remove(tick);
      st.kill();
    };
  }, []);

  return (
    <section
      id="brands"
      ref={sectionRef}
      className="overflow-hidden pb-24 pt-0 md:pb-32"
    >
      {/* Heading */}
      <div className="mx-auto mb-12 max-w-[1400px] px-6 md:mb-16 md:px-10">
        <p className="eyebrow mb-4">Unsere Kunden</p>
        <h2 className="font-display text-[length:var(--fs-h2)] font-semibold leading-[1.05] tracking-[-0.03em]">
          Marken, die auf{" "}
          <span className="text-gradient">VS Agency</span> setzen
        </h2>
      </div>

      {/* 3 marquee rows */}
      <div className="flex flex-col gap-4">
        {brandRows.map((brands, rowIndex) => (
          <div key={rowIndex} className="overflow-hidden">
            <div
              ref={(el) => {
                rowRefs.current[rowIndex] = el;
              }}
              className="flex w-max gap-5"
              style={{ willChange: "transform" }}
            >
              {[...brands, ...brands].map((brand, j) => (
                <div
                  key={j}
                  className="glass flex select-none items-center gap-4 rounded-full px-6 py-4"
                >
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-bold text-white"
                    style={{ backgroundColor: brand.color }}
                  >
                    {brand.name[0]}
                  </span>
                  <span className="whitespace-nowrap text-base font-medium text-white/80">
                    {brand.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
