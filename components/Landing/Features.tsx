export default function Features() {
  return (
    <section className="py-24 bg-muted/30">
<div className="mx-auto max-w-5xl px-6">
  <div className="text-center mb-16">
    <h2 className="text-3xl md:text-4xl font-bold mb-4">
      Everything you need to manage investments
    </h2>
    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
      Powerful features designed for serious investors
    </p>
  </div>

  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[
      {
        title: "Real-Time Tracking",
        description: "Monitor your portfolio value and performance in real-time with live market data.",
      },
      {
        title: "Advanced Analytics",
        description: "Deep insights into your portfolio with sector allocation and risk metrics.",
      },
      {
        title: "Benchmark Comparison",
        description: "Compare your performance against S&P 500, NASDAQ, and custom benchmarks.",
      },
      {
        title: "Market News",
        description: "Stay informed with curated news affecting your holdings.",
      },
      {
        title: "Performance Reports",
        description: "Comprehensive reports with returns analysis and growth charts.",
      },
      {
        title: "Secure & Private",
        description: "Your data is encrypted and secure. We never share your information.",
      },
    ].map((feature, index) => (
      <div key={index} className="bg-background p-6 rounded-lg border hover:border-primary/50 transition-colors">
        <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
        <p className="text-muted-foreground text-sm">{feature.description}</p>
      </div>
    ))}
  </div>
</div>
</section>          
    )
    }
