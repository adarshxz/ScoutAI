import { lazy, Suspense } from "react";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";

// Lazy-load below-the-fold sections to reduce initial bundle size
const Testimonials = lazy(() => import("../components/landing/Testimonials"));
const Pricing = lazy(() => import("../components/landing/Pricing"));
const CTA = lazy(() => import("../components/landing/CTA"));
const Footer = lazy(() => import("../components/landing/Footer"));

export default function Landing() {
  return (
    <main style={{ position: "relative", overflow: "hidden" }}>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Suspense fallback={null}>
        <Testimonials />
        <Pricing />
        <CTA />
        <Footer />
      </Suspense>
    </main>
  );
}
