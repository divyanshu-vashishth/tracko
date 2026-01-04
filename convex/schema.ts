import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  // Your other tables...
  portfolios: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  holdings: defineTable({
    portfolioId: v.id("portfolios"),
    userId: v.id("users"),
    symbol: v.string(), // Stock ticker symbol (e.g., "AAPL")
    name: v.string(), // Company name
    shares: v.number(), // Number of shares owned
    avgPurchasePrice: v.number(), // Average purchase price per share
    currentPrice: v.optional(v.number()), // Current market price (cached)
    totalValue: v.optional(v.number()), // Total value of holding (shares * currentPrice)
    sector: v.optional(v.string()), // Stock sector (Technology, Healthcare, etc.)
    currency: v.optional(v.string()), // Currency (e.g., "USD", "INR")
    purchaseDate: v.optional(v.number()), // Date when stock was purchased (Unix timestamp)
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_portfolio", ["portfolioId"])
    .index("by_user", ["userId"])
    .index("by_symbol", ["symbol"]),
  transactions: defineTable({
    portfolioId: v.id("portfolios"),
    userId: v.id("users"),
    holdingId: v.optional(v.id("holdings")), // Reference to holding if applicable
    type: v.union(v.literal("buy"), v.literal("sell"), v.literal("dividend")),
    symbol: v.string(),
    shares: v.number(),
    pricePerShare: v.number(),
    totalAmount: v.number(),
    transactionDate: v.number(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_portfolio", ["portfolioId"])
    .index("by_user", ["userId"])
    .index("by_date", ["transactionDate"]),

  // Watchlist table - stocks user is monitoring
  watchlist: defineTable({
    userId: v.id("users"),
    symbol: v.string(),
    name: v.string(),
    currentPrice: v.optional(v.number()),
    targetPrice: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_symbol", ["symbol"]),

  // Price History table - cached historical price data
  priceHistory: defineTable({
    symbol: v.string(),
    date: v.number(), // Unix timestamp for the date
    open: v.number(),
    high: v.number(),
    low: v.number(),
    close: v.number(),
    volume: v.number(),
  })
    .index("by_symbol", ["symbol"])
    .index("by_symbol_and_date", ["symbol", "date"]),

  // User Preferences table
  userPreferences: defineTable({
    userId: v.id("users"),
    currency: v.optional(v.string()), // Default: "USD"
    theme: v.optional(v.union(v.literal("light"), v.literal("dark"), v.literal("system"))),
    notifications: v.optional(
      v.object({
        email: v.boolean(),
        priceAlerts: v.boolean(),
        newsAlerts: v.boolean(),
      })
    ),
    defaultPortfolioId: v.optional(v.id("portfolios")),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // News Bookmarks table - saved news articles
  newsBookmarks: defineTable({
    userId: v.id("users"),
    title: v.string(),
    source: v.string(),
    url: v.string(),
    publishedAt: v.number(),
    symbol: v.optional(v.string()), // Related stock symbol if applicable
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});

export default schema;