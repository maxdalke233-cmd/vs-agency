# Skill: Cycling Word Effekt (Wort-Wechsel in der Headline)

## Was macht dieser Effekt?

In der Hero-Section steht eine Headline, und **ein einzelnes Wort wechselt sich zyklisch ab**.
Das alte Wort gleitet schnell nach oben raus, das neue Wort kommt langsam und elegant von unten rein.
Die Wörter überlappen sich nicht — erst verschwindet das alte, dann erscheint das neue.

**Visuell:**
```
Gebaut für Wachstum.
Nicht für [Stillstand.]    →    [Durchschnitt.]    →    [Ausreden.]
                ↑ nach oben raus         ↑ von unten rein
```

---

## Technologie

- **Framework**: React (Next.js kompatibel, aber auch in Plain React nutzbar)
- **Animation-Library**: [Framer Motion](https://www.framer.com/motion/) — Paket: `motion` oder `framer-motion`
- **Kernkonzept**: `AnimatePresence` mit `mode="wait"` — exit-Animation ist fertig, bevor enter-Animation startet

---

## Installation

```bash
npm install motion
# oder
npm install framer-motion
```

---

## Vollständiger Komponenten-Code

```tsx
"use client"; // nur bei Next.js App Router notwendig

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
// bei framer-motion stattdessen:
// import { AnimatePresence, motion } from "framer-motion";

// ── KONFIGURATION ──────────────────────────────────────────────
const words = ["Stillstand.", "Durchschnitt.", "Ausreden."];
const STAND_MS = 5500;      // Wie lange ein Wort sichtbar bleibt (ms)
const TRANSITION_S = 0.85;  // Dauer der Enter-Animation (Sekunden)
// ──────────────────────────────────────────────────────────────

export default function CyclingWord() {
  const [index, setIndex] = useState(0);

  // Re-armed via useEffect([index]) — vermeidet React StrictMode Doppelauslösung
  useEffect(() => {
    const timer = setTimeout(() => {
      setIndex((i) => (i + 1) % words.length);
    }, STAND_MS);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <span style={{ display: "inline-block", verticalAlign: "bottom" }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[index]}
          // Enter: von unten reingleiten, langsam und elegant
          initial={{ y: 28, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: {
              duration: TRANSITION_S,
              ease: [0.22, 1, 0.36, 1], // custom ease-out (federt leicht ein)
            },
          }}
          // Exit: nach oben rausgleiten, schnell
          exit={{
            y: -28,
            opacity: 0,
            transition: {
              duration: 0.22,
              ease: [0.4, 0, 1, 1], // ease-in (beschleunigt beim Rausgehen)
            },
          }}
          style={{ display: "inline-block" }}
          // Styling hier anpassen — z.B. italic serif oder normal:
          className="font-serif italic font-normal"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
```

---

## Parameter erklärt

| Parameter | Wert | Bedeutung |
|---|---|---|
| `words` | `["Stillstand.", ...]` | Array der rotierenden Wörter — beliebig erweiterbar |
| `STAND_MS` | `5500` | Wie lange ein Wort steht (Millisekunden) |
| `TRANSITION_S` | `0.85` | Dauer des Einblendens (Sekunden) |
| `initial={{ y: 28 }}` | `28px` | Startposition des neuen Worts (von unten) |
| `exit={{ y: -28 }}` | `-28px` | Endposition des alten Worts (nach oben) |
| `ease: [0.22, 1, 0.36, 1]` | custom | Enter-Easing: startet schnell, bremst elegant ab |
| `ease: [0.4, 0, 1, 1]` | ease-in | Exit-Easing: beschleunigt beim Rausgehen |
| `exit duration: 0.22` | 0.22s | Exit ist schnell — damit das neue Wort schnell dran ist |
| `mode="wait"` | AnimatePresence | Exit komplett fertig bevor Enter startet — kein Überlappen |
| `initial={false}` | AnimatePresence | Kein Enter-Effekt beim ersten Render (Seite lädt normal) |

---

## In die Headline einbauen

```tsx
import CyclingWord from "@/components/cycling-word";

<h1 className="text-6xl font-black leading-tight">
  Gebaut für Wachstum.
  <br />
  Nicht für{" "}
  <CyclingWord />
</h1>
```

**Wichtig:** `{" "}` vor `<CyclingWord />` setzt ein Leerzeichen zwischen dem Text und dem animierten Wort.

---

## Styling anpassen

### Wort anders aussehen lassen (nicht italic serif)
```tsx
// Statt className="font-serif italic font-normal" z.B.:
className="font-sans font-bold"           // fett sans-serif
className="text-blue-500 font-black"      // farbig
className="underline decoration-wavy"    // unterstrichen wellig
```

### Größere/kleinere Slides
```tsx
// Mehr Bewegung (dramatischer):
initial={{ y: 48, opacity: 0 }}
exit={{ y: -48, opacity: 0, ... }}

// Weniger Bewegung (subtiler):
initial={{ y: 14, opacity: 0 }}
exit={{ y: -14, opacity: 0, ... }}
```

### Schneller/langsamer wechseln
```tsx
const STAND_MS = 3000;    // alle 3 Sekunden wechseln
const STAND_MS = 8000;    // alle 8 Sekunden wechseln
```

### Andere Easing-Optionen
```tsx
ease: "easeOut"           // Framer Motion built-in, weich
ease: "backOut"           // federt leicht zurück beim Einfahren
ease: [0.22, 1, 0.36, 1] // der originale custom cubic-bezier (empfohlen)
```

---

## Anweisung für die KI

Wenn du diesen Effekt auf einer neuen Website haben willst, gib der KI folgendes:

> Baue eine React-Komponente `CyclingWord` die Wörter zyklisch wechselt.
> Verwende Framer Motion (`motion/react`) mit `AnimatePresence mode="wait"`.
> Das alte Wort gleitet nach oben raus (y: -28, opacity: 0, duration: 0.22s, ease-in [0.4,0,1,1]).
> Das neue Wort kommt von unten rein (y: 28→0, opacity: 0→1, duration: 0.85s, ease [0.22,1,0.36,1]).
> Jedes Wort steht 5500ms. Timer via useEffect([index]) mit setTimeout re-armed.
> Container-span: display inline-block, verticalAlign bottom.
> Wörter als Array konfigurierbar. Kein Effekt beim ersten Render (initial={false}).
