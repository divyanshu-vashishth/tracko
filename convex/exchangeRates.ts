"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

// Cache exchange rates in memory (refreshed per action call, but reduces API calls)
let cachedRates: { rates: Record<string, number>; timestamp: number; base: string } | null = null;
const CACHE_TTL = 1000 * 60 * 60; // 1 hour cache

export const getExchangeRates = action({
    args: { baseCurrency: v.string() },
    handler: async (ctx, { baseCurrency }) => {
        // Check cache
        const now = Date.now();
        if (
            cachedRates &&
            cachedRates.base === baseCurrency &&
            now - cachedRates.timestamp < CACHE_TTL
        ) {
            return cachedRates.rates;
        }

        try {
            // Use frankfurter.app - free, no API key required
            const response = await fetch(
                `https://api.frankfurter.app/latest?from=${baseCurrency}`
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch exchange rates: ${response.status}`);
            }

            const data = await response.json();

            // Cache the rates
            cachedRates = {
                rates: data.rates,
                timestamp: now,
                base: baseCurrency,
            };

            return data.rates as Record<string, number>;
        } catch (error) {
            console.error("Error fetching exchange rates:", error);
            // Return fallback rates if API fails
            return {
                USD: baseCurrency === "INR" ? 0.012 : 1,
                INR: baseCurrency === "USD" ? 83.5 : 1,
                EUR: baseCurrency === "USD" ? 0.92 : 0.011,
                GBP: baseCurrency === "USD" ? 0.79 : 0.0095,
            };
        }
    },
});

// Helper to convert currency
export const convertCurrency = action({
    args: {
        amount: v.number(),
        fromCurrency: v.string(),
        toCurrency: v.string(),
    },
    handler: async (ctx, { amount, fromCurrency, toCurrency }) => {
        if (fromCurrency === toCurrency) {
            return amount;
        }

        try {
            const response = await fetch(
                `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
            );

            if (!response.ok) {
                throw new Error(`Failed to convert currency: ${response.status}`);
            }

            const data = await response.json();
            return data.rates[toCurrency] as number;
        } catch (error) {
            console.error("Error converting currency:", error);
            // Fallback conversion
            const fallbackRates: Record<string, number> = {
                "USD-INR": 83.5,
                "INR-USD": 0.012,
                "EUR-INR": 90.5,
                "INR-EUR": 0.011,
            };
            const key = `${fromCurrency}-${toCurrency}`;
            const rate = fallbackRates[key] || 1;
            return amount * rate;
        }
    },
});
