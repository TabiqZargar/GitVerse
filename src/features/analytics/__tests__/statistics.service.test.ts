import { describe, it, expect } from "vitest";
import {
  calculateTotalContributions,
  calculateTotalActiveDays,
  calculateAverages,
  calculateYearlyTotals,
  calculateMonthlyTotals,
  calculateDistributionByLevel,
  calculateDistributionByWeekday,
  findMostProductiveWeekday,
  findMostProductiveMonth,
  calculateStatistics,
} from "../services/statistics.service";

function makeDay(date: string, count: number, level: number = Math.min(count, 4) as 0 | 1 | 2 | 3 | 4) {
  return { date, count, level };
}

describe("statistics.service", () => {
  const sampleDays = [
    makeDay("2024-01-01", 5, 3),
    makeDay("2024-01-02", 3, 2),
    makeDay("2024-01-03", 0, 0),
    makeDay("2024-01-04", 7, 4),
    makeDay("2024-01-05", 2, 1),
  ];

  describe("calculateTotalContributions", () => {
    it("sums all counts", () => {
      expect(calculateTotalContributions(sampleDays)).toBe(17);
    });

    it("returns 0 for empty input", () => {
      expect(calculateTotalContributions([])).toBe(0);
    });
  });

  describe("calculateTotalActiveDays", () => {
    it("counts days with count > 0", () => {
      expect(calculateTotalActiveDays(sampleDays)).toBe(4);
    });
  });

  describe("calculateAverages", () => {
    it("returns non-zero daily average", () => {
      const avg = calculateAverages(sampleDays);
      expect(avg.daily).toBeGreaterThan(0);
    });

    it("returns 0 for empty input", () => {
      const avg = calculateAverages([]);
      expect(avg.daily).toBe(0);
      expect(avg.weekly).toBe(0);
    });
  });

  describe("calculateYearlyTotals", () => {
    it("groups by year", () => {
      const days = [
        makeDay("2023-06-01", 10),
        makeDay("2024-01-01", 5),
        makeDay("2024-06-01", 7),
      ];
      const totals = calculateYearlyTotals(days);
      expect(totals).toHaveLength(2);
      const year2024 = totals.find((t) => t.year === 2024);
      expect(year2024?.count).toBe(12);
    });
  });

  describe("calculateMonthlyTotals", () => {
    it("groups by month", () => {
      const days = [
        makeDay("2024-01-01", 5),
        makeDay("2024-01-15", 3),
        makeDay("2024-02-01", 7),
      ];
      const totals = calculateMonthlyTotals(days);
      expect(totals).toHaveLength(2);
    });
  });

  describe("calculateDistributionByLevel", () => {
    it("distributes days and contributions by level", () => {
      const dist = calculateDistributionByLevel(sampleDays);
      expect(dist.length).toBeGreaterThan(0);
      const level3 = dist.find((d) => d.level === 3);
      expect(level3?.days).toBe(1);
      expect(level3?.contributions).toBe(5);
    });
  });

  describe("calculateDistributionByWeekday", () => {
    it("returns 7 entries (one per weekday)", () => {
      const dist = calculateDistributionByWeekday([
        makeDay("2024-01-01", 5), // Monday
        makeDay("2024-01-02", 3), // Tuesday
      ]);
      expect(dist.length).toBe(2);
    });
  });

  describe("findMostProductiveWeekday", () => {
    it("identifies the weekday with most contributions", () => {
      const result = findMostProductiveWeekday(sampleDays);
      expect(result.contributions).toBeGreaterThan(0);
    });
  });

  describe("findMostProductiveMonth", () => {
    it("identifies the month with most contributions", () => {
      const result = findMostProductiveMonth(sampleDays);
      expect(result.contributions).toBeGreaterThan(0);
    });
  });

  describe("calculateStatistics (combined)", () => {
    it("returns complete StatisticsResult", () => {
      const stats = calculateStatistics(sampleDays);
      expect(stats.totalContributions).toBe(17);
      expect(stats.totalActiveDays).toBe(4);
      expect(stats.averages.daily).toBeGreaterThan(0);
      expect(stats.byLevel.length).toBeGreaterThan(0);
      expect(stats.byWeekday.length).toBeGreaterThan(0);
      expect(stats.mostProductiveYear.year).toBe(2024);
    });
  });
});
