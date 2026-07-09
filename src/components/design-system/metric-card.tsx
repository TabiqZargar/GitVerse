"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { GlassPanel, GlassPanelContent } from "./glass-panel";

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: { value: number; direction: "up" | "down" };
  icon?: React.ReactNode;
  className?: string;
  delay?: number;
}

export function MetricCard({ label, value, trend, icon, className, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <GlassPanel className={cn("group cursor-default", className)}>
        <GlassPanelContent className="space-y-1.5 pt-5">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs tracking-wide uppercase">{label}</span>
            {icon && <span className="text-muted-foreground/50 h-3.5 w-3.5">{icon}</span>}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight">{value}</span>
            {trend && (
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.direction === "up" ? "text-chart-2" : "text-destructive"
                )}
              >
                {trend.direction === "up" ? "+" : ""}
                {trend.value}%
              </span>
            )}
          </div>
        </GlassPanelContent>
      </GlassPanel>
    </motion.div>
  );
}
