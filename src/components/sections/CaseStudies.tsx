"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Heading } from "./Heading";
import { caseStudies } from "@/lib/data";

function CaseCard({
  title,
  category,
  image,
  href,
  cta,
}: {
  title: string;
  category: string;
  metric?: string;
  image?: string;
  href?: string;
  cta?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const seed = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const src = image ?? `https://picsum.photos/seed/${seed}/800/1000`;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-6px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      data-case
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-[var(--line)] transition-transform duration-300 will-change-transform"
    >
      {/* 🔁 REPLACE with real work video/poster later */}
      <div
        className="absolute inset-0 bg-cover bg-center brightness-90 contrast-125 grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
        style={{ backgroundImage: `url(${src})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
      <div className="absolute inset-0 bg-blue/0 transition-colors duration-500 group-hover:bg-blue/5" />

      {/* play overlay */}
      <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 opacity-0 backdrop-blur transition-all duration-300 group-hover:scale-110 group-hover:opacity-100">
        <span className="ml-1 block h-0 w-0 border-y-[9px] border-l-[14px] border-y-transparent border-l-white" />
      </div>

      {/* whole card clickable when a link is set */}
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${title} – ${cta ?? "Besuche die Seite"}`}
          className="absolute inset-0 z-10"
        />
      )}

      <div className="pointer-events-none absolute inset-x-5 bottom-5 z-20">
        {cta && (
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-medium text-black transition-transform duration-300 group-hover:-translate-y-0.5">
            {cta}
            <span aria-hidden>&#8599;</span>
          </span>
        )}
        <p className="text-xs uppercase tracking-[0.18em] text-white/55">{category}</p>
        <h3 className="mt-1 font-display text-lg font-medium text-white">{title}</h3>
      </div>
    </div>
  );
}

export default function CaseStudies() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from("[data-case]", {
        opacity: 0,
        y: 44,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: "[data-case-grid]",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: ref },
  );

  return (
    <section
      id="work"
      ref={ref}
      className="relative flex min-h-svh items-center px-6 py-28 md:px-10"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Heading
            eyebrow="Referenzen"
            lines={["Ausgewählte Arbeiten."]}
            body="Formate, die wir für Marken, Creator und lokale Unternehmen umsetzen."
          />
          <a
            href="#contact"
            className="hidden shrink-0 font-mono text-sm uppercase tracking-[0.15em] text-[var(--text-2)] transition-colors hover:text-white md:inline"
          >
            Projekt starten &#8599;
          </a>
        </div>

        <div data-case-grid className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((c) => (
            <CaseCard key={c.title} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}
