"use client";

import { cn } from "@/lib/utils";

interface StatBadgeProps {
  label: string;
  value: string | number;
  className?: string;
  color?: "default" | "primary" | "success" | "warning";
}

const colorStyles = {
  default: "bg-muted text-muted-foreground border-border",
  primary: "bg-primary/10 text-primary border-primary/20",
  success: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  warning: "bg-chart-3/10 text-chart-3 border-chart-3/20",
};

export function StatBadge({ label, value, className, color = "default" }: StatBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs",
        colorStyles[color],
        className
      )}
    >
      <span className="font-medium">{value}</span>
      <span className="opacity-70">{label}</span>
    </div>
  );
}
