/**
 * Totals calculator — pure functions for contribution aggregation.
 *
 * Framework-independent. All functions operate on domain model arrays.
 *
 * Provides weekly averages, monthly/yearly totals, and intensity distribution
 * used across the statistics API and future visualization features.
 */

import type { ContributionDay, ContributionWeek, MonthlyTotal, YearlyTotal } from "../types/domain";

export function calculateWeeklyAverage(weeks: ContributionWeek[]): number {
  const totalDays = weeks.reduce((sum, w) => sum + w.days.length, 0);
  if (totalDays === 0) return 0;
  const totalContributions = weeks.reduce(
    (sum, w) => sum + w.days.reduce((s, d) => s + d.count, 0),
    0
  );
  return Math.round((totalContributions / totalDays) * 7 * 100) / 100;
}

export function calculateMonthlyTotals(days: ContributionDay[]): MonthlyTotal[] {
  const grouped = new Map<string, number>();

  for (const day of days) {
    const date = new Date(day.date);
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    const key = `${year}-${month}`;
    grouped.set(key, (grouped.get(key) ?? 0) + day.count);
  }

  return Array.from(grouped.entries())
    .map(([key, count]) => {
      const [yearStr, month] = key.split("-");
      return { month: month!, year: parseInt(yearStr!, 10), count };
    })
    .sort((a, b) => a.year - b.year || a.month.localeCompare(b.month));
}

export function calculateYearlyTotals(days: ContributionDay[]): YearlyTotal[] {
  const grouped = new Map<number, number>();

  for (const day of days) {
    const year = new Date(day.date).getFullYear();
    grouped.set(year, (grouped.get(year) ?? 0) + day.count);
  }

  return Array.from(grouped.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year - b.year);
}

export function calculateIntensityDistribution(
  days: ContributionDay[]
): Record<number, number> {
  const distribution: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };

  for (const day of days) {
    distribution[day.intensity] = (distribution[day.intensity] ?? 0) + 1;
  }

  return distribution;
}

export function calculateCommitFrequency(
  days: ContributionDay[]
): { daily: Record<string, number>; hourly: Record<string, number> } {
  const daily: Record<string, number> = {};
  const hourly: Record<string, number> = {};

  for (const day of days) {
    if (day.count > 0) {
      const date = new Date(day.date);
      const dayName = date.toLocaleString("en-US", { weekday: "short" });
      daily[dayName] = (daily[dayName] ?? 0) + day.count;
    }
  }

  return { daily, hourly };
}

export function findMostActiveDay(days: ContributionDay[]): string | null {
  if (days.length === 0) return null;
  return days.reduce((max, d) => (d.count > max.count ? d : max), days[0]!).date;
}

export function findMostActiveHour(): number | null {
  return null;
}

export function calculateContributionTotals(days: ContributionDay[]): {
  allTime: number;
  thisYear: number;
  thisMonth: number;
  thisWeek: number;
} {
  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());

  let allTime = 0;
  let yearTotal = 0;
  let monthTotal = 0;
  let weekTotal = 0;

  for (const day of days) {
    allTime += day.count;
    const d = new Date(day.date);

    if (d.getFullYear() === thisYear) yearTotal += day.count;
    if (d.getFullYear() === thisYear && d.getMonth() === thisMonth) monthTotal += day.count;
    if (d >= startOfWeek) weekTotal += day.count;
  }

  return { allTime, thisYear: yearTotal, thisMonth: monthTotal, thisWeek: weekTotal };
}
