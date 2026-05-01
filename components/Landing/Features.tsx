"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const features = [
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Get a bird's-eye view of your holdings, recent performance, and AI-driven insights all in one clean interface.",
    image: "/dashboard.png",
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "Analyze sector weightings, historical performance, and risk metrics without the clutter of traditional brokerages.",
    image: "/analytics.png",
  },
  {
    id: "compare",
    title: "Compare",
    description: "Compare your custom portfolios side-by-side to understand how different strategies perform in the current market.",
    image: "/compare.png",
  },
  {
    id: "news",
    title: "Contextual News",
    description: "See only the market narratives connected to your specific holdings, so context arrives before volatility.",
    image: "/news.png",
  },
];

export default function Features() {
  const [activeFeature, setActiveFeature] = useState(features[0].id);

  const activeImage = features.find((f) => f.id === activeFeature)?.image || features[0].image;

  return (
    <section id="features" className="overflow-hidden bg-primary py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-display font-medium tracking-tight text-primary-foreground md:text-4xl">
            Everything you need to manage your portfolio.
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            A calm product designed to reduce noise: tighter context, faster reads, and better investment decisions.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0">
          <div className="lg:col-span-4">
            <div className="flex flex-col gap-y-2">
              {features.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeature(feature.id)}
                  className={cn(
                    "group relative rounded-2xl px-6 py-5 text-left transition-colors",
                    activeFeature === feature.id
                      ? "bg-primary-foreground/10"
                      : "hover:bg-primary-foreground/5"
                  )}
                >
                  <h3
                    className={cn(
                      "text-lg font-semibold tracking-tight",
                      activeFeature === feature.id ? "text-primary-foreground" : "text-primary-foreground/80 group-hover:text-primary-foreground"
                    )}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-2 text-sm",
                      activeFeature === feature.id ? "text-primary-foreground/80" : "text-primary-foreground/60 group-hover:text-primary-foreground/80"
                    )}
                  >
                    {feature.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-8 relative">
            <div className="relative w-[110%] md:w-[120%] lg:w-[140%] overflow-hidden rounded-xl bg-background shadow-2xl ring-1 ring-border/50">
              {/* Browser top bar */}
              <div className="flex items-center gap-2 border-b border-border/50 bg-muted/40 px-4 py-3">
                <div className="size-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                <div className="size-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                <div className="size-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
              </div>
              <div className="relative aspect-[16/10] w-full bg-background">
                <Image
                  src={activeImage}
                  alt="Feature preview"
                  fill
                  className="object-cover object-left-top sm:object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}