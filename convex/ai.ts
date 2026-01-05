"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export const chat = action({
    args: {
        message: v.string(),
        portfolioContext: v.optional(v.string()),
        newsContext: v.optional(v.string()),
        investorProfile: v.optional(v.string()),
    },
    handler: async (ctx, { message, portfolioContext, newsContext, investorProfile }) => {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

            const systemPrompt = `You are Tracko AI, a helpful portfolio assistant for Indian stock market investors.

${investorProfile ? `## Investor Profile\n${investorProfile}\n` : ""}

${portfolioContext ? `## Current Portfolio\n${portfolioContext}\n` : "No portfolio data available."}

${newsContext ? `## Recent Market News (for context)\n${newsContext}\n` : ""}

## Your Role
- Analyze the user's portfolio and provide insights
- Answer questions about their investments
- Suggest improvements based on their risk profile
- Explain market news and its impact on their holdings
- Provide data-driven recommendations

## Guidelines
- Always be helpful and informative
- Base recommendations on the latest news provided
- Consider the investor's risk profile when giving advice
- Use ₹ for Indian stocks and $ for US stocks
- Be concise but thorough
- If you don't have enough information, ask clarifying questions

Respond in a conversational tone. Format responses with markdown for readability.`;

            const result = await model.generateContent([
                { text: systemPrompt },
                { text: `User: ${message}` },
            ]);

            const response = result.response;
            const text = response.text();

            return { success: true, response: text };
        } catch (error) {
            console.error("AI chat error:", error);
            return {
                success: false,
                response: "I'm having trouble processing your request. Please try again later.",
                error: error instanceof Error ? error.message : "Unknown error"
            };
        }
    },
});
