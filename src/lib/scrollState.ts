/**
 * Single source of truth for global scroll progress (0 → 1).
 * Written by <ScrollDriver/> on the DOM side, read inside R3F's useFrame.
 * A plain mutable singleton on purpose: no React re-renders per scroll frame.
 */
export const scrollState = { progress: 0 };
