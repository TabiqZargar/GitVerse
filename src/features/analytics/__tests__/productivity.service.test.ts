import { describe, it, expect } from "vitest";
import { calculateProductivity, calculateConsistencyScore, calculateActiveDaysRatio } from "../services/productivity.service";

function makeDay(date: string, count: number) {
  return { date, count };
}

describe("productivity.service", () => {
  describe("calculateConsistencyScore", () => {
    it("returns 0 for insufficient data", () => {
      expect(calculateConsistencyScore([])).toBe(0);
    });

    it("returns higher for regular activity", () => {
      const days = Array.from({ length: 60 }, (_, i) => {
        const date = new Date(2024, 0, i + 1);
        return makeDay(date.toISOString().slice(0, 10), 3);
      });
      const score = calculateConsistencyScore(days);
      expect(score).toBeGreaterThan(50);
    });
  });

  describe("calculateActiveDaysRatio", () => {
    it("returns 100 for all days active", () => {
      const days = [
        makeDay("2024-01-01", 1),
        makeDay("2024-01-02", 2),
        makeDay("2024-01-03", 3),
      ];
      expect(calculateActiveDaysRatio(days)).toBe(100);
    });

    it("returns 0 for empty input", () => {
      expect(calculateActiveDaysRatio([])).toBe(0);
    });
  });

  describe("calculateProductivity (combined)", () => {
    it("returns complete ProductivityResult", () => {
      const days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(2024, 0, i + 1);
        return makeDay(date.toISOString().slice(0, 10), i % 2 === 0 ? 5 : 0);
      });
      const result = calculateProductivity(days);
      expect(result.commitFrequency).toBeGreaterThanOrEqual(0);
      expect(result.consistencyScore).toBeGreaterThanOrEqual(0);
      expect(result.productivityScore).toBeGreaterThanOrEqual(0);
      expect(result.mostProductivePeriod).not.toBe("None");
    });
  });
});
