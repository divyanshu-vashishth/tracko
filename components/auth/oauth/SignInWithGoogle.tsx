"use client";
// import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { GoogleLogo } from "./GoogleLogo";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";

export function SignInWithGoogle() {
  const { signIn } = useAuthActions()
  return (
    <Button
      className="flex-1"
      variant="outline"
      type="button"
      onClick={() => void signIn("google")}
    >
      <GoogleLogo className="mr-2 h-4 w-4" /> Google
    </Button>
  );
}