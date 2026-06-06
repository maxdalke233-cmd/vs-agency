"use client";

import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function BgTransition() {
  useGSAP(() => {
    const gradient = document.getElementById("bg-gradient");
    const overlay = document.getElementById("bg-white-overlay");
    if (!gradient || !overlay) return;

    // Single source of truth for the light theme. Uses gsap.getProperty
    // (reads from GSAP's internal state, no DOM style flush) and guards
    // the classList toggle so it only fires on actual state changes.
    let isLight = false;
    const syncTheme = () => {
      const o = gsap.getProperty(overlay, "opacity") as number;
      // Hysteresis: add light-bg early (overlay > 0.5) so text turns dark
      // while the white phase is clearly active; remove it only when the
      // overlay is nearly gone (< 0.05) so text never turns white while
      // still visible against the fading overlay.
      if (!isLight && o > 0.5) {
        isLight = true;
        document.body.classList.add("light-bg");
      } else if (isLight && o < 0.18) {
        isLight = false;
        document.body.classList.remove("light-bg");
      }
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

    // Hard reset of the theme at both scroll boundaries. The scrubbed
    // hysteresis in syncTheme only runs while the trigger is actively
    // updating — scroll past a boundary faster than the scrub catches up and
    // `light-bg` gets stuck, leaving the dark hero with light-theme buttons
    // (white-on-white → invisible dark fill). onLeaveBack (back above Capture =
    // hero) and onLeave (past Results) force the dark theme so the hero CTAs
    // always render as the bright white/glass pair.
    const setDark = () => {
      isLight = false;
      document.body.classList.remove("light-bg");
    };

    ScrollTrigger.create({
      trigger: "#capture",
      start: "top 95%",
      endTrigger: "#results",
      end: "top 30%",
      scrub: 1,
      animation: tl,
      onUpdate: syncTheme,
      onLeaveBack: setDark,
      onLeave: setDark,
    });
  });

  return null;
}
