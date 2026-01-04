"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Indian Market Holidays for 2025-2026
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

// US Market Holidays for 2026
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
    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

function getDaysUntil(date: Date): number {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const diff = date.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getUpcomingHoliday(holidays: typeof INDIAN_HOLIDAYS) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return holidays.find((h) => h.date >= now);
}

export default function CalendarPage() {
    const [showUsMarket, setShowUsMarket] = useState(false);

    const holidays = showUsMarket ? US_HOLIDAYS : INDIAN_HOLIDAYS;
    const upcomingHoliday = getUpcomingHoliday(holidays);
    const daysUntilNext = upcomingHoliday ? getDaysUntil(upcomingHoliday.date) : 0;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Market Calendar</h1>
                <p className="text-muted-foreground">Track market holidays and important dates</p>
            </div>

            <Tabs defaultValue="holidays">
                <TabsList>
                    <TabsTrigger value="economic">Economic Calendar</TabsTrigger>
                    <TabsTrigger value="results">Stock Results Calendar</TabsTrigger>
                    <TabsTrigger value="holidays">Holiday Calendar</TabsTrigger>
                </TabsList>

                <TabsContent value="economic" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Economic Events</CardTitle>
                            <CardDescription>Important economic announcements and data releases</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-10 text-muted-foreground">
                                <p>Economic calendar coming soon...</p>
                                <p className="text-sm mt-2">Track RBI policy announcements, GDP data, inflation reports, and more.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="results" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quarterly Results</CardTitle>
                            <CardDescription>Upcoming earnings announcements for your portfolio stocks</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-10 text-muted-foreground">
                                <p>Results calendar coming soon...</p>
                                <p className="text-sm mt-2">Track quarterly earnings dates for stocks in your portfolio.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="holidays" className="space-y-4">
                    {/* Upcoming Holiday Banner */}
                    {upcomingHoliday && (
                        <Card className="bg-primary/5 border-primary/20">
                            <CardContent className="py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-3 w-3 rounded-full bg-primary" />
                                        <span className="font-medium">
                                            Upcoming Holiday: {formatDate(upcomingHoliday.date)}, {upcomingHoliday.day} ({daysUntilNext} days) — {upcomingHoliday.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Label htmlFor="us-market" className="text-sm text-muted-foreground">
                                            Show US Market Holidays
                                        </Label>
                                        <Switch
                                            id="us-market"
                                            checked={showUsMarket}
                                            onCheckedChange={setShowUsMarket}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Holiday Table */}
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
                                            <TableRow
                                                key={`${holiday.date.toISOString()}-${holiday.name}`}
                                                className={`${isPast ? "text-muted-foreground" : ""} ${isNext ? "bg-primary/5" : ""}`}
                                            >
                                                <TableCell className={isNext ? "text-primary font-medium" : ""}>{index + 1}</TableCell>
                                                <TableCell className={isNext ? "font-medium" : ""}>{formatDate(holiday.date)}</TableCell>
                                                <TableCell className={isNext ? "font-medium" : ""}>{holiday.day}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg">{showUsMarket ? "🇺🇸" : "🇮🇳"}</span>
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
