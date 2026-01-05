export default function Stats(){      
      
      <section className="relative py-16 border-y border-border/50 bg-muted/20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: "10K+", label: "Active Portfolios" },
              { value: "₹500Cr+", label: "Assets Tracked" },
              { value: "99.9%", label: "Uptime" },
              { value: "< 1s", label: "Data Refresh" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
}