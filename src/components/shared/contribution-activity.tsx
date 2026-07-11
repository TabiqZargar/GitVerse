"use client";

import { cn } from "@/lib/utils";
import type { ProfileContributionDay } from "@/features/profile/types";

interface ContributionActivityProps {
  days: ProfileContributionDay[];
  className?: string;
  weeks?: number;
}

const levelColors: Record<number, string> = {
  0: "bg-surface-container-highest",
  1: "bg-primary/20",
  2: "bg-primary/40",
  3: "bg-primary/65",
  4: "bg-primary",
};

export function ContributionActivity({ days, className, weeks = 24 }: ContributionActivityProps) {
  const recent = days.slice(-weeks * 7);
  const rows = 7;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex gap-[3px]">
        {Array.from({ length: Math.ceil(recent.length / rows) }).map((_, w) => (
          <div key={w} className="flex flex-col gap-[3px]">
            {Array.from({ length: rows }).map((_, d) => {
              const idx = w * rows + d;
              const day = recent[idx];
              if (!day) return <div key={d} className="h-3 w-3 rounded-sm bg-surface-container-highest" />;
              return (
                <div
                  key={day.date}
                  className={cn("h-3 w-3 rounded-sm transition-colors duration-300", levelColors[day.level] ?? levelColors[0])}
                  title={`${day.date}: ${day.count} contributions`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 justify-end mt-1">
        <span className="text-[8px] text-on-surface-variant/40">Less</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <div key={l} className={cn("h-2 w-2 rounded-sm", levelColors[l])} />
        ))}
        <span className="text-[8px] text-on-surface-variant/40">More</span>
      </div>
    </div>
  );
}
