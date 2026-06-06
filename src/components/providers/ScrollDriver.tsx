"use client";

import { useEffect } from "react";
import { scrollState } from "@/lib/scrollState";
import { portalState } from "@/lib/portalState";

/**
 * Single scroll listener that drives two signals:
 *  - scrollState: the main camera narrative (Hero → CTA), anchored so it
 *    completes right as the portal runway begins — adding the portal/pricing
 *    below never desyncs the keyframes.
 *  - portalState: 0→1 through the #portal-runway section (the lens dive).
 * Computed from scroll position so it works with/without Lenis & reduced-motion.
 */
export default function ScrollDriver() {
  useEffect(() => {
    const clamp = (v: number) => Math.min(Math.max(v, 0), 1);

    const update = () => {
      const doc = document.documentElement;
      const vh = window.innerHeight;
      const y = window.scrollY || doc.scrollTop || 0;
      const runway = document.getElementById("portal-runway");

      if (runway) {
        const top = runway.offsetTop;
        const h = runway.offsetHeight;
        const mainDenom = Math.max(top - vh, 1);
        scrollState.progress = clamp(y / mainDenom);
        portalState.progress = clamp((y - (top - vh)) / Math.max(h, 1));
      } else {
        const max = doc.scrollHeight - vh;
        scrollState.progress = max > 0 ? clamp(y / max) : 0;
        portalState.progress = 0;
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return null;
}
