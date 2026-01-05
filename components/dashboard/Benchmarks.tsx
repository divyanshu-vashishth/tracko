"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Search, X, Loader2, Check } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState, useMemo, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Benchmark {
  symbol: string;
  name: string;
  color: string;
}

const PREDEFINED_BENCHMARKS: Benchmark[] = [
  { symbol: "SPY", name: "S&P 500", color: "#10b981" },
  { symbol: "^NSEI", name: "Nifty 50", color: "#f59e0b" },
  { symbol: "^N225", name: "Nikkei 225", color: "#8b5cf6" },
  { symbol: "QQQ", name: "NASDAQ 100", color: "#ef4444" },
  { symbol: "^DJI", name: "Dow Jones", color: "#06b6d4" },
];

type TimePeriod = "1M" | "3M" | "6M" | "YTD" | "1Y" | "2Y" | "5Y";

const TIME_PERIODS: { value: TimePeriod; label: string }[] = [
  { value: "1M", label: "1M" },
  { value: "3M", label: "3M" },
  { value: "6M", label: "6M" },
  { value: "YTD", label: "YTD" },
  { value: "1Y", label: "1Y" },
  { value: "2Y", label: "2Y" },
  { value: "5Y", label: "5Y" },
];

function getStartDate(period: TimePeriod): string {
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case "1M":
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      break;
    case "3M":
      startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      break;
    case "6M":
      startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      break;
    case "YTD":
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    case "1Y":
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      break;
    case "2Y":
      startDate = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
      break;
    case "5Y":
      startDate = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());
      break;
    default:
      startDate = new Date(now.getFullYear(), 0, 1);
  }

  return startDate.toISOString().split('T')[0];
}

export function Benchmarks() {
  const holdings = useQuery(api.portfolios.getHoldings);
  const getHistory = useAction(api.stocks.getHistoricalPrices);
  const searchStocks = useAction(api.stocks.searchStocks);

  const [historyData, setHistoryData] = useState<Record<string, any[]>>({});
  const [selectedBenchmarks, setSelectedBenchmarks] = useState<Set<string>>(new Set(["SPY"]));
  const [customBenchmarks, setCustomBenchmarks] = useState<Benchmark[]>([]);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("1Y");

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const allBenchmarks = [...PREDEFINED_BENCHMARKS, ...customBenchmarks];
  const activeBenchmarks = allBenchmarks.filter(b => selectedBenchmarks.has(b.symbol));

  // Debounced Search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchQuery) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchStocks({ query: searchQuery });
          // Filter out already added benchmarks
          const existingSymbols = new Set(allBenchmarks.map(b => b.symbol));
          setSearchResults(results.filter((r: any) => !existingSymbols.has(r.symbol)));
          setShowResults(true);
        } catch (error) {
          console.error("Search failed:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery, searchStocks]);

  const addBenchmark = (stock: any) => {
    const colors = ["#ec4899", "#14b8a6", "#a855f7", "#f97316", "#84cc16"];
    const newBenchmark: Benchmark = {
      symbol: stock.symbol,
      name: stock.shortname || stock.longname || stock.symbol,
      color: colors[customBenchmarks.length % colors.length],
    };
    setCustomBenchmarks(prev => [...prev, newBenchmark]);
    setSelectedBenchmarks(prev => new Set([...prev, stock.symbol]));
    setSearchQuery("");
    setShowResults(false);
  };

  const toggleBenchmark = (symbol: string) => {
    setSelectedBenchmarks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(symbol)) {
        newSet.delete(symbol);
      } else {
        newSet.add(symbol);
      }
      return newSet;
    });
  };

  const removeBenchmark = (symbol: string) => {
    setCustomBenchmarks(prev => prev.filter(b => b.symbol !== symbol));
    setSelectedBenchmarks(prev => {
      const newSet = new Set(prev);
      newSet.delete(symbol);
      return newSet;
    });
  };

  useEffect(() => {
    if (holdings && holdings.length > 0) {
      const portfolioSymbols = holdings.map((h: any) => h.symbol);
      const benchmarkSymbols = Array.from(selectedBenchmarks);
      const allSymbols = [...portfolioSymbols, ...benchmarkSymbols];

      const period1 = getStartDate(timePeriod);

      getHistory({ symbols: allSymbols, period1, interval: "1d" }).then(setHistoryData);
    }
  }, [holdings, selectedBenchmarks, timePeriod, getHistory]);

  const cumulativeData = useMemo(() => {
    if (!holdings || Object.keys(historyData).length === 0) return [];

    // Find benchmark with most data points for date baseline
    let baseDates: any[] = [];
    activeBenchmarks.forEach(b => {
      const history = historyData[b.symbol] || [];
      if (history.length > baseDates.length) {
        baseDates = history.map((d: any) => d.date);
      }
    });

    if (baseDates.length === 0) return [];

    // Initial Portfolio Value
    let initialPortfolioValue = 0;
    holdings.forEach((h: any) => {
      const firstPrice = historyData[h.symbol]?.[0]?.close || h.avgPurchasePrice;
      initialPortfolioValue += h.shares * firstPrice;
    });

    // Initial benchmark prices
    const initialBenchmarkPrices: Record<string, number> = {};
    activeBenchmarks.forEach(b => {
      initialBenchmarkPrices[b.symbol] = historyData[b.symbol]?.[0]?.close || 1;
    });

    return baseDates.map((date: any) => {
      const dateStr = date.toString().slice(0, 10);

      // Portfolio Value at Date
      let currentPortfolioValue = 0;
      holdings.forEach((h: any) => {
        const stockHistory = historyData[h.symbol];
        const dayData = stockHistory?.find((d: any) => d.date.toString().slice(0, 10) === dateStr);
        if (dayData) {
          currentPortfolioValue += dayData.close * h.shares;
        }
      });

      const portfolioReturn = initialPortfolioValue > 0
        ? ((currentPortfolioValue - initialPortfolioValue) / initialPortfolioValue) * 100
        : 0;

      const result: any = {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        portfolio: portfolioReturn,
      };

      // Add benchmark returns
      activeBenchmarks.forEach(b => {
        const benchmarkHistory = historyData[b.symbol];
        const dayData = benchmarkHistory?.find((d: any) => d.date.toString().slice(0, 10) === dateStr);
        const currentPrice = dayData?.close || 0;
        const initialPrice = initialBenchmarkPrices[b.symbol];
        result[b.symbol] = initialPrice > 0 ? ((currentPrice - initialPrice) / initialPrice) * 100 : 0;
      });

      return result;
    });
  }, [holdings, historyData, activeBenchmarks]);

  const portfolioYTD = cumulativeData.length > 0 ? cumulativeData[cumulativeData.length - 1].portfolio : 0;

  const benchmarkYTDs = useMemo(() => {
    if (cumulativeData.length === 0) return {};
    const lastData = cumulativeData[cumulativeData.length - 1];
    const result: Record<string, number> = {};
    activeBenchmarks.forEach(b => {
      result[b.symbol] = lastData[b.symbol] || 0;
    });
    return result;
  }, [cumulativeData, activeBenchmarks]);

  if (!holdings) return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-20 mt-2" />
            <Skeleton className="h-3 w-24 mt-2" />
          </CardHeader>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Benchmark Search & Selection - No card to avoid overflow issues */}
      <div className="border rounded-lg p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Select Benchmarks</h3>
          <p className="text-sm text-muted-foreground">Choose benchmarks to compare with your portfolio</p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for more indices..."
            className="pl-9"
            autoComplete="off"
          />
          {isSearching && (
            <div className="absolute right-2.5 top-2.5">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Search Results Dropdown - Full height, no max */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 z-[100] bg-popover border rounded-md shadow-xl overflow-hidden">
              <div className="max-h-[300px] overflow-y-auto p-1">
                {searchResults.map((result: any) => (
                  <div
                    key={result.symbol}
                    className="flex flex-col px-3 py-2.5 text-sm cursor-pointer hover:bg-muted rounded-sm"
                    onClick={() => addBenchmark(result)}
                  >
                    <div className="font-medium flex justify-between">
                      <span>{result.symbol}</span>
                      <span className="text-xs text-muted-foreground">{result.typeDisp}</span>
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {result.shortname || result.longname} • {result.exchDisp}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Time Period Selector */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Period:</span>
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {TIME_PERIODS.map((period) => (
              <button
                key={period.value}
                onClick={() => setTimePeriod(period.value)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${timePeriod === period.value
                  ? "bg-background shadow-sm font-medium"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Benchmark Checkboxes */}
        <div className="flex flex-wrap gap-3">
          {allBenchmarks.map((benchmark) => (
            <div
              key={benchmark.symbol}
              className="flex items-center gap-2 border rounded-lg px-3 py-2 hover:bg-muted/50 transition-colors"
            >
              <Checkbox
                id={benchmark.symbol}
                checked={selectedBenchmarks.has(benchmark.symbol)}
                onCheckedChange={() => toggleBenchmark(benchmark.symbol)}
              />
              <label
                htmlFor={benchmark.symbol}
                className="text-sm font-medium cursor-pointer flex items-center gap-2"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: benchmark.color }}
                />
                {benchmark.name}
              </label>
              {!PREDEFINED_BENCHMARKS.find(b => b.symbol === benchmark.symbol) && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 ml-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeBenchmark(benchmark.symbol);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Your Portfolio ({timePeriod})</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              {portfolioYTD >= 0 ? <TrendingUp className="h-5 w-5 text-green-600" /> : <TrendingDown className="h-5 w-5 text-red-600" />}
              <span className={portfolioYTD >= 0 ? "text-green-600" : "text-red-600"}>
                {portfolioYTD >= 0 ? '+' : ''}{portfolioYTD.toFixed(1)}%
              </span>
            </CardTitle>
          </CardHeader>
        </Card>
        {activeBenchmarks.slice(0, 3).map((benchmark) => {
          const ytd = benchmarkYTDs[benchmark.symbol] || 0;
          return (
            <Card key={benchmark.symbol}>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: benchmark.color }} />
                  {benchmark.name} ({timePeriod})
                </CardDescription>
                <CardTitle className="text-2xl flex items-center gap-2">
                  {ytd >= 0 ? <TrendingUp className="h-5 w-5 text-green-600" /> : <TrendingDown className="h-5 w-5 text-red-600" />}
                  <span className={ytd >= 0 ? "text-green-600" : "text-red-600"}>
                    {ytd >= 0 ? '+' : ''}{ytd.toFixed(1)}%
                  </span>
                </CardTitle>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Cumulative Returns Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Cumulative Returns Comparison ({timePeriod})</CardTitle>
          <CardDescription>{timePeriod === "YTD" ? "Year-to-date" : timePeriod} cumulative returns vs selected benchmarks</CardDescription>
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
              {activeBenchmarks.map((benchmark) => (
                <Line
                  key={benchmark.symbol}
                  type="monotone"
                  dataKey={benchmark.symbol}
                  stroke={benchmark.color}
                  strokeWidth={2}
                  name={benchmark.name}
                  dot={false}
                />
              ))}
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
                <TableHead className="text-right">{timePeriod} Return</TableHead>
                <TableHead className="text-right">vs Portfolio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="bg-muted/50">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    Your Portfolio
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className={portfolioYTD >= 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                    {portfolioYTD >= 0 ? '+' : ''}{portfolioYTD.toFixed(1)}%
                  </span>
                </TableCell>
                <TableCell className="text-right">—</TableCell>
              </TableRow>
              {activeBenchmarks.map((benchmark) => {
                const ytd = benchmarkYTDs[benchmark.symbol] || 0;
                const diff = portfolioYTD - ytd;
                return (
                  <TableRow key={benchmark.symbol}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: benchmark.color }} />
                        {benchmark.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={ytd >= 0 ? "text-green-600" : "text-red-600"}>
                        {ytd >= 0 ? '+' : ''}{ytd.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={diff >= 0 ? "text-green-600" : "text-red-600"}>
                        {diff >= 0 ? '+' : ''}{diff.toFixed(1)}%
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
