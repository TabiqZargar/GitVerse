/**
 * Streak calculator — pure functions for current and longest contribution streaks.
 *
 * Framework-independent. Operates on ContributionDay[] from domain models.
 *
 * A streak is defined as consecutive days with count > 0.
 * The current streak is measured backwards from today (excluding today
 * since it may be incomplete).
 */

import type { ContributionDay, Streak } from "../types/domain";

export function calculateStreaks(days: ContributionDay[]): Streak {
  if (days.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      currentStreakStart: null,
      currentStreakEnd: null,
      longestStreakStart: null,
      longestStreakEnd: null,
    };
  }

  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const today = new Date().toISOString().slice(0, 10);

  let currentStreak = 0;
  let currentStreakStart: string | null = null;
  let currentStreakEnd: string | null = null;

  let longestStreak = 0;
  let longestStreakStart: string | null = null;
  let longestStreakEnd: string | null = null;

  let tempStreak = 0;
  let tempStart: string | null = null;

  for (let i = 0; i < sorted.length; i++) {
    const day = sorted[i];
    if (!day) break;
    if (day.count > 0) {
      if (tempStreak === 0) tempStart = day.date;
      tempStreak++;
    } else {
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
        longestStreakStart = tempStart;
        longestStreakEnd = sorted[i - 1]?.date ?? null;
      }
      tempStreak = 0;
      tempStart = null;
    }
  }

  if (tempStreak > longestStreak) {
    longestStreak = tempStreak;
    longestStreakStart = tempStart;
    longestStreakEnd = sorted[sorted.length - 1]?.date ?? null;
  }

  const todayIndex = sorted.findIndex((d) => d.date === today);
  const todayDay = todayIndex >= 0 ? sorted[todayIndex] : undefined;
  if (todayDay && todayDay.count > 0) {
    currentStreak = countConsecutiveBackwards(sorted, todayIndex);
    const startDay = sorted[todayIndex - currentStreak + 1];
    currentStreakStart = startDay?.date ?? null;
    currentStreakEnd = today;
  } else {
    const yesterdayIndex = todayIndex >= 0 ? todayIndex - 1 : sorted.length - 1;
    const yesterdayDay = yesterdayIndex >= 0 ? sorted[yesterdayIndex] : undefined;
    if (yesterdayDay && yesterdayDay.count > 0) {
      currentStreak = countConsecutiveBackwards(sorted, yesterdayIndex);
      const startDay = sorted[yesterdayIndex - currentStreak + 1];
      currentStreakStart = startDay?.date ?? null;
      currentStreakEnd = sorted[yesterdayIndex]?.date ?? null;
    }
  }

  return {
    currentStreak,
    longestStreak,
    currentStreakStart,
    currentStreakEnd,
    longestStreakStart,
    longestStreakEnd,
  };
}

function countConsecutiveBackwards(days: ContributionDay[], fromIndex: number): number {
  let count = 0;
  for (let i = fromIndex; i >= 0; i--) {
    const day = days[i];
    if (day && day.count > 0) {
      count++;
    } else {
      break;
    }
  }
  return count;
}
