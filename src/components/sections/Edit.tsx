"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { reduced } from "@/lib/motion";
import { Heading } from "./Heading";
import { editCards, editServices } from "@/lib/data";

// scattered vertical reel cards (right half)
const CARD_POS = [
  { top: "6%", left: "8%", rot: -6 },
  { top: "2%", left: "44%", rot: 5 },
  { top: "30%", left: "26%", rot: -2 },
  { top: "34%", left: "62%", rot: 7 },
  { top: "60%", left: "10%", rot: 4 },
  { top: "58%", left: "46%", rot: -5 },
];

export default function Edit() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
      gsap.from(cards, {
        opacity: 0,
        y: 40,
        scale: 0.85,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      });
      if (!reduced())
        cards.forEach((card, i) => {
          gsap.to(card, {
            y: "+=16",
          duration: 2.6 + (i % 3) * 0.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 0.12,
        });
      });

      gsap.from("[data-mini]", {
        opacity: 0,
        y: 20,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: "[data-mini-grid]",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: ref },
  );

  return (
    <section
      id="edit"
      ref={ref}
      className="relative flex min-h-svh items-center px-6 py-24 md:px-10"
    >
      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-10 md:grid-cols-2">
        <div>
          <Heading
            eyebrow="02 / Schnitt"
            lines={["Dann schneiden", "wir Content, der den", "Scroll stoppt."]}
            body="Aus rohem Material, Ideen und Markenmomenten machen wir Short-Form-Videos, die auf Verweildauer, Rhythmus und Klarheit gebaut sind."
          />

          <div data-mini-grid className="mt-10 flex flex-col gap-3">
            {editServices.map((s) => (
              <div
                key={s.title}
                data-mini
                className="flex items-start gap-4 rounded-2xl border border-white/10 p-4 backdrop-blur-xl"
                style={{ background: "rgba(8, 8, 8, 0.92)" }}
              >
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue shadow-[0_0_12px_var(--glow)]" />
                <div>
                  <p className="text-sm font-medium text-white">{s.title}</p>
                  <p className="mt-1 text-sm text-white/55">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* floating reel cards */}
        <div className="pointer-events-none relative hidden h-[80vh] md:block">
          {editCards.map((card, i) => (
            <div
              key={card.label}
              data-card
              className="glass absolute aspect-[9/16] w-[clamp(110px,11vw,150px)] overflow-hidden rounded-2xl"
              style={{
                top: CARD_POS[i].top,
                left: CARD_POS[i].left,
                rotate: `${CARD_POS[i].rot}deg`,
              }}
            >
              {/* 🔁 REPLACE thumbnail with a real <video>/<Image> later */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#11141c] via-[#0a0a0f] to-[#1a1230]" />
              <div className="absolute right-2 top-2 rounded-full bg-black/40 px-2 py-0.5 text-[10px] text-white/80">
                {card.duration}
              </div>
              <div className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur">
                <span className="ml-0.5 block h-0 w-0 border-y-[6px] border-l-[10px] border-y-transparent border-l-white" />
              </div>
              <div className="absolute inset-x-2 bottom-2 text-[11px] font-medium text-white">
                {card.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
