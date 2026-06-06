import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VS Agency — Video- & Content-Agentur",
  description:
    "VS Agency produziert performante Short-Form-Videos, Instagram Reels und Content-Systeme für Creator, Marken und lokale Unternehmen.",
  metadataBase: new URL("https://vsagency.com"),
  openGraph: {
    title: "VS Agency — Video- & Content-Agentur",
    description:
      "Cinematische Short-Form-Videos und Content-Systeme für Creator, Marken und lokale Unternehmen.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full" suppressHydrationWarning>
        {/* Global cinematic background — fixed behind everything */}
        <div
          id="bg-gradient"
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-50"
          style={{
            background:
              "radial-gradient(60% 50% at 72% 18%, rgba(59,130,246,0.16), transparent 60%), radial-gradient(50% 45% at 20% 85%, rgba(139,92,246,0.12), transparent 60%), #050505",
          }}
        />
        <div aria-hidden className="grain pointer-events-none fixed inset-0 -z-40" />
        {/* White overlay for scroll-driven light phase — sits behind the 3D canvas */}
        <div
          id="bg-white-overlay"
          aria-hidden
          className="pointer-events-none fixed inset-0 bg-white opacity-0"
          style={{ zIndex: -30 }}
        />

        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
