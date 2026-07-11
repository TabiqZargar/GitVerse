"use client";

import { cn } from "@/lib/utils";
import { GlassCard } from "./glass-card";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: string;
  trend?: { value: number; positive: boolean };
  className?: string;
}

export function StatsCard({ label, value, icon, trend, className }: StatsCardProps) {
  return (
    <GlassCard padding="md" className={cn("flex flex-col gap-unit-sm", className)}>
      <div className="flex items-center justify-between">
        <span className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-widest">{label}</span>
        {icon && <span className="material-symbols-outlined text-primary/60 text-lg">{icon}</span>}
      </div>
      <span className="font-headline-lg text-headline-lg text-on-surface">{typeof value === "number" ? value.toLocaleString() : value}</span>
      {trend && (
        <div className="flex items-center gap-1">
          <span className={cn("text-xs font-medium", trend.positive ? "text-secondary" : "text-destructive")}>
            {trend.positive ? "+" : ""}{trend.value}%
          </span>
          <span className="text-[10px] text-on-surface-variant/50">vs last month</span>
        </div>
      )}
    </GlassCard>
  );
}
