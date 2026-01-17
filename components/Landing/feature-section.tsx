"use client";

import Image from 'next/image'

const features = [
    {
        title: "Trading Journal",
        description: "Track your daily P&L, trade count, and insights to improve your trading strategy.",
        image: "/journal.png",
    },
    {
        title: "Market News",
        description: "Stay informed with curated news filtered for stocks in your portfolio.",
        image: "/news.png",
    },
    {
        title: "Benchmark Comparison",
        description: "Compare your portfolio against major indices like Nifty 50, Sensex, and S&P 500.",
        image: "/benchmark.png",
    },
]

export default function Features() {
    return (
        <section id="features" className="bg-muted/30 dark:bg-muted/10 py-20 md:py-28">
            <div className="mx-auto max-w-5xl px-6">
                <div className="mb-12 md:mb-16">
                    <h2 className="text-foreground text-3xl md:text-4xl font-bold">
                        Everything You Need
                    </h2>
                    <p className="text-muted-foreground mt-4 text-balance text-lg max-w-2xl">
                        Powerful features to help you track your investments, analyze performance, and stay ahead of the market.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {features.map((feature) => (
                        <div key={feature.title} className="space-y-4">
                            {/* Thick grayish border directly on image - no inner white/dark padding */}
                            <div className="aspect-[4/3] overflow-hidden rounded-xl p-3 md:p-4 bg-gray-300 dark:bg-gray-600 shadow-sm">
                                <div className="relative w-full h-full rounded-lg overflow-hidden">
                                    <Image
                                        src={feature.image}
                                        alt={feature.title}
                                        fill
                                        className="object-contain object-top"
                                    />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-foreground text-lg font-semibold">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}