import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

const holdings = [
  { symbol: "AAPL", name: "Apple Inc.", shares: 50, avgPrice: 150.25, currentPrice: 178.50, value: 8925, change: 18.8 },
  { symbol: "MSFT", name: "Microsoft Corporation", shares: 30, avgPrice: 310.50, currentPrice: 378.91, value: 11367.30, change: 22.0 },
  { symbol: "GOOGL", name: "Alphabet Inc.", shares: 40, avgPrice: 125.80, currentPrice: 138.45, value: 5538, change: 10.1 },
  { symbol: "AMZN", name: "Amazon.com Inc.", shares: 25, avgPrice: 145.20, currentPrice: 168.75, value: 4218.75, change: 16.2 },
  { symbol: "TSLA", name: "Tesla Inc.", shares: 35, avgPrice: 210.30, currentPrice: 248.20, value: 8687, change: 18.0 },
  { symbol: "NVDA", name: "NVIDIA Corporation", shares: 20, avgPrice: 420.15, currentPrice: 495.30, value: 9906, change: 17.9 },
];

export function PortfolioOverview() {
  const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);
  const totalCost = holdings.reduce((sum, h) => sum + (h.shares * h.avgPrice), 0);
  const totalGain = totalValue - totalCost;
  const totalGainPercent = ((totalGain / totalCost) * 100);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Value</CardDescription>
            <CardTitle className="text-2xl">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Cost</CardDescription>
            <CardTitle className="text-2xl">${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Gain/Loss</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              {totalGain >= 0 ? (
                <span className="text-green-600">${totalGain.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              ) : (
                <span className="text-red-600">-${Math.abs(totalGain).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              )}
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
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
          <CardDescription>Your current portfolio positions</CardDescription>
        </CardHeader>
        <CardContent>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.map((holding) => {
                const gain = holding.value - (holding.shares * holding.avgPrice);
                const gainPercent = ((gain / (holding.shares * holding.avgPrice)) * 100);
                
                return (
                  <TableRow key={holding.symbol}>
                    <TableCell>
                      <Badge variant="outline">{holding.symbol}</Badge>
                    </TableCell>
                    <TableCell>{holding.name}</TableCell>
                    <TableCell className="text-right">{holding.shares}</TableCell>
                    <TableCell className="text-right">${holding.avgPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${holding.currentPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${holding.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-right">
                      <div className={`flex items-center justify-end gap-1 ${gainPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {gainPercent >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span>{gainPercent >= 0 ? '+' : ''}{gainPercent.toFixed(2)}%</span>
                      </div>
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
