"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { reduced } from "@/lib/motion";
import { Heading } from "./Heading";
import { processSteps } from "@/lib/data";

export default function Process() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // progress line fills as the timeline scrolls through view (skip on reduced motion)
      if (!reduced()) {
        const mm = gsap.matchMedia();

        // narrow / mobile: line is vertical → grow it top → bottom
        mm.add("(max-width: 1023px)", () => {
          gsap.fromTo(
            "[data-progress]",
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: "[data-timeline]",
                start: "top 80%",
                end: "bottom 65%",
                scrub: 1,
              },
            },
          );
        });

        // desktop: line is horizontal → grow it left → right
        mm.add("(min-width: 1024px)", () => {
          gsap.fromTo(
            "[data-progress]",
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: "[data-timeline]",
                start: "top 70%",
                end: "bottom 70%",
                scrub: 1,
              },
            },
          );
        });
      }

      gsap.from("[data-step]", {
        opacity: 0,
        y: 36,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: "[data-timeline]",
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: ref },
  );

  return (
    <section
      id="process"
      ref={ref}
      className="relative flex min-h-svh items-center px-6 py-24 md:px-10"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <Heading
          eyebrow="Ablauf"
          lines={["Von der Idee", "zum fertigen Post."]}
          body="Ein klarer Ablauf, der Ihren Content von der groben Idee zu fertigen Videos für den Feed bringt."
        />

        <div data-timeline className="relative mt-16">
          {/* timeline base line — horizontal on desktop, vertical on mobile */}
          <div className="absolute left-[18px] top-2 h-[calc(100%-1rem)] w-px bg-[var(--line)] lg:left-0 lg:top-[18px] lg:h-px lg:w-full" />
          <div
            data-progress
            className="absolute left-[18px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-white lg:left-0 lg:top-[18px] lg:h-px lg:w-full lg:origin-left"
          />

          <ol className="grid gap-10 lg:grid-cols-5 lg:gap-6">
            {processSteps.map((step) => (
              <li key={step.number} data-step className="relative pl-12 lg:pl-0 lg:pt-12">
                <span className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line-strong)] bg-bg-2 font-display text-sm text-blue lg:left-0">
                  {step.number}
                </span>
                <h3 className="font-display text-lg font-medium text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-2)]">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
