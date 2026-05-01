"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface PortfolioContextType {
  activePortfolioId: Id<"portfolios"> | undefined;
  setActivePortfolioId: (id: Id<"portfolios">) => void;
  portfolios: Array<{ _id: Id<"portfolios">; name: string }>;
  isLoading: boolean;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const portfolios = useQuery(api.portfolios.getPortfolios);
  const [activePortfolioId, setActivePortfolioId] = useState<Id<"portfolios"> | undefined>(undefined);

  useEffect(() => {
    if (portfolios && portfolios.length > 0 && !activePortfolioId) {
      // Default to the first portfolio if none selected
      setActivePortfolioId(portfolios[0]._id);
    } else if (portfolios && portfolios.length === 0) {
      setActivePortfolioId(undefined);
    } else if (portfolios && activePortfolioId) {
      // Ensure active portfolio still exists (wasn't deleted)
      const exists = portfolios.some((p) => p._id === activePortfolioId);
      if (!exists && portfolios.length > 0) {
        setActivePortfolioId(portfolios[0]._id);
      }
    }
  }, [portfolios, activePortfolioId]);

  return (
    <PortfolioContext.Provider
      value={{
        activePortfolioId,
        setActivePortfolioId,
        portfolios: portfolios || [],
        isLoading: portfolios === undefined,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
}
