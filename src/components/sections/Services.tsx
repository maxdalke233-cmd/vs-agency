"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Heading } from "./Heading";
import { services } from "@/lib/data";

const TRAFFIC_LIGHTS = ["#FF5F57", "#FFBD2E", "#28C840"];

export default function Services() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from("[data-scard]", {
        y: 32,
        opacity: 0,
        scale: 0.97,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: "[data-sgrid]",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: ref },
  );

  return (
    <section
      id="services"
      ref={ref}
      className="relative flex min-h-svh items-center px-6 py-28 md:px-10"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <Heading
          eyebrow="Leistungen"
          lines={["Alles, was Ihr", "Content braucht."]}
          body="Strategie, Schnitt, Motion Design und verlässliche Lieferung — für Marken, die online selbstbewusst auftreten wollen."
        />

        <div
          data-sgrid
          className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((s, i) => (
            /* LED border wrapper */
            <div
              key={s.title}
              data-scard
              className="led-wrap"
              style={{ animationDelay: `${-i * 0.65}s` }}
            >
              {/* inner card */}
              <div
                className="overflow-hidden rounded-[12px] h-full"
                style={{
                  background: "rgba(22, 22, 26, 0.97)",
                }}
              >
                {/* title bar */}
                <div
                  className="flex items-center gap-3 px-4"
                  style={{
                    height: 36,
                    background: "rgba(44, 44, 48, 0.98)",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="flex items-center gap-[6px] shrink-0">
                    {TRAFFIC_LIGHTS.map((color) => (
                      <span
                        key={color}
                        className="block rounded-full"
                        style={{ width: 12, height: 12, backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span
                    className="flex-1 truncate text-center pr-[60px]"
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.45)",
                      fontFamily: "var(--font-sans)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {s.title}
                  </span>
                </div>

                {/* body */}
                <div className="p-5">
                  <p
                    className="font-display font-bold leading-none select-none"
                    style={{
                      fontSize: 42,
                      background: "linear-gradient(135deg, #ffffff 0%, #a8c8ff 55%, #6f9bff 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p
                    className="mt-3 leading-relaxed"
                    style={{ fontSize: 13.5, color: "#ffffff" }}
                  >
                    {s.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
