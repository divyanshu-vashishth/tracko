"use client";

import { cn } from "@/lib/utils";
import {
	BarChart3,
	Camera,
	LineChart,
	Newspaper,
	Sparkles,
	TrendingUp,
} from "lucide-react";
import type React from "react";

type FeatureType = {
	title: string;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	description: string;
	visual?: "chart" | "card" | "default";
};

export function FeatureSection() {
	return (
		<div className="relative mx-auto w-full max-w-6xl px-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{features.map((feature, index) => (
					<FeatureCard feature={feature} key={feature.title} index={index} />
				))}
			</div>
		</div>
	);
}

export function FeatureCard({
	feature,
	className,
	index = 0,
	...props
}: React.ComponentProps<"div"> & {
	feature: FeatureType;
	index?: number;
}) {
	return (
		<div
			className={cn(
				"group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/20",
				className
			)}
			{...props}
		>
			<div className="mb-4">
				<h3 className="text-lg font-semibold text-foreground">
					{feature.title}
				</h3>
				<p className="mt-2 text-muted-foreground text-sm leading-relaxed">
					{feature.description}
				</p>
			</div>

			{/* Visual element based on type */}
			<div className="mt-4">
				{feature.visual === "chart" ? (
					<div className="h-32 rounded-xl bg-muted/30 p-4 flex items-end gap-1">
						{/* Line chart visualization */}
						<svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
							<path
								d="M0,60 Q30,50 50,55 T100,40 T150,45 T200,20"
								fill="none"
								stroke="hsl(var(--chart-3))"
								strokeWidth="2"
								className="opacity-60"
							/>
							<path
								d="M0,70 Q40,65 60,60 T120,55 T160,50 T200,30"
								fill="none"
								stroke="hsl(var(--primary))"
								strokeWidth="2"
							/>
						</svg>
					</div>
				) : feature.visual === "card" ? (
					<div className="rounded-xl border bg-card shadow-sm p-4">
						<div className="flex items-center gap-3 mb-3">
							<div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
								<Sparkles className="size-4 text-primary" />
							</div>
							<div className="flex-1">
								<div className="h-2 bg-muted rounded w-16" />
							</div>
							<div className="flex gap-1">
								<div className="size-2 rounded-full bg-muted" />
								<div className="size-2 rounded-full bg-muted" />
								<div className="size-2 rounded-full bg-muted" />
							</div>
						</div>
						<div className="text-xs font-mono text-muted-foreground">INV-456789</div>
						<div className="text-xl font-bold mt-1">₹2,84,342.57</div>
						<div className="text-xs text-muted-foreground mt-1">Due in 15 days</div>
						<div className="mt-4 space-y-2">
							<div className="flex items-center gap-2">
								<span className="text-xs text-muted-foreground w-12">To</span>
								<div className="h-2 bg-muted rounded flex-1" />
							</div>
							<div className="flex items-center gap-2">
								<span className="text-xs text-muted-foreground w-12">From</span>
								<div className="h-2 bg-muted rounded flex-1" />
							</div>
						</div>
					</div>
				) : (
					<div className="h-20 rounded-xl bg-gradient-to-br from-primary/5 to-muted/30 flex items-center justify-center">
						<feature.icon className="size-10 text-primary/30" strokeWidth={1} />
					</div>
				)}
			</div>
		</div>
	);
}

const features: FeatureType[] = [
	{
		title: "Powerful analytics dashboard",
		icon: BarChart3,
		description:
			"Track performance metrics with real-time data visualization and customizable reports for informed.",
		visual: "chart",
	},
	{
		title: "Streamlined invoicing system",
		icon: Sparkles,
		description:
			"Generate, send, and manage professional invoices automatically with integrated payment tracking.",
		visual: "card",
	},
	{
		title: "Real-Time Tracking",
		icon: TrendingUp,
		description:
			"Monitor your portfolio performance with live price updates from global markets.",
		visual: "default",
	},
	{
		title: "Benchmark Comparison",
		icon: LineChart,
		description:
			"Compare your portfolio against major indices like Nifty 50, Sensex, and S&P 500.",
		visual: "default",
	},
	{
		title: "Market News",
		icon: Newspaper,
		description:
			"Stay informed with curated news filtered for stocks in your portfolio.",
		visual: "default",
	},
	{
		title: "Screenshot Import",
		icon: Camera,
		description:
			"Simply upload a screenshot of your holdings and let our AI extract stocks automatically.",
		visual: "default",
	},
];
