import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CallToAction() {
    return (
        <div className="relative mx-auto max-w-4xl px-6">
            {/* Card container with rounded corners */}
            <div className="relative rounded-3xl border bg-card p-8 md:p-12 text-center">
                {/* Decorative rounded rectangle at bottom */}
                <div className="absolute left-1/2 -bottom-4 -translate-x-1/2 w-24 h-8 bg-muted rounded-t-2xl border-x border-t" />

                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                    Create, Sell and Grow
                </h2>
                <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                    Join a community of over 1000+ companies and developers
                    who have already discovered the power of Tracko.
                </p>

                <Button size="lg" className="h-12 px-8">
                    <Link href="/auth">
                        Get Started
                    </Link>
                </Button>
            </div>
        </div>
    );
}
