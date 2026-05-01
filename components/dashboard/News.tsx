"use client"
import { useAction, useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, Bookmark, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePortfolio } from "@/components/PortfolioContext";

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

export function News() {
  const { activePortfolioId } = usePortfolio();
  const getNews = useAction(api.news.getMarketNews);
  const holdings = useQuery(api.portfolios.getHoldings, { portfolioId: activePortfolioId });
  const bookmarks = useQuery(api.bookmarks.getBookmarks) || [];
  const addBookmark = useMutation(api.bookmarks.bookmarkNews);
  const removeBookmarkMutation = useMutation(api.bookmarks.removeBookmark);
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterByPortfolio, setFilterByPortfolio] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState("off");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsLoading(true);
    getNews().then((items) => {
      setNewsItems(items);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, [getNews]);
  
  useEffect(() => {
    if (refreshInterval === "off") return;
    
    // Auto refresh logic
    const ms = parseInt(refreshInterval) * 60 * 1000;
    const intervalId = setInterval(() => {
      // Only refresh if not viewing bookmarks exclusively
      if (!showBookmarks) {
        getNews().then((items) => {
          setNewsItems(items);
        }).catch(console.error);
      }
    }, ms);
    
    return () => clearInterval(intervalId);
  }, [refreshInterval, showBookmarks, getNews]);

  const portfolioSymbols: string[] = holdings
    ? Array.from(new Set(holdings.map((h: any) => h.symbol.replace(".NS", "").replace(".BO", ""))))
    : [];
    
  // Compute base items to display (Regular News OR Bookmarks)
  const baseItems = useMemo(() => {
    if (showBookmarks) {
      return bookmarks.map((b: any) => ({
        title: b.title,
        link: b.url,
        pubDate: new Date(b.publishedAt).toISOString(),
        contentSnippet: b.contentSnippet || "",
        source: b.source,
        guid: b._id,
      }));
    }
    return newsItems;
  }, [showBookmarks, bookmarks, newsItems]);

  // Filter news based on portfolio filter
  const portfolioFilteredNews = useMemo(() => {
    if (!filterByPortfolio || portfolioSymbols.length === 0) return baseItems;
    return baseItems.filter(item => {
      const titleUpper = item.title.toUpperCase();
      const contentUpper = (item.contentSnippet || "").toUpperCase();
      return portfolioSymbols.some((symbol: string) =>
        titleUpper.includes(symbol) || contentUpper.includes(symbol)
      );
    });
  }, [baseItems, filterByPortfolio, portfolioSymbols]);

  // Then filter by search query
  const filteredNews = useMemo(() => {
    if (!searchQuery.trim()) return portfolioFilteredNews;
    const query = searchQuery.toLowerCase();
    return portfolioFilteredNews.filter(item =>
      item.title.toLowerCase().includes(query) ||
      (item.contentSnippet || "").toLowerCase().includes(query)
    );
  }, [portfolioFilteredNews, searchQuery]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-[300px]" />
        </div>
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
      {/* Search and Filter Section */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">{showBookmarks ? "Bookmarked News" : "Market News"}</h2>
          {portfolioSymbols.length > 0 && (
            <Button
              variant={filterByPortfolio ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterByPortfolio(!filterByPortfolio)}
            >
              {filterByPortfolio ? "Show All" : "Filter by Portfolio"}
            </Button>
          )}
          <Button
            variant={showBookmarks ? "default" : "outline"}
            size="sm"
            onClick={() => setShowBookmarks(!showBookmarks)}
          >
            <Bookmark className={`h-4 w-4 mr-2 ${showBookmarks ? 'fill-current' : ''}`} />
            Bookmarks
          </Button>

          <div className="flex items-center gap-1 border rounded-md px-2 h-9 bg-background">
            <span className="text-muted-foreground text-xs">Auto Refresh:</span>
            <Clock className="h-3.5 w-3.5 text-muted-foreground mr-1" />
            <Select value={refreshInterval} onValueChange={(val) => setRefreshInterval(val || "off")}>
              <SelectTrigger className="w-[85px] h-7 border-0 p-0 hover:bg-transparent shadow-none focus:ring-0 text-xs">
                <SelectValue placeholder="Auto-refresh" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="off">Off</SelectItem>
                <SelectItem value="5">5 Min</SelectItem>
                <SelectItem value="15">15 Min</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search news..."
            className="pl-10 w-full sm:w-[300px]"
          />
        </div>
      </div>

      {/* Status */}
      {(filterByPortfolio || searchQuery || showBookmarks) && (
        <p className="text-sm text-muted-foreground">
          Showing {filteredNews.length} of {baseItems.length} articles
          {filterByPortfolio && " (filtered by portfolio stocks)"}
        </p>
      )}

      {/* News Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-1">
        {filteredNews.map((item, index) => {
          const isBookmarked = bookmarks.some((b: any) => b.url === item.link);
          return (
            <article key={item.guid || index} className="py-3 border-b border-border/40 last:border-0 relative group">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-primary leading-snug hover:underline pr-6">
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </a>
                </h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 shrink-0 -mt-1 -mr-2 opacity-50 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    if (isBookmarked) {
                      removeBookmarkMutation({ url: item.link });
                    } else {
                      addBookmark({
                        title: item.title,
                        contentSnippet: item.contentSnippet,
                        source: item.source || "CNBC TV18",
                        url: item.link,
                        publishedAt: new Date(item.pubDate).getTime(),
                      });
                    }
                  }}
                  title={isBookmarked ? "Remove Bookmark" : "Bookmark News"}
                >
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-primary text-primary' : ''}`} />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3 mt-1.5 leading-relaxed pr-2">
                {item.contentSnippet}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {formatTimeAgo(item.pubDate)}
              </p>
            </article>
          );
        })}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center text-muted-foreground py-10">
          No news found {searchQuery ? `for "${searchQuery}"` : "for your portfolio stocks"}.
        </div>
      )}
    </div>
  );
}
