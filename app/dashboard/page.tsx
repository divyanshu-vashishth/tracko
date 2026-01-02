import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioOverview } from "@/components/dashboard/PortfolioOverview";
import { Analytics } from "@/components/dashboard/Analytics";
import { News } from "@/components/dashboard/News";
import { Benchmarks } from "@/components/dashboard/Benchmarks";
import { TrendingUp, Newspaper, BarChart3, Target } from "lucide-react";

export function Dashboard() {
  return (
    <div className="min-h-screen bg-background mt-16 max-w-6xl mx-auto container">

      {/* Main Content */}
      <main className="px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="benchmarks" className="gap-2">
              <Target className="h-4 w-4" />
              Benchmarks
            </TabsTrigger>
            <TabsTrigger value="news" className="gap-2">
              <Newspaper className="h-4 w-4" />
              News
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <PortfolioOverview />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>

          <TabsContent value="benchmarks">
            <Benchmarks />
          </TabsContent>

          <TabsContent value="news">
            <News />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
