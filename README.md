# Portfolio Tracker

A modern portfolio tracking application for Indian investors. Track your holdings, analyze performance, compare with benchmarks, and stay updated with market news.

## Features

- **Portfolio Overview** - Real-time prices, P&L tracking, portfolio value updates
- **Analytics Dashboard** - Sector allocation, top performers, performance metrics
- **Benchmark Comparison** - Compare against Nifty 50, Sensex, S&P 500
- **Market News** - Curated news filtered for your holdings
- **Trading Journal** - Track daily P&L and trade insights
- **Screenshot Import** - AI-powered stock extraction from broker screenshots

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Backend**: Convex (real-time database & serverless functions)
- **Styling**: Tailwind CSS, Shadcn UI
- **Charts**: Recharts
- **Authentication**: Google OAuth (via Convex Auth)
- **AI**: Gemini API (for screenshot import)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Bun](https://bun.sh/) (recommended package manager)
- [Convex account](https://www.convex.dev/) (free tier available)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/portfolio-tracker.git
   cd portfolio-tracker
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env.local
   ```

4. Configure your environment variables in `.env.local`:
   - `CONVEX_DEPLOYMENT` - Your Convex deployment name
   - `NEXT_PUBLIC_CONVEX_URL` - Your Convex deployment URL
   - `GEMINI_API_KEY` - [Get from Google AI Studio](https://aistudio.google.com/app/apikey)
   - `GOOGLE_API_KEY` - Same as GEMINI_API_KEY (for some integrations)

5. Set up Convex:
   ```bash
   npx convex dev
   ```

6. In a new terminal, start the development server:
   ```bash
   bun run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

## Deployment

The easiest way to deploy is with [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy Convex to production: `npx convex deploy`

## License

MIT
