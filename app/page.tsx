"use client"

import { Cta } from "@/components/Landing/Cta";
import { Footer } from "@/components/Landing/Footer";
import { Hero } from "@/components/Landing/Hero";
import { Navbar } from "@/components/Landing/Navbar";
import { Authenticated, Unauthenticated } from "convex/react";
import { Dashboard } from "@/app/dashboard/page";

export default function Page() {
return (
    <div className="flex flex-col min-h-screen">
        <Navbar />
        <Unauthenticated>
            <Hero />
        <Footer />
        </Unauthenticated>
        <Authenticated>
            <Dashboard />
        </Authenticated>
    </div>
);
}