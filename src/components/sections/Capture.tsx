"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { reduced } from "@/lib/motion";
import { Heading } from "./Heading";
import { captureLabels } from "@/lib/data";

// scattered positions for the floating glass chips (right half of the viewport)
const CHIP_POS = [
  { top: "16%", left: "54%" },
  { top: "30%", left: "78%" },
  { top: "46%", left: "60%" },
  { top: "60%", left: "82%" },
  { top: "72%", left: "56%" },
  { top: "24%", left: "66%" },
];

export default function Capture() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const chips = gsap.utils.toArray<HTMLElement>("[data-chip]");
      gsap.from(chips, {
        opacity: 0,
        y: 24,
        scale: 0.9,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 65%",
          toggleActions: "play none none reverse",
        },
      });
      // gentle perpetual float
      if (!reduced())
        chips.forEach((chip, i) => {
        gsap.to(chip, {
          y: "+=12",
          duration: 2.4 + (i % 3) * 0.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 0.15,
        });
      });
    },
    { scope: ref },
  );

  return (
    <section
      id="capture"
      ref={ref}
      className="relative flex min-h-svh items-center px-6 md:px-10"
    >
      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-10 md:grid-cols-2">
        <Heading
          eyebrow="01 / Einfangen"
          lines={["Zuerst", "fangen wir die", "Geschichte ein."]}
          body="Jedes starke Video beginnt mit einer klaren Idee. Konzept, Regie und Bildsprache stehen bei uns, bevor der erste Schnitt gesetzt wird."
        />

        {/* floating glass chips */}
        <div className="pointer-events-none relative hidden h-[60vh] md:block">
          {captureLabels.map((label, i) => (
            <span
              key={label}
              data-chip
              className="glass absolute rounded-full px-5 py-2.5 text-sm text-white/90"
              style={{ top: CHIP_POS[i].top, left: CHIP_POS[i].left }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
