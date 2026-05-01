"use client";

import { useState } from "react";
import Image from "next/image";
import { ChartCandlestick, NotebookText, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    id: "benchmark",
    title: "Benchmark",
    description: "Compare your portfolio against Nifty 50, Sensex, and S&P 500 with instant performance framing. Understand if your stock picks are actually outperforming the market.",
    icon: ChartCandlestick,
    image: "/compare.png",
  },
  {
    id: "journal",
    title: "Journal",
    description: "Capture daily P&L, market notes, and trade rationale in a clean workflow built for reflection. The best investors learn from their past decisions.",
    icon: NotebookText,
    image: "/journal.png",
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "Analyze sector weightings, historical performance, and risk metrics without the clutter. Keep your allocation in check and identify blind spots easily.",
    icon: BarChart3,
    image: "/analytics.png",
  },
];

export default function SecondaryFeatures() {
  const [activeFeature, setActiveFeature] = useState(features[1].id);

  const activeImage = features.find((f) => f.id === activeFeature)?.image || features[1].image;

  return (
    <section className="bg-background py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h2 className="mx-auto max-w-2xl font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
          Simplify your investment workflow.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Because modern portfolio tracking shouldn't feel like navigating a spreadsheet from 1995.
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => setActiveFeature(feature.id)}
              className={cn(
                "group text-left transition-opacity",
                activeFeature === feature.id ? "opacity-100" : "opacity-70 hover:opacity-100"
              )}
            >
              <div className="flex items-center gap-4 md:block">
                <div
                  className={cn(
                    "flex size-12 items-center justify-center rounded-xl transition-colors",
                    activeFeature === feature.id ? "bg-primary" : "bg-muted group-hover:bg-muted/80"
                  )}
                >
                  <feature.icon
                    className={cn(
                      "size-6 transition-colors",
                      activeFeature === feature.id ? "text-primary-foreground" : "text-muted-foreground"
                    )}
                  />
                </div>
                <div className="mt-0 md:mt-6">
                  <h3
                    className={cn(
                      "text-lg font-semibold tracking-tight transition-colors",
                      activeFeature === feature.id ? "text-primary" : "text-foreground"
                    )}
                  >
                    {feature.title}
                  </h3>
                  <p className="mt-1 md:mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-20 overflow-hidden rounded-2xl bg-muted/50 ring-1 ring-border/50 p-4 md:p-8 lg:p-12 transition-all duration-300">
          <div className="relative aspect-[16/10] sm:aspect-[2/1] lg:aspect-[16/9] w-full overflow-hidden rounded-xl bg-background shadow-sm ring-1 ring-border/50">
            <Image
              src={activeImage}
              alt={`${activeFeature} preview`}
              fill
              className="object-cover object-left-top md:object-contain bg-background"
              sizes="(min-width: 1280px) 1152px, (min-width: 1024px) 896px, (min-width: 768px) 672px, 100vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
