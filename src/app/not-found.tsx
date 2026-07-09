import Link from "next/link";
import { GradientButton } from "@/components/design-system/gradient-button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,oklch(0.65_0.2_265/0.06),transparent_60%)]" />
      <h2 className="text-7xl font-bold tracking-tight">404</h2>
      <p className="text-muted-foreground">This universe doesn&apos;t exist yet</p>
      <Link href="/">
        <GradientButton>Go Home</GradientButton>
      </Link>
    </div>
  );
}
