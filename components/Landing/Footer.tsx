export function Footer() {
  return (
    <footer className="bg-background">
    <div className="mx-auto max-w-10/12 px-6 py-2">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold">PortfolioHub</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © 2026 PortfolioHub. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
  )
}