import type { TrendResult, PeriodComparison } from "../types";

function filterUpToDate(
  days: { date: string; count: number }[],
  currentDate?: string
): { date: string; count: number }[] {
  if (!currentDate) return [...days];
  return days.filter((d) => d.date <= currentDate);
}

export function calculatePeriodComparison(
  days: { date: string; count: number }[],
  currentPeriodLabel: string,
  _previousPeriodLabel: string,
  currentStart: string,
  currentEnd: string,
  previousStart: string,
  previousEnd: string
): PeriodComparison {
  const currentTotal = days
    .filter((d) => d.date >= currentStart && d.date <= currentEnd)
    .reduce((s, d) => s + d.count, 0);

  const previousTotal = days
    .filter((d) => d.date >= previousStart && d.date <= previousEnd)
    .reduce((s, d) => s + d.count, 0);

  const change = currentTotal - previousTotal;
  const changePercent = previousTotal > 0
    ? Math.round((change / previousTotal) * 10000) / 100
    : currentTotal > 0 ? 100 : 0;

  return {
    period: currentPeriodLabel,
    previous: previousTotal,
    current: currentTotal,
    change,
    changePercent,
  };
}

export function calculateMonthlyComparisons(
  days: { date: string; count: number }[],
  currentDate?: string
): PeriodComparison[] {
  const filtered = filterUpToDate(days, currentDate);
  if (filtered.length < 30) return [];

  const byMonth = new Map<string, { year: number; month: number; count: number }>();

  for (const day of filtered) {
    const d = new Date(day.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const existing = byMonth.get(key);
    if (existing) {
      existing.count += day.count;
    } else {
      byMonth.set(key, { year: d.getFullYear(), month: d.getMonth() + 1, count: day.count });
    }
  }

  const months = Array.from(byMonth.entries())
    .map(([key, data]) => ({ key, ...data }))
    .sort((a, b) => a.key.localeCompare(b.key));

  const comparisons: PeriodComparison[] = [];

  for (let i = 1; i < months.length; i++) {
    const current = months[i];
    const previous = months[i - 1];
    if (!current || !previous) continue;

    const change = current.count - previous.count;
    const changePercent = previous.count > 0
      ? Math.round((change / previous.count) * 10000) / 100
      : 100;

    comparisons.push({
      period: current.key,
      previous: previous.count,
      current: current.count,
      change,
      changePercent,
    });
  }

  return comparisons;
}

export function calculateSixMonthGrowth(
  days: { date: string; count: number }[],
  currentDate?: string
): number {
  const now = currentDate ? new Date(currentDate) : new Date();
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const yearAgo = new Date(now);
  yearAgo.setMonth(yearAgo.getMonth() - 12);

  const recentStr = sixMonthsAgo.toISOString().slice(0, 10);
  const pastStr = yearAgo.toISOString().slice(0, 10);

  const recentTotal = days
    .filter((d) => d.date >= recentStr && d.date <= (currentDate ?? ""))
    .reduce((s, d) => s + d.count, 0);

  const pastTotal = days
    .filter((d) => d.date >= pastStr && d.date < recentStr)
    .reduce((s, d) => s + d.count, 0);

  if (pastTotal === 0) return recentTotal > 0 ? 100 : 0;
  return Math.round(((recentTotal - pastTotal) / pastTotal) * 100);
}

export function calculateYearOverYearGrowth(
  days: { date: string; count: number }[],
  currentDate?: string
): number {
  const now = currentDate ? new Date(currentDate) : new Date();
  const thisYear = now.getFullYear();
  const lastYear = thisYear - 1;

  const thisYearTotal = days
    .filter((d) => {
      const year = new Date(d.date).getFullYear();
      return year === thisYear && (!currentDate || d.date <= currentDate);
    })
    .reduce((s, d) => s + d.count, 0);

  const lastYearTotal = days
    .filter((d) => new Date(d.date).getFullYear() === lastYear)
    .reduce((s, d) => s + d.count, 0);

  if (lastYearTotal === 0) return thisYearTotal > 0 ? 100 : 0;
  return Math.round(((thisYearTotal - lastYearTotal) / lastYearTotal) * 100);
}

export function calculateGrowthScore(
  days: { date: string; count: number }[],
  currentDate?: string
): number {
  const momentum = calculateSixMonthGrowth(days, currentDate);
  const yoy = calculateYearOverYearGrowth(days, currentDate);
  const score = (momentum * 0.4 + yoy * 0.6);
  return Math.round(Math.max(-100, Math.min(100, score)));
}

export function calculateDirection(
  days: { date: string; count: number }[],
  currentDate?: string
): "up" | "down" | "stable" {
  const score = calculateGrowthScore(days, currentDate);
  if (score > 10) return "up";
  if (score < -10) return "down";
  return "stable";
}

export function calculateTrends(
  days: { date: string; count: number }[],
  currentDate?: string
): TrendResult {
  return {
    comparisons: calculateMonthlyComparisons(days, currentDate),
    growthScore: calculateGrowthScore(days, currentDate),
    direction: calculateDirection(days, currentDate),
    sixMonthGrowth: calculateSixMonthGrowth(days, currentDate),
    yearOverYearGrowth: calculateYearOverYearGrowth(days, currentDate),
  };
}
