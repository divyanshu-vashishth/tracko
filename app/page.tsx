"use client"

import { Footer } from "@/components/Landing/Footer";
import { Hero } from "@/components/Landing/Hero";
import { Navbar } from "@/components/Landing/Navbar";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { redirect } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";

function RedirectToDashboard() {
  useEffect(() => {
    window.location.href = "/dashboard";
  }, []);

  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner className="size-8" />
    </div>
  );
}

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
        <RedirectToDashboard />
      </Authenticated>
    </div>
  );
}
