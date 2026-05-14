"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import "flag-icons/css/flag-icons.min.css";
import { usePortfolio } from "@/components/PortfolioContext";

// Country codes for flag-icons
const COUNTRY_CODES: Record<string, string> = {
    "India": "in",
    "USA": "us",
    "China": "cn",
    "Japan": "jp",
    "Euro Area": "eu",
};

// Extended Economic Events Data for January-March 2026
interface EconomicEvent {
    date: Date;
    country: "India" | "USA" | "China" | "Japan" | "Euro Area";
    event: string;
    impact: "High" | "Medium" | "Low";
    expected?: string;
    actual?: string;
    previous?: string;
}

const ECONOMIC_EVENTS: EconomicEvent[] = [
    // May 2026
    { date: new Date(2026, 4, 14, 12, 0), country: "India", event: "WPI Inflation YoY APR", impact: "Medium", expected: "4.40%", actual: "8.30%", previous: "3.88%" },
    { date: new Date(2026, 4, 14, 18, 0), country: "USA", event: "Initial Jobless Claims MAY/09", impact: "Medium", expected: "205K", actual: "211K", previous: "200K" },
    { date: new Date(2026, 4, 14, 18, 0), country: "USA", event: "Retail Sales YoY APR", impact: "Medium", expected: "4.90%", previous: "4.60%" },
    { date: new Date(2026, 4, 15, 18, 45), country: "USA", event: "Industrial Production YoY APR", impact: "Low", previous: "0.70%" },
    { date: new Date(2026, 4, 18, 7, 30), country: "China", event: "Industrial Production YoY APR", impact: "Medium", previous: "5.70%" },
    { date: new Date(2026, 4, 20, 23, 30), country: "USA", event: "FOMC Minutes", impact: "High" },
    { date: new Date(2026, 4, 21, 18, 0), country: "USA", event: "Housing Starts APR", impact: "Medium", previous: "1.502M" },
    { date: new Date(2026, 4, 21, 18, 0), country: "USA", event: "Initial Jobless Claims MAY/16", impact: "Medium" },
    { date: new Date(2026, 4, 28, 0, 0), country: "India", event: "Market Holiday - Bakri Eid", impact: "Low" },
    { date: new Date(2026, 4, 28, 16, 0), country: "India", event: "Industrial Production YoY APR", impact: "Medium", previous: "4.1%" },
    { date: new Date(2026, 4, 28, 19, 30), country: "USA", event: "New Home Sales APR", impact: "Medium", previous: "0.682M" },
    { date: new Date(2026, 4, 28, 18, 0), country: "USA", event: "Initial Jobless Claims MAY/23", impact: "Medium" },
    { date: new Date(2026, 4, 29, 16, 0), country: "India", event: "GDP Growth Rate YoY Q1", impact: "High", previous: "7.80%" },
    { date: new Date(2026, 4, 31, 7, 0), country: "China", event: "NBS Manufacturing PMI MAY", impact: "Low", previous: "50.3" },
    // June 2026
    { date: new Date(2026, 5, 4, 18, 0), country: "USA", event: "Non Farm Payrolls MAY", impact: "High" },
    { date: new Date(2026, 5, 5, 16, 0), country: "India", event: "RBI Policy Decision", impact: "High", previous: "6.00%" },
    { date: new Date(2026, 5, 10, 18, 0), country: "USA", event: "Inflation Rate YoY MAY", impact: "High" },
    { date: new Date(2026, 5, 17, 18, 0), country: "USA", event: "Fed Interest Rate Decision", impact: "High", previous: "4.50%" },
    { date: new Date(2026, 5, 18, 10, 0), country: "Euro Area", event: "ECB Interest Rate Decision", impact: "High" },
    { date: new Date(2026, 5, 26, 0, 0), country: "India", event: "Market Holiday - Muharram", impact: "Low" },
];

// Stock Results Data
interface StockResult {
    date: Date;
    symbol: string;
    name: string;
    eventType: "Stock Results (Q4)" | "Split" | "Dividend";
    price: number;
    change: number;
    quarter?: string;
    splitRatio?: string;
    details?: string;
}

const STOCK_RESULTS: StockResult[] = [
    // 13th May, Wednesday
    { date: new Date(2026, 4, 13), symbol: "CIPLA", name: "Cipla Ltd.", eventType: "Stock Results (Q4)", price: 1436.70, change: 0.0, quarter: "Q4 2026" },
    { date: new Date(2026, 4, 13), symbol: "CROMPTON", name: "Crompton Greaves Consumer Electricals Ltd.", eventType: "Stock Results (Q4)", price: 288.95, change: 0.0, quarter: "Q4 2026" },
    { date: new Date(2026, 4, 13), symbol: "TIINDIA", name: "Tube Investments of India Ltd.", eventType: "Stock Results (Q4)", price: 2800.80, change: 0.0, quarter: "Q4 2026" },
    { date: new Date(2026, 4, 13), symbol: "BHARTIARTL", name: "Bharti Airtel Ltd.", eventType: "Stock Results (Q4)", price: 1883.50, change: 0.0, quarter: "Q4 2026" },
    { date: new Date(2026, 4, 13), symbol: "LICHSGFIN", name: "LIC Housing Fin. Ltd.", eventType: "Stock Results (Q4)", price: 560.40, change: 0.0, quarter: "Q4 2026" },
    { date: new Date(2026, 4, 13), symbol: "TVSMOTOR", name: "TVS Motor Co. Ltd.", eventType: "Stock Results (Q4)", price: 3460.80, change: 0.0, quarter: "Q4 2026" },
    { date: new Date(2026, 4, 13), symbol: "KAYNES", name: "Kaynes Technology India Ltd.", eventType: "Stock Results (Q4)", price: 3336.50, change: 0.0, quarter: "Q4 2026" },
    { date: new Date(2026, 4, 13), symbol: "PFC", name: "Power Fin. Corp. Ltd.", eventType: "Stock Results (Q4)", price: 451.45, change: 0.0, quarter: "Q4 2026" },
    { date: new Date(2026, 4, 13), symbol: "OIL", name: "Oil India Ltd.", eventType: "Stock Results (Q4)", price: 517.55, change: 0.0, quarter: "Q4 2026" },
    { date: new Date(2026, 4, 13), symbol: "HINDPETRO", name: "Hindustan Petroleum Corp. Ltd.", eventType: "Stock Results (Q4)", price: 377.55, change: 0.0, quarter: "Q4 2026" },
    { date: new Date(2026, 4, 13), symbol: "DLF", name: "DLF Ltd.", eventType: "Stock Results (Q4)", price: 583.25, change: 0.0, quarter: "Q4 2026" },
    { date: new Date(2026, 4, 13), symbol: "JSWSTEEL", name: "JSW Steel Ltd.", eventType: "Stock Results (Q4)", price: 1296.90, change: 0.0, quarter: "Q4 2026" },
    { date: new Date(2026, 4, 13), symbol: "TMPV", name: "Tata Motors Passenger Vehicles Ltd.", eventType: "Stock Results (Q4)", price: 338.75, change: 0.0, quarter: "Q4 2026" },
    { date: new Date(2026, 4, 13), symbol: "HAL", name: "Hindustan Aeronautics Ltd.", eventType: "Stock Results (Q4)", price: 4608.00, change: 0.0, quarter: "Q4 2026" },
    { date: new Date(2026, 4, 13), symbol: "UNITDSPR", name: "United Spirits Ltd.", eventType: "Stock Results (Q4)", price: 1272.50, change: 0.0, quarter: "Q4 2026" },
    // 14th May, Thursday
    { date: new Date(2026, 4, 14), symbol: "IRFC", name: "Indian Railway Finance Corp. Ltd.", eventType: "Stock Results (Q4)", price: 100.19, change: 0.0, quarter: "Q4 2026" },
    { date: new Date(2026, 4, 14), symbol: "VOLTAS", name: "Voltas Ltd.", eventType: "Stock Results (Q4)", price: 1293.50, change: 0.0, quarter: "Q4 2026" },
    { date: new Date(2026, 4, 14), symbol: "VMM", name: "Vishal Mega Mart Ltd.", eventType: "Stock Results (Q4)", price: 117.78, change: 0.0, quarter: "Q4 2026" },
    { date: new Date(2026, 4, 14), symbol: "MUTHOOTFIN", name: "Muthoot Fin. Ltd.", eventType: "Stock Results (Q4)", price: 3531.10, change: 0.0, quarter: "Q4 2026" },
    { date: new Date(2026, 4, 14), symbol: "OBEROIRLTY", name: "Oberoi Realty Ltd.", eventType: "Dividend", price: 1637.60, change: 0.0, details: "Interim Dividend of ₹ 2 Per Share" },
    { date: new Date(2026, 4, 14), symbol: "IEX", name: "Indian Energy Exchange Ltd.", eventType: "Dividend", price: 128.44, change: 0.0, details: "Dividend of ₹ 2 Per Share" },
    // 15th May, Friday
    { date: new Date(2026, 4, 15), symbol: "PREMIERENE", name: "Premier Energies Ltd.", eventType: "Stock Results (Q4)", price: 977.40, change: 0.0, quarter: "Q4 2026" },
    { date: new Date(2026, 4, 15), symbol: "TATASTEEL", name: "Tata Steel Ltd.", eventType: "Stock Results (Q4)", price: 221.13, change: 0.0, quarter: "Q4 2026" },
    { date: new Date(2026, 4, 15), symbol: "SOLARINDS", name: "Solar Industries India Ltd.", eventType: "Stock Results (Q4)", price: 16665.00, change: 0.0, quarter: "Q4 2026" },
    { date: new Date(2026, 4, 15), symbol: "COCHINSHIP", name: "Cochin Shipyard Ltd.", eventType: "Stock Results (Q4)", price: 1645.20, change: 0.0, quarter: "Q4 2026" },
    { date: new Date(2026, 4, 15), symbol: "GODFRYPHLP", name: "Godfrey Phillips India Ltd.", eventType: "Stock Results (Q4)", price: 2458.60, change: 0.0, quarter: "Q4 2026" },
    { date: new Date(2026, 4, 15), symbol: "SAIL", name: "Steel Authority of India Ltd.", eventType: "Stock Results (Q4)", price: 199.08, change: 0.0, quarter: "Q4 2026" },
    { date: new Date(2026, 4, 15), symbol: "NHPC", name: "NHPC Ltd.", eventType: "Stock Results (Q4)", price: 78.45, change: 0.0, quarter: "Q4 2026" },
    { date: new Date(2026, 4, 15), symbol: "POWERGRID", name: "Power Grid Corp. of India Ltd.", eventType: "Stock Results (Q4)", price: 301.75, change: 0.0, quarter: "Q4 2026" },
    { date: new Date(2026, 4, 15), symbol: "AMBER", name: "Amber Enterprises India Ltd.", eventType: "Stock Results (Q4)", price: 8288.50, change: 0.0, quarter: "Q4 2026" },
    { date: new Date(2026, 4, 15), symbol: "SBIN", name: "State Bank of India", eventType: "Dividend", price: 979.90, change: 0.0, details: "Dividend of ₹ 17.35 Per Share" },
    { date: new Date(2026, 4, 15), symbol: "NUVAMA", name: "Nuvama Wealth Management Ltd.", eventType: "Dividend", price: 1477.90, change: 0.0, details: "Interim Dividend of ₹ 14 Per Share" },
];

// Indian Market Holidays
const INDIAN_HOLIDAYS = [
    { date: new Date(2025, 11, 25), name: "Christmas", day: "Thursday" },
    { date: new Date(2026, 0, 26), name: "Republic Day", day: "Monday" },
    { date: new Date(2026, 2, 3), name: "Holi", day: "Tuesday" },
    { date: new Date(2026, 2, 26), name: "Shri Ram Navami", day: "Thursday" },
    { date: new Date(2026, 2, 31), name: "Shri Mahavir Jayanti", day: "Tuesday" },
    { date: new Date(2026, 3, 3), name: "Good Friday", day: "Friday" },
    { date: new Date(2026, 3, 14), name: "Dr. Baba Saheb Ambedkar Jayanti", day: "Tuesday" },
    { date: new Date(2026, 4, 1), name: "Maharashtra Day", day: "Friday" },
    { date: new Date(2026, 4, 28), name: "Bakri Id", day: "Thursday" },
    { date: new Date(2026, 5, 26), name: "Muharram", day: "Friday" },
    { date: new Date(2026, 7, 15), name: "Independence Day", day: "Saturday" },
    { date: new Date(2026, 8, 14), name: "Ganesh Chaturthi", day: "Monday" },
    { date: new Date(2026, 9, 2), name: "Mahatma Gandhi Jayanti", day: "Friday" },
    { date: new Date(2026, 9, 20), name: "Dussehra", day: "Tuesday" },
    { date: new Date(2026, 10, 10), name: "Diwali-Balipratipada", day: "Tuesday" },
    { date: new Date(2026, 10, 24), name: "Prakash Gurpurb Sri Guru Nanak Dev", day: "Tuesday" },
    { date: new Date(2026, 11, 25), name: "Christmas", day: "Friday" },
];

const US_HOLIDAYS = [
    { date: new Date(2026, 0, 1), name: "New Year's Day", day: "Thursday" },
    { date: new Date(2026, 0, 19), name: "Martin Luther King Jr. Day", day: "Monday" },
    { date: new Date(2026, 1, 16), name: "Presidents' Day", day: "Monday" },
    { date: new Date(2026, 3, 3), name: "Good Friday", day: "Friday" },
    { date: new Date(2026, 4, 25), name: "Memorial Day", day: "Monday" },
    { date: new Date(2026, 5, 19), name: "Juneteenth", day: "Friday" },
    { date: new Date(2026, 6, 3), name: "Independence Day (Observed)", day: "Friday" },
    { date: new Date(2026, 8, 7), name: "Labor Day", day: "Monday" },
    { date: new Date(2026, 10, 26), name: "Thanksgiving Day", day: "Thursday" },
    { date: new Date(2026, 11, 25), name: "Christmas Day", day: "Friday" },
];

function formatDate(date: Date): string {
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

function formatDateTime(date: Date): string {
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", weekday: "short" }) +
        " " + date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function formatResultDate(date: Date): string {
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", weekday: "long" });
}

function getDaysUntil(date: Date): number {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function getUpcomingHoliday(holidays: typeof INDIAN_HOLIDAYS) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return holidays.find((h) => h.date >= now);
}

// Flag component using flag-icons
function CountryFlag({ country }: { country: string }) {
    const code = COUNTRY_CODES[country];
    if (!code) return null;
    return <span className={`fi fi-${code} mr-2`} />;
}

export default function CalendarPage() {
    const { activePortfolioId } = usePortfolio();
    const holdings = useQuery(api.portfolios.getHoldings, { portfolioId: activePortfolioId }) || [];
    const [showUsMarket, setShowUsMarket] = useState(false);

    // Economic filters
    const [selectedCountries, setSelectedCountries] = useState<string[]>(["India", "USA", "China", "Japan", "Euro Area"]);
    const [selectedImpacts, setSelectedImpacts] = useState<string[]>(["High", "Medium", "Low"]);

    // Stock results filter
    const [selectedStocks, setSelectedStocks] = useState<Set<string>>(new Set());

    const portfolioSymbols = useMemo(() =>
        holdings.map(h => h.symbol.replace(".NS", "").replace(".BO", "")),
        [holdings]
    );

    const filteredEconomicEvents = useMemo(() =>
        ECONOMIC_EVENTS.filter(e =>
            selectedCountries.includes(e.country) &&
            selectedImpacts.includes(e.impact)
        ),
        [selectedCountries, selectedImpacts]
    );

    const filteredStockResults = useMemo(() => {
        if (selectedStocks.size === 0) return STOCK_RESULTS;
        return STOCK_RESULTS.filter(r => selectedStocks.has(r.symbol));
    }, [selectedStocks]);

    const toggleStockFilter = (symbol: string) => {
        setSelectedStocks(prev => {
            const newSet = new Set(prev);
            if (newSet.has(symbol)) {
                newSet.delete(symbol);
            } else {
                newSet.add(symbol);
            }
            return newSet;
        });
    };

    const toggleCountry = (country: string) => {
        setSelectedCountries(prev =>
            prev.includes(country)
                ? prev.filter(c => c !== country)
                : [...prev, country]
        );
    };

    const toggleImpact = (impact: string) => {
        setSelectedImpacts(prev =>
            prev.includes(impact)
                ? prev.filter(i => i !== impact)
                : [...prev, impact]
        );
    };

    const holidays = showUsMarket ? US_HOLIDAYS : INDIAN_HOLIDAYS;
    const upcomingHoliday = getUpcomingHoliday(holidays);
    const daysUntilNext = upcomingHoliday ? getDaysUntil(upcomingHoliday.date) : 0;

    return (
        <div className="space-y-6 h-full overflow-auto">
            <div>
                <h1 className="text-2xl font-bold">Market Calendar</h1>
                <p className="text-muted-foreground">Track economic events, earnings announcements, and market holidays</p>
            </div>

            <Tabs defaultValue="holidays">
                <TabsList>
                    <TabsTrigger value="economic">Economic Calendar</TabsTrigger>
                    <TabsTrigger value="results">Stock Results Calendar</TabsTrigger>
                    <TabsTrigger value="holidays">Holiday Calendar</TabsTrigger>
                </TabsList>

                {/* Economic Calendar Tab */}
                <TabsContent value="economic" className="space-y-4">
                    {/* Filters - Using render prop to avoid nested buttons */}
                    <div className="flex items-center gap-4 flex-wrap">
                        <span className="text-sm font-medium">Filters</span>

                        <DropdownMenu>
                            <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
                                Country <ChevronDown className="ml-2 h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {["India", "China", "Japan", "Euro Area", "USA"].map(country => (
                                    <DropdownMenuCheckboxItem
                                        key={country}
                                        checked={selectedCountries.includes(country)}
                                        onCheckedChange={() => toggleCountry(country)}
                                    >
                                        <CountryFlag country={country} />
                                        {country}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
                                Impact <ChevronDown className="ml-2 h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {["High", "Medium", "Low"].map(impact => (
                                    <DropdownMenuCheckboxItem
                                        key={impact}
                                        checked={selectedImpacts.includes(impact)}
                                        onCheckedChange={() => toggleImpact(impact)}
                                    >
                                        {impact}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Country</TableHead>
                                    <TableHead>Event</TableHead>
                                    <TableHead className="text-center">Impact</TableHead>
                                    <TableHead className="text-right">Expected</TableHead>
                                    <TableHead className="text-right">Actual</TableHead>
                                    <TableHead className="text-right">Previous</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredEconomicEvents.map((event, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="whitespace-nowrap">{formatDateTime(event.date)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <CountryFlag country={event.country} />
                                                <span>{event.country}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-primary font-medium">{event.event}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge
                                                variant={event.impact === "High" ? "destructive" : event.impact === "Medium" ? "default" : "secondary"}
                                                className={event.impact === "Medium" ? "bg-amber-500 hover:bg-amber-600" : ""}
                                            >
                                                {event.impact}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">{event.expected || "—"}</TableCell>
                                        <TableCell className="text-right">{event.actual || "—"}</TableCell>
                                        <TableCell className="text-right">{event.previous || "—"}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                {/* Stock Results Tab */}
                <TabsContent value="results" className="space-y-4">
                    {/* Portfolio Filter */}
                    {holdings.length > 0 && (
                        <div className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium">Filter by Portfolio Stocks</span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {portfolioSymbols.map((symbol) => {
                                    const hasResults = STOCK_RESULTS.some(r => r.symbol === symbol);
                                    if (!hasResults) return null;
                                    return (
                                        <div
                                            key={symbol}
                                            className="flex items-center gap-2 border rounded-lg px-3 py-2 hover:bg-muted/50 transition-colors"
                                        >
                                            <Checkbox
                                                id={`stock-${symbol}`}
                                                checked={selectedStocks.has(symbol)}
                                                onCheckedChange={() => toggleStockFilter(symbol)}
                                            />
                                            <label htmlFor={`stock-${symbol}`} className="text-sm font-medium cursor-pointer">
                                                {symbol}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Event</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead>Quarter</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStockResults.map((result, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="whitespace-nowrap font-medium">{formatResultDate(result.date)}</TableCell>
                                        <TableCell>
                                            <div>
                                                <span className="text-primary">{result.name}</span>
                                                <span className="text-muted-foreground ml-1">({result.symbol})</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={result.eventType === "Dividend" ? "bg-purple-100 text-purple-700 border-purple-300" : "bg-primary/10 text-primary border-primary/30"}>
                                                {result.eventType}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span>{result.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                                            <span className={`ml-2 ${result.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                                                {result.change >= 0 ? "+" : ""}{result.change.toFixed(1)}%
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {result.details || result.quarter || result.splitRatio}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                {/* Holiday Calendar Tab */}
                <TabsContent value="holidays" className="space-y-4">
                    {upcomingHoliday && (
                        <div className="bg-primary/5 border-primary/20 border rounded-lg p-4">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-3 w-3 rounded-full bg-primary" />
                                    <span className="font-medium">
                                        Upcoming Holiday: {formatDate(upcomingHoliday.date)}, {upcomingHoliday.day} ({daysUntilNext} days) — {upcomingHoliday.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="us-market" className="text-sm text-muted-foreground">Show US Market Holidays</Label>
                                    <Switch id="us-market" checked={showUsMarket} onCheckedChange={setShowUsMarket} />
                                </div>
                            </div>
                        </div>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>{showUsMarket ? "US" : "Indian"} Market Holidays 2026</CardTitle>
                            <CardDescription>Days when the {showUsMarket ? "NYSE/NASDAQ" : "NSE/BSE"} is closed</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">Sr. No.</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Weekday</TableHead>
                                        <TableHead>Holiday</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {holidays.map((holiday, index) => {
                                        const isPast = holiday.date < new Date();
                                        const isNext = upcomingHoliday?.name === holiday.name && upcomingHoliday?.date.getTime() === holiday.date.getTime();
                                        return (
                                            <TableRow key={`${holiday.date.toISOString()}-${holiday.name}`} className={`${isPast ? "text-muted-foreground" : ""} ${isNext ? "bg-primary/5" : ""}`}>
                                                <TableCell className={isNext ? "text-primary font-medium" : ""}>{index + 1}</TableCell>
                                                <TableCell className={isNext ? "font-medium" : ""}>{formatDate(holiday.date)}</TableCell>
                                                <TableCell className={isNext ? "font-medium" : ""}>{holiday.day}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        <span className={`fi fi-${showUsMarket ? "us" : "in"} mr-2`} />
                                                        <span className={isNext ? "font-medium" : ""}>{holiday.name}</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
