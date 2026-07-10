import type { ProductivityResult } from "../types";

function filterUpToDate(
  days: { date: string; count: number }[],
  currentDate?: string
): { date: string; count: number }[] {
  if (!currentDate) return [...days];
  return days.filter((d) => d.date <= currentDate);
}

export function calculateCommitFrequency(
  days: { date: string; count: number }[],
  currentDate?: string
): number {
  const filtered = filterUpToDate(days, currentDate);
  if (filtered.length === 0) return 0;

  const activeDays = filtered.filter((d) => d.count > 0).length;
  const ratio = activeDays / filtered.length;

  const totalContributions = filtered.reduce((s, d) => s + d.count, 0);
  const contributionsPerActiveDay = activeDays > 0 ? totalContributions / activeDays : 0;

  const frequency = (ratio * 50 + Math.min(contributionsPerActiveDay, 10) * 5);
  return Math.round(frequency * 100) / 100;
}

export function calculateConsistencyScore(
  days: { date: string; count: number }[],
  currentDate?: string
): number {
  const filtered = filterUpToDate(days, currentDate);
  if (filtered.length < 7) return 0;

  const byWeek = new Map<string, { days: number; total: number }>();

  for (const day of filtered) {
    const d = new Date(day.date);
    const dayOfWeek = d.getDay();
    const diff = d.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(d);
    monday.setDate(diff);
    const weekKey = monday.toISOString().slice(0, 10);

    const existing = byWeek.get(weekKey);
    if (existing) {
      existing.days += day.count > 0 ? 1 : 0;
      existing.total += day.count;
    } else {
      byWeek.set(weekKey, { days: day.count > 0 ? 1 : 0, total: day.count });
    }
  }

  const weeks = Array.from(byWeek.values());
  if (weeks.length < 4) return 0;

  const totalActiveDays = weeks.reduce((s, w) => s + w.days, 0);
  const avgActiveDays = totalActiveDays / weeks.length;
  const regularityScore = Math.min((avgActiveDays / 7) * 100, 100);

  const withActivity = weeks.filter((w) => w.total > 0).length;
  const consistencyRatio = withActivity / weeks.length;
  const consistencyScore = Math.round(consistencyRatio * 100);

  return Math.round(regularityScore * 0.4 + consistencyScore * 0.6);
}

export function calculateProductivityScore(
  days: { date: string; count: number }[],
  currentDate?: string
): number {
  const filtered = filterUpToDate(days, currentDate);
  if (filtered.length < 7) return 0;

  const totalContributions = filtered.reduce((s, d) => s + d.count, 0);
  const activeDays = filtered.filter((d) => d.count > 0).length;

  const contributionScore = Math.min((totalContributions / Math.max(1, filtered.length)) * 2, 50);
  const activityScore = Math.min((activeDays / Math.max(1, filtered.length)) * 100, 50);

  return Math.round(contributionScore + activityScore);
}

export function calculateMostProductivePeriod(
  days: { date: string; count: number }[],
  currentDate?: string
): string {
  const filtered = filterUpToDate(days, currentDate);
  if (filtered.length === 0) return "None";

  const byMonth = new Map<string, number>();

  for (const day of filtered) {
    const d = new Date(day.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    byMonth.set(key, (byMonth.get(key) ?? 0) + day.count);
  }

  let bestPeriod = "";
  let bestCount = 0;

  for (const [period, count] of byMonth) {
    if (count > bestCount) {
      bestCount = count;
      bestPeriod = period;
    }
  }

  return bestPeriod;
}

export function calculateActiveDaysRatio(
  days: { date: string; count: number }[],
  currentDate?: string
): number {
  const filtered = filterUpToDate(days, currentDate);
  if (filtered.length === 0) return 0;

  const activeDays = filtered.filter((d) => d.count > 0).length;
  return Math.round((activeDays / filtered.length) * 10000) / 100;
}

export function calculateProductivity(
  days: { date: string; count: number }[],
  currentDate?: string
): ProductivityResult {
  return {
    commitFrequency: calculateCommitFrequency(days, currentDate),
    consistencyScore: calculateConsistencyScore(days, currentDate),
    productivityScore: calculateProductivityScore(days, currentDate),
    mostProductivePeriod: calculateMostProductivePeriod(days, currentDate),
    activeDaysRatio: calculateActiveDaysRatio(days, currentDate),
  };
}
