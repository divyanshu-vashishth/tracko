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
    // January 2026
    { date: new Date(2026, 0, 8, 19, 0), country: "USA", event: "Initial Jobless Claims JAN/03", impact: "Medium", expected: "205K", previous: "199K" },
    { date: new Date(2026, 0, 9, 19, 0), country: "USA", event: "Housing Starts OCT", impact: "Medium" },
    { date: new Date(2026, 0, 9, 19, 0), country: "USA", event: "Housing Starts SEP", impact: "Medium", actual: "1.31M", previous: "1.307M" },
    { date: new Date(2026, 0, 9, 19, 0), country: "USA", event: "Non Farm Payrolls DEC", impact: "High", expected: "57K", previous: "64K" },
    { date: new Date(2026, 0, 12, 16, 0), country: "India", event: "Inflation Rate YoY DEC", impact: "High", previous: "0.71%" },
    { date: new Date(2026, 0, 13, 19, 0), country: "USA", event: "Inflation Rate YoY DEC", impact: "High", previous: "2.70%" },
    { date: new Date(2026, 0, 13, 20, 30), country: "USA", event: "New Home Sales OCT", impact: "Medium" },
    { date: new Date(2026, 0, 13, 20, 30), country: "USA", event: "New Home Sales SEP", impact: "Medium", actual: "0.71M", previous: "0.8M" },
    { date: new Date(2026, 0, 14, 19, 0), country: "USA", event: "Retail Sales YoY NOV", impact: "Medium", previous: "4.00%" },
    { date: new Date(2026, 0, 14, 20, 30), country: "USA", event: "Existing Home Sales DEC", impact: "Medium", previous: "4.13M" },
    { date: new Date(2026, 0, 16, 19, 45), country: "USA", event: "Industrial Production YoY DEC", impact: "Low", previous: "2.50%" },
    { date: new Date(2026, 0, 19, 7, 30), country: "China", event: "GDP Growth Rate YoY Q4", impact: "High", previous: "4.80%" },
    { date: new Date(2026, 0, 19, 7, 30), country: "China", event: "Industrial Production YoY DEC", impact: "Medium", previous: "4.80%" },
    { date: new Date(2026, 0, 19, 7, 30), country: "China", event: "Retail Sales YoY DEC", impact: "Medium", previous: "1.30%" },
    { date: new Date(2026, 0, 21, 19, 0), country: "USA", event: "Housing Starts DEC", impact: "Medium" },
    { date: new Date(2026, 0, 23, 15, 0), country: "Japan", event: "BoJ Interest Rate Decision", impact: "High", previous: "0.25%" },
    { date: new Date(2026, 0, 27, 10, 30), country: "India", event: "RBI MPC Minutes", impact: "High" },
    { date: new Date(2026, 0, 29, 19, 0), country: "USA", event: "Fed Interest Rate Decision", impact: "High", previous: "4.50%" },
    { date: new Date(2026, 0, 30, 10, 0), country: "Euro Area", event: "ECB Interest Rate Decision", impact: "High", previous: "2.75%" },
    { date: new Date(2026, 0, 30, 19, 0), country: "USA", event: "GDP Growth Rate Q4", impact: "High", previous: "2.80%" },
    // February 2026
    { date: new Date(2026, 1, 3, 10, 0), country: "India", event: "Union Budget 2026-27", impact: "High" },
    { date: new Date(2026, 1, 6, 19, 0), country: "USA", event: "Non Farm Payrolls JAN", impact: "High" },
    { date: new Date(2026, 1, 10, 15, 0), country: "India", event: "RBI Policy Decision", impact: "High", previous: "6.50%" },
    { date: new Date(2026, 1, 12, 19, 0), country: "USA", event: "Inflation Rate YoY JAN", impact: "High" },
    { date: new Date(2026, 1, 16, 7, 30), country: "Japan", event: "GDP Growth Rate Q4", impact: "High" },
    { date: new Date(2026, 1, 18, 7, 30), country: "China", event: "Industrial Production YoY JAN", impact: "Medium" },
    { date: new Date(2026, 1, 25, 19, 0), country: "USA", event: "Consumer Confidence FEB", impact: "Medium" },
    { date: new Date(2026, 1, 28, 14, 0), country: "India", event: "GDP Growth Rate Q3", impact: "High" },
    // March 2026
    { date: new Date(2026, 2, 6, 19, 0), country: "USA", event: "Non Farm Payrolls FEB", impact: "High" },
    { date: new Date(2026, 2, 10, 19, 0), country: "USA", event: "Inflation Rate YoY FEB", impact: "High" },
    { date: new Date(2026, 2, 12, 10, 0), country: "Euro Area", event: "ECB Interest Rate Decision", impact: "High" },
    { date: new Date(2026, 2, 18, 18, 0), country: "USA", event: "Fed Interest Rate Decision", impact: "High" },
    { date: new Date(2026, 2, 19, 15, 0), country: "Japan", event: "BoJ Interest Rate Decision", impact: "High" },
    { date: new Date(2026, 2, 31, 10, 30), country: "India", event: "RBI MPC Minutes", impact: "Medium" },
];

// Stock Results Data
interface StockResult {
    date: Date;
    symbol: string;
    name: string;
    eventType: "Stock Results (Q3)" | "Split" | "Dividend";
    price: number;
    change: number;
    quarter?: string;
    splitRatio?: string;
}

const STOCK_RESULTS: StockResult[] = [
    { date: new Date(2026, 0, 2), symbol: "MCX", name: "Multi Commodity Exchange of India Ltd.", eventType: "Split", price: 2201.00, change: -0.7, splitRatio: "1:5" },
    { date: new Date(2026, 0, 10), symbol: "DMART", name: "Avenue Supermarts Ltd.", eventType: "Stock Results (Q3)", price: 3654.80, change: -1.7, quarter: "Q3 2026" },
    { date: new Date(2026, 0, 12), symbol: "HCLTECH", name: "HCL Technologies Ltd.", eventType: "Stock Results (Q3)", price: 1609.40, change: -1.9, quarter: "Q3 2026" },
    { date: new Date(2026, 0, 12), symbol: "TCS", name: "Tata Consultancy Services Ltd.", eventType: "Stock Results (Q3)", price: 3222.80, change: -0.9, quarter: "Q3 2026" },
    { date: new Date(2026, 0, 13), symbol: "ICICIGI", name: "ICICI Lombard General Insurance Co. Ltd.", eventType: "Stock Results (Q3)", price: 1977.40, change: 0.2, quarter: "Q3 2026" },
    { date: new Date(2026, 0, 13), symbol: "ICICIPRULI", name: "ICICI Prudential Life Insurance Co. Ltd.", eventType: "Stock Results (Q3)", price: 682.85, change: 0.7, quarter: "Q3 2026" },
    { date: new Date(2026, 0, 14), symbol: "INFY", name: "Infosys Ltd.", eventType: "Stock Results (Q3)", price: 1608.20, change: -2.0, quarter: "Q3 2026" },
    { date: new Date(2026, 0, 14), symbol: "HDFCAMC", name: "HDFC Asset Management Co. Ltd.", eventType: "Stock Results (Q3)", price: 2662.60, change: 0.2, quarter: "Q3 2026" },
    { date: new Date(2026, 0, 14), symbol: "KOTAKBANK", name: "Kotak Mahindra Bank Ltd.", eventType: "Split", price: 2190.90, change: -0.2, splitRatio: "1:5" },
    { date: new Date(2026, 0, 15), symbol: "ANGELONE", name: "Angel One Ltd.", eventType: "Stock Results (Q3)", price: 2395.20, change: 0.3, quarter: "Q3 2026" },
    { date: new Date(2026, 0, 15), symbol: "HDFCLIFE", name: "HDFC Life Insurance Co. Ltd.", eventType: "Stock Results (Q3)", price: 759.55, change: 0.6, quarter: "Q3 2026" },
    { date: new Date(2026, 0, 16), symbol: "TECHM", name: "Tech Mahindra Ltd.", eventType: "Stock Results (Q3)", price: 1601.30, change: -0.7, quarter: "Q3 2026" },
    { date: new Date(2026, 0, 16), symbol: "TATATECH", name: "Tata Technologies Ltd.", eventType: "Stock Results (Q3)", price: 652.70, change: -0.5, quarter: "Q3 2026" },
    { date: new Date(2026, 0, 16), symbol: "FEDERALBNK", name: "The Federal Bank Ltd.", eventType: "Stock Results (Q3)", price: 263.65, change: -1.2, quarter: "Q3 2026" },
    { date: new Date(2026, 0, 16), symbol: "POLYCAB", name: "Polycab India Ltd.", eventType: "Stock Results (Q3)", price: 7758.00, change: -0.5, quarter: "Q3 2026" },
    { date: new Date(2026, 0, 17), symbol: "ICICIBANK", name: "ICICI Bank Ltd.", eventType: "Stock Results (Q3)", price: 1372.50, change: 1.3, quarter: "Q3 2026" },
    { date: new Date(2026, 0, 17), symbol: "HDFCBANK", name: "HDFC Bank Ltd.", eventType: "Stock Results (Q3)", price: 978.65, change: -2.3, quarter: "Q3 2026" },
    { date: new Date(2026, 0, 17), symbol: "YESBANK", name: "Yes Bank Ltd.", eventType: "Stock Results (Q3)", price: 22.84, change: 2.5, quarter: "Q3 2026" },
    { date: new Date(2026, 0, 20), symbol: "PERSISTENT", name: "Persistent Systems Ltd.", eventType: "Stock Results (Q3)", price: 6210.50, change: -1.3, quarter: "Q3 2026" },
    { date: new Date(2026, 0, 21), symbol: "DRREDDY", name: "Dr. Reddy's Laboratories Ltd.", eventType: "Stock Results (Q3)", price: 1250.80, change: -0.4, quarter: "Q3 2026" },
    { date: new Date(2026, 0, 22), symbol: "COFORGE", name: "Coforge Ltd.", eventType: "Stock Results (Q3)", price: 1642.00, change: -0.5, quarter: "Q3 2026" },
    { date: new Date(2026, 0, 22), symbol: "MPHASIS", name: "Mphasis Ltd.", eventType: "Stock Results (Q3)", price: 2802.00, change: -0.2, quarter: "Q3 2026" },
    { date: new Date(2026, 0, 22), symbol: "CAMS", name: "Computer Age Management Services Ltd.", eventType: "Stock Results (Q3)", price: 751.90, change: -0.6, quarter: "Q3 2026" },
    { date: new Date(2026, 0, 23), symbol: "JSWSTEEL", name: "JSW Steel Ltd.", eventType: "Stock Results (Q3)", price: 1186.70, change: 0.5, quarter: "Q3 2026" },
    { date: new Date(2026, 0, 23), symbol: "CIPLA", name: "Cipla Ltd.", eventType: "Stock Results (Q3)", price: 1520.50, change: 0.6, quarter: "Q3 2026" },
    { date: new Date(2026, 0, 23), symbol: "GODREJCP", name: "Godrej Consumer Products Ltd.", eventType: "Stock Results (Q3)", price: 1240.20, change: 0.4, quarter: "Q3 2026" },
    { date: new Date(2026, 0, 23), symbol: "ADANIGREEN", name: "Adani Green Energy Ltd.", eventType: "Stock Results (Q3)", price: 1032.40, change: -0.6, quarter: "Q3 2026" },
    { date: new Date(2026, 0, 24), symbol: "ULTRACEMCO", name: "UltraTech Cement Ltd.", eventType: "Stock Results (Q3)", price: 12071.00, change: 1.4, quarter: "Q3 2026" },
    { date: new Date(2026, 0, 27), symbol: "ASIANPAINT", name: "Asian Paints Ltd.", eventType: "Stock Results (Q3)", price: 2819.40, change: 1.7, quarter: "Q3 2026" },
    { date: new Date(2026, 0, 29), symbol: "DABUR", name: "Dabur India Ltd.", eventType: "Stock Results (Q3)", price: 521.45, change: -0.2, quarter: "Q3 2026" },
    { date: new Date(2026, 0, 29), symbol: "BLUESTARCO", name: "Blue Star Ltd.", eventType: "Stock Results (Q3)", price: 1855.00, change: 2.1, quarter: "Q3 2026" },
    { date: new Date(2026, 0, 30), symbol: "NESTLEIND", name: "Nestle India Ltd.", eventType: "Stock Results (Q3)", price: 1315.00, change: 2.8, quarter: "Q3 2026" },
    { date: new Date(2026, 0, 30), symbol: "EXIDEIND", name: "Exide Industries Ltd.", eventType: "Stock Results (Q3)", price: 366.80, change: -0.2, quarter: "Q3 2026" },
    { date: new Date(2026, 0, 30), symbol: "CHOLAFIN", name: "Cholamandalam Inv. & Fin. Co. Ltd.", eventType: "Stock Results (Q3)", price: 1769.60, change: -0.6, quarter: "Q3 2026" },
    { date: new Date(2026, 0, 31), symbol: "IDFCFIRSTB", name: "IDFC First Bank Ltd.", eventType: "Stock Results (Q3)", price: 84.98, change: -1.1, quarter: "Q3 2026" },
    { date: new Date(2026, 1, 4), symbol: "NHPC", name: "NHPC Ltd.", eventType: "Stock Results (Q3)", price: 83.68, change: 0.1, quarter: "Q3 2026" },
    { date: new Date(2026, 1, 6), symbol: "BOSCHLTD", name: "Bosch Ltd.", eventType: "Stock Results (Q3)", price: 39180.00, change: -0.6, quarter: "Q3 2026" },
    { date: new Date(2026, 1, 6), symbol: "SHREECEM", name: "Shree Cement Ltd.", eventType: "Stock Results (Q3)", price: 27615.00, change: 2.1, quarter: "Q3 2026" },
    { date: new Date(2026, 1, 11), symbol: "M&M", name: "Mahindra & Mahindra Ltd.", eventType: "Stock Results (Q3)", price: 3804.80, change: 0.1, quarter: "Q3 2026" },
    { date: new Date(2026, 1, 11), symbol: "MFSL", name: "Max Financial Services Ltd.", eventType: "Stock Results (Q3)", price: 1706.70, change: 2.1, quarter: "Q3 2026" },
    { date: new Date(2026, 1, 12), symbol: "HINDALCO", name: "Hindalco Industries Ltd.", eventType: "Stock Results (Q3)", price: 932.10, change: 0.7, quarter: "Q3 2026" },
    { date: new Date(2026, 1, 13), symbol: "KFINTECH", name: "Kfin Technologies Ltd.", eventType: "Stock Results (Q3)", price: 1087.50, change: 0.5, quarter: "Q3 2026" },
    { date: new Date(2026, 1, 19), symbol: "ABB", name: "ABB India Ltd.", eventType: "Stock Results (Q3)", price: 5168.50, change: -0.7, quarter: "Q3 2026" },
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
                                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
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
                                            {result.quarter || result.splitRatio}
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
