"use client";

import HeroSection from "./hero-section";
import Features from "./Features";
import SecondaryFeatures from "./SecondaryFeatures";
import FAQs from "./FAQ";

export function Hero() {
  return (
    <main className="overflow-hidden bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <Features />

      {/* Secondary Features Section */}
      <SecondaryFeatures />

      {/* FAQ Section - provides transition before footer */}
      <FAQs />
    </main>
  );
}
