"use client"

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { AIChatbot } from "@/components/AIChatbot";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <AuthLoading>
                <div className="flex h-screen items-center justify-center">
                    <Spinner className="size-8" />
                </div>
            </AuthLoading>

            <Unauthenticated>
                <div className="flex h-screen items-center justify-center">
                    <div className="text-center">
                        <p className="text-muted-foreground mb-4">Please sign in to access the dashboard</p>
                        <a href="/" className="text-primary underline">Go to Home</a>
                    </div>
                </div>
            </Unauthenticated>

            <Authenticated>
                <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset>
                        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <div className="font-semibold">Dashboard</div>
                        </header>
                        <main className="flex-1 p-4 md:p-8">
                            {children}
                        </main>
                    </SidebarInset>
                    <AIChatbot />
                </SidebarProvider>
            </Authenticated>
        </>
    );
}

