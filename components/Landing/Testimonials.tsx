"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface Testimonial {
    id: number;
    name: string;
    role: string;
    company: string;
    content: string;
    avatar: string;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: "Priya Sharma",
        role: "Retail Investor",
        company: "Mumbai",
        content:
            "Finally, a portfolio tracker that understands Indian markets! The benchmark comparison with Nifty 50 helps me see exactly how my picks are performing.",
        avatar: "PS",
    },
    {
        id: 2,
        name: "Rahul Mehta",
        role: "Day Trader",
        company: "Bangalore",
        content:
            "The trading journal is a game-changer. I can track my P&L daily and the insights help me avoid repeating mistakes. Clean UI, fast updates.",
        avatar: "RM",
    },
    {
        id: 3,
        name: "Ankit Patel",
        role: "Long-term Investor",
        company: "Ahmedabad",
        content:
            "Love the screenshot import feature! Just uploaded my Zerodha holdings and it automatically detected all my stocks. Saves so much time.",
        avatar: "AP",
    },
    {
        id: 4,
        name: "Sneha Reddy",
        role: "Finance Professional",
        company: "Hyderabad",
        content:
            "The analytics dashboard gives me a clear picture of sector allocation and performance metrics. Perfect for managing multiple portfolios.",
        avatar: "SR",
    },
];

export function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const nextTestimonial = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, []);

    const prevTestimonial = useCallback(() => {
        setCurrentIndex(
            (prev) => (prev - 1 + testimonials.length) % testimonials.length
        );
    }, []);

    // Auto-rotation
    useEffect(() => {
        if (isHovered) return;

        const interval = setInterval(() => {
            nextTestimonial();
        }, 5000);

        return () => clearInterval(interval);
    }, [isHovered, nextTestimonial]);

    return (
        <section className="py-20 md:py-28 bg-muted/30">
            <div className="mx-auto max-w-6xl px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Loved by Investors
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        See what our users have to say about their experience
                    </p>
                </div>

                <div
                    className="relative flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Stacked Cards Visual */}
                    <div className="relative w-64 h-72 md:w-72 md:h-80">
                        {testimonials.map((testimonial, index) => {
                            const offset =
                                (index - currentIndex + testimonials.length) %
                                testimonials.length;
                            const isActive = offset === 0;
                            const isNext = offset === 1;
                            const isPrev = offset === testimonials.length - 1;

                            // Only show 3 cards: current, next, and previous
                            if (!isActive && !isNext && !isPrev) return null;

                            return (
                                <div
                                    key={testimonial.id}
                                    className={cn(
                                        "absolute inset-0 rounded-2xl overflow-hidden transition-all duration-500 ease-out",
                                        "bg-gradient-to-br from-primary/20 via-primary/10 to-background",
                                        "border shadow-xl",
                                        isActive && "z-30 scale-100 translate-x-0 rotate-0 opacity-100",
                                        isNext && "z-20 scale-95 translate-x-4 rotate-3 opacity-70",
                                        isPrev && "z-10 scale-90 -translate-x-4 -rotate-3 opacity-40"
                                    )}
                                >
                                    {/* Avatar */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border">
                                            <span className="text-4xl md:text-5xl font-bold text-primary/80">
                                                {testimonial.avatar}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Testimonial Content */}
                    <div className="flex-1 max-w-lg text-center lg:text-left">
                        <div className="relative">
                            {testimonials.map((testimonial, index) => (
                                <div
                                    key={testimonial.id}
                                    className={cn(
                                        "transition-all duration-500",
                                        index === currentIndex
                                            ? "opacity-100 translate-y-0"
                                            : "opacity-0 absolute inset-0 translate-y-4 pointer-events-none"
                                    )}
                                >
                                    <h3 className="text-2xl md:text-3xl font-bold mb-1">
                                        {testimonial.name}
                                    </h3>
                                    <p className="text-muted-foreground text-sm mb-6">
                                        {testimonial.role} · {testimonial.company}
                                    </p>
                                    <div className="relative">
                                        <Quote className="absolute -top-2 -left-2 size-8 text-primary/20" />
                                        <p className="text-muted-foreground text-base md:text-lg leading-relaxed pl-6">
                                            {testimonial.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-center lg:justify-start gap-4 mt-8">
                            <button
                                onClick={prevTestimonial}
                                className="p-2 rounded-full border hover:bg-muted transition-colors"
                                aria-label="Previous testimonial"
                            >
                                <ChevronLeft className="size-5" />
                            </button>
                            <button
                                onClick={nextTestimonial}
                                className="p-2 rounded-full border hover:bg-muted transition-colors"
                                aria-label="Next testimonial"
                            >
                                <ChevronRight className="size-5" />
                            </button>
                        </div>

                        {/* Dots indicator */}
                        <div className="flex items-center justify-center lg:justify-start gap-2 mt-4">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={cn(
                                        "size-2 rounded-full transition-all",
                                        index === currentIndex
                                            ? "bg-primary w-6"
                                            : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                                    )}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
