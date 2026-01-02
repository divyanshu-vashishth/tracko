import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const comparisonData = [
  { month: "Jan", portfolio: 5.2, sp500: 4.1, nasdaq: 6.2, dowjones: 3.5 },
  { month: "Feb", portfolio: 8.6, sp500: 7.2, nasdaq: 8.8, dowjones: 6.1 },
  { month: "Mar", portfolio: -3.9, sp500: -2.5, nasdaq: -4.2, dowjones: -1.8 },
  { month: "Apr", portfolio: 9.6, sp500: 8.1, nasdaq: 10.2, dowjones: 7.3 },
  { month: "May", portfolio: 6.3, sp500: 5.8, nasdaq: 7.1, dowjones: 5.2 },
  { month: "Jun", portfolio: 5.9, sp500: 6.2, nasdaq: 6.8, dowjones: 5.9 },
  { month: "Jul", portfolio: -2.7, sp500: -1.9, nasdaq: -3.1, dowjones: -1.5 },
  { month: "Aug", portfolio: 5.5, sp500: 4.8, nasdaq: 6.2, dowjones: 4.3 },
  { month: "Sep", portfolio: 2.8, sp500: 3.2, nasdaq: 3.5, dowjones: 2.9 },
  { month: "Oct", portfolio: -1.5, sp500: -0.8, nasdaq: -1.9, dowjones: -0.5 },
  { month: "Nov", portfolio: 3.0, sp500: 2.8, nasdaq: 3.4, dowjones: 2.5 },
  { month: "Dec", portfolio: 0.9, sp500: 1.2, nasdaq: 1.5, dowjones: 1.0 },
];

const cumulativeData = [
  { month: "Jan", portfolio: 5.2, sp500: 4.1, nasdaq: 6.2 },
  { month: "Feb", portfolio: 14.2, sp500: 11.5, nasdaq: 15.4 },
  { month: "Mar", portfolio: 9.8, sp500: 8.8, nasdaq: 10.6 },
  { month: "Apr", portfolio: 20.3, sp500: 17.5, nasdaq: 22.1 },
  { month: "May", portfolio: 27.5, sp500: 24.0, nasdaq: 30.2 },
  { month: "Jun", portfolio: 34.4, sp500: 31.2, nasdaq: 38.3 },
  { month: "Jul", portfolio: 31.1, sp500: 28.8, nasdaq: 34.4 },
  { month: "Aug", portfolio: 37.9, sp500: 34.4, nasdaq: 42.1 },
  { month: "Sep", portfolio: 41.5, sp500: 38.3, nasdaq: 46.6 },
  { month: "Oct", portfolio: 39.7, sp500: 37.2, nasdaq: 44.3 },
  { month: "Nov", portfolio: 43.6, sp500: 40.7, nasdaq: 48.9 },
  { month: "Dec", portfolio: 44.8, sp500: 42.2, nasdaq: 51.2 },
];

const benchmarks = [
  {
    name: "S&P 500",
    ytd: 24.5,
    oneYear: 26.8,
    threeYear: 12.3,
    correlation: 0.85,
    beta: 1.15,
  },
  {
    name: "NASDAQ 100",
    ytd: 28.2,
    oneYear: 31.5,
    threeYear: 15.8,
    correlation: 0.92,
    beta: 1.28,
  },
  {
    name: "Dow Jones",
    ytd: 18.3,
    oneYear: 20.1,
    threeYear: 9.5,
    correlation: 0.78,
    beta: 0.95,
  },
  {
    name: "Russell 2000",
    ytd: 15.8,
    oneYear: 17.2,
    threeYear: 7.8,
    correlation: 0.65,
    beta: 0.82,
  },
];

export function Benchmarks() {
  const portfolioYTD = 39.0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Portfolio vs S&P 500</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-green-600">+14.5%</span>
            </CardTitle>
            <p className="text-xs text-muted-foreground">Outperforming</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Portfolio vs NASDAQ</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-green-600">+7.8%</span>
            </CardTitle>
            <p className="text-xs text-muted-foreground">Outperforming</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Portfolio Beta</CardDescription>
            <CardTitle className="text-2xl">1.15</CardTitle>
            <p className="text-xs text-muted-foreground">vs S&P 500</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Correlation</CardDescription>
            <CardTitle className="text-2xl">0.85</CardTitle>
            <p className="text-xs text-muted-foreground">with S&P 500</p>
          </CardHeader>
        </Card>
      </div>

      {/* Cumulative Returns Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Cumulative Returns Comparison</CardTitle>
          <CardDescription>Year-to-date cumulative returns vs major indices</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={cumulativeData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" tickFormatter={(value) => `${value}%`} />
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
                dot={{ fill: '#3b82f6' }}
              />
              <Line 
                type="monotone" 
                dataKey="sp500" 
                stroke="#10b981" 
                strokeWidth={2}
                name="S&P 500"
                dot={{ fill: '#10b981' }}
              />
              <Line 
                type="monotone" 
                dataKey="nasdaq" 
                stroke="#f59e0b" 
                strokeWidth={2}
                name="NASDAQ 100"
                dot={{ fill: '#f59e0b' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Returns Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Returns Comparison</CardTitle>
          <CardDescription>Month-over-month return comparison with benchmarks</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" tickFormatter={(value) => `${value}%`} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                formatter={(value: number) => `${value.toFixed(2)}%`}
              />
              <Legend />
              <Bar dataKey="portfolio" fill="#3b82f6" name="Your Portfolio" />
              <Bar dataKey="sp500" fill="#10b981" name="S&P 500" />
              <Bar dataKey="nasdaq" fill="#f59e0b" name="NASDAQ 100" />
              <Bar dataKey="dowjones" fill="#8b5cf6" name="Dow Jones" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Benchmark Statistics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Benchmark Statistics</CardTitle>
          <CardDescription>Performance metrics and correlation analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Index</TableHead>
                <TableHead className="text-right">YTD Return</TableHead>
                <TableHead className="text-right">1 Year Return</TableHead>
                <TableHead className="text-right">3 Year Return</TableHead>
                <TableHead className="text-right">Correlation</TableHead>
                <TableHead className="text-right">Beta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="bg-muted/50">
                <TableCell>Your Portfolio</TableCell>
                <TableCell className="text-right">
                  <span className="text-green-600 font-semibold">+{portfolioYTD}%</span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-green-600 font-semibold">+42.2%</span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-green-600 font-semibold">+18.5%</span>
                </TableCell>
                <TableCell className="text-right">-</TableCell>
                <TableCell className="text-right">-</TableCell>
              </TableRow>
              {benchmarks.map((benchmark) => {
                const ytdDiff = portfolioYTD - benchmark.ytd;
                return (
                  <TableRow key={benchmark.name}>
                    <TableCell>{benchmark.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span>+{benchmark.ytd}%</span>
                        <span className={`text-xs ${ytdDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ({ytdDiff >= 0 ? '+' : ''}{ytdDiff.toFixed(1)}%)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">+{benchmark.oneYear}%</TableCell>
                    <TableCell className="text-right">+{benchmark.threeYear}%</TableCell>
                    <TableCell className="text-right">{benchmark.correlation.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{benchmark.beta.toFixed(2)}</TableCell>
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
