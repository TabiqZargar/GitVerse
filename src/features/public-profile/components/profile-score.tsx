"use client";

import type { ProfileData } from "@/features/profile/types";

interface ProfileScoreProps {
  profile: ProfileData;
}

function computeScore(profile: ProfileData): { score: number; grade: string } {
  const score = Math.min(
    Math.round(
      profile.totalCommits * 0.3 +
        profile.totalStars * 0.2 +
        profile.followers * 0.2 +
        profile.languages.length * 5 +
        Math.min(profile.publicRepos, 50)
    ),
    100
  );
  const grade =
    score >= 90 ? "S" : score >= 75 ? "A" : score >= 55 ? "B" : score >= 35 ? "C" : score >= 15 ? "D" : "E";
  return { score, grade };
}

export function ProfileScore({ profile }: ProfileScoreProps) {
  const { score, grade } = computeScore(profile);
  return (
    <div className="flex items-center gap-4 rounded-xl border border-glass-border bg-glass p-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-chart-1/30">
        <span className="text-2xl font-black text-chart-1">{grade}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Developer Score</span>
        <span className="text-xl font-bold">{score}/100</span>
      </div>
    </div>
  );
}
