# Project Context & Knowledge Base

## Tech Stack
- **Framework:** Next.js (App Router)
- **Backend:** Convex
- **UI Component Library:** Shadcn UI
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Package Manager:** Bun
- **External APIs:** 
    - Yahoo Finance (`yahoo-finance2`)
    - RSS Feeds (`rss-parser`) for CNBC TV18

## Key Directories
- `app/`: Next.js App Router pages and layouts.
- `components/`: React components.
    - `dashboard/`: Dashboard-specific components (`PortfolioOverview`, `Analytics`, `Benchmarks`, `News`).
    - `ui/`: Shadcn UI primitives.
- `convex/`: Backend logic.
    - `schema.ts`: Database schema definition.
    - `auth.ts`: Auth configuration (Google provider).
    - `portfolios.ts`: Portfolio & holding management queries/mutations.
    - `stocks.ts`: Actions to fetch stock data (real-time & historical).
    - `news.ts`: Action to fetch market news.

## Development Rules & Conventions

### 1. Convex (Backend)
- **Auth:** 
    - ALWAYS import `getAuthUserId` from `@convex-dev/auth/server`.
    - Usage: `const userId = await getAuthUserId(ctx);`
    - Do NOT import `auth` from `./auth` for getting user ID.
- **Actions:** 
    - Must start with `"use node";` if using Node.js built-ins.
    - Use `internalAction` for background tasks/crons.
- **Mutations/Queries:**
    - Always use `args` and `handler` syntax.
    - Validate arguments with `v`.

### 2. Yahoo Finance (Stock Data)
- **Instantiation:**
    - ALWAYS instantiate the client class:
      ```typescript
      import YahooFinance from "yahoo-finance2";
      const yahooFinance = new YahooFinance();
      const quote = await yahooFinance.quote("AAPL");
      ```
    - Do NOT use the default export directly (e.g., `yahooFinance.quote` without `new`).

### 3. Shadcn UI (Components)
- **Button & Links:**
    - Do NOT use `asChild` prop on `Button` when wrapping a `Link`.
    - Correct:
      ```tsx
      <Button>
        <Link href="...">Text</Link>
      </Button>
      ```

### 4. General
- **Package Manager:** Use `bun` for all commands (e.g., `bun install`, `bun run dev`).

## Current Project State
- **Portfolio:** Starts empty by default. Auto-seeding has been removed.
- **Stocks:** Fetched via `convex/stocks.ts` actions using `yahoo-finance2`.
- **News:** Fetched via `convex/news.ts` from CNBC RSS, with client-side filtering by portfolio holdings.
- **Analytics:** Calculates performance based on real-time and historical data fetched on-demand.
- **Type Safety:** TypeScript is enforced. `any` types should be avoided where possible, but `yahoo-finance2` returns might need explicit typing if inference fails.

## Important Notes
- **Mock Data:** Most mock data has been replaced with real Convex query/action hooks.
- **Environment:** Running in a local/dev environment with `npx convex dev` and `bun run dev`.
