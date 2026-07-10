"use client";

import { useExportStore } from "../store";

export function ExportProgress() {
  const jobs = useExportStore((s) => s.jobs);
  const activeJobId = useExportStore((s) => s.activeJobId);

  const activeJob = jobs.find((j) => j.id === activeJobId);
  if (!activeJob) return null;

  return (
    <div className="rounded-xl border border-glass-border bg-glass p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            {activeJob.status === "processing" ? "Exporting..." : activeJob.status === "complete" ? "Complete" : "Pending"}
          </span>
          {activeJob.error && (
            <span className="text-xs text-destructive">Error: {activeJob.error}</span>
          )}
        </div>
        <span className="text-xs text-muted-foreground">{activeJob.progress}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            activeJob.status === "error" ? "bg-destructive" : "bg-chart-1"
          }`}
          style={{ width: `${activeJob.progress}%` }}
        />
      </div>
    </div>
  );
}
