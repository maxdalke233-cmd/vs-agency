/**
 * True when the user asked the OS to reduce motion.
 * Guard GSAP entrance/scroll animations with this so content appears
 * statically instead of animating.
 */
export function reduced(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
