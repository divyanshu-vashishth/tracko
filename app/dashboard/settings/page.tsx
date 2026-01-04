"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const user = useQuery(api.users.viewer);
    const { theme, setTheme } = useTheme();
    const { signOut } = useAuthActions();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push("/");
    };

    return (
        <div className="space-y-8 max-w-md">
            <div>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-muted-foreground text-sm">Manage your preferences</p>
            </div>

            {/* Profile */}
            <div className="space-y-4">
                <h2 className="text-sm font-medium text-muted-foreground">Profile</h2>
                <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14">
                        <AvatarImage src={user?.image} alt={user?.name} />
                        <AvatarFallback>
                            {user?.name ? user.name.slice(0, 2).toUpperCase() : "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium">{user?.name || "User"}</p>
                        <p className="text-sm text-muted-foreground">{user?.email || ""}</p>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Appearance */}
            <div className="space-y-4">
                <h2 className="text-sm font-medium text-muted-foreground">Appearance</h2>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {theme === "dark" ? (
                            <Moon className="h-5 w-5" />
                        ) : (
                            <Sun className="h-5 w-5" />
                        )}
                        <Label htmlFor="dark-mode">Dark Mode</Label>
                    </div>
                    <Switch
                        id="dark-mode"
                        checked={theme === "dark"}
                        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                    />
                </div>
            </div>

            <Separator />

            {/* Sign Out */}
            <Button
                variant="outline"
                className="w-full text-destructive hover:text-destructive"
                onClick={handleSignOut}
            >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
            </Button>
        </div>
    );
}
