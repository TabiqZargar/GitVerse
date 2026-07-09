"use client";

import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-semibold">Something went wrong</h2>
      <p className="text-muted-foreground max-w-md text-center text-sm">
        {error.message ?? "An unexpected error occurred on the dashboard."}
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
