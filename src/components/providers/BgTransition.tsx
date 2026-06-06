"use client";

import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function BgTransition() {
  useGSAP(() => {
    const gradient = document.getElementById("bg-gradient");
    const overlay = document.getElementById("bg-white-overlay");
    if (!gradient || !overlay) return;

    // Single source of truth for the light theme: the body class strictly
    // follows the white overlay's ACTUAL opacity. This makes it toggle
    // correctly in both scroll directions — no separate trigger to desync.
    const syncTheme = () => {
      const o = parseFloat(getComputedStyle(overlay).opacity || "0");
      document.body.classList.toggle("light-bg", o > 0.5);
    };

    // ── One master timeline for the whole light phase ────────────────────
    // dark → (entry at Capture) white → hold (Edit/Distribute) → (exit at
    // Results) dark. A SINGLE scrubbed timeline has exactly one state per
    // scroll position, so there is no second trigger to fight over the
    // overlay. At the top of the page (before the trigger starts) the timeline
    // rests at time 0 — overlay 0, gradient 1, canvas 1 = dark hero. This is
    // the fix for the "white hero on load" bug: there is no `from:{opacity:1}`
    // on the overlay that a scrubbed trigger could render at scroll 0.
    const ENTRY = 0.6; // dark → white (front-loaded, finishes fast)
    const HOLD = 4.6; // white held across Capture / Edit / Distribute
    const EXIT = 0.5; // white → dark (snappy, finishes before Results is centred)

    const tl = gsap.timeline({ defaults: { ease: "none" } });

    // Entry: gradient fades out, white fades in just after — so the whiteout
    // completes before the centered Capture heading is readable. (The 3D camera
    // crossfade is owned by StrokeTrail, in sync with the snake.)
    tl.fromTo(gradient, { opacity: 1 }, { opacity: 0, duration: ENTRY * 0.5 }, 0)
      .fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: ENTRY * 0.9 }, ENTRY * 0.1);

    // Hold: keep the white phase steady through the mid sections.
    tl.to(overlay, { opacity: 1, duration: HOLD });

    // Exit: white stays readable (dark text on light) then SNAPS to dark
    // (power2.in) so the muddy mid-grey frame is brief, finishing before the
    // Results heading is centred. A short dark-hold tail follows so the camera
    // (StrokeTrail) can fade back in on an already-dark frame — clean, no mud.
    const exitAt = ENTRY + HOLD;
    tl.to(overlay, { opacity: 0, duration: EXIT, ease: "power2.in" }, exitAt)
      .to(gradient, { opacity: 1, duration: EXIT * 0.7 }, exitAt + EXIT * 0.3)
      .to(overlay, { opacity: 0, duration: 0.3 }); // dark-hold tail

    ScrollTrigger.create({
      trigger: "#capture",
      start: "top 95%",
      endTrigger: "#results",
      end: "top 30%",
      scrub: 1,
      animation: tl,
      onUpdate: syncTheme,
    });
  });

  return null;
}
