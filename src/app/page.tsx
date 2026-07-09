import Link from "next/link";
import { GradientButton } from "@/components/design-system/gradient-button";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,oklch(0.65_0.2_265/0.08),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,oklch(0.7_0.18_170/0.04),transparent_50%)]" />

      <main className="relative z-10 flex flex-col items-center gap-8 px-4 text-center">
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 mb-2 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/10 shadow-glow">
          <span className="bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-2xl font-bold text-transparent">
            G
          </span>
        </div>

        <h1 className="max-w-2xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          Your GitHub history
          <br />
          <span className="text-gradient">in a new dimension</span>
        </h1>

        <p className="text-muted-foreground max-w-md text-lg">
          Transform your development journey into an immersive, interactive universe.
        </p>

        <div className="flex gap-4">
          <Link href="/login">
            <GradientButton size="lg">Get Started</GradientButton>
          </Link>
          <Link href="/dashboard">
            <GradientButton variant="subtle" size="lg">
              Dashboard
            </GradientButton>
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-8">
          {[
            { label: "Repositories", value: "Unlimited" },
            { label: "Visualizations", value: "3D + Flow" },
            { label: "Insights", value: "AI-Powered" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span className="text-sm font-semibold">{stat.value}</span>
              <span className="text-muted-foreground text-xs">{stat.label}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
