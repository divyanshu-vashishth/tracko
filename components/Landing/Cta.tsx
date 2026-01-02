import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function Cta() {
    return (
<section className="py-24">
    <div className="mx-auto max-w-5xl px-6">
      <div className="bg-linear-to-br from-primary/5 to-primary/10 rounded-2xl p-12 text-center border">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to take control of your investments?
        </h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of investors who trust PortfolioHub for professional portfolio management
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" >
            <Link href="/auth" className="flex items-center gap-2">
              <span>Start Free Trial</span>
              <ChevronRight className="opacity-50" />
            </Link> 
          </Button>
          <Button size="lg" variant="outline">
            <Link href="/dashboard" className="flex items-center gap-2">
              {/* You may need to replace CirclePlay with a compatible icon. Example uses Lucide's PlayCircle */}
              <ChevronRight className="opacity-50" />
              <span className="text-nowrap">View Demo</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  </section>    
  )
}