import { Suspense } from "react";
import { AnalyticsView } from "./analytics-view";

export default function AnalyticsPage() {
  return (
    <Suspense fallback={
      <div className="space-y-8">
        <div className="h-8 w-48 bg-white/10 rounded animate-pulse" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    }>
      <AnalyticsView />
    </Suspense>
  );
}
