import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const bookmarkNews = mutation({
  args: {
    title: v.string(),
    contentSnippet: v.optional(v.string()),
    source: v.string(),
    url: v.string(),
    publishedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existingId = await ctx.db
      .query("newsBookmarks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("url"), args.url))
      .first();

    if (existingId) return existingId._id;

    return await ctx.db.insert("newsBookmarks", {
      userId,
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const removeBookmark = mutation({
  args: {
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("newsBookmarks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("url"), args.url))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

export const getBookmarks = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    
    return await ctx.db
      .query("newsBookmarks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});
