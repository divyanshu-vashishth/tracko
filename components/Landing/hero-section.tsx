"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(83,140,240,0.18),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(46,137,255,0.12),transparent_45%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute left-[12%] top-[16%] h-28 w-28 rounded-full bg-primary/15 blur-3xl animate-float-slow" />
        <div className="absolute right-[18%] top-[36%] h-32 w-32 rounded-full bg-cyan-300/20 blur-3xl animate-float-medium" />
        <div className="absolute bottom-[18%] left-[42%] h-24 w-24 rounded-full bg-indigo-300/15 blur-3xl animate-float-fast" />
        <svg
          aria-hidden="true"
          className="absolute -top-24 -right-16 h-[360px] w-[360px] text-primary/25 animate-float-medium"
          viewBox="0 0 320 320"
          fill="none"
        >
          <circle cx="160" cy="160" r="110" stroke="currentColor" strokeWidth="1.4" strokeDasharray="8 9">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 160 160"
              to="360 160 160"
              dur="30s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="160" cy="160" r="72" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 8">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360 160 160"
              to="0 160 160"
              dur="18s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
        <svg
          aria-hidden="true"
          className="absolute -bottom-16 -left-16 h-[260px] w-[260px] text-primary/20 animate-float-slow"
          viewBox="0 0 280 280"
          fill="none"
        >
          <path
            d="M24 142C24 89.6 66.6 47 119 47H161C213.4 47 256 89.6 256 142C256 194.4 213.4 237 161 237H119C66.6 237 24 194.4 24 142Z"
            stroke="currentColor"
            strokeWidth="1.4"
          >
            <animate
              attributeName="d"
              dur="9s"
              repeatCount="indefinite"
              values="M24 142C24 89.6 66.6 47 119 47H161C213.4 47 256 89.6 256 142C256 194.4 213.4 237 161 237H119C66.6 237 24 194.4 24 142Z;
                      M36 136C36 91.3 72.3 55 117 55H168C212.7 55 249 91.3 249 136C249 180.7 212.7 217 168 217H117C72.3 217 36 180.7 36 136Z;
                      M24 142C24 89.6 66.6 47 119 47H161C213.4 47 256 89.6 256 142C256 194.4 213.4 237 161 237H119C66.6 237 24 194.4 24 142Z"
            />
          </path>
        </svg>
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" />
            AI-first portfolio intelligence
          </div>

          <div className="space-y-5">
            <h1 className="max-w-xl text-pretty text-4xl font-semibold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Build conviction in every investment decision.
            </h1>
            <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              Tracko combines real-time portfolio tracking, benchmark clarity, and conversational AI insights so you
              can act faster with less noise.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Button size="lg" className="h-11 rounded-full px-6" onClick={() => router.push("/auth")}>
              Get started
              <ArrowRight className="ml-1 size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 rounded-full px-6"
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
            >
              Explore features
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-1 text-sm">
            <div className="rounded-xl border bg-background/80 p-3">
              <p className="text-lg font-semibold">Real-time</p>
              <p className="text-muted-foreground">Live prices</p>
            </div>
            <div className="rounded-xl border bg-background/80 p-3">
              <p className="text-lg font-semibold">AI Chat</p>
              <p className="text-muted-foreground">Thread memory</p>
            </div>
            <div className="rounded-xl border bg-background/80 p-3">
              <p className="text-lg font-semibold">Benchmarks</p>
              <p className="text-muted-foreground">Nifty & S&P</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-16/13 overflow-hidden rounded-3xl border border-border/70 bg-linear-to-br from-slate-100 via-slate-50 to-blue-50 shadow-[0_35px_90px_-50px_rgba(32,92,192,0.5)]">
            <Image
              src="/dashboard.png"
              alt="Tracko portfolio dashboard"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-contain p-3 md:p-4"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
            <div className="absolute -right-2 top-6 rounded-xl border border-border/60 bg-background/92 px-3 py-2 text-xs shadow-md backdrop-blur-sm md:-right-4 md:text-sm">
              <p className="font-medium">Nifty50 vs Portfolio</p>
              <p className="text-emerald-600">+3.8% this month</p>
            </div>
            <div className="absolute -left-2 bottom-6 rounded-xl border border-border/60 bg-background/92 px-3 py-2 text-xs shadow-md backdrop-blur-sm md:-left-4 md:text-sm">
              <p className="font-medium">AI Insight</p>
              <p className="text-muted-foreground">Diversify financial sector weight</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}