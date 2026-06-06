import { navLinks } from "@/lib/data";

const socials = ["Instagram", "TikTok", "YouTube"];

export default function Footer() {
  return (
    <footer className="relative border-t border-[var(--line)] px-6 py-14 md:px-10">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-lg font-bold tracking-tight">
            VS<span className="text-blue"> Agency</span>
          </p>
          <p className="mt-3 max-w-[34ch] text-sm text-[var(--text-2)]">
            Cinematischer Content für Marken mit Anspruch.
          </p>
        </div>

        <nav className="flex flex-col gap-3">
          <span className="eyebrow">Menü</span>
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-[var(--text-2)] transition-colors hover:text-[var(--text)]"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <nav className="flex flex-col gap-3">
          <span className="eyebrow">Social</span>
          {socials.map((s) => (
            <a
              key={s}
              href="#"
              className="text-sm text-[var(--text-2)] transition-colors hover:text-[var(--text)]"
            >
              {s}
            </a>
          ))}
        </nav>
      </div>

      <div className="mx-auto mt-12 flex max-w-[1400px] flex-col gap-2 border-t border-[var(--line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-[var(--text-muted)]">
          © 2026 VS Agency. Alle Rechte vorbehalten.
        </p>
        <p className="text-xs text-[var(--text-muted)]">
          3D-Kamera:{" "}
          <a
            href="https://sketchfab.com/3d-models/cinema-camera-e1fec87c8ae0487f964d20de2559aa62"
            className="underline transition-colors hover:text-[var(--text)]"
            target="_blank"
            rel="noopener noreferrer"
          >
            &ldquo;Cinema Camera&rdquo; von re1monsen
          </a>{" "}
          (CC BY 4.0) via Sketchfab
        </p>
      </div>
    </footer>
  );
}
