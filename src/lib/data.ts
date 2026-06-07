/**
 * Reusable content for the VS Agency homepage.
 * Edit copy here — sections render from this data.
 */

export const navLinks = [
  { label: "Referenzen", href: "#work" },
  { label: "Leistungen", href: "#services" },
  { label: "Ablauf", href: "#process" },
  { label: "Kontakt", href: "#contact" },
];

// Floating glass chips around the camera in the Capture section
export const captureLabels = [
  "Strategie",
  "Regie",
  "Dreh",
  "Ideen",
  "Hook",
  "Bildsprache",
];

// Vertical reel-style cards emerging in the Edit section
export const editCards = [
  { label: "Reel-Schnitt", duration: "0:18" },
  { label: "Markengeschichte", duration: "0:24" },
  { label: "Lokale Anzeige", duration: "0:15" },
  { label: "Creator-Clip", duration: "0:31" },
  { label: "Produktvideo", duration: "0:22" },
  { label: "Hook-Test", duration: "0:09" },
];

export const editServices = [
  {
    title: "Short-Form-Schnitt",
    description: "Schnelle Schnitte, gebaut für Watchtime und Verweildauer.",
  },
  {
    title: "Instagram Reels",
    description: "Vertikaler Content, der den Daumen stoppt.",
  },
  {
    title: "Content-Strategie",
    description: "Ideen, Hooks und Struktur — bevor der Schnitt beginnt.",
  },
];

// Floating metrics orbiting the camera in the Distribute section
export const distributeMetrics = [
  "+328K Views",
  "18.4K Likes",
  "2.8K Shares",
  "741 Comments",
  "63 Leads",
  "4.7x Reach",
];

// Animated counters in the Results section
export const resultsStats = [
  { value: 1, suffix: "M+", label: "Views generiert" },
  { value: 30, suffix: "+", label: "Videos / Monat" },
  { value: 15, suffix: "+", label: "Marken betreut" },
  { value: 4.7, suffix: "x", label: "Ø Reichweiten-Lift", decimals: 1 },
];

// 🔁 Short VS Agency intro — read-through (scroll-highlighted) bio in the About section
export const agencyBio =
  "VS Agency ist ein Video-first-Studio für Marken mit Anspruch. Aus rohen Ideen und Footage " +
  "machen wir Short-Form-Content, der den Scroll stoppt, Vertrauen aufbaut und echte Ergebnisse bringt — " +
  "von Strategie und Dreh bis Schnitt und Distribution.";

export const services = [
  {
    title: "Short-Form-Videoschnitt",
    description:
      "Videos mit Sog für Reels, TikTok und Shorts: starke Hooks, sauberes Pacing, Untertitel und Sounddesign.",
  },
  {
    title: "Content-Strategie",
    description:
      "Wir planen Ideen, Hooks, Formate und Posting-Winkel, damit Ihr Content vor der Produktion ein klares Ziel hat.",
  },
  {
    title: "Content für lokale Unternehmen",
    description:
      "Hochwertige Videos für Restaurants, Friseure, Studios, Autohäuser, Immobilien, Events und Dienstleister.",
  },
  {
    title: "Creator- & Personal-Brand-Clips",
    description:
      "Aus langen Videos, Podcasts oder Rohmaterial werden pointierte Clips, die Reichweite und Vertrauen aufbauen.",
  },
  {
    title: "Motion Design",
    description:
      "Klare Bewegtgrafik, animierte Titel, Übergänge und Effekte, die Ihre Videos hochwertig wirken lassen.",
  },
  {
    title: "Monatliche Content-Systeme",
    description:
      "Verlässliche Produktion mit festem Liefertakt, klaren Feedback-Schleifen und wiederholbarem Kreativ-System.",
  },
];

export const caseStudies = [
  { title: "Visitenkarte", category: "Local Business", metric: "+82K Views", image: "/barber-brand-reel.png" },
  { title: "Insta Reels", category: "Fitness", metric: "3.2x Reach", image: "/gym-transformation-ad.png" },
  { title: "Social Media pflegen", category: "Personal Brand", metric: "24 Clips Delivered", image: "/creator-podcast-clips.png" },
  { title: "Websites von dalkeweb", category: "Partnerunternehmen", metric: "+41K Views", image: "/restaurant-launch-video.png", href: "https://www.dalkeweb.de", cta: "Besuche die Seite" },
];

// 🔁 REPLACE with real pricing — placeholder tiers for now
export const pricingTiers = [
  {
    name: "Starter",
    price: "€700",
    period: "/Monat",
    tagline: "Für Marken, die regelmäßig sichtbar werden wollen.",
    features: ["8 Short-Form-Videos / Monat", "Schnitt + Untertitel", "1 Korrekturschleife", "Lieferung in 48 h"],
    highlighted: false,
  },
  {
    name: "Growth",
    price: "€1,500",
    period: "/Monat",
    tagline: "Unser meistgewähltes System.",
    features: [
      "16 Short-Form-Videos / Monat",
      "Strategie + Hooks + Motion",
      "2 Korrekturschleifen",
      "Bevorzugte Lieferung",
      "Monatliches Performance-Review",
    ],
    highlighted: true,
  },
];

export const brandRows: { name: string; color: string }[][] = [
  [
    { name: "Nike", color: "#2D2D2D" },
    { name: "Spotify", color: "#1DB954" },
    { name: "Apple", color: "#6E6E6E" },
    { name: "Adobe", color: "#FF0000" },
    { name: "Tesla", color: "#E31937" },
    { name: "Airbnb", color: "#FF385C" },
    { name: "Red Bull", color: "#CC181E" },
    { name: "Porsche", color: "#A87C00" },
  ],
  [
    { name: "Uber", color: "#09091A" },
    { name: "Google", color: "#4285F4" },
    { name: "Meta", color: "#0866FF" },
    { name: "Samsung", color: "#1428A0" },
    { name: "Rolex", color: "#006039" },
    { name: "Gucci", color: "#2B231A" },
    { name: "BMW", color: "#0066B1" },
    { name: "Hugo Boss", color: "#3D3D3D" },
  ],
  [
    { name: "Amazon", color: "#FF9900" },
    { name: "Microsoft", color: "#00A4EF" },
    { name: "Chanel", color: "#2A2A2A" },
    { name: "Louis Vuitton", color: "#7A5230" },
    { name: "Supreme", color: "#EE0000" },
    { name: "Beats", color: "#CC1515" },
    { name: "Bang & Olufsen", color: "#3A3A3A" },
    { name: "Balenciaga", color: "#1C1C1C" },
  ],
];

export const processSteps = [
  {
    number: "01",
    title: "Strategie",
    description: "Wir definieren Ziel, Zielgruppe, Angebot, Hooks und Content-Winkel.",
  },
  {
    number: "02",
    title: "Produktion / Material",
    description: "Wir sammeln Footage, planen Aufnahmen oder arbeiten mit Ihrem bestehenden Material.",
  },
  {
    number: "03",
    title: "Schnitt",
    description: "Wir bauen saubere, schnelle Videos mit Untertiteln, Rhythmus und Motion.",
  },
  {
    number: "04",
    title: "Feedback",
    description: "Sie sichten, kommentieren und geben frei — über einen einfachen Ablauf.",
  },
  {
    number: "05",
    title: "Posten & Wachstum",
    description: "Wir strukturieren den Content für die Plattformen und einen verlässlichen Output.",
  },
];
