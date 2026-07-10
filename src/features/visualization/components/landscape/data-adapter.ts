import type { GitHubDay } from "@/features/github/types";
import type { TileData } from "./types";

export function adaptGitHubDaysToTiles(days: GitHubDay[]): TileData[] {
  if (days.length === 0) return [];

  const sorted = [...days].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const first = sorted[0];
  if (!first) return [];
  const firstDate = new Date(first.date);
  const startDayOfWeek = firstDate.getDay();

  return sorted.map((day, index) => {
    const date = new Date(day.date);
    const dayOfWeek = date.getDay();
    const dayIndex = index;
    const week = Math.floor((dayIndex + startDayOfWeek) / 7);

    return {
      date: day.date,
      count: day.count,
      week,
      dayOfWeek,
      isCurrentStreak: false,
    };
  });
}

export function computeStreakDays(days: TileData[]): Set<string> {
  const sorted = [...days].filter((d) => d.count > 0).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  if (sorted.length === 0) return new Set();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streakEnd = sorted.length - 1;
  for (let i = sorted.length - 1; i >= 0; i--) {
    const day = sorted[i];
    if (!day) break;
    const dayDate = new Date(day.date);
    dayDate.setHours(0, 0, 0, 0);
    const diffDays = Math.round((today.getTime() - dayDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays > sorted.length) break;

    if (i === sorted.length - 1 && diffDays > 1) {
      return new Set();
    }

    if (i < sorted.length - 1) {
      const next = sorted[i + 1];
      if (!next) break;
      const prevDate = new Date(next.date);
      prevDate.setHours(0, 0, 0, 0);
      const expectedDiff = Math.round((prevDate.getTime() - dayDate.getTime()) / (1000 * 60 * 60 * 24));
      if (expectedDiff > 1) {
        streakEnd = i;
        break;
      }
    }
  }

  const streakDays = new Set<string>();
  for (let i = streakEnd; i < sorted.length; i++) {
    const day = sorted[i];
    if (day) streakDays.add(day.date);
  }

  return streakDays;
}
