"use node"
import { action } from "./_generated/server";
import { v } from "convex/values";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Parsed holding from screenshot
export interface ParsedHolding {
    symbol: string;
    name: string | null;
    quantity: number;
    avgPrice: number;
    currency: string;
}

export const parsePortfolioScreenshot = action({
    args: {
        imageBase64: v.string(),
        mimeType: v.string()
    },
    handler: async (ctx, { imageBase64, mimeType }): Promise<ParsedHolding[]> => {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY environment variable is not set");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Analyze this portfolio/holdings screenshot and extract all stock holdings.

For each stock/holding found, extract:
- symbol: The stock ticker symbol (e.g., "ATHERENE", "RELIANCE", "AAPL"). If not directly visible, infer from the company name.
- name: The company/stock name if visible, otherwise null
- quantity: Number of shares/units owned (as a number)
- avgPrice: The average purchase price or buy average (as a number)
- currency: The currency (usually "INR" for Indian stocks, "USD" for US stocks). Infer from the context.

IMPORTANT:
- Return ONLY a valid JSON array, no markdown formatting, no code blocks
- Each object must have: symbol (string), name (string|null), quantity (number), avgPrice (number), currency (string)
- If a field cannot be determined, use reasonable defaults (quantity: 0, avgPrice: 0)
- Convert any formatted numbers (like "1,234.56") to plain numbers (1234.56)

Example output:
[{"symbol":"ATHERENE","name":"Ather Energy","quantity":2,"avgPrice":646.75,"currency":"INR"}]`;

        try {
            const result = await model.generateContent([
                {
                    inlineData: {
                        data: imageBase64,
                        mimeType: mimeType as "image/png" | "image/jpeg" | "image/webp" | "image/heic" | "image/heif"
                    }
                },
                prompt
            ]);

            const responseText = result.response.text().trim();

            // Clean up response - remove any markdown code blocks if present
            let jsonStr = responseText;
            if (jsonStr.startsWith("```")) {
                jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
            }

            const holdings: ParsedHolding[] = JSON.parse(jsonStr);

            // Validate and clean the parsed data
            return holdings.map((h) => ({
                symbol: String(h.symbol || "UNKNOWN").toUpperCase().trim(),
                name: h.name ? String(h.name).trim() : null,
                quantity: typeof h.quantity === "number" ? h.quantity : parseFloat(String(h.quantity)) || 0,
                avgPrice: typeof h.avgPrice === "number" ? h.avgPrice : parseFloat(String(h.avgPrice)) || 0,
                currency: String(h.currency || "INR").toUpperCase().trim(),
            }));
        } catch (error) {
            console.error("Failed to parse portfolio screenshot:", error);
            throw new Error(`Failed to analyze screenshot: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    },
});
