"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface JournalEntry {
    _id: string;
    date: number;
    netPnL: number;
    tradeCount: number;
    tradeInsights?: string;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function getStartOfDay(date: Date): number {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
}

function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
    return new Date(year, month, 1).getDay();
}

export default function JournalPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form state
    const [netPnL, setNetPnL] = useState<number>(0);
    const [tradeCount, setTradeCount] = useState<number>(0);
    const [tradeInsights, setTradeInsights] = useState<string>("");

    const entries = useQuery(api.journal.getJournalEntries, {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth(),
    });
    const upsertEntry = useMutation(api.journal.upsertJournalEntry);
    const deleteEntry = useMutation(api.journal.deleteJournalEntry);

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

    // Create a map for quick lookup
    const entriesMap = useMemo(() => {
        const map = new Map<number, JournalEntry>();
        entries?.forEach((entry: any) => {
            map.set(entry.date, entry);
        });
        return map;
    }, [entries]);

    const navigateMonth = (delta: number) => {
        setCurrentDate(new Date(currentYear, currentMonth + delta, 1));
    };

    const openDayDialog = (day: number) => {
        const date = new Date(currentYear, currentMonth, day);
        const dateKey = getStartOfDay(date);
        const existing = entriesMap.get(dateKey);

        setSelectedDate(date);
        setNetPnL(existing?.netPnL || 0);
        setTradeCount(existing?.tradeCount || 0);
        setTradeInsights(existing?.tradeInsights || "");
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (!selectedDate) return;

        try {
            await upsertEntry({
                date: getStartOfDay(selectedDate),
                netPnL,
                tradeCount,
                tradeInsights: tradeInsights || undefined,
            });
            toast.success("Journal entry saved!");
            setIsDialogOpen(false);
        } catch (error) {
            toast.error("Failed to save entry");
            console.error(error);
        }
    };

    const handleDelete = async () => {
        if (!selectedDate) return;
        const dateKey = getStartOfDay(selectedDate);
        const existing = entriesMap.get(dateKey);
        if (!existing) return;

        try {
            await deleteEntry({ id: existing._id as any });
            toast.success("Journal entry deleted");
            setIsDialogOpen(false);
        } catch (error) {
            toast.error("Failed to delete entry");
            console.error(error);
        }
    };

    // Generate calendar days
    const calendarDays = [];

    // Empty cells for days before the 1st
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(null);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = getStartOfDay(new Date(currentYear, currentMonth, day));
        calendarDays.push({ day, entry: entriesMap.get(dateKey) });
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Trading Journal</h1>
                <p className="text-muted-foreground">Track your daily trades and P&L</p>
            </div>

            {/* Calendar Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => navigateMonth(-1)}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-xl font-semibold min-w-[180px] text-center">
                        {MONTHS[currentMonth]} {currentYear}
                    </h2>
                    <Button variant="outline" size="icon" onClick={() => navigateMonth(1)}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <Button onClick={() => {
                    const today = new Date();
                    setSelectedDate(today);
                    const dateKey = getStartOfDay(today);
                    const existing = entriesMap.get(dateKey);
                    setNetPnL(existing?.netPnL || 0);
                    setTradeCount(existing?.tradeCount || 0);
                    setTradeInsights(existing?.tradeInsights || "");
                    setIsDialogOpen(true);
                }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Today
                </Button>
            </div>

            {/* Calendar Grid */}
            <div className="border rounded-lg overflow-hidden">
                {/* Day Headers */}
                <div className="grid grid-cols-7 bg-muted">
                    {DAYS.map((day) => (
                        <div key={day} className="py-3 text-center text-sm font-medium text-muted-foreground">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Cells */}
                <div className="grid grid-cols-7">
                    {calendarDays.map((cell, index) => (
                        <div
                            key={index}
                            onClick={() => cell && openDayDialog(cell.day)}
                            className={cn(
                                "min-h-[100px] border-t border-r p-2 cursor-pointer transition-colors hover:bg-muted/50",
                                "last:border-r-0 [&:nth-child(7n)]:border-r-0",
                                !cell && "bg-muted/20 cursor-default"
                            )}
                        >
                            {cell && (
                                <>
                                    <div className="text-sm font-medium mb-1">{cell.day}</div>
                                    {cell.entry ? (
                                        <div
                                            className={cn(
                                                "rounded-md p-2 text-center",
                                                cell.entry.netPnL >= 0
                                                    ? "bg-green-500/20 text-green-700 dark:text-green-400"
                                                    : "bg-red-500/20 text-red-700 dark:text-red-400"
                                            )}
                                        >
                                            <div className="text-sm font-semibold">
                                                {cell.entry.netPnL >= 0 ? "+" : ""}₹{cell.entry.netPnL.toLocaleString()}
                                            </div>
                                            <div className="text-xs opacity-80">
                                                {cell.entry.tradeCount} trade{cell.entry.tradeCount !== 1 ? "s" : ""}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-xs text-muted-foreground text-center mt-4">
                                            Click to add
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Entry Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedDate?.toLocaleDateString("en-IN", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="netPnL">Net P&L (₹)</Label>
                                <Input
                                    id="netPnL"
                                    type="number"
                                    value={netPnL}
                                    onChange={(e) => setNetPnL(parseFloat(e.target.value) || 0)}
                                    placeholder="e.g., 5000 or -2000"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tradeCount">Number of Trades</Label>
                                <Input
                                    id="tradeCount"
                                    type="number"
                                    min="0"
                                    value={tradeCount}
                                    onChange={(e) => setTradeCount(parseInt(e.target.value) || 0)}
                                    placeholder="e.g., 5"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tradeInsights">Trade Insights</Label>
                            <p className="text-xs text-muted-foreground">What did you trade? Why? What did you learn?</p>
                            <Textarea
                                id="tradeInsights"
                                value={tradeInsights}
                                onChange={(e) => setTradeInsights(e.target.value)}
                                placeholder="e.g., Traded RELIANCE based on VWAP bounce. Risk was 0.5R. Entry was good but exit was too early. Need to hold for target."
                                rows={5}
                            />
                        </div>
                    </div>

                    <DialogFooter className="flex justify-between">
                        {entriesMap.get(selectedDate ? getStartOfDay(selectedDate) : 0) && (
                            <Button variant="destructive" onClick={handleDelete}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        )}
                        <div className="flex gap-2 ml-auto">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave}>Save Entry</Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
