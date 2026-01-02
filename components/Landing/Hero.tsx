import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, CirclePlay } from "lucide-react";

export function Hero() {
  return (
    <main className="overflow-hidden">
      <section className="bg-linear-to-b from-muted to-background">
        <div className="py-20 md:py-32">
          <div className="mx-auto w-full max-w-10/12  px-6 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div>
                <h1 className="text-balance text-3xl font-semibold md:text-6xl">
                  Track Your Portfolio Like a Pro
                </h1>
                <p className="text-muted-foreground my-8 text-balance text-xl">
                  One tool that does it all. Track holdings, analyze performance, compare benchmarks, and stay updated with market news—all in one place.
                </p>

                <div className="flex items-center gap-3">
                    <Button size="lg" >
                  <Link href="/auth" className="flex items-center gap-2">
                      <span className="text-nowrap">Get Started</span>
                      <ChevronRight className="opacity-50" />
                  </Link>
                  </Button>
                  <Button size="lg" variant="outline">
                    <Link href="/dashboard" className="flex items-center gap-2">
                    <CirclePlay className="fill-primary/25 stroke-primary" />
                    <span className="text-nowrap">View Demo</span>
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="mt-10">
                <p className="text-muted-foreground">Trusted by investors at:</p>
                <div className="mt-6 grid max-w-sm grid-cols-3 gap-6">
                  <div className="flex items-center">
                    <div className="h-8 w-20 bg-muted rounded flex items-center justify-center text-xs font-semibold text-muted-foreground">
                      Goldman
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-8 w-20 bg-muted rounded flex items-center justify-center text-xs font-semibold text-muted-foreground">
                      Morgan
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-8 w-20 bg-muted rounded flex items-center justify-center text-xs font-semibold text-muted-foreground">
                      Fidelity
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="perspective-near relative w-full">
              <div className="before:border-foreground/5 before:bg-foreground/5 relative h-full before:absolute before:-inset-x-4 before:bottom-7 before:top-0 before:skew-x-6 before:rounded-[calc(var(--radius)+1rem)] before:border">
                <div className="bg-background rounded-[--radius] shadow-foreground/10 ring-foreground/5 relative h-full -translate-y-12 skew-x-6 overflow-hidden border border-transparent shadow-md ring-1">
                  <div className="aspect-16/10 bg-linear-to-br from-primary/10 via-background to-muted p-8">
                    {/* Dashboard Preview */}
                    <div className="h-full w-full bg-card rounded-lg border shadow-lg p-6 space-y-4">
                      {/* Header */}
                      <div className="flex items-center justify-between pb-4 border-b">
                        <div>
                          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                          <div className="h-3 w-24 bg-muted/50 rounded mt-2 animate-pulse" />
                        </div>
                        <div className="h-8 w-24 bg-primary/20 rounded animate-pulse" />
                      </div>
                      
                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="bg-muted/30 rounded-lg p-4 space-y-2">
                            <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                            <div className="h-5 w-20 bg-muted/70 rounded animate-pulse" />
                          </div>
                        ))}
                      </div>

                      {/* Chart Area */}
                      <div className="bg-muted/20 rounded-lg h-40 p-4 flex items-end gap-2">
                        {[40, 60, 45, 70, 55, 75, 65, 80].map((height, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-primary/30 rounded-t animate-pulse"
                            style={{ height: `${height}%` }}
                          />
                        ))}
                      </div>

                      {/* Table Preview */}
                      <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-4 p-3 bg-muted/20 rounded animate-pulse">
                            <div className="h-3 w-12 bg-muted rounded" />
                            <div className="h-3 w-32 bg-muted rounded flex-1" />
                            <div className="h-3 w-16 bg-primary/30 rounded" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}


    </main>
  );
}
