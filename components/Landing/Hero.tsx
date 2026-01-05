"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { FeatureSection } from "./Features";
import { CallToAction } from "./Cta";

export function Hero() {
  return (
    <main className="overflow-hidden">
      {/* Hero Section - Clean centered layout */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32">
        {/* Sky-like gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-sky-50 to-background dark:from-sky-950/20 dark:via-sky-900/10 dark:to-background" />
        {/* Cloud-like soft shapes */}
        <div className="absolute top-20 left-1/4 size-64 bg-white/60 dark:bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-32 right-1/3 size-48 bg-white/80 dark:bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 size-56 bg-white/70 dark:bg-white/5 rounded-full blur-3xl" />

        <div className="relative">
          {/* Centered text content */}
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl leading-tight tracking-tight">
              Your Personal Portfolio,
              <br />
              <span className="text-foreground">With you Anywhere</span>
            </h1>

            <p className="mt-6 text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Track. Analyze. Compare. Stay Updated with Market News.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="outline" className="h-12 px-6 rounded-full">
                <Link href="/auth" className="flex items-center gap-2">
                  <span>Get Started</span>
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-6 rounded-full">
                <Link href="#features" className="flex items-center gap-2">
                  <span>Learn More</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Dashboard Preview Card - Centered below */}
          <div className="mx-auto max-w-md px-6 mt-16">
            <div className="bg-card rounded-2xl border shadow-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-8 rounded-lg bg-muted flex items-center justify-center">
                  <svg className="size-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Data Fetching</span>
              </div>

              {/* Placeholder lines */}
              <div className="space-y-3">
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-4/5" />
                <div className="h-3 bg-muted rounded w-3/4" />
              </div>

              <div className="mt-6 pt-4 border-t space-y-2">
                <div className="h-3 bg-muted rounded w-2/3" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center mb-12 px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need
          </h2>
          <p className="text-muted-foreground text-lg">
            Powerful features to help you track your investments
          </p>
        </div>
        <FeatureSection />
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <CallToAction />
      </section>
    </main>
  );
}
