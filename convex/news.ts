"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import Parser from "rss-parser";

const parser = new Parser();
const MARKET_FEED_URL = "https://www.cnbctv18.com/commonfeeds/v1/cne/rss/market.xml";

export const getMarketNews = action({
  args: {},
  handler: async () => {
    try {
      const feed = await parser.parseURL(MARKET_FEED_URL);
      
      // Transform RSS items into a cleaner format for our frontend
      return feed.items.map((item) => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        content: item.content,
        contentSnippet: item.contentSnippet,
        guid: item.guid,
        isoDate: item.isoDate,
        source: "CNBC TV18", // Hardcoded for this feed
      }));
    } catch (error) {
      console.error("Error fetching RSS feed:", error);
      return [];
    }
  },
});
