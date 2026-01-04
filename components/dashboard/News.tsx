"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown, Activity, DollarSign, Globe, Filter } from "lucide-react";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function News() {
  const getNews = useAction(api.news.getMarketNews);
  const holdings = useQuery(api.portfolios.getHoldings);
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [selectedSymbols, setSelectedSymbols] = useState<Set<string>>(new Set());

  useEffect(() => {
    getNews().then((items) => {
        setNewsItems(items);
    });
  }, [getNews]);

  const portfolioSymbols = holdings ? Array.from(new Set(holdings.map((h: any) => h.symbol))) : [];

  const toggleSymbol = (symbol: string) => {
    const newSelected = new Set(selectedSymbols);
    if (newSelected.has(symbol)) {
        newSelected.delete(symbol);
    } else {
        newSelected.add(symbol);
    }
    setSelectedSymbols(newSelected);
  };

  // Simple client-side tagging
  const enrichedNews = newsItems.map(item => {
    const titleUpper = item.title.toUpperCase();
    const contentUpper = (item.contentSnippet || "").toUpperCase();
    
    // Check if any portfolio symbol is mentioned
    const matchedSymbol = portfolioSymbols.find((symbol: any) => 
        titleUpper.includes(symbol) || contentUpper.includes(symbol)
    );

    return {
        ...item,
        symbol: matchedSymbol || null,
        category: matchedSymbol ? "Portfolio" : "Market",
        sentiment: "neutral" 
    };
  });

  const portfolioNewsCount = enrichedNews.filter(i => i.symbol).length;
  const recentNewsCount = enrichedNews.length;

  const filteredNews = selectedSymbols.size > 0 
    ? enrichedNews.filter(item => item.symbol && selectedSymbols.has(item.symbol))
    : enrichedNews;

  const getSentimentIcon = (sentiment: string) => {
     return <Activity className="h-4 w-4 text-yellow-600" />;
  };

  const getSentimentColor = (sentiment: string) => {
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Portfolio":
        return <DollarSign className="h-4 w-4" />;
      case "Market":
        return <Globe className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Market Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Portfolio Holdings News</CardDescription>
            <CardTitle className="text-2xl">{portfolioNewsCount} Updates</CardTitle>
            <p className="text-xs text-muted-foreground">Affecting your positions</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Market Sentiment</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Activity className="h-5 w-5 text-yellow-600" />
              <span className="text-yellow-600">Neutral</span>
            </CardTitle>
            <p className="text-xs text-muted-foreground">Based on recent news</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Latest News</CardDescription>
            <CardTitle className="text-2xl">{recentNewsCount} News </CardTitle>
            <p className="text-xs text-muted-foreground">From CNBC TV18</p>
          </CardHeader>
        </Card>
      </div>

      {/* News Feed */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
                <CardTitle>Market News & Updates</CardTitle>
                <CardDescription>Latest news affecting your portfolio and the market</CardDescription>
            </div>
            {selectedSymbols.size > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setSelectedSymbols(new Set())}>
                    Clear Filter
                </Button>
            )}
          </div>
          
          {/* Filter Bar */}
          {portfolioSymbols.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                  <span className="text-sm text-muted-foreground flex items-center gap-2 mr-2">
                    <Filter className="h-4 w-4" /> Filter by:
                  </span>
                  {portfolioSymbols.map((symbol) => (
                      <Badge 
                        key={symbol} 
                        variant={selectedSymbols.has(symbol) ? "default" : "outline"}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => toggleSymbol(symbol)}
                      >
                        {symbol}
                      </Badge>
                  ))}
              </div>
          )}
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              {filteredNews.map((item, index) => (
                <div key={item.guid || index}>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {item.symbol && (
                            <Badge variant="outline">{item.symbol}</Badge>
                          )}
                          <Badge variant="secondary" className="gap-1">
                            {getCategoryIcon(item.category)}
                            {item.category}
                          </Badge>
                        </div>
                        <h3 className="font-semibold leading-tight">
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {item.title}
                          </a>
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.contentSnippet}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{item.source}</span>
                          <span>•</span>
                          <span>{new Date(item.pubDate).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < filteredNews.length - 1 && <Separator className="mt-6" />}
                </div>
              ))}
              {filteredNews.length === 0 && newsItems.length > 0 && (
                 <div className="text-center text-muted-foreground py-10">
                    No news found for selected filters.
                 </div>
              )}
               {newsItems.length === 0 && (
                 <div className="text-center text-muted-foreground py-10">
                    Loading news...
                 </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
