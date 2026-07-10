import type { StreakResult, StreakSegment } from "../types";

function filterUpToDate(days: { date: string; count: number }[], currentDate?: string) {
  if (!currentDate) return [...days].sort((a, b) => a.date.localeCompare(b.date));
  return days
    .filter((d) => d.date <= currentDate)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function calculateCurrentStreak(
  days: { date: string; count: number }[],
  currentDate?: string
): { streak: number; start: string | null; end: string | null } {
  const sorted = filterUpToDate(days, currentDate);
  if (sorted.length === 0) return { streak: 0, start: null, end: null };

  const endDate = currentDate ?? sorted[sorted.length - 1]?.date ?? "";
  if (!endDate) return { streak: 0, start: null, end: null };

  let count = 0;
  let start: string | null = null;

  for (let i = sorted.length - 1; i >= 0; i--) {
    const day = sorted[i];
    if (!day) break;

    const expectedDate = new Date(endDate);
    expectedDate.setDate(expectedDate.getDate() - (sorted.length - 1 - i));
    const expected = expectedDate.toISOString().slice(0, 10);

    if (day.date !== expected) break;
    if (day.count === 0) break;

    count++;
    start = day.date;
  }

  return { streak: count, start, end: count > 0 ? endDate : null };
}

export function calculateLongestStreak(
  days: { date: string; count: number }[],
  currentDate?: string
): { streak: number; start: string | null; end: string | null } {
  const sorted = filterUpToDate(days, currentDate);
  if (sorted.length === 0) return { streak: 0, start: null, end: null };

  let longest = 0;
  let longestStart: string | null = null;
  let longestEnd: string | null = null;

  let tempStreak = 0;
  let tempStart: string | null = null;

  for (let i = 0; i < sorted.length; i++) {
    const day = sorted[i];
    if (!day) break;

    if (day.count > 0) {
      if (tempStreak === 0) tempStart = day.date;
      tempStreak++;
    } else {
      if (tempStreak > longest) {
        longest = tempStreak;
        longestStart = tempStart;
        longestEnd = sorted[i - 1]?.date ?? null;
      }
      tempStreak = 0;
      tempStart = null;
    }
  }

  if (tempStreak > longest) {
    longest = tempStreak;
    longestStart = tempStart;
    longestEnd = sorted[sorted.length - 1]?.date ?? null;
  }

  return { streak: longest, start: longestStart, end: longestEnd };
}

export function calculateStreakHistory(
  days: { date: string; count: number }[]
): StreakSegment[] {
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const segments: StreakSegment[] = [];

  let tempStreak = 0;
  let tempStart: string | null = null;

  for (let i = 0; i < sorted.length; i++) {
    const day = sorted[i];
    if (!day) break;

    if (day.count > 0) {
      if (tempStreak === 0) tempStart = day.date;
      tempStreak++;
    } else {
      if (tempStreak > 0 && tempStart) {
        segments.push({
          start: tempStart,
          end: sorted[i - 1]?.date ?? tempStart,
          length: tempStreak,
        });
      }
      tempStreak = 0;
      tempStart = null;
    }
  }

  if (tempStreak > 0 && tempStart) {
    segments.push({
      start: tempStart,
      end: sorted[sorted.length - 1]?.date ?? tempStart,
      length: tempStreak,
    });
  }

  return segments.sort((a, b) => b.length - a.length);
}

export function calculateLongestInactivePeriod(
  days: { date: string; count: number }[],
  currentDate?: string
): { days: number; start: string | null; end: string | null } {
  const sorted = filterUpToDate(days, currentDate);
  if (sorted.length === 0) return { days: 0, start: null, end: null };

  let longest = 0;
  let longestStart: string | null = null;
  let longestEnd: string | null = null;

  let tempStart: string | null = null;

  for (let i = 0; i < sorted.length; i++) {
    const day = sorted[i];
    if (!day) break;

    if (day.count === 0) {
      if (tempStart === null) tempStart = day.date;
    } else {
      if (tempStart !== null) {
        const prevDay = sorted[i - 1];
        if (prevDay) {
          const start = new Date(tempStart);
          const end = new Date(prevDay.date);
          const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          if (diff > longest) {
            longest = diff;
            longestStart = tempStart;
            longestEnd = prevDay.date;
          }
        }
      }
      tempStart = null;
    }
  }

  if (tempStart !== null) {
    const lastDay = sorted[sorted.length - 1];
    if (lastDay) {
      const start = new Date(tempStart);
      const end = new Date(lastDay.date);
      const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      if (diff > longest) {
        longest = diff;
        longestStart = tempStart;
        longestEnd = lastDay.date;
      }
    }
  }

  return { days: longest, start: longestStart, end: longestEnd };
}

export function calculateStreaks(
  days: { date: string; count: number }[],
  currentDate?: string
): StreakResult {
  const current = calculateCurrentStreak(days, currentDate);
  const longest = calculateLongestStreak(days, currentDate);
  const inactive = calculateLongestInactivePeriod(days, currentDate);
  const history = calculateStreakHistory(days);

  return {
    currentStreak: current.streak,
    currentStreakStart: current.start,
    currentStreakEnd: current.end,
    longestStreak: longest.streak,
    longestStreakStart: longest.start,
    longestStreakEnd: longest.end,
    streakHistory: history,
    longestInactiveDays: inactive.days,
    longestInactiveStart: inactive.start,
    longestInactiveEnd: inactive.end,
  };
}
