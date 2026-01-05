import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get all journal entries for a user (for calendar view)
export const getJournalEntries = query({
    args: {
        year: v.optional(v.number()),
        month: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];

        const entries = await ctx.db
            .query("journalEntries")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        // Filter by year/month if provided
        if (args.year !== undefined && args.month !== undefined) {
            return entries.filter((entry) => {
                const date = new Date(entry.date);
                return date.getFullYear() === args.year && date.getMonth() === args.month;
            });
        }

        return entries;
    },
});

// Get single journal entry by date
export const getJournalEntry = query({
    args: {
        date: v.number(), // Start of day timestamp
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const entry = await ctx.db
            .query("journalEntries")
            .withIndex("by_user_date", (q) =>
                q.eq("userId", userId).eq("date", args.date)
            )
            .first();

        return entry;
    },
});

// Create or update journal entry
export const upsertJournalEntry = mutation({
    args: {
        date: v.number(),
        netPnL: v.number(),
        tradeCount: v.number(),
        tradeInsights: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        // Check if entry exists for this date
        const existing = await ctx.db
            .query("journalEntries")
            .withIndex("by_user_date", (q) =>
                q.eq("userId", userId).eq("date", args.date)
            )
            .first();

        if (existing) {
            // Update existing
            await ctx.db.patch(existing._id, {
                netPnL: args.netPnL,
                tradeCount: args.tradeCount,
                tradeInsights: args.tradeInsights,
                updatedAt: Date.now(),
            });
            return existing._id;
        } else {
            // Create new
            return await ctx.db.insert("journalEntries", {
                userId,
                date: args.date,
                netPnL: args.netPnL,
                tradeCount: args.tradeCount,
                tradeInsights: args.tradeInsights,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
        }
    },
});

// Delete journal entry
export const deleteJournalEntry = mutation({
    args: {
        id: v.id("journalEntries"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const entry = await ctx.db.get(args.id);
        if (!entry || entry.userId !== userId) {
            throw new Error("Entry not found or unauthorized");
        }

        await ctx.db.delete(args.id);
    },
});
