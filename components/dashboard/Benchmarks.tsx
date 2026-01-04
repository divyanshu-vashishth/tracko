"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState, useMemo } from "react";

export function Benchmarks() {
  const holdings = useQuery(api.portfolios.getHoldings);
  const getHistory = useAction(api.stocks.getHistoricalPrices);
  const [historyData, setHistoryData] = useState<Record<string, any[]>>({});

  useEffect(() => {
    if (holdings && holdings.length > 0) {
        const symbols = holdings.map((h: any) => h.symbol);
        const allSymbols = [...symbols, "SPY"]; // Add Benchmark
        
        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const period1 = startOfYear.toISOString().split('T')[0];

        getHistory({ symbols: allSymbols, period1, interval: "1d" }).then(setHistoryData);
    }
  }, [holdings, getHistory]);

  const cumulativeData = useMemo(() => {
    if (!holdings || Object.keys(historyData).length === 0) return [];

    const spyHistory = historyData["SPY"] || [];
    if (spyHistory.length === 0) return [];

    const baseDates = spyHistory.map((d: any) => d.date);

    // Initial Portfolio Value
    let initialPortfolioValue = 0;
    holdings.forEach((h: any) => {
        const firstPrice = historyData[h.symbol]?.[0]?.close || h.avgPurchasePrice;
        initialPortfolioValue += h.shares * firstPrice;
    });

    const initialSpyPrice = spyHistory[0]?.close || 1;

    return baseDates.map((date: any) => {
        const dateStr = date.toString().slice(0,10);
        
        // Portfolio Value at Date
        let currentPortfolioValue = 0;
        holdings.forEach((h: any) => {
             const stockHistory = historyData[h.symbol];
             const dayData = stockHistory?.find((d: any) => d.date.toString().slice(0,10) === dateStr);
             if (dayData) {
                 currentPortfolioValue += dayData.close * h.shares;
             }
        });

        // SPY Value at Date (Normalized to Portfolio start value)
        const spyDayData = spyHistory.find((d: any) => d.date.toString().slice(0,10) === dateStr);
        const currentSpyPrice = spyDayData?.close || 0;
        
        // Calculate % Return
        const portfolioReturn = initialPortfolioValue > 0 ? ((currentPortfolioValue - initialPortfolioValue) / initialPortfolioValue) * 100 : 0;
        const spyReturn = initialSpyPrice > 0 ? ((currentSpyPrice - initialSpyPrice) / initialSpyPrice) * 100 : 0;

        return {
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            portfolio: portfolioReturn,
            sp500: spyReturn
        };
    });
  }, [holdings, historyData]);

  const portfolioYTD = cumulativeData.length > 0 ? cumulativeData[cumulativeData.length - 1].portfolio : 0;
  const spyYTD = cumulativeData.length > 0 ? cumulativeData[cumulativeData.length - 1].sp500 : 0;
  const ytdDiff = portfolioYTD - spyYTD;

  if (!holdings) return <div>Loading benchmarks...</div>;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Portfolio vs S&P 500 (YTD)</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              {ytdDiff >= 0 ? <TrendingUp className="h-5 w-5 text-green-600" /> : <TrendingDown className="h-5 w-5 text-red-600" />}
              <span className={ytdDiff >= 0 ? "text-green-600" : "text-red-600"}>
                {ytdDiff >= 0 ? '+' : ''}{ytdDiff.toFixed(1)}%
              </span>
            </CardTitle>
            <p className="text-xs text-muted-foreground">{ytdDiff >= 0 ? 'Outperforming' : 'Underperforming'}</p>
          </CardHeader>
        </Card>
      </div>

      {/* Cumulative Returns Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Cumulative Returns Comparison (YTD)</CardTitle>
          <CardDescription>Year-to-date cumulative returns vs S&P 500 (SPY)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={cumulativeData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" minTickGap={30} />
              <YAxis className="text-xs" tickFormatter={(value) => `${value.toFixed(0)}%`} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                formatter={(value: number) => `${value.toFixed(2)}%`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="portfolio" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Your Portfolio"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="sp500" 
                stroke="#10b981" 
                strokeWidth={2}
                name="S&P 500 (SPY)"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Benchmark Statistics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Benchmark Statistics</CardTitle>
          <CardDescription>Performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Index</TableHead>
                <TableHead className="text-right">YTD Return</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="bg-muted/50">
                <TableCell>Your Portfolio</TableCell>
                <TableCell className="text-right">
                  <span className={portfolioYTD >= 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                    {portfolioYTD >= 0 ? '+' : ''}{portfolioYTD.toFixed(1)}%
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>S&P 500 (SPY)</TableCell>
                <TableCell className="text-right">
                    <span className={spyYTD >= 0 ? "text-green-600" : "text-red-600"}>
                    {spyYTD >= 0 ? '+' : ''}{spyYTD.toFixed(1)}%
                    </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
