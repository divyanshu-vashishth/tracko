"use client"
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) {
    return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }
}

function NewsSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
      {[...Array(9)].map((_, i) => (
        <article key={i} className="space-y-2 py-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-3 w-24 mt-1" />
        </article>
      ))}
    </div>
  );
}

// Generate unique colors for stocks
const STOCK_COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444",
  "#06b6d4", "#ec4899", "#14b8a6", "#a855f7", "#f97316",
];

export function News() {
  const getNews = useAction(api.news.getMarketNews);
  const holdings = useQuery(api.portfolios.getHoldings);
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSymbols, setSelectedSymbols] = useState<Set<string>>(new Set());

  useEffect(() => {
    setIsLoading(true);
    getNews().then((items) => {
      setNewsItems(items);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, [getNews]);

  const portfolioSymbols = holdings ? Array.from(new Set(holdings.map((h: any) => h.symbol))) : [];

  const toggleSymbol = (symbol: string) => {
    setSelectedSymbols(prev => {
      const newSet = new Set(prev);
      if (newSet.has(symbol)) {
        newSet.delete(symbol);
      } else {
        newSet.add(symbol);
      }
      return newSet;
    });
  };

  // Filter news based on selected symbols
  const filteredNews = selectedSymbols.size > 0
    ? newsItems.filter(item => {
      const titleUpper = item.title.toUpperCase();
      const contentUpper = (item.contentSnippet || "").toUpperCase();
      return Array.from(selectedSymbols).some((symbol: string) =>
        titleUpper.includes(symbol) || contentUpper.includes(symbol)
      );
    })
    : newsItems;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-10 w-24" />
              ))}
            </div>
          </CardContent>
        </Card>
        <NewsSkeleton />
      </div>
    );
  }

  if (newsItems.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        No news available at the moment.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stock Filter Section */}
      {portfolioSymbols.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Filter by Stock</CardTitle>
            <CardDescription>Select stocks to filter relevant news</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {portfolioSymbols.map((symbol, index) => (
                <div
                  key={symbol}
                  className="flex items-center gap-2 border rounded-lg px-3 py-2 hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={`stock-${symbol}`}
                    checked={selectedSymbols.has(symbol)}
                    onCheckedChange={() => toggleSymbol(symbol)}
                  />
                  <label
                    htmlFor={`stock-${symbol}`}
                    className="text-sm font-medium cursor-pointer flex items-center gap-2"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: STOCK_COLORS[index % STOCK_COLORS.length] }}
                    />
                    {symbol}
                  </label>
                </div>
              ))}
            </div>
            {selectedSymbols.size > 0 && (
              <p className="text-sm text-muted-foreground mt-3">
                Showing {filteredNews.length} news for selected stocks
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* News Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-1">
        {filteredNews.map((item, index) => (
          <article key={item.guid || index} className="py-3 border-b border-border/40 last:border-0">
            <h3 className="font-semibold text-primary leading-snug hover:underline">
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                {item.title}
              </a>
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-3 mt-1.5 leading-relaxed">
              {item.contentSnippet}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {formatTimeAgo(item.pubDate)}
            </p>
          </article>
        ))}
      </div>

      {filteredNews.length === 0 && selectedSymbols.size > 0 && (
        <div className="text-center text-muted-foreground py-10">
          No news found for selected stocks.
        </div>
      )}
    </div>
  );
}
