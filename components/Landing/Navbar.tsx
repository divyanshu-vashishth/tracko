"use client";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname === "/auth";
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (isAuthPage) return null;

  return (
    <header className="absolute top-0 z-50 w-full">
      <nav className="mx-auto max-w-7xl px-6 py-6 md:py-8">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="home" className="flex items-center space-x-2">
            <Image src="/logo.svg" alt="Tracko" width={32} height={32} />
            <span className="font-bold text-xl">Tracko</span>
          </Link>

          <div className="flex items-center gap-4 md:gap-6">
            {!isLoading && (
              isAuthenticated ? (
                <>
                  <button
                    onClick={handleSignOut}
                    className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors hidden sm:block"
                  >
                    Sign out
                  </button>
                  <Button className="h-10 px-5">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth"
                    className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors hidden sm:block"
                  >
                    Sign in
                  </Link>
                  <Button className="h-10 px-5">
                    <Link href="/auth">Get started today</Link>
                  </Button>
                </>
              )
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}