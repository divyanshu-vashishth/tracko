"use client";

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden">
            {/* Sky-like gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-sky-50 to-background dark:from-sky-950/30 dark:via-sky-900/20 dark:to-background" />
            {/* Cloud-like soft shapes */}
            <div className="absolute top-20 left-1/4 size-64 bg-white/60 dark:bg-sky-500/10 rounded-full blur-3xl" />
            <div className="absolute top-32 right-1/3 size-48 bg-white/80 dark:bg-sky-400/10 rounded-full blur-3xl" />
            <div className="absolute top-40 right-1/4 size-56 bg-white/70 dark:bg-sky-600/10 rounded-full blur-3xl" />

            <div className="relative py-20 md:py-32">
                <div className="mx-auto max-w-5xl px-6">
                    {/* Text content */}
                    <div className="text-center">
                        <h1 className="mx-auto max-w-3xl text-balance text-4xl font-bold md:text-5xl lg:text-6xl leading-tight tracking-tight">
                            Your Personal Portfolio,
                            <br />
                            <span className="text-foreground">With you Anywhere</span>
                        </h1>

                        <p className="text-muted-foreground mx-auto my-6 max-w-2xl text-balance text-lg md:text-xl">
                            Track. Analyze. Compare. Stay Updated with Market News.
                        </p>

                        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Button size="lg" className="h-12 px-6 rounded-full">
                                <Link href="/auth">
                                    <span className="text-nowrap">Get Started</span>
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="h-12 px-6 rounded-full">
                                <Link href="#features">
                                    <span className="text-nowrap">Learn More</span>
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Dashboard Screenshot - Gradient border directly on image */}
                    <div className="relative mx-auto mt-12 max-w-4xl md:mt-20">
                        {/* Thick gradient border wrapper */}
                        <div className="p-3 md:p-4 lg:p-5 rounded-2xl md:rounded-3xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-500 dark:from-sky-500 dark:via-blue-600 dark:to-indigo-600 shadow-2xl shadow-sky-500/20 dark:shadow-sky-400/10">
                            <div className="relative w-full overflow-hidden rounded-xl md:rounded-2xl">
                                <Image
                                    src="/dashboard.png"
                                    alt="Portfolio Dashboard"
                                    width={1920}
                                    height={1080}
                                    className="w-full h-auto object-contain"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}