import { describe, it, expect } from "vitest";
import { calculateMonthlyComparisons, calculateSixMonthGrowth, calculateYearOverYearGrowth, calculateGrowthScore, calculateDirection, calculateTrends } from "../services/trend.service";

function makeDay(date: string, count: number) {
  return { date, count };
}

describe("trend.service", () => {
  describe("calculateMonthlyComparisons", () => {
    it("returns empty for insufficient data", () => {
      expect(calculateMonthlyComparisons([])).toEqual([]);
    });

    it("returns period comparisons for multi-month data", () => {
      const days: { date: string; count: number }[] = [];
      for (let day = 1; day <= 90; day++) {
        const date = new Date(2024, 0, day);
        days.push(makeDay(date.toISOString().slice(0, 10), 5));
      }
      const comparisons = calculateMonthlyComparisons(days);
      expect(comparisons.length).toBeGreaterThanOrEqual(2);
      expect(comparisons[0]?.period).toBeDefined();
      expect(comparisons[0]?.changePercent).toBeDefined();
    });
  });

  describe("calculateSixMonthGrowth", () => {
    it("returns 0 for empty input", () => {
      expect(calculateSixMonthGrowth([])).toBe(0);
    });
  });

  describe("calculateYearOverYearGrowth", () => {
    it("returns 0 for empty input", () => {
      expect(calculateYearOverYearGrowth([])).toBe(0);
    });
  });

  describe("calculateGrowthScore", () => {
    it("returns a bounded value", () => {
      const days = Array.from({ length: 400 }, (_, i) => {
        const date = new Date(2023, 0, i + 1);
        return makeDay(date.toISOString().slice(0, 10), 5);
      });
      const score = calculateGrowthScore(days);
      expect(score).toBeGreaterThanOrEqual(-100);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe("calculateDirection", () => {
    it("returns stable for empty input", () => {
      expect(calculateDirection([])).toBe("stable");
    });
  });

  describe("calculateTrends (combined)", () => {
    it("returns complete TrendResult", () => {
      const days = Array.from({ length: 400 }, (_, i) => {
        const date = new Date(2023, 0, i + 1);
        return makeDay(date.toISOString().slice(0, 10), 5);
      });
      const result = calculateTrends(days);
      expect(["up", "down", "stable"]).toContain(result.direction);
      expect(result.growthScore).toBeGreaterThanOrEqual(-100);
      expect(result.growthScore).toBeLessThanOrEqual(100);
    });
  });
});
