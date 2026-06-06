"use client";

import { useEffect, useState } from "react";
import { navLinks } from "@/lib/data";

export default function Navbar() {
  const [pastHero, setPastHero] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock body scroll behind the mobile menu
  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", open);
    return () => document.documentElement.classList.remove("lenis-stopped");
  }, [open]);

  // While the menu is open the header sits over the dark overlay, so it must
  // use the dark treatment too (white logo + visible X) even at the page top.
  const dark = pastHero || open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 border-b ${
          dark
            ? "border-white/8 bg-[rgba(5,5,5,0.92)] backdrop-blur-xl"
            : "border-black/10 bg-white/85 backdrop-blur-md"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 md:h-20 md:px-10">
          <a href="#top" aria-label="VS Agency — Startseite" className="flex items-center">
            {/* black-on-transparent monogram; inverted to white on the dark header */}
            <img
              src="/vs-logo.png"
              alt="VS Agency"
              className={`h-10 w-auto md:h-12 ${dark ? "invert" : ""}`}
            />
          </a>

          {/* desktop links */}
          <ul className="hidden items-center gap-9 md:flex">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`text-sm transition-colors duration-500 ${
                    dark
                      ? "text-[var(--text-2)] hover:text-white"
                      : "text-black/55 hover:text-black"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#cta"
            className={`btn btn-primary btn-cta-nav hidden md:inline-flex ${dark ? "btn-light" : ""}`}
          >
            Termin buchen
          </a>

          {/* mobile toggle */}
          <button
            type="button"
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative z-50 flex h-10 w-10 items-center justify-center md:hidden"
          >
            <span className="relative block h-3 w-6">
              <span
                className={`absolute left-0 block h-px w-6 transition-all duration-300 ${
                  open ? "top-1.5 rotate-45 bg-white" : `top-0 ${dark ? "bg-white" : "bg-black"}`
                }`}
              />
              <span
                className={`absolute left-0 top-3 block h-px w-6 transition-all duration-300 ${
                  open ? "-translate-y-1.5 -rotate-45 bg-white" : dark ? "bg-white" : "bg-black"
                }`}
              />
            </span>
          </button>
        </nav>
      </header>

      {/* mobile full-screen menu — rendered OUTSIDE <header> on purpose:
          the header's backdrop-filter would otherwise become the containing
          block for this fixed element, clamping it to the ~80px header bar. */}
      <div
        className={`fixed inset-0 z-40 flex flex-col justify-center gap-2 bg-[rgba(5,5,5,0.97)] px-8 backdrop-blur-2xl transition-opacity duration-500 md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {navLinks.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className="font-display text-4xl font-medium tracking-tight text-white"
          >
            {l.label}
          </a>
        ))}
        <a
          href="#cta"
          onClick={() => setOpen(false)}
          className="btn btn-primary mt-8 w-fit"
        >
          Termin buchen
        </a>
      </div>
    </>
  );
}
