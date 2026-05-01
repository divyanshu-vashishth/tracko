"use client";

import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Scale } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { formatCurrency } from "@/lib/formatCurrency";

export default function ComparePage() {
  const portfolios = useQuery(api.portfolios.getPortfolios) || [];
  const allHoldings = useQuery(api.portfolios.getHoldings, {}) || []; // Get ALL holdings
  const getQuotes = useAction(api.stocks.getQuotes);

  const [selectedPortfolios, setSelectedPortfolios] = useState<Set<string>>(new Set());
  const [livePrices, setLivePrices] = useState<Record<string, number>>({});

  // Select all portfolios by default when loaded
  useEffect(() => {
    if (portfolios.length > 0 && selectedPortfolios.size === 0) {
      setSelectedPortfolios(new Set(portfolios.map(p => p._id)));
    }
  }, [portfolios, selectedPortfolios.size]);

  // Fetch live prices for all holdings
  useEffect(() => {
    if (allHoldings.length > 0) {
      const symbols = Array.from(new Set(allHoldings.map((h: any) => h.symbol)));
      getQuotes({ symbols }).then(quotes => {
        const prices: Record<string, number> = {};
        quotes.forEach((q: any) => {
          if (q && q.symbol) {
            prices[q.symbol] = q.regularMarketPrice;
          }
        });
        setLivePrices(prices);
      });
    }
  }, [allHoldings.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const togglePortfolio = (id: string) => {
    setSelectedPortfolios(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const comparisonData = useMemo(() => {
    if (portfolios.length === 0 || allHoldings.length === 0) return [];

    return Array.from(selectedPortfolios).map(portfolioId => {
      const portfolio = portfolios.find(p => p._id === portfolioId);
      if (!portfolio) return null;

      const p_holdings = allHoldings.filter((h: any) => h.portfolioId === portfolioId);

      let totalValue = 0;
      let totalCost = 0;
      const sectorMap: Record<string, number> = {};

      p_holdings.forEach((h: any) => {
        const currentPrice = livePrices[h.symbol] || h.currentPrice || h.avgPurchasePrice;
        const value = h.shares * currentPrice;
        const cost = h.shares * h.avgPurchasePrice;
        
        totalValue += value;
        totalCost += cost;

        const sector = h.sector || "Other";
        sectorMap[sector] = (sectorMap[sector] || 0) + value;
      });

      const totalGain = totalValue - totalCost;
      const gainPercent = totalCost === 0 ? 0 : (totalGain / totalCost) * 100;

      // Format sector data for charts
      const sectorAllocation = Object.keys(sectorMap).map(sector => ({
        name: sector,
        value: sectorMap[sector]
      })).sort((a, b) => b.value - a.value);

      return {
        id: portfolio._id,
        name: portfolio.name,
        totalValue,
        totalCost,
        totalGain,
        gainPercent,
        sectorAllocation,
        holdingsCount: p_holdings.length
      };
    }).filter(Boolean);
  }, [portfolios, allHoldings, selectedPortfolios, livePrices]);

  if (portfolios.length === 0) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4", "#ec4899", "#f97316"];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Portfolio Comparison</h1>
        <p className="text-muted-foreground mt-2">Compare performance and allocation across your portfolios.</p>
      </div>

      <Card>
        <CardHeader className="pb-4 border-b">
          <CardTitle className="text-lg flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Select Portfolios to Compare
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            {portfolios.map(p => (
              <div
                key={p._id}
                className="flex items-center gap-2 border rounded-lg px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => togglePortfolio(p._id)}
              >
                <Checkbox checked={selectedPortfolios.has(p._id)} onCheckedChange={() => togglePortfolio(p._id)} />
                <span className="font-medium">{p.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {comparisonData.length > 0 ? (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {comparisonData.map((data: any) => (
              <Card key={data.id} className="relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                <CardHeader className="pb-2">
                  <CardTitle className="truncate">{data.name}</CardTitle>
                  <CardDescription>{data.holdingsCount} Holdings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mt-2">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Value</p>
                      <p className="text-2xl font-bold">{formatCurrency(data.totalValue, "INR")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Return</p>
                      <div className="flex items-center gap-2">
                        {data.gainPercent >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`font-semibold ${data.gainPercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {data.gainPercent >= 0 ? '+' : ''}{data.gainPercent.toFixed(2)}%
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({formatCurrency(data.totalGain, "INR")})
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Value Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
                    <Tooltip 
                      cursor={{ fill: 'hsl(var(--muted))' }}
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                      formatter={(value: number) => formatCurrency(value, "INR")}
                    />
                    <Legend />
                    <Bar dataKey="totalValue" name="Total Value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="totalCost" name="Total Cost" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Return % Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} />
                    <Tooltip 
                      cursor={{ fill: 'hsl(var(--muted))' }}
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                      formatter={(value: number) => `${value.toFixed(2)}%`}
                    />
                    <Bar dataKey="gainPercent" name="Return %" radius={[4, 4, 0, 0]}>
                      {comparisonData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.gainPercent >= 0 ? '#10b981' : '#ef4444'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {comparisonData.map((data: any, idx: number) => (
              <Card key={data.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{data.name} Sector Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.sectorAllocation.length > 0 ? (
                    <div className="flex flex-col md:flex-row items-center gap-4">
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={data.sectorAllocation}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {data.sectorAllocation.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                            formatter={(value: number) => formatCurrency(value, "INR")}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="w-full space-y-2">
                        {data.sectorAllocation.slice(0, 5).map((sector: any, index: number) => (
                          <div key={sector.name} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                              <span className="truncate max-w-[120px]">{sector.name}</span>
                            </div>
                            <span className="text-muted-foreground font-medium">
                              {((sector.value / data.totalValue) * 100).toFixed(1)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                      No allocation data
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
          <Scale className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p>Select at least one portfolio to view comparison metrics.</p>
        </div>
      )}
    </div>
  );
}
