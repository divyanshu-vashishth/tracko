"use client";

import HeroSection from "./hero-section";
import Features from "./Features";
import FAQs from "./FAQ";

export function Hero() {
  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <Features />

      {/* FAQ Section - provides transition before footer */}
      <FAQs />
    </main>
  );
}
