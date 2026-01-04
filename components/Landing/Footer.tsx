import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="mx-auto max-w-10/12 px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Tracko" width={24} height={24} />
            <span className="font-semibold">Tracko</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Tracko. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}