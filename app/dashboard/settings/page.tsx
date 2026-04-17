"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LogOut, Moon, Sun, Sparkles, TrendingUp, Shield, Loader2, Pencil, Check, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

export default function SettingsPage() {
    const user = useQuery(api.users.viewer);
    const preferences = useQuery(api.portfolios.getUserPreferences);
    const updatePreferences = useMutation(api.portfolios.updateUserPreferences);
    const { theme, setTheme } = useTheme();
    const { signOut } = useAuthActions();
    const router = useRouter();

    const [riskAppetite, setRiskAppetite] = useState<"aggressive" | "moderate" | "defensive">("moderate");
    const [investmentHorizon, setInvestmentHorizon] = useState("");
    const [investmentGoals, setInvestmentGoals] = useState("");
    const [monthlyInvestment, setMonthlyInvestment] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);

    // Sync state with DB when preferences load
    useEffect(() => {
        if (preferences !== undefined && !hasLoaded) {
            if (preferences?.investorProfile) {
                setRiskAppetite(preferences.investorProfile.riskAppetite || "moderate");
                setInvestmentHorizon(preferences.investorProfile.investmentHorizon || "");
                setInvestmentGoals(preferences.investorProfile.investmentGoals || "");
                setMonthlyInvestment(preferences.investorProfile.monthlyInvestment || 0);
            }
            setHasLoaded(true);
        }
    }, [preferences, hasLoaded]);

    // If no profile exists, start in edit mode
    useEffect(() => {
        if (hasLoaded && !preferences?.investorProfile) {
            setIsEditing(true);
        }
    }, [hasLoaded, preferences]);

    const handleSignOut = async () => {
        await signOut();
        router.push("/");
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            await updatePreferences({
                investorProfile: {
                    riskAppetite,
                    investmentHorizon: investmentHorizon || undefined,
                    investmentGoals: investmentGoals || undefined,
                    monthlyInvestment: monthlyInvestment || undefined,
                },
            });
            toast.success("Investor profile saved!");
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save profile:", error);
            toast.error("Failed to save profile");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        // Reset to saved values
        if (preferences?.investorProfile) {
            setRiskAppetite(preferences.investorProfile.riskAppetite || "moderate");
            setInvestmentHorizon(preferences.investorProfile.investmentHorizon || "");
            setInvestmentGoals(preferences.investorProfile.investmentGoals || "");
            setMonthlyInvestment(preferences.investorProfile.monthlyInvestment || 0);
        }
        setIsEditing(false);
    };

    const getRiskLabel = (risk: string) => {
        switch (risk) {
            case "aggressive": return "Aggressive";
            case "moderate": return "Moderate";
            case "defensive": return "Defensive";
            default: return risk;
        }
    };

    return (
        <div className="space-y-8 max-w-lg">
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

            {/* Investor Profile for AI */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <h2 className="text-sm font-medium text-muted-foreground">Investor Profile (AI Context)</h2>
                    </div>
                    {!isEditing && hasLoaded && preferences?.investorProfile && (
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                            <Pencil className="h-3 w-3 mr-1" />
                            Edit
                        </Button>
                    )}
                </div>
                <p className="text-xs text-muted-foreground">
                    This information helps the AI assistant provide personalized advice.
                </p>

                {preferences === undefined ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : isEditing ? (
                    <>
                        {/* Risk Appetite */}
                        <div className="space-y-2">
                            <Label>Risk Appetite</Label>
                            <RadioGroup
                                value={riskAppetite}
                                onValueChange={(v) => setRiskAppetite(v as typeof riskAppetite)}
                                className="flex gap-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="aggressive" id="aggressive" />
                                    <Label htmlFor="aggressive" className="flex items-center gap-1 cursor-pointer">
                                        <TrendingUp className="h-3 w-3 text-green-600" />
                                        Aggressive
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="moderate" id="moderate" />
                                    <Label htmlFor="moderate" className="cursor-pointer">Moderate</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="defensive" id="defensive" />
                                    <Label htmlFor="defensive" className="flex items-center gap-1 cursor-pointer">
                                        <Shield className="h-3 w-3 text-blue-600" />
                                        Defensive
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Investment Horizon */}
                        <div className="space-y-2">
                            <Label htmlFor="horizon">Investment Horizon</Label>
                            <Input
                                id="horizon"
                                value={investmentHorizon}
                                onChange={(e) => setInvestmentHorizon(e.target.value)}
                                placeholder="e.g., 5-10 years, Long-term, Short-term"
                            />
                        </div>

                        {/* Monthly Investment */}
                        <div className="space-y-2">
                            <Label htmlFor="monthly">Monthly Investment Amount (₹)</Label>
                            <Input
                                id="monthly"
                                type="number"
                                value={monthlyInvestment || ""}
                                onChange={(e) => setMonthlyInvestment(parseInt(e.target.value) || 0)}
                                placeholder="e.g., 50000"
                            />
                        </div>

                        {/* Investment Goals */}
                        <div className="space-y-2">
                            <Label htmlFor="goals">Investment Goals</Label>
                            <Textarea
                                id="goals"
                                value={investmentGoals}
                                onChange={(e) => setInvestmentGoals(e.target.value)}
                                placeholder="e.g., Retirement planning, Wealth creation, Children's education"
                                rows={3}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={handleSaveProfile} disabled={isSaving}>
                                <Check className="h-4 w-4 mr-1" />
                                {isSaving ? "Saving..." : "Save"}
                            </Button>
                            {preferences?.investorProfile && (
                                <Button variant="outline" onClick={handleCancel}>
                                    <X className="h-4 w-4 mr-1" />
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </>
                ) : (
                    /* View Mode */
                    <div className="space-y-3 bg-muted/30 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground text-xs">Risk Appetite</p>
                                <p className="font-medium">{getRiskLabel(riskAppetite)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-xs">Monthly Investment</p>
                                <p className="font-medium">{monthlyInvestment ? `₹${monthlyInvestment.toLocaleString()}` : "Not set"}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-xs">Investment Horizon</p>
                                <p className="font-medium">{investmentHorizon || "Not set"}</p>
                            </div>
                        </div>
                        {investmentGoals && (
                            <div>
                                <p className="text-muted-foreground text-xs">Goals</p>
                                <p className="text-sm">{investmentGoals}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Separator />

            {/* Appearance */}
            <div className="space-y-4">
                <h2 className="text-sm font-medium text-muted-foreground">Appearance</h2>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {theme === "dark" ? (
                            <>
                                <Moon className="h-5 w-5" />
                                <Label htmlFor="dark-mode">Dark Mode</Label>
                            </>
                        ) : (
                            <>
                                <Sun className="h-5 w-5" />
                                <Label htmlFor="dark-mode">Light Mode</Label>
                            </>
                        )}
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
