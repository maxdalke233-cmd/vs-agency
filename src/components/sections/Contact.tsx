"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

const SERVICES = [
  "Short-Form-Schnitt",
  "Content-Strategie",
  "Content für lokale Unternehmen",
  "Creator- & Personal-Brand-Clips",
  "Motion Design",
  "Monatliches Content-System",
];

const inputClass =
  "w-full rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.03)] px-4 py-3 text-sm text-[var(--text)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-blue/60";

type Form = {
  name: string;
  email: string;
  company: string;
  service: string;
  message: string;
};

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.15em] text-[var(--text-2)]">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const [form, setForm] = useState<Form>({
    name: "",
    email: "",
    company: "",
    service: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Form>>({});
  const [sent, setSent] = useState(false);

  useGSAP(
    () => {
      gsap.from("[data-c-reveal]", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: ref },
  );

  const set =
    (k: keyof Form) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const er: Partial<Form> = {};
    if (!form.name.trim()) er.name = "Bitte geben Sie Ihren Namen ein.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = "Bitte geben Sie eine gültige E-Mail ein.";
    if (!form.message.trim()) er.message = "Erzählen Sie uns kurz von Ihrem Projekt.";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    // 🔁 Wire to a real endpoint here (Resend / Formspree / a Next.js route handler).
    // Working fallback for now: open the visitor's mail client, pre-filled.
    const subject = encodeURIComponent(`Neue Projektanfrage — ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\n` +
        `E-Mail: ${form.email}\n` +
        `Unternehmen: ${form.company || "—"}\n` +
        `Leistung: ${form.service || "—"}\n\n` +
        `${form.message}`,
    );
    window.location.href = `mailto:vladislavs.stolarevskis@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="relative px-6 pb-20 pt-8 md:px-10 md:pb-28 md:pt-12"
    >
      <div className="mx-auto grid w-full max-w-[1400px] gap-12 md:grid-cols-2 md:items-center">
        {/* intro */}
        <div>
          <p data-c-reveal className="eyebrow mb-5">
            Kontakt
          </p>
          <h2
            data-c-reveal
            className="max-w-[14ch] font-display font-semibold leading-[1.0] tracking-[-0.02em] text-[length:var(--fs-h2)]"
          >
            Erzählen Sie uns von Ihrer Marke.
          </h2>
          <p
            data-c-reveal
            className="mt-6 max-w-[42ch] text-[length:var(--fs-body)] text-[var(--text-2)]"
          >
            Hinterlassen Sie Ihre Daten und ein paar Worte zu Ihrem Vorhaben. Wir
            antworten innerhalb von 24 Stunden.
          </p>
        </div>

        {/* form / success */}
        {sent ? (
          <div data-c-reveal className="glass rounded-3xl p-10 text-center">
            <p className="font-display text-2xl font-medium">Danke — fast geschafft.</p>
            <p className="mt-3 text-[var(--text-2)]">
              Ihr E-Mail-Programm sollte sich mit der fertigen Nachricht geöffnet haben.
              Falls nicht, erreichen Sie uns unter{" "}
              <a className="text-blue underline" href="mailto:vladislavs.stolarevskis@gmail.com">
                vladislavs.stolarevskis@gmail.com
              </a>
              .
            </p>
          </div>
        ) : (
          <form
            data-c-reveal
            onSubmit={onSubmit}
            noValidate
            className="glass rounded-3xl p-6 md:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" error={errors.name}>
                <input
                  className={inputClass}
                  type="text"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Max Mustermann"
                  autoComplete="name"
                />
              </Field>
              <Field label="E-Mail" error={errors.email}>
                <input
                  className={inputClass}
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="max@marke.de"
                  autoComplete="email"
                />
              </Field>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Unternehmen (optional)">
                <input
                  className={inputClass}
                  type="text"
                  value={form.company}
                  onChange={set("company")}
                  placeholder="Firmenname"
                  autoComplete="organization"
                />
              </Field>
              <Field label="Leistung (optional)">
                <select className={inputClass} value={form.service} onChange={set("service")}>
                  <option value="">Bitte wählen …</option>
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="mt-4">
              <Field label="Zum Projekt" error={errors.message}>
                <textarea
                  className={`${inputClass} min-h-[120px] resize-y`}
                  value={form.message}
                  onChange={set("message")}
                  placeholder="Worum geht's? Ziel, Zeitrahmen, Budget …"
                />
              </Field>
            </div>

            <button type="submit" className="btn btn-primary mt-6 w-full justify-center">
              Anfrage senden
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
