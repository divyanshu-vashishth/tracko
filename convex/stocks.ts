"use node"
import { action } from "./_generated/server";
import { v } from "convex/values";
import YahooFinance from "yahoo-finance2";
import { sanitize } from "../lib/Sanitize";

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });


export const getQuotes = action({
  args: { symbols: v.array(v.string()) },
  handler: async (ctx, { symbols }) => {
    if (symbols.length === 0) return [];

    try {
      const quotes = await yahooFinance.quote(symbols);
      return sanitize(quotes);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      // Fallback: try fetching individually if batch fails (sometimes YF API is finicky with mixed valid/invalid symbols)
      const results: any[] = [];
      for (const symbol of symbols) {
        try {
          const quote = await yahooFinance.quote(symbol);
          results.push(quote);
        } catch (e) {
          console.error(`Failed to fetch quote for ${symbol}`, e);
        }
      }
      return sanitize(results);
    }
  },
});

export const searchStocks = action({
  args: { query: v.string() },
  handler: async (ctx, { query }) => {
    if (!query) return [];
    try {
      const results = await yahooFinance.search(query, { quotesCount: 20, newsCount: 0 });
      // Filter for common tradeable assets to reduce noise
      const quotes = results.quotes.filter((q: any) =>
        q.isYahooFinance !== false &&
        ['EQUITY', 'ETF', 'MUTUALFUND', 'INDEX', 'CURRENCY', 'CRYPTOCURRENCY', 'FUTURE', 'OPTION'].includes(q.quoteType)
      );
      return sanitize(quotes);
    } catch (error) {
      console.error("Error searching stocks:", error);
      return [];
    }
  },
});

// Fetch single stock quote with price and currency
export const getStockQuote = action({
  args: { symbol: v.string() },
  handler: async (ctx, { symbol }) => {
    try {
      const quote = await yahooFinance.quote(symbol);
      return sanitize({
        symbol: quote.symbol,
        regularMarketPrice: quote.regularMarketPrice,
        currency: quote.currency || "USD", // Default to USD if not available
        shortName: quote.shortName,
        longName: quote.longName,
      });
    } catch (error) {
      console.error(`Failed to fetch quote for ${symbol}:`, error);
      return null;
    }
  },
});

export const getHistoricalPrices = action({
  args: {
    symbols: v.array(v.string()),
    period1: v.string(), // Start date (YYYY-MM-DD or ISO)
    interval: v.string(), // "1d", "1wk", "1mo"
  },
  handler: async (ctx, { symbols, period1, interval }) => {
    if (symbols.length === 0) return {};

    const results: Record<string, any[]> = {};
    const validInterval = ["1d", "1wk", "1mo"].includes(interval) ? (interval as "1d" | "1wk" | "1mo") : "1d";

    await Promise.all(symbols.map(async (symbol) => {
      try {
        const history = await yahooFinance.chart(symbol, {
          period1,
          period2: new Date().toISOString(),
          interval: validInterval,
        });
        results[symbol] = sanitize(history.quotes || history);
      } catch (error) {
        console.error(`Error fetching history for ${symbol}:`, error);
        results[symbol] = [];
      }
    }));

    return results;
  },
});

// Resolve a symbol to its Yahoo Finance equivalent
// Handles cases like "GOLDBEES-E" -> "GOLDBEES.NS"
export const resolveSymbol = action({
  args: {
    symbol: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, { symbol, name }) => {
    // Clean the symbol - remove common suffixes like -E, -BE, etc.
    const cleanSymbol = symbol.replace(/-[A-Z]+$/, "").toUpperCase();

    // Try different variations
    const variations = [
      symbol,
      cleanSymbol,
      `${cleanSymbol}.NS`, // NSE India
      `${cleanSymbol}.BO`, // BSE India
    ];

    // First try direct quote for each variation
    for (const sym of variations) {
      try {
        const quote = await yahooFinance.quote(sym);
        if (quote && quote.symbol && quote.regularMarketPrice) {
          return sanitize({
            resolvedSymbol: quote.symbol,
            name: quote.shortName || quote.longName || name,
            price: quote.regularMarketPrice,
            currency: quote.currency || "INR",
            exchange: quote.exchange,
          });
        }
      } catch {
        // Continue to next variation
      }
    }

    // If direct quotes fail, try search
    const searchQuery = name || cleanSymbol;
    try {
      const results = await yahooFinance.search(searchQuery, { quotesCount: 5, newsCount: 0 });
      const match = results.quotes.find((q: any) => {
        const qSymbol = q.symbol?.toUpperCase() || "";
        return qSymbol.startsWith(cleanSymbol) ||
          qSymbol.replace(/\.(NS|BO)$/, "") === cleanSymbol;
      });

      if (match && match.symbol) {
        const matchSymbol = match.symbol as string;
        // Get the actual quote to get price
        try {
          const quote = await yahooFinance.quote(matchSymbol);
          if (quote) {
            return sanitize({
              resolvedSymbol: quote.symbol,
              name: quote.shortName || quote.longName || match.shortname || name,
              price: quote.regularMarketPrice,
              currency: quote.currency || "INR",
              exchange: quote.exchange,
            });
          }
        } catch {
          // Return match without price
          return sanitize({
            resolvedSymbol: match.symbol,
            name: match.shortname || match.longname || name,
            price: null,
            currency: "INR",
            exchange: match.exchange,
          });
        }
      }
    } catch (error) {
      console.error(`Search failed for ${searchQuery}:`, error);
    }

    // Return null if nothing found
    return null;
  },
});
