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
import Brands from "@/components/sections/Brands";
import About from "@/components/sections/About";
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
        <Brands />
        <About />
        <PricingTiers />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
