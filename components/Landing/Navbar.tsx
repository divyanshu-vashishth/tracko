"use client"
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
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
  const [menuState, setMenuState] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <header>
      <nav
        data-state={menuState ? "active" : ""}
        className={cn(
          "fixed z-20 w-full transition-all duration-300",
          isScrolled &&
          "bg-background/75 border-b border-black/5 backdrop-blur-lg",
        )}
      >
        <div className="mx-auto px-6 max-w-10/12">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0">
            <div className="flex w-full justify-between gap-6 lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <Image src="/logo.svg" alt="Tracko" width={32} height={32} />
                <span className="font-bold text-xl">
                  Tracko
                </span>
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={
                  menuState ? "Close Menu" : "Open Menu"
                }
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="data-[state=active]:rotate-180 data-[state=active]:scale-0 data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="data-[state=active]:rotate-0 data-[state=active]:scale-100 data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            <div
              data-state={menuState ? "active" : ""}
              className="bg-background data-[state=active]:block lg:data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent"
            >
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                {!isAuthPage && !isLoading && (
                  isAuthenticated ? (
                    <>
                      <Button
                        size="lg"
                        variant="outline"
                      >
                        <Link href="/dashboard">
                          Dashboard
                        </Link>
                      </Button>
                      <Button
                        size="lg"
                        onClick={handleSignOut}
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="lg"
                    >
                      <Link href="/auth">
                        Sign In
                      </Link>
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}