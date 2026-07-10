import type { ActivityResult } from "../types";

function filterUpToDate(
  days: { date: string; count: number }[],
  currentDate?: string
): { date: string; count: number }[] {
  if (!currentDate) return [...days];
  return days.filter((d) => d.date <= currentDate);
}

export function calculateActivityHeatScore(
  days: { date: string; count: number }[],
  currentDate?: string
): number {
  const filtered = filterUpToDate(days, currentDate);
  if (filtered.length === 0) return 0;

  const activeDays = filtered.filter((d) => d.count > 0).length;
  const ratio = activeDays / filtered.length;

  const byWeek = new Map<string, number>();
  for (const day of filtered) {
    const d = new Date(day.date);
    const dayOfWeek = d.getDay();
    const diff = d.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(d);
    monday.setDate(diff);
    const weekKey = monday.toISOString().slice(0, 10);
    byWeek.set(weekKey, (byWeek.get(weekKey) ?? 0) + (day.count > 0 ? 1 : 0));
  }

  let consistentWeeks = 0;
  for (const activeDaysInWeek of byWeek.values()) {
    if (activeDaysInWeek >= 4) consistentWeeks++;
  }

  const consistencyRatio = byWeek.size > 0 ? consistentWeeks / byWeek.size : 0;
  const score = Math.round((ratio * 60 + consistencyRatio * 40));
  return Math.min(100, score);
}

export function calculateContributionMomentum(
  days: { date: string; count: number }[],
  currentDate?: string
): number {
  const filtered = filterUpToDate(days, currentDate);
  if (filtered.length < 60) return 0;

  const midpoint = Math.floor(filtered.length / 2);
  const firstHalf = filtered.slice(0, midpoint);
  const secondHalf = filtered.slice(midpoint);

  const firstTotal = firstHalf.reduce((s, d) => s + d.count, 0);
  const secondTotal = secondHalf.reduce((s, d) => s + d.count, 0);

  if (firstTotal === 0) return secondTotal > 0 ? 100 : 0;
  const change = ((secondTotal - firstTotal) / firstTotal) * 100;

  return Math.round(Math.max(-100, Math.min(100, change)));
}

export function calculateContributionVolatility(
  days: { date: string; count: number }[],
  currentDate?: string
): number {
  const filtered = filterUpToDate(days, currentDate);
  if (filtered.length < 14) return 0;

  const weeklyTotals: number[] = [];
  const byWeek = new Map<string, number>();

  for (const day of filtered) {
    const d = new Date(day.date);
    const dayOfWeek = d.getDay();
    const diff = d.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(d);
    monday.setDate(diff);
    const weekKey = monday.toISOString().slice(0, 10);
    byWeek.set(weekKey, (byWeek.get(weekKey) ?? 0) + day.count);
  }

  for (const total of byWeek.values()) {
    weeklyTotals.push(total);
  }

  if (weeklyTotals.length < 4) return 0;

  const mean = weeklyTotals.reduce((s, v) => s + v, 0) / weeklyTotals.length;
  if (mean === 0) return 0;

  const variance =
    weeklyTotals.reduce((s, v) => s + (v - mean) ** 2, 0) / weeklyTotals.length;
  const stdDev = Math.sqrt(variance);

  const cv = (stdDev / mean) * 100;
  return Math.round(Math.min(100, cv));
}

export function findPeakActivityDay(
  days: { date: string; count: number }[],
  currentDate?: string
): { date: string; count: number } | null {
  const filtered = filterUpToDate(days, currentDate);
  if (filtered.length === 0) return null;

  return filtered.reduce(
    (max, d) => (d.count > max.count ? d : max),
    filtered[0] ?? { date: "", count: 0 }
  );
}

export function calculateWeeklyCadence(
  days: { date: string; count: number }[],
  currentDate?: string
): number[] {
  const filtered = filterUpToDate(days, currentDate);
  const byWeekday = new Map<number, number>();

  for (const day of filtered) {
    const d = new Date(day.date);
    const wd = d.getDay();
    byWeekday.set(wd, (byWeekday.get(wd) ?? 0) + day.count);
  }

  return Array.from({ length: 7 }, (_, i) => byWeekday.get(i) ?? 0);
}

export function calculateMonthlyCadence(
  days: { date: string; count: number }[],
  currentDate?: string
): number[] {
  const filtered = filterUpToDate(days, currentDate);
  const byMonth = new Map<number, number>();

  for (const day of filtered) {
    const d = new Date(day.date);
    const m = d.getMonth();
    byMonth.set(m, (byMonth.get(m) ?? 0) + day.count);
  }

  return Array.from({ length: 12 }, (_, i) => byMonth.get(i) ?? 0);
}

export function calculateActivity(
  days: { date: string; count: number }[],
  currentDate?: string
): ActivityResult {
  return {
    heatScore: calculateActivityHeatScore(days, currentDate),
    momentum: calculateContributionMomentum(days, currentDate),
    volatility: calculateContributionVolatility(days, currentDate),
    weeklyCadence: calculateWeeklyCadence(days, currentDate),
    monthlyCadence: calculateMonthlyCadence(days, currentDate),
    peak: findPeakActivityDay(days, currentDate),
  };
}
