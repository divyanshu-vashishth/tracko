"use client"

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Footer } from "@/components/Landing/Footer";
import { Hero } from "@/components/Landing/Hero";
import { Navbar } from "@/components/Landing/Navbar";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioOverview } from "@/components/dashboard/PortfolioOverview";
import { Analytics } from "@/components/dashboard/Analytics";
import { News } from "@/components/dashboard/News";
import { Benchmarks } from "@/components/dashboard/Benchmarks";
import { OverviewSkeleton, AnalyticsSkeleton, BenchmarksSkeleton, NewsSkeleton } from "@/components/dashboard/TabSkeletons";
import { TrendingUp, Newspaper, BarChart3, Target } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";

function DashboardContent() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loadedTabs, setLoadedTabs] = useState<Set<string>>(new Set(["overview"]));

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Mark tab as loaded after a brief delay to show skeleton
    if (!loadedTabs.has(value)) {
      setTimeout(() => {
        setLoadedTabs(prev => new Set([...prev, value]));
      }, 300);
    }
  };

  const renderTabContent = () => {
    const isLoaded = loadedTabs.has(activeTab);

    switch (activeTab) {
      case "overview":
        return isLoaded ? <PortfolioOverview /> : <OverviewSkeleton />;
      case "analytics":
        return isLoaded ? <Analytics /> : <AnalyticsSkeleton />;
      case "benchmarks":
        return isLoaded ? <Benchmarks /> : <BenchmarksSkeleton />;
      case "news":
        return isLoaded ? <News /> : <NewsSkeleton />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-8 pt-6">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="overview" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden md:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden md:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="benchmarks" className="gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden md:inline">Benchmarks</span>
          </TabsTrigger>
          <TabsTrigger value="news" className="gap-2">
            <Newspaper className="h-4 w-4" />
            <span className="hidden md:inline">News</span>
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <AuthLoading>
        <div className="flex h-screen items-center justify-center">
          <Spinner />
        </div>
      </AuthLoading>

      <Unauthenticated>
        <Navbar />
        <Hero />
        <Footer />
      </Unauthenticated>

      <Authenticated>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="font-semibold">Dashboard</div>
            </header>
            <DashboardContent />
          </SidebarInset>
        </SidebarProvider>
      </Authenticated>
    </div>
  );
}
