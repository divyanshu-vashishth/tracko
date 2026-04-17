import { Agent, createThread, listUIMessages, saveMessage } from "@convex-dev/agent";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { components, internal } from "./_generated/api";
import { internalAction, mutation, query } from "./_generated/server";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY,
});

const trackoAgent = new Agent(components.agent, {
  name: "Tracko AI",
  languageModel: google("gemini-2.0-flash"),
  maxSteps: 4,
  instructions: `You are Tracko AI, a portfolio assistant for Indian and US stock market investors.

Core responsibilities:
- Analyze portfolio allocations, diversification, and concentration risks.
- Explain impact of recent market news on holdings.
- Suggest practical next actions based on risk profile and goals.
- Use clear markdown structure and concise bullet points when useful.

Guidelines:
- Prefer data-backed reasoning and include caveats where data is incomplete.
- Ask a clarifying question when user intent is ambiguous.
- Use ₹ for Indian equity examples and $ for US equity examples.
- Never claim certainty for future price movement.`,
});

const buildDynamicContext = (args: {
  portfolioContext?: string;
  newsContext?: string;
  investorProfile?: string;
}) => {
  const portfolioSection = args.portfolioContext
    ? `## Current Portfolio Snapshot\n${args.portfolioContext}`
    : "## Current Portfolio Snapshot\nNo portfolio data available.";
  const profileSection = args.investorProfile
    ? `## Investor Profile\n${args.investorProfile}`
    : "";
  const newsSection = args.newsContext
    ? `## Recent Market News\n${args.newsContext}`
    : "";

  return `${portfolioSection}

${profileSection}

${newsSection}

Instruction: treat the above context as the latest available user data.`;
};

export const ensureThread = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("aiThreads")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (existing) return { threadId: existing.threadId };

    const threadId = await createThread(ctx, components.agent, {
      userId,
      title: "Tracko AI Chat",
    });
    await ctx.db.insert("aiThreads", {
      userId,
      threadId,
      updatedAt: Date.now(),
    });
    return { threadId };
  },
});

export const getThread = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const thread = await ctx.db
      .query("aiThreads")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    return thread ? { threadId: thread.threadId } : null;
  },
});

export const listThreadMessages = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const ownsThread = await ctx.db
      .query("aiThreads")
      .withIndex("by_user_thread", (q) =>
        q.eq("userId", userId).eq("threadId", args.threadId),
      )
      .first();

    if (!ownsThread) throw new Error("Unauthorized thread access");

    return listUIMessages(ctx, components.agent, {
      threadId: args.threadId,
      paginationOpts: args.paginationOpts,
    });
  },
});

export const sendMessage = mutation({
  args: {
    prompt: v.string(),
    portfolioContext: v.optional(v.string()),
    newsContext: v.optional(v.string()),
    investorProfile: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("aiThreads")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    const threadId =
      existing?.threadId ??
      (await createThread(ctx, components.agent, {
        userId,
        title: "Tracko AI Chat",
      }));

    if (!existing) {
      await ctx.db.insert("aiThreads", {
        userId,
        threadId,
        updatedAt: Date.now(),
      });
    }

    const { messageId } = await saveMessage(ctx, components.agent, {
      threadId,
      userId,
      prompt: args.prompt.trim(),
    });

    const dynamicContext = buildDynamicContext({
      portfolioContext: args.portfolioContext,
      newsContext: args.newsContext,
      investorProfile: args.investorProfile,
    });

    await ctx.scheduler.runAfter(0, internal.ai.generateResponseAsync, {
      threadId,
      promptMessageId: messageId,
      dynamicContext,
    });

    if (existing) {
      await ctx.db.patch(existing._id, { updatedAt: Date.now() });
    }

    return { threadId, messageId };
  },
});

export const generateResponseAsync = internalAction({
  args: {
    threadId: v.string(),
    promptMessageId: v.string(),
    dynamicContext: v.string(),
  },
  handler: async (ctx, args) => {
    await trackoAgent.generateText(
      ctx,
      { threadId: args.threadId },
      {
        promptMessageId: args.promptMessageId,
        system: args.dynamicContext,
      },
    );
  },
});

export const clearThread = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const thread = await ctx.db
      .query("aiThreads")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!thread) {
      const threadId = await createThread(ctx, components.agent, {
        userId,
        title: "Tracko AI Chat",
      });
      await ctx.db.insert("aiThreads", { userId, threadId, updatedAt: Date.now() });
      return { threadId };
    }

    await trackoAgent.deleteThreadAsync(ctx, { threadId: thread.threadId });

    const threadId = await createThread(ctx, components.agent, {
      userId,
      title: "Tracko AI Chat",
    });
    await ctx.db.patch(thread._id, { threadId, updatedAt: Date.now() });

    return { threadId };
  },
});
