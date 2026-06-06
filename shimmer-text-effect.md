# Horizontal Text Shimmer Effect

Ein orangener (oder beliebig farbiger) Lichtstrahl, der langsam von links nach rechts über einen großen Text zieht. Aktiviert sich wenn das Element in den Viewport scrollt. Wiederholt sich alle X Sekunden.

---

## Ergebnis

- Text ist standardmäßig dim (weiß, 12% Opacity)
- Beim Scrollen: ein Lichtstrahl mit Farbverlauf (Orange → Weiß → Orange) zieht horizontal durch den Text
- Läuft solange der User auf dem Element bleibt, pausiert wenn er wegscrollt

---

## Tech Stack

- Next.js App Router
- Framer Motion (`motion/react`)
- Tailwind CSS
- `"use client"` Komponente

---

## Code

### 1. Imports

```tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
```

### 2. Hook Setup

```tsx
const ref = useRef<HTMLDivElement>(null);
const inView = useInView(ref, { once: false, margin: "-20px" });
// once: false → Effekt wiederholt sich jedes Mal wenn Element in View kommt
```

### 3. Das Element

```tsx
<div ref={ref} className="overflow-hidden select-none pointer-events-none">
  <motion.p
    style={{
      // Gradient: dim → orange → white → orange → dim
      backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.12) 34%, rgba(255,100,20,0.35) 43%, #ff6520 49%, #ffffff 50%, #ff6520 51%, rgba(255,100,20,0.35) 57%, rgba(255,255,255,0.12) 66%, rgba(255,255,255,0.12) 100%)",
      backgroundSize: "300% 100%",   // Gradient ist 3x breiter als das Element
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      WebkitTextFillColor: "transparent",
      // Beliebige Text-Styles:
      fontSize: "clamp(36px, 11vw, 155px)",
      fontWeight: 900,
      whiteSpace: "nowrap",
    }}
    animate={inView
      ? { backgroundPositionX: ["100%", "0%"] }   // Strahl zieht von rechts nach links durch das Gradient-Fenster → wirkt links→rechts im Text
      : { backgroundPositionX: "100%" }            // Strahl ist off-screen rechts → Text erscheint dim
    }
    transition={inView ? {
      duration: 2.5,       // Sekunden für einen Durchlauf
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: 0.5,    // Pause zwischen Durchläufen (duration + repeatDelay = Gesamtzyklus)
    } : { duration: 0.4 }}
  >
    Dein Text hier
  </motion.p>
</div>
```

---

## Wie es funktioniert

### Das Gradient-Trick

`backgroundSize: "300%"` macht den Gradient 3x so breit wie das Element. Das Element ist quasi ein "Fenster" das nur 1/3 des Gradients zeigt.

```
Gradient (300% breit):
[==dim==][==dim==][orange/white beam][==dim==][==dim==]
 0%       34%          50%            66%      100%

Fenster (100% breit) bei backgroundPositionX 100%:
                              [====sichtbar====]
                              ↑ zeigt nur das rechte Drittel → alles dim ✓

Fenster bei backgroundPositionX 0%:
[====sichtbar====]
↑ zeigt nur das linke Drittel → alles dim ✓

Fenster bei backgroundPositionX 50%:
              [====sichtbar====]
              ↑ zeigt die Mitte → Strahl ist sichtbar ✓
```

Durch Animation von `100% → 0%` bewegt sich der "Strahl" im Fenster von links nach rechts.

### `background-clip: text`

Schneidet den Gradient auf die Buchstabenform zu. Nur die Pixel **innerhalb der Buchstaben** zeigen den Gradient – der Rest ist transparent. Deshalb braucht es `WebkitTextFillColor: transparent`.

---

## Anpassungen

| Was | Wie |
|---|---|
| Farbe ändern | `#ff6520` und `#ffffff` im Gradient ersetzen |
| Strahl breiter/schmaler | Die `%`-Stops im Gradient enger oder weiter setzen |
| Schneller/langsamer | `duration` anpassen |
| Häufigkeit | `repeatDelay` anpassen |
| Richtung umkehren | `["0%", "100%"]` statt `["100%", "0%"]` |
| Einmalig (kein Loop) | `repeat: 0` statt `repeat: Infinity` |
| Nur einmal beim ersten Scroll | `once: true` in `useInView` |

---

## Prompt für Claude Code

> Erstelle einen horizontalen Text-Shimmer-Effekt mit `background-clip: text` und Framer Motion (`motion/react`). Der Text soll standardmäßig dim sein (weiß, 12% Opacity). Wenn das Element in den Viewport scrollt (`useInView`, `once: false`), soll ein Lichtstrahl von links nach rechts durch den Text ziehen – umgesetzt durch Animation von `backgroundPositionX: ["100%", "0%"]` auf einem `motion.p` mit `backgroundSize: "300% 100%"` und einem Gradient der den Strahl in der Mitte hat. Duration 2.5s, repeatDelay 0.5s, ease easeInOut, repeat Infinity. Schreib die Komponente als `"use client"`.
