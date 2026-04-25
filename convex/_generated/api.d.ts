/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ai from "../ai.js";
import type * as auth from "../auth.js";
import type * as bookmarks from "../bookmarks.js";
import type * as chatHistory from "../chatHistory.js";
import type * as exchangeRates from "../exchangeRates.js";
import type * as http from "../http.js";
import type * as journal from "../journal.js";
import type * as news from "../news.js";
import type * as portfolioImport from "../portfolioImport.js";
import type * as portfolios from "../portfolios.js";
import type * as stocks from "../stocks.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  ai: typeof ai;
  auth: typeof auth;
  bookmarks: typeof bookmarks;
  chatHistory: typeof chatHistory;
  exchangeRates: typeof exchangeRates;
  http: typeof http;
  journal: typeof journal;
  news: typeof news;
  portfolioImport: typeof portfolioImport;
  portfolios: typeof portfolios;
  stocks: typeof stocks;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  agent: import("@convex-dev/agent/_generated/component.js").ComponentApi<"agent">;
};
