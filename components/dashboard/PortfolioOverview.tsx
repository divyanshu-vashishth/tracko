"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TrendingUp, TrendingDown, PlusCircle, MoreHorizontal, Pencil, Trash, Search, Loader2 } from "lucide-react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState, useRef } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { formatCurrency } from "@/lib/formatCurrency";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Holding {
  _id: Id<"holdings">;
  symbol: string;
  name: string;
  shares: number;
  avgPurchasePrice: number;
  currency?: string;
  sector?: string;
  currentPrice?: number;
  value?: number;
  gain?: number;
  gainPercent?: number;
}

export function PortfolioOverview() {
  const holdings = useQuery(api.portfolios.getHoldings) || [];
  const getQuotes = useAction(api.stocks.getQuotes);
  const deleteHolding = useMutation(api.portfolios.deleteHolding);

  const [livePrices, setLivePrices] = useState<Record<string, number>>({});
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingHolding, setEditingHolding] = useState<Holding | null>(null);
  const [holdingToDelete, setHoldingToDelete] = useState<Id<"holdings"> | null>(null);

  // Fetch live prices
  useEffect(() => {
    if (holdings.length > 0) {
      const symbols = holdings.map(h => h.symbol);
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
  }, [holdings.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const mergedHoldings = holdings.map(h => {
    const currentPrice = livePrices[h.symbol] || h.currentPrice || h.avgPurchasePrice;
    const value = h.shares * currentPrice;
    const cost = h.shares * h.avgPurchasePrice;
    const gain = value - cost;
    const gainPercent = cost === 0 ? 0 : (gain / cost) * 100;

    return {
      ...h,
      currentPrice,
      value,
      gain,
      gainPercent
    };
  });

  const totalValue = mergedHoldings.reduce((sum, h) => sum + h.value, 0);
  const totalCost = mergedHoldings.reduce((sum, h) => sum + (h.shares * h.avgPurchasePrice), 0);
  const totalGain = totalValue - totalCost;
  const totalGainPercent = totalCost === 0 ? 0 : ((totalGain / totalCost) * 100);

  const portfolioCurrency = holdings.length > 0 ? (holdings[0].currency || "INR") : "INR";

  const handleDeleteConfirm = async () => {
    if (holdingToDelete) {
      await deleteHolding({ id: holdingToDelete });
      setHoldingToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Value</CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(totalValue, portfolioCurrency)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Cost</CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(totalCost, portfolioCurrency)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Gain/Loss</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <span className={totalGain >= 0 ? "text-green-600" : "text-red-600"}>
                {formatCurrency(totalGain, portfolioCurrency)}
              </span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Return</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              {totalGainPercent >= 0 ? (
                <>
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="text-green-600">+{totalGainPercent.toFixed(2)}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  <span className="text-red-600">{totalGainPercent.toFixed(2)}%</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Holdings Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Holdings</CardTitle>
            <CardDescription>Your current portfolio positions</CardDescription>
          </div>
          <Button size="sm" onClick={() => setIsAddOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Holding
          </Button>
        </CardHeader>
        <CardContent>
          {mergedHoldings.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <p>No holdings found.</p>
              <p className="text-sm">Add stocks to your portfolio to track their performance.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Shares</TableHead>
                  <TableHead className="text-right">Avg Price</TableHead>
                  <TableHead className="text-right">Current Price</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">Gain/Loss</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mergedHoldings.map((holding) => {
                  return (
                    <TableRow key={holding._id}>
                      <TableCell>
                        <Badge variant="outline">{holding.symbol}</Badge>
                      </TableCell>
                      <TableCell>{holding.name}</TableCell>
                      <TableCell className="text-right">{holding.shares}</TableCell>
                      <TableCell className="text-right">{formatCurrency(holding.avgPurchasePrice, holding.currency)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(holding.currentPrice, holding.currency)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(holding.value, holding.currency)}</TableCell>
                      <TableCell className="text-right">
                        <div className={`flex items-center justify-end gap-1 ${holding.gainPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {holding.gainPercent >= 0 ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          <span>{holding.gainPercent >= 0 ? '+' : ''}{holding.gainPercent.toFixed(2)}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingHolding(holding)}>
                              <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => setHoldingToDelete(holding._id)}
                            >
                              <Trash className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <HoldingDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        mode="add"
      />

      {editingHolding && (
        <HoldingDialog
          open={!!editingHolding}
          onOpenChange={(open) => !open && setEditingHolding(null)}
          mode="edit"
          holding={editingHolding}
        />
      )}

      <AlertDialog open={!!holdingToDelete} onOpenChange={(open) => !open && setHoldingToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove this holding from your portfolio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function HoldingDialog({
  open,
  onOpenChange,
  mode,
  holding
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  holding?: any;
}) {
  const addHolding = useMutation(api.portfolios.addHolding);
  const updateHolding = useMutation(api.portfolios.updateHolding);
  const searchStocks = useAction(api.stocks.searchStocks);
  const getStockQuote = useAction(api.stocks.getStockQuote);

  const [symbol, setSymbol] = useState(holding?.symbol || "");
  const [name, setName] = useState(holding?.name || "");
  const [shares, setShares] = useState(holding?.shares?.toString() || "");
  const [price, setPrice] = useState(holding?.avgPurchasePrice?.toString() || "");
  const [currency, setCurrency] = useState(holding?.currency || "USD"); // Default to USD
  const [sector, setSector] = useState(holding?.sector || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Current price state for displaying fetched price
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);

  // Search Logic
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (holding) {
      setSymbol(holding.symbol);
      setName(holding.name);
      setShares(holding.shares);
      setPrice(holding.avgPurchasePrice);
      setCurrency(holding.currency || "USD");
      setSector(holding.sector || "");
      setSearchQuery(holding.symbol); // Pre-fill search query with symbol
      setCurrentPrice(null);
    } else {
      setSymbol("");
      setName("");
      setShares("");
      setPrice("");
      setCurrency("USD");
      setSector("");
      setSearchQuery("");
      setCurrentPrice(null);
    }
    setSearchResults([]);
    setShowResults(false);
  }, [holding, open]);

  // Debounced Search
  useEffect(() => {
    if (mode === "edit") return; // Disable search in edit mode

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchQuery || searchQuery === symbol) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchStocks({ query: searchQuery });
          setSearchResults(results);
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
    }, 500); // 500ms debounce

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery, mode, symbol, searchStocks]);

  const selectStock = (stock: any) => {
    setSymbol(stock.symbol);
    setName(stock.shortname || stock.longname || stock.symbol);
    setSearchQuery(stock.symbol);
    setSector(stock.sector || ""); // Some results might have sector
    setShowResults(false);

    // Fetch current price and currency from quote API
    setCurrentPrice(null);
    setIsFetchingPrice(true);
    getStockQuote({ symbol: stock.symbol })
      .then((quote) => {
        if (quote) {
          setCurrentPrice(quote.regularMarketPrice);
          // Use currency from quote, default to USD
          setCurrency(quote.currency || "USD");
        }
      })
      .catch((err) => console.error("Failed to fetch quote:", err))
      .finally(() => setIsFetchingPrice(false));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (mode === "add") {
        await addHolding({
          symbol: symbol.toUpperCase(),
          name: name || symbol,
          shares: Number(shares),
          price: Number(price),
          currency,
          sector,
        });
      } else {
        await updateHolding({
          id: holding._id,
          shares: Number(shares),
          price: Number(price),
          currency,
        });
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save holding:", error);
      alert("Failed to save holding. Please check the inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] overflow-visible">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New Holding" : "Edit Holding"}</DialogTitle>
          <DialogDescription>
            {mode === "add" ? "Search and select a stock to add to your portfolio." : "Update your position details."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">

          {/* Symbol / Search Field */}
          <div className="grid grid-cols-4 items-center gap-4 relative z-50">
            <Label htmlFor="search" className="text-right">Symbol</Label>
            <div className="col-span-3 relative">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (mode === "add" && e.target.value === "") {
                      setSymbol(""); // Clear symbol if search cleared
                    }
                  }}
                  className="pl-9"
                  disabled={mode === "edit"}
                  placeholder="Search stock (e.g. AAPL, Reliance)"
                  autoComplete="off"
                  required
                />
                {isSearching && (
                  <div className="absolute right-2.5 top-2.5">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <Card className="absolute top-full mt-1 w-full z-50 shadow-lg max-h-[300px] overflow-hidden">
                  <ScrollArea className="h-[200px]">
                    <div className="p-1">
                      {searchResults.map((result: any) => (
                        <div
                          key={result.symbol}
                          className="flex flex-col px-3 py-2 text-sm cursor-pointer hover:bg-muted rounded-sm"
                          onClick={() => selectStock(result)}
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
                  </ScrollArea>
                </Card>
              )}
              {showResults && searchResults.length === 0 && !isSearching && searchQuery.length >= 2 && (
                <Card className="absolute top-full mt-1 w-full z-50 shadow-lg p-4 text-sm text-center text-muted-foreground">
                  No results found.
                </Card>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Company Name"
              readOnly={mode === "add"} // Prefer selecting from list
            />
          </div>

          {/* Current Price Display - only in add mode */}
          {mode === "add" && symbol && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Current Price</Label>
              <div className="col-span-3 flex items-center gap-2">
                {isFetchingPrice ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Fetching price...</span>
                  </div>
                ) : currentPrice !== null ? (
                  <span className="text-lg font-semibold text-green-600">
                    {formatCurrency(currentPrice, currency)}
                  </span>
                ) : (
                  <span className="text-muted-foreground">--</span>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="shares" className="text-right">Shares</Label>
            <Input
              id="shares"
              type="number"
              step="any"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">Avg Price</Label>
            <Input
              id="price"
              type="number"
              step="any"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="currency" className="text-right">Currency</Label>
            <Input
              id="currency"
              value={currency}
              className="col-span-3 bg-muted"
              placeholder="USD, INR"
              readOnly
              disabled
            />
          </div>
        </form>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
