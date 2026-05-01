"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortfolio } from "@/components/PortfolioContext";

import { formatCurrency } from "@/lib/formatCurrency";

export function Analytics() {
  const { activePortfolioId } = usePortfolio();
  const holdings = useQuery(api.portfolios.getHoldings, { portfolioId: activePortfolioId });
  const getHistory = useAction(api.stocks.getHistoricalPrices);
  const [historyData, setHistoryData] = useState<Record<string, any[]>>({});

  // 1. Fetch History
  useEffect(() => {
    if (holdings && holdings.length > 0) {
      const symbols = holdings.map((h: any) => h.symbol);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      const period1 = oneYearAgo.toISOString().split('T')[0];

      getHistory({ symbols, period1, interval: "1d" }).then(setHistoryData);
    }
  }, [holdings, getHistory]);

  const portfolioCurrency = holdings && holdings.length > 0 ? (holdings[0].currency || "INR") : "INR";

  // 2. Process Performance Data
  const performanceData = useMemo(() => {
    if (!holdings || holdings.length === 0 || Object.keys(historyData).length === 0) return [];

    // Find all unique dates (assuming all stocks have similar trading days)
    // We'll use the first symbol's dates as a baseline
    const firstSymbol = holdings[0].symbol;
    const baseDates = historyData[firstSymbol]?.map((d: any) => d.date) || [];

    return baseDates.map((date: any) => {
      let totalValue = 0;
      const dateStr = date.toString().slice(0, 10);
      const targetDate = new Date(date);
      
      // For this date, sum up value of all holdings
      holdings.forEach((h: any) => {
        const stockHistory = historyData[h.symbol];
        let price = h.avgPurchasePrice || 0; // fallback
        
        if (stockHistory && stockHistory.length > 0) {
          // Find closest date match
          let dayData = stockHistory.find((d: any) => d.date.toString().slice(0, 10) === dateStr);
          if (!dayData) {
             // Find most recent previous price if exact date is missing
             dayData = [...stockHistory].reverse().find((d: any) => new Date(d.date) <= targetDate);
          }
          if (dayData) {
            price = dayData.close;
          }
        }
        totalValue += price * h.shares;
      });

      // Simplified benchmark (e.g. just a flat growth or placeholder if we don't fetch SPY)
      // For a real app, we'd fetch SPY history too.
      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: totalValue,
        // benchmark: totalValue * 0.9 // Placeholder
      };
    });
  }, [holdings, historyData]);

  // 3. Process Allocation Data
  const allocationData = useMemo(() => {
    if (!holdings) return [];

    const sectorMap: Record<string, number> = {};
    let totalPortfolioValue = 0;

    holdings.forEach((h: any) => {
      // Use current price from history (last entry) or avgPrice if history missing
      const lastPrice = historyData[h.symbol]?.[historyData[h.symbol].length - 1]?.close || h.avgPurchasePrice;
      const val = h.shares * lastPrice;
      sectorMap[h.sector || "Other"] = (sectorMap[h.sector || "Other"] || 0) + val;
      totalPortfolioValue += val;
    });

    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#6b7280"];

    return Object.keys(sectorMap).map((sector, index) => ({
      name: sector,
      value: Number(((sectorMap[sector] / totalPortfolioValue) * 100).toFixed(1)),
      color: colors[index % colors.length]
    }));
  }, [holdings, historyData]);

  // 4. Monthly Returns (Simplified based on performanceData)
  const monthlyReturns = useMemo(() => {
    if (performanceData.length < 30) return [];

    // Group by month
    const months: Record<string, { start: number, end: number }> = {};

    // Note: detailed calculation would require precise start/end of months.
    // This is a simplified visualization.
    return [];
  }, [performanceData]);

  // Metrics
  const totalValue = performanceData.length > 0 ? performanceData[performanceData.length - 1].value : 0;
  const startValue = performanceData.length > 0 ? performanceData[0].value : 0;
  const totalReturn = startValue > 0 ? ((totalValue - startValue) / startValue) * 100 : 0;

  const metrics = [
    { label: "Total Return", value: `${totalReturn > 0 ? '+' : ''}${totalReturn.toFixed(1)}%`, description: "Past Year" },
    { label: "Current Value", value: formatCurrency(totalValue, portfolioCurrency), description: "Total Assets" },
    // Add more real metrics calculation here
  ];

  if (!holdings) return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-24 mt-2" />
              <Skeleton className="h-3 w-16 mt-2" />
            </CardHeader>
          </Card>
        ))}
      </div>
      <div className="max-w-3xl">
        <Skeleton className="h-10 w-48 mb-4" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="pb-2">
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className="text-2xl">{metric.value}</CardTitle>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="performance">
        <TabsList className="w-auto max-w-xl">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Performance</CardTitle>
              <CardDescription>Portfolio value over the last year</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" minTickGap={30} />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    formatter={(value: number) => [formatCurrency(value, portfolioCurrency), "Value"]}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    name="Portfolio Value"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allocation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sector Allocation</CardTitle>
              <CardDescription>Portfolio distribution by sector</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={140}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-3 w-full md:w-auto">
                  {allocationData.map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="flex-1 min-w-[120px]">
                        <p>{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.value}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
