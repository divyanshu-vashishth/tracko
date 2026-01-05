"use client"

import { Footer } from "@/components/Landing/Footer";
import { Hero } from "@/components/Landing/Hero";
import { Navbar } from "@/components/Landing/Navbar";
import { Unauthenticated, AuthLoading, Authenticated } from "convex/react";
import { Spinner } from "@/components/ui/spinner";




export default function Page() {
   
  return (
    <div className="flex flex-col min-h-screen">
      <AuthLoading>
        <div className="flex h-screen items-center justify-center">
          <Spinner className="size-8" />
        </div>
      </AuthLoading>

      <Unauthenticated>
        <Navbar />
        <Hero />
        <Footer />
      </Unauthenticated>
      <Authenticated>
        <Navbar />
        <Hero />
        <Footer />
      </Authenticated>
    </div>
  );
}
