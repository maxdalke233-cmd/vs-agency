"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { pricingTiers } from "@/lib/data";

/**
 * Pricing tiers in normal document flow — emerges right after the lens portal.
 * Natural height so all three tiers are always fully visible (stacked on mobile,
 * 3-up on desktop). Reveal mirrors the site-wide GSAP scroll pattern.
 */
export default function PricingTiers() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from("[data-reveal]", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: ref },
  );

  return (
    <section id="pricing" ref={ref} className="relative px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="mb-12 text-center">
          <p data-reveal className="eyebrow mb-4">
            Preise
          </p>
          <h2
            data-reveal
            className="font-display font-semibold leading-[0.98] tracking-[-0.02em] text-[length:var(--fs-h2)]"
          >
            Durch die Linse gedacht.
          </h2>
          <p
            data-reveal
            className="mx-auto mt-5 max-w-[46ch] text-[length:var(--fs-body)] text-[var(--text-2)]"
          >
            Einfache monatliche Content-Systeme. Jederzeit kündbar.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {pricingTiers.map((t) => (
            <div
              key={t.name}
              data-reveal
              className={`glass relative flex flex-col rounded-3xl p-8 ${
                t.highlighted ? "shadow-[0_0_60px_-16px_var(--glow)] ring-1 ring-blue/60" : ""
              }`}
            >
              {t.highlighted && (
                <span className="absolute right-6 top-6 rounded-full bg-blue/15 px-3 py-1 text-xs font-medium text-blue">
                  Beliebt
                </span>
              )}
              <p className="font-display text-lg font-medium text-[var(--text)]">{t.name}</p>
              <p className="mt-1 text-sm text-[var(--text-2)]">{t.tagline}</p>
              <p className="mt-6 font-display text-4xl font-semibold tracking-tight">
                {t.price}
                <span className="text-base font-normal text-[var(--text-muted)]">{t.period}</span>
              </p>
              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-[var(--text-2)]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className={`btn mt-8 justify-center ${t.highlighted ? "btn-primary" : "btn-secondary"}`}
              >
                Loslegen
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
