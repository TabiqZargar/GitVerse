"use client";

import type { GitHubDay } from "@/features/github/types";

interface ContributionGraphProps {
  days: GitHubDay[];
}

export function ContributionGraph({ days }: ContributionGraphProps) {
  const levelColors: Record<number, string> = {
    0: "bg-muted",
    1: "bg-primary/25",
    2: "bg-primary/50",
    3: "bg-primary/75",
    4: "bg-primary",
  };

  return (
    <div className="flex flex-wrap gap-1">
      {days.map((day) => (
        <div
          key={day.date}
          className={`h-3 w-3 rounded-sm ${levelColors[day.level]}`}
          title={`${day.date}: ${day.count} contributions`}
        />
      ))}
    </div>
  );
}
