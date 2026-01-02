import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown, Activity, DollarSign, Globe } from "lucide-react";

const newsItems = [
  {
    id: 1,
    title: "Apple Reports Record Q4 Earnings, Stock Jumps 5%",
    source: "Bloomberg",
    time: "2 hours ago",
    category: "Earnings",
    sentiment: "positive",
    symbol: "AAPL",
    summary: "Apple Inc. exceeded analyst expectations with quarterly revenue of $89.5 billion, driven by strong iPhone 15 sales."
  },
  {
    id: 2,
    title: "Federal Reserve Signals Potential Rate Cuts in 2024",
    source: "Reuters",
    time: "4 hours ago",
    category: "Market",
    sentiment: "positive",
    symbol: null,
    summary: "Fed Chair Jerome Powell indicated the central bank may begin cutting interest rates in the second half of 2024."
  },
  {
    id: 3,
    title: "NVIDIA Announces New AI Chip Partnership with Microsoft",
    source: "CNBC",
    time: "5 hours ago",
    category: "Technology",
    sentiment: "positive",
    symbol: "NVDA",
    summary: "NVIDIA and Microsoft partner to develop next-generation AI chips for data centers, stock up 3% in after-hours trading."
  },
  {
    id: 4,
    title: "Amazon Web Services Faces Increased Competition",
    source: "Financial Times",
    time: "6 hours ago",
    category: "Business",
    sentiment: "neutral",
    symbol: "AMZN",
    summary: "AWS market share slips slightly as Google Cloud and Microsoft Azure gain ground in enterprise cloud computing."
  },
  {
    id: 5,
    title: "Tesla Recalls 2 Million Vehicles Over Autopilot Concerns",
    source: "Wall Street Journal",
    time: "8 hours ago",
    category: "Automotive",
    sentiment: "negative",
    symbol: "TSLA",
    summary: "NHTSA requires Tesla to implement software update addressing autopilot safety features, stock down 2%."
  },
  {
    id: 6,
    title: "Microsoft Cloud Revenue Surges 30% Year-Over-Year",
    source: "MarketWatch",
    time: "10 hours ago",
    category: "Earnings",
    sentiment: "positive",
    symbol: "MSFT",
    summary: "Strong Azure performance drives Microsoft's quarterly results, with AI services showing rapid adoption among enterprise clients."
  },
  {
    id: 7,
    title: "Global Tech Stocks Rally on Positive Economic Data",
    source: "Bloomberg",
    time: "12 hours ago",
    category: "Market",
    sentiment: "positive",
    symbol: null,
    summary: "Better-than-expected jobs data and cooling inflation boost investor sentiment across technology sector."
  },
  {
    id: 8,
    title: "Alphabet Faces Antitrust Lawsuit Over Search Dominance",
    source: "Reuters",
    time: "1 day ago",
    category: "Legal",
    sentiment: "negative",
    symbol: "GOOGL",
    summary: "DOJ files expanded antitrust case against Google's parent company, seeking structural changes to search business."
  },
];

export function News() {
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "negative":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "negative":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Earnings":
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
            <CardTitle className="text-2xl">6 Updates</CardTitle>
            <p className="text-xs text-muted-foreground">Affecting your positions</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Market Sentiment</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-green-600">Bullish</span>
            </CardTitle>
            <p className="text-xs text-muted-foreground">Based on recent news</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Breaking News</CardDescription>
            <CardTitle className="text-2xl">3 New</CardTitle>
            <p className="text-xs text-muted-foreground">In the last hour</p>
          </CardHeader>
        </Card>
      </div>

      {/* News Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Market News & Updates</CardTitle>
          <CardDescription>Latest news affecting your portfolio and the market</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              {newsItems.map((item, index) => (
                <div key={item.id}>
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
                          <Badge className={getSentimentColor(item.sentiment)}>
                            <span className="flex items-center gap-1">
                              {getSentimentIcon(item.sentiment)}
                              {item.sentiment}
                            </span>
                          </Badge>
                        </div>
                        <h3 className="font-semibold leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.summary}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{item.source}</span>
                          <span>•</span>
                          <span>{item.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < newsItems.length - 1 && <Separator className="mt-6" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
