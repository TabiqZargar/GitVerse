import { Suspense } from "react";
import { DashboardContent } from "./dashboard-content";

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="p-unit-xxl space-y-gutter">
        <div className="h-8 w-48 bg-white/10 rounded animate-pulse" />
        <div className="grid grid-cols-12 gap-gutter">
          <div className="col-span-8 h-96 bg-white/5 rounded-xl animate-pulse" />
          <div className="col-span-4 space-y-gutter">
            <div className="h-44 bg-white/5 rounded-xl animate-pulse" />
            <div className="h-44 bg-white/5 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
