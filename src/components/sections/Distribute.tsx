"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { reduced } from "@/lib/motion";
import { Heading } from "./Heading";
import { distributeMetrics } from "@/lib/data";

// metrics arranged around an ellipse (centers, translate -50%/-50%)
const RING_POS = [
  { top: "6%", left: "50%" },
  { top: "28%", left: "88%" },
  { top: "72%", left: "88%" },
  { top: "94%", left: "50%" },
  { top: "72%", left: "12%" },
  { top: "28%", left: "12%" },
];

export default function Distribute() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const chips = gsap.utils.toArray<HTMLElement>("[data-metric]");
      gsap.from(chips, {
        opacity: 0,
        scale: 0.7,
        duration: 0.7,
        ease: "back.out(1.6)",
        stagger: 0.1,
        scrollTrigger: { trigger: ref.current, start: "top 60%" },
      });
      if (!reduced())
        chips.forEach((chip, i) => {
          gsap.to(chip, {
            y: "+=10",
          duration: 2.8 + (i % 3) * 0.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 0.18,
        });
      });
    },
    { scope: ref },
  );

  return (
    <section
      id="distribute"
      ref={ref}
      className="relative flex min-h-svh items-center px-6 md:px-10"
    >
      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-10 md:grid-cols-2">
        <Heading
          eyebrow="03 / Ausspielen"
          lines={["Gebaut für", "Plattformen, auf denen", "Aufmerksamkeit rast."]}
          body="Ihr Content muss nicht nur gut aussehen. Er muss bewegen, überzeugen und im Feed im Kopf bleiben."
        />

        {/* orbiting metrics around the camera */}
        <div className="pointer-events-none relative hidden h-[68vh] md:block">
          {/* implied orbit ring */}
          <div className="absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />
          <div className="absolute left-1/2 top-1/2 h-[55%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]" />

          {distributeMetrics.map((m, i) => (
            <span
              key={m}
              data-metric
              className="glass absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium text-white"
              style={{ top: RING_POS[i].top, left: RING_POS[i].left }}
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
