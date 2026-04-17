import { ChartCandlestick, Newspaper, NotebookText } from "lucide-react";

const features = [
  {
    title: "Journal clarity",
    description: "Capture daily P&L, market notes, and trade rationale in a clean workflow built for reflection.",
    icon: NotebookText,
    accent: "from-sky-300/45 via-sky-200/20 to-transparent",
  },
  {
    title: "Signal-rich news",
    description: "See only the market narratives connected to your holdings, so context arrives before volatility.",
    icon: Newspaper,
    accent: "from-indigo-300/45 via-indigo-200/20 to-transparent",
  },
  {
    title: "Benchmark truth",
    description: "Compare your portfolio against Nifty 50, Sensex, and S&P 500 with instant performance framing.",
    icon: ChartCandlestick,
    accent: "from-cyan-300/45 via-cyan-200/20 to-transparent",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">A calm product for serious investors.</h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            Every section is designed to reduce noise: tighter context, faster reads, and better portfolio decisions.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl border bg-background p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className={`absolute inset-0 -z-10 bg-linear-to-b ${feature.accent}`} />
              <div className="mb-6 inline-flex rounded-xl border bg-background/90 p-2.5">
                <feature.icon className="size-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight">{feature.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              <div className="mt-8 h-1 w-12 rounded-full bg-primary/70 transition-all duration-300 group-hover:w-20" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}