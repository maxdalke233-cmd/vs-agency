"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { reduced } from "@/lib/motion";

/**
 * Cycling word for the hero headline — the last word rotates on a loop.
 * Old word slides up & out fast, new word slides up from below slowly and
 * settles (no overlap). Rebuilt with GSAP from cycling-word-effekt.md.
 *
 * The gradient fill comes from the parent line's `.text-gradient` class, so
 * every word inherits the blue gradient automatically.
 */

// ── CONFIG ──────────────────────────────────────────────────────
const WORDS = ["Wirkung.", "Vertrauen.", "Wachstum.", "Umsatz."];
const STAND_MS = 5500; // how long a word stays visible
const SLIDE = 28; // vertical travel in px
// ────────────────────────────────────────────────────────────────

export default function CyclingWord({
  words = WORDS,
  className = "",
}: {
  words?: string[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const wordRef = useRef<HTMLSpanElement>(null);
  const scope = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      // Respect reduced motion: keep the first word static, no cycling.
      if (reduced()) return;

      const word = wordRef.current!;
      let i = 0;

      const cycle = () => {
        const tl = gsap.timeline();
        // exit current word upward, fast & accelerating
        tl.to(word, {
          y: -SLIDE,
          opacity: 0,
          duration: 0.22,
          ease: "cw-exit",
          onComplete: () => {
            i = (i + 1) % words.length;
            setIndex(i);
            // place next word below the mask, invisible
            gsap.set(word, { y: SLIDE, opacity: 0 });
          },
        });
        // enter next word from below, slow & elegant
        tl.to(word, {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: "cw-enter",
        });
      };

      // No effect on first render (matches initial={false}); start after one stand.
      const id = window.setInterval(cycle, STAND_MS);
      return () => window.clearInterval(id);
    },
    { scope, dependencies: [words] },
  );

  return (
    <span ref={scope} className="cycling-mask">
      <span ref={wordRef} className={`cycling-word ${className}`}>
        {words[index]}
      </span>
    </span>
  );
}
