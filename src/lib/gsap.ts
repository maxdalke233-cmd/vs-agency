/**
 * Central GSAP entry point.
 * Import { gsap, ScrollTrigger } from here so plugins are registered exactly once.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, CustomEase);

  // Cycling-word eases (1:1 to cycling-word-effekt.md cubic-beziers).
  // Created once here so any component can reference them by name.
  if (!CustomEase.get("cw-enter")) CustomEase.create("cw-enter", "0.22, 1, 0.36, 1");
  if (!CustomEase.get("cw-exit")) CustomEase.create("cw-exit", "0.4, 0, 1, 1");
}

export { gsap, ScrollTrigger, CustomEase };
