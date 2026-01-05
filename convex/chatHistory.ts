import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get chat history for user
export const getChatHistory = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const history = await ctx.db
            .query("chatHistory")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        return history;
    },
});

// Save chat messages
export const saveChatHistory = mutation({
    args: {
        messages: v.array(
            v.object({
                role: v.union(v.literal("user"), v.literal("assistant")),
                content: v.string(),
                timestamp: v.number(),
            })
        ),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const existing = await ctx.db
            .query("chatHistory")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                messages: args.messages,
                updatedAt: Date.now(),
            });
            return existing._id;
        } else {
            return await ctx.db.insert("chatHistory", {
                userId,
                messages: args.messages,
                updatedAt: Date.now(),
            });
        }
    },
});

// Clear chat history
export const clearChatHistory = mutation({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const existing = await ctx.db
            .query("chatHistory")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        if (existing) {
            await ctx.db.delete(existing._id);
        }
    },
});
