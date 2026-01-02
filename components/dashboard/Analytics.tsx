import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const performanceData = [
  { date: "Jan", value: 35000, benchmark: 33000 },
  { date: "Feb", value: 38000, benchmark: 35000 },
  { date: "Mar", value: 36500, benchmark: 36000 },
  { date: "Apr", value: 40000, benchmark: 38000 },
  { date: "May", value: 42500, benchmark: 39500 },
  { date: "Jun", value: 45000, benchmark: 42000 },
  { date: "Jul", value: 43800, benchmark: 43000 },
  { date: "Aug", value: 46200, benchmark: 44500 },
  { date: "Sep", value: 47500, benchmark: 46000 },
  { date: "Oct", value: 46800, benchmark: 45500 },
  { date: "Nov", value: 48200, benchmark: 47000 },
  { date: "Dec", value: 48642, benchmark: 47800 },
];

const allocationData = [
  { name: "Technology", value: 35, color: "#3b82f6" },
  { name: "Healthcare", value: 20, color: "#10b981" },
  { name: "Finance", value: 18, color: "#f59e0b" },
  { name: "Consumer", value: 15, color: "#8b5cf6" },
  { name: "Energy", value: 8, color: "#ef4444" },
  { name: "Other", value: 4, color: "#6b7280" },
];

const monthlyReturns = [
  { month: "Jan", return: 5.2 },
  { month: "Feb", return: 8.6 },
  { month: "Mar", return: -3.9 },
  { month: "Apr", return: 9.6 },
  { month: "May", return: 6.3 },
  { month: "Jun", return: 5.9 },
  { month: "Jul", return: -2.7 },
  { month: "Aug", return: 5.5 },
  { month: "Sep", return: 2.8 },
  { month: "Oct", return: -1.5 },
  { month: "Nov", return: 3.0 },
  { month: "Dec", return: 0.9 },
];

const metrics = [
  { label: "Total Return", value: "+39.0%", description: "Since inception" },
  { label: "Annual Return", value: "+18.5%", description: "Annualized" },
  { label: "Sharpe Ratio", value: "1.85", description: "Risk-adjusted return" },
  { label: "Max Drawdown", value: "-8.2%", description: "Largest peak-to-trough decline" },
  { label: "Volatility", value: "12.4%", description: "Standard deviation" },
  { label: "Win Rate", value: "67%", description: "Profitable months" },
];

export function Analytics() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="pb-2">
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className="text-2xl">{metric.value}</CardTitle>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
          <TabsTrigger value="returns">Returns</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Performance</CardTitle>
              <CardDescription>Portfolio value vs benchmark over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6b7280" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6b7280" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                    name="Portfolio Value"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="benchmark" 
                    stroke="#6b7280" 
                    fillOpacity={1} 
                    fill="url(#colorBenchmark)" 
                    name="Benchmark (S&P 500)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allocation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sector Allocation</CardTitle>
              <CardDescription>Portfolio distribution by sector</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={140}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-3 w-full md:w-auto">
                  {allocationData.map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded" 
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="flex-1 min-w-[120px]">
                        <p>{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.value}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="returns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Returns</CardTitle>
              <CardDescription>Month-over-month return percentage</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyReturns}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    formatter={(value: number) => [`${value.toFixed(2)}%`, 'Return']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="return" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Monthly Return (%)"
                    dot={{ fill: '#3b82f6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
