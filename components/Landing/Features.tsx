import Image from 'next/image'

const features = [
	{
		title: "Trading Journal",
		description: "Track your daily P&L, trade count, and insights to improve your trading strategy.",
		image: "/journal.png",
		// First card: image shifted down (touching bottom)
		containerClass: "px-6",
		innerClass: "h-full translate-y-6",
	},
	{
		title: "Market News",
		description: "Stay informed with curated news filtered for stocks in your portfolio.",
		image: "/news.png",
		// Second card: image centered with padding
		containerClass: "p-6",
		innerClass: "h-full",
	},
	{
		title: "Benchmark Comparison",
		description: "Compare your portfolio against major indices like Nifty 50, Sensex, and S&P 500.",
		image: "/benchmark.png",
		// Third card: no padding, image fills
		containerClass: "",
		innerClass: "h-full translate-x-6 translate-y-6",
	},
]

export default function Features() {
	return (
		<section id="features">
			<div className="bg-muted/50 dark:bg-muted/20 py-24">
				<div className="mx-auto max-w-5xl px-6">
					<div>
						<h2 className="text-foreground text-4xl font-semibold">Everything You Need</h2>
						<p className="text-muted-foreground mb-12 mt-4 text-balance text-lg">Powerful features to help you track your investments, analyze performance, and stay ahead of the market.</p>
					</div>
					<div className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-16 md:grid-cols-3">
						{features.map((feature) => (
							<div key={feature.title} className="space-y-4">
								{/* Outer gray container */}
								<div className={`aspect-video overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-700 ${feature.containerClass}`}>
									{/* Inner white card with image */}
									<div className={`relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-sm ${feature.innerClass}`}>
										<Image
											src={feature.image}
											alt={feature.title}
											fill
											className="object-cover object-top"
										/>
									</div>
								</div>
								<div className="sm:max-w-sm">
									<h3 className="text-foreground text-xl font-semibold">{feature.title}</h3>
									<p className="text-muted-foreground my-4 text-base">{feature.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}