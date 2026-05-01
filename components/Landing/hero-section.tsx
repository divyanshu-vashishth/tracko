"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden bg-background pt-40 pb-20 md:pt-48 md:pb-28">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-foreground sm:text-7xl">
          Portfolio management{" "}
          <span className="relative whitespace-nowrap text-primary">
            <svg
              aria-hidden="true"
              viewBox="0 0 418 42"
              className="absolute top-2/3 left-0 h-[0.58em] w-full fill-primary/30"
              preserveAspectRatio="none"
            >
              <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.051.951.56 2.236 1.183 2.936.36.404 2.169 1.406 3.528 1.961 1.97.808 6.046 1.683 9.145 1.952 1.343.117 3.332-.239 4.398-.788 1.13-.583 2.503-.996 3.013-.911.235.04.094.23-.314.425-2.28 1.096-7.146 1.48-11.832.936-3.791-.44-8.831-2.071-10.741-3.483-.984-.728-1.077-1.341-.295-1.922 1.41-1.05 4.795-2.086 10.37-3.171 14.896-2.906 43.14-7.53 73.024-11.951 31.424-4.646 72.846-9.155 106.67-11.602 36.326-2.63 76.513-2.26 111.41 1.031 34.254 3.23 68.643 9.873 92.513 17.868 6.69 2.242 12.164 4.887 13.91 6.695.833.856 1.503 1.11 2.395.903.655-.152 1.517-.674 1.914-1.157.49-.604.538-1.033.155-1.332-1.285-1.003-4.633-2.83-8.873-4.851-14.73-7.01-41.905-14.79-72.31-20.713-33.88-6.598-75.13-10.428-115.17-10.825-11.604-.115-26.685-.02-33.565.212z" />
            </svg>
            <span className="relative">made simple</span>
          </span>{" "}
          for serious investors.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-muted-foreground">
          Tracko combines real-time portfolio tracking, benchmark clarity, and conversational AI insights so you can act faster with less noise.
        </p>
        <div className="mt-10 flex justify-center gap-x-6">
          <Button
            size="lg"
            className="px-8 text-base font-semibold"
            onClick={() => router.push("/auth")}
          >
            Get started
          </Button>
        </div>
      </div>
    </section>
  );
}