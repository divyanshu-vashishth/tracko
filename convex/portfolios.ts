import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getHoldings = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const holdings = await ctx.db
      .query("holdings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return holdings;
  },
});

export const getPortfolioSummary = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return {
        totalValue: 0,
        totalCost: 0,
        totalGain: 0,
        totalGainPercent: 0,
      };
    }

    const holdings = await ctx.db
      .query("holdings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const totalValue = holdings.reduce((sum, h) => sum + (h.totalValue || 0), 0);
    const totalCost = holdings.reduce((sum, h) => sum + (h.shares * h.avgPurchasePrice), 0);
    const totalGain = totalValue - totalCost;
    const totalGainPercent = totalCost === 0 ? 0 : ((totalGain / totalCost) * 100);

    return {
      totalValue,
      totalCost,
      totalGain,
      totalGainPercent,
    };
  },
});


export const addHolding = mutation({
  args: {
    symbol: v.string(),
    name: v.string(),
    shares: v.number(),
    price: v.number(),
    sector: v.optional(v.string()),
    currency: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    let portfolio = await ctx.db
      .query("portfolios")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!portfolio) {
      const portfolioId = await ctx.db.insert("portfolios", {
        userId,
        name: "My Portfolio",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      portfolio = await ctx.db.get(portfolioId);
    }

    if (!portfolio) throw new Error("Failed to create portfolio");

    // Check if holding exists
    const existingHolding = await ctx.db
      .query("holdings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("symbol"), args.symbol))
      .first();

    if (existingHolding) {
      // Update existing holding (average price calculation)
      const totalShares = existingHolding.shares + args.shares;
      const totalCost = (existingHolding.shares * existingHolding.avgPurchasePrice) + (args.shares * args.price);
      const newAvgPrice = totalCost / totalShares;

      await ctx.db.patch(existingHolding._id, {
        shares: totalShares,
        avgPurchasePrice: newAvgPrice,
        currency: args.currency || existingHolding.currency, // Update currency if provided
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("holdings", {
        userId,
        portfolioId: portfolio._id,
        symbol: args.symbol,
        name: args.name,
        shares: args.shares,
        avgPurchasePrice: args.price,
        currentPrice: args.price,
        totalValue: args.shares * args.price,
        sector: args.sector,
        currency: args.currency,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  }
});

export const updateHolding = mutation({
  args: {
    id: v.id("holdings"),
    shares: v.optional(v.number()),
    price: v.optional(v.number()),
    currency: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const holding = await ctx.db.get(args.id);
    if (!holding || holding.userId !== userId) {
      throw new Error("Holding not found or unauthorized");
    }

    const updates: any = { updatedAt: Date.now() };
    if (args.shares !== undefined) updates.shares = args.shares;
    if (args.price !== undefined) updates.avgPurchasePrice = args.price;
    if (args.currency !== undefined) updates.currency = args.currency;

    // Recalculate total value if shares changed (using currentPrice if available, else avgPrice)
    if (args.shares !== undefined) {
      const price = holding.currentPrice || (args.price ?? holding.avgPurchasePrice);
      updates.totalValue = args.shares * price;
    }

    await ctx.db.patch(args.id, updates);
  }
});

export const deleteHolding = mutation({
  args: {
    id: v.id("holdings"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const holding = await ctx.db.get(args.id);
    if (!holding || holding.userId !== userId) {
      throw new Error("Holding not found or unauthorized");
    }

    await ctx.db.delete(args.id);
  }
});

// Get user preferences including investor profile
export const getUserPreferences = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const preferences = await ctx.db
      .query("userPreferences")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return preferences;
  },
});

// Update user preferences including investor profile
export const updateUserPreferences = mutation({
  args: {
    currency: v.optional(v.string()),
    investorProfile: v.optional(
      v.object({
        riskAppetite: v.union(v.literal("aggressive"), v.literal("moderate"), v.literal("defensive")),
        investmentHorizon: v.optional(v.string()),
        investmentGoals: v.optional(v.string()),
        monthlyInvestment: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("userPreferences")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...(args.currency && { currency: args.currency }),
        ...(args.investorProfile && { investorProfile: args.investorProfile }),
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("userPreferences", {
        userId,
        currency: args.currency,
        investorProfile: args.investorProfile,
        updatedAt: Date.now(),
      });
    }
  },
});