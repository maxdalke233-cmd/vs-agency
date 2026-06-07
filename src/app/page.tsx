import type React from "react";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import SceneMount from "@/components/canvas/SceneMount";
import ScrollDriver from "@/components/providers/ScrollDriver";
import BgTransition from "@/components/providers/BgTransition";
import StrokeTrail from "@/components/providers/StrokeTrail";
import Hero from "@/components/sections/Hero";
import Capture from "@/components/sections/Capture";
import Edit from "@/components/sections/Edit";
import Distribute from "@/components/sections/Distribute";
import Results from "@/components/sections/Results";
import Services from "@/components/sections/Services";
import CaseStudies from "@/components/sections/CaseStudies";
import Process from "@/components/sections/Process";
import CTA from "@/components/sections/CTA";
import Pricing from "@/components/sections/Pricing";
import About from "@/components/sections/About";
import Portrait from "@/components/sections/Portrait";
import PricingTiers from "@/components/sections/PricingTiers";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Preloader />
      <Navbar />
      <SceneMount />
      <ScrollDriver />
      <BgTransition />
      <StrokeTrail />

      <main className="relative">
        <Hero />
        <Capture />
        <Edit />
        <Distribute />
        <Results />
        <Services />
        <CaseStudies />
        <Process />
        <CTA />
        <Pricing />

        {/* Post-portal: permanent WHITE region. Opaque bg hides the fixed
            dark 3D canvas + gradient behind it; --bg/--bg-2 overridden inline
            so the scroll-phase .light-bg behavior on <body> stays untouched. */}
        <div
          className="light-bg theme-static relative"
          style={
            {
              zIndex: 1,
              background: "#ffffff",
              color: "var(--text)",
              "--bg": "#ffffff",
              "--bg-2": "#f5f5f5",
            } as React.CSSProperties
          }
        >
          <Portrait />
          <About />
          <PricingTiers />
          <Contact />
          <Footer />
        </div>
      </main>
    </>
  );
}
