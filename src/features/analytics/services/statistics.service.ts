import type {
  StatisticsResult,
  WeeklyTotals,
  MonthlyTotals,
  YearlyTotals,
  DistributionByLevel,
  DistributionByWeekday,
  DistributionByMonth,
  ContributionAverages,
} from "../types";

const WEEKDAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_LABELS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function filterUpToDate<T extends { date: string }>(
  days: T[],
  currentDate?: string
): T[] {
  if (!currentDate) return [...days];
  return days.filter((d) => d.date <= currentDate);
}

export function calculateTotalContributions(
  days: { date: string; count: number }[],
  currentDate?: string
): number {
  return filterUpToDate(days, currentDate).reduce((sum, d) => sum + d.count, 0);
}

export function calculateTotalActiveDays(
  days: { date: string; count: number }[],
  currentDate?: string
): number {
  return filterUpToDate(days, currentDate).filter((d) => d.count > 0).length;
}

export function calculateAverages(
  days: { date: string; count: number }[],
  currentDate?: string
): ContributionAverages {
  const filtered = filterUpToDate(days, currentDate);
  const total = filtered.reduce((s, d) => s + d.count, 0);

  if (filtered.length === 0) {
    return { daily: 0, weekly: 0, monthly: 0, yearly: 0 };
  }

  const daily = Math.round((total / filtered.length) * 100) / 100;

  const firstDate = new Date(filtered[0]?.date ?? "");
  const lastDate = new Date(filtered[filtered.length - 1]?.date ?? "");
  const totalDays = Math.max(1, Math.round((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)));
  const totalWeeks = Math.max(1, totalDays / 7);
  const totalMonths = Math.max(1, totalDays / 30.44);
  const totalYears = Math.max(1, totalDays / 365.25);

  return {
    daily,
    weekly: Math.round((total / totalWeeks) * 100) / 100,
    monthly: Math.round((total / totalMonths) * 100) / 100,
    yearly: Math.round((total / totalYears) * 100) / 100,
  };
}

export function calculateYearlyTotals(
  days: { date: string; count: number }[],
  currentDate?: string
): YearlyTotals[] {
  const filtered = filterUpToDate(days, currentDate);
  const grouped = new Map<number, number>();

  for (const day of filtered) {
    const year = new Date(day.date).getFullYear();
    grouped.set(year, (grouped.get(year) ?? 0) + day.count);
  }

  return Array.from(grouped.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year - b.year);
}

export function calculateMonthlyTotals(
  days: { date: string; count: number }[],
  currentDate?: string
): MonthlyTotals[] {
  const filtered = filterUpToDate(days, currentDate);
  const grouped = new Map<string, { year: number; month: number; count: number }>();

  for (const day of filtered) {
    const d = new Date(day.date);
    const year = d.getFullYear();
    const month = d.getMonth();
    const key = `${year}-${month}`;
    const existing = grouped.get(key);
    if (existing) {
      existing.count += day.count;
    } else {
      grouped.set(key, { year, month, count: day.count });
    }
  }

  return Array.from(grouped.values())
    .map((g) => ({ ...g, label: MONTH_LABELS[g.month] ?? "Unknown" }))
    .sort((a, b) => a.year - b.year || a.month - b.month);
}

export function calculateWeeklyTotals(
  days: { date: string; count: number }[],
  currentDate?: string
): WeeklyTotals[] {
  const filtered = filterUpToDate(days, currentDate);
  const grouped = new Map<string, number>();

  for (const day of filtered) {
    const d = new Date(day.date);
    const dayOfWeek = d.getDay();
    const diff = d.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(d);
    monday.setDate(diff);
    const key = monday.toISOString().slice(0, 10);
    grouped.set(key, (grouped.get(key) ?? 0) + day.count);
  }

  return Array.from(grouped.entries())
    .map(([week, count]) => ({ week, count }))
    .sort((a, b) => a.week.localeCompare(b.week));
}

export function calculateDistributionByLevel(
  days: { date: string; count: number; level: number }[],
  currentDate?: string
): DistributionByLevel[] {
  const filtered = filterUpToDate(days, currentDate);
  const byLevel = new Map<number, { days: number; contributions: number }>();

  for (const day of filtered) {
    const existing = byLevel.get(day.level);
    if (existing) {
      existing.days++;
      existing.contributions += day.count;
    } else {
      byLevel.set(day.level, { days: 1, contributions: day.count });
    }
  }

  return Array.from(byLevel.entries())
    .map(([level, data]) => ({ level, ...data }))
    .sort((a, b) => a.level - b.level);
}

export function calculateDistributionByWeekday(
  days: { date: string; count: number }[],
  currentDate?: string
): DistributionByWeekday[] {
  const filtered = filterUpToDate(days, currentDate);
  const byWeekday = new Map<number, { days: number; contributions: number }>();

  for (const day of filtered) {
    const d = new Date(day.date);
    const wd = d.getDay();
    const existing = byWeekday.get(wd);
    if (existing) {
      existing.days++;
      existing.contributions += day.count;
    } else {
      byWeekday.set(wd, { days: 1, contributions: day.count });
    }
  }

  return Array.from(byWeekday.entries())
    .map(([weekday, data]) => ({
      weekday,
      label: WEEKDAY_LABELS[weekday] ?? "Unknown",
      ...data,
    }))
    .sort((a, b) => a.weekday - b.weekday);
}

export function calculateDistributionByMonth(
  days: { date: string; count: number }[],
  currentDate?: string
): DistributionByMonth[] {
  const filtered = filterUpToDate(days, currentDate);
  const byMonth = new Map<number, number>();

  for (const day of filtered) {
    const d = new Date(day.date);
    const m = d.getMonth();
    byMonth.set(m, (byMonth.get(m) ?? 0) + day.count);
  }

  return Array.from(byMonth.entries())
    .map(([month, contributions]) => ({
      month,
      label: MONTH_LABELS[month] ?? "Unknown",
      contributions,
    }))
    .sort((a, b) => a.month - b.month);
}

export function findMostProductiveWeekday(
  days: { date: string; count: number }[],
  currentDate?: string
): { weekday: number; label: string; contributions: number } {
  const distribution = calculateDistributionByWeekday(days, currentDate);
  if (distribution.length === 0) return { weekday: 0, label: "Sunday", contributions: 0 };

  const sorted = [...distribution].sort((a, b) => b.contributions - a.contributions);
  const top = sorted[0];
  if (!top) return { weekday: 0, label: "Sunday", contributions: 0 };
  return { weekday: top.weekday, label: top.label, contributions: top.contributions };
}

export function findMostProductiveMonth(
  days: { date: string; count: number }[],
  currentDate?: string
): { month: number; label: string; contributions: number } {
  const distribution = calculateDistributionByMonth(days, currentDate);
  if (distribution.length === 0) return { month: 0, label: "January", contributions: 0 };

  const sorted = [...distribution].sort((a, b) => b.contributions - a.contributions);
  const top = sorted[0];
  if (!top) return { month: 0, label: "January", contributions: 0 };
  return { month: top.month, label: top.label, contributions: top.contributions };
}

export function findMostProductiveYear(
  days: { date: string; count: number }[],
  currentDate?: string
): { year: number; contributions: number } {
  const totals = calculateYearlyTotals(days, currentDate);
  if (totals.length === 0) return { year: 0, contributions: 0 };

  const sorted = [...totals].sort((a, b) => b.count - a.count);
  const top = sorted[0];
  if (!top) return { year: 0, contributions: 0 };
  return { year: top.year, contributions: top.count };
}

export function calculateStatistics(
  days: { date: string; count: number; level: number }[],
  currentDate?: string
): StatisticsResult {
  return {
    totalContributions: calculateTotalContributions(days, currentDate),
    totalActiveDays: calculateTotalActiveDays(days, currentDate),
    averages: calculateAverages(days, currentDate),
    yearlyTotals: calculateYearlyTotals(days, currentDate),
    monthlyTotals: calculateMonthlyTotals(days, currentDate),
    weeklyTotals: calculateWeeklyTotals(days, currentDate),
    byLevel: calculateDistributionByLevel(days, currentDate),
    byWeekday: calculateDistributionByWeekday(days, currentDate),
    byMonth: calculateDistributionByMonth(days, currentDate),
    mostProductiveWeekday: findMostProductiveWeekday(days, currentDate),
    mostProductiveMonth: findMostProductiveMonth(days, currentDate),
    mostProductiveYear: findMostProductiveYear(days, currentDate),
  };
}
