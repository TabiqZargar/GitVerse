import { describe, it, expect } from "vitest";
import {
  calculateActivityHeatScore,
  calculateContributionMomentum,
  calculateContributionVolatility,
  findPeakActivityDay,
  calculateWeeklyCadence,
  calculateActivity,
} from "../services/activity.service";

function makeDay(date: string, count: number) {
  return { date, count };
}

describe("activity.service", () => {
  describe("calculateActivityHeatScore", () => {
    it("returns 0 for empty input", () => {
      expect(calculateActivityHeatScore([])).toBe(0);
    });

    it("returns high score for consistent daily activity", () => {
      const days = Array.from({ length: 28 }, (_, i) => {
        const date = new Date(2024, 0, i + 1);
        return makeDay(date.toISOString().slice(0, 10), 5);
      });
      const score = calculateActivityHeatScore(days);
      expect(score).toBeGreaterThan(50);
    });

    it("returns low score for sparse activity", () => {
      const days = Array.from({ length: 28 }, (_, i) => {
        const date = new Date(2024, 0, i + 1);
        return makeDay(date.toISOString().slice(0, 10), i % 7 === 0 ? 5 : 0);
      });
      const score = calculateActivityHeatScore(days);
      expect(score).toBeLessThan(80);
    });
  });

  describe("calculateContributionMomentum", () => {
    it("returns 0 for insufficient data", () => {
      expect(calculateContributionMomentum([])).toBe(0);
    });

    it("returns positive for increasing trend", () => {
      const days: { date: string; count: number }[] = [];
      for (let i = 0; i < 120; i++) {
        const date = new Date(2024, 0, i + 1);
        days.push(makeDay(date.toISOString().slice(0, 10), Math.floor(i / 10)));
      }
      const momentum = calculateContributionMomentum(days);
      expect(momentum).toBeGreaterThan(0);
    });

    it("returns negative for decreasing trend", () => {
      const days: { date: string; count: number }[] = [];
      for (let i = 120; i > 0; i--) {
        const date = new Date(2024, 0, 121 - i);
        days.push(makeDay(date.toISOString().slice(0, 10), i));
      }
      const momentum = calculateContributionMomentum(days);
      expect(momentum).toBeLessThan(0);
    });
  });

  describe("calculateContributionVolatility", () => {
    it("returns 0 for insufficient data", () => {
      expect(calculateContributionVolatility([])).toBe(0);
    });

    it("returns lower for consistent activity", () => {
      const days = Array.from({ length: 60 }, (_, i) => {
        const date = new Date(2024, 0, i + 1);
        return makeDay(date.toISOString().slice(0, 10), 5);
      });
      const volatility = calculateContributionVolatility(days);
      expect(volatility).toBeLessThan(50);
    });
  });

  describe("findPeakActivityDay", () => {
    it("returns the day with highest count", () => {
      const days = [
        makeDay("2024-01-01", 5),
        makeDay("2024-01-02", 20),
        makeDay("2024-01-03", 3),
      ];
      const peak = findPeakActivityDay(days);
      expect(peak?.date).toBe("2024-01-02");
      expect(peak?.count).toBe(20);
    });

    it("returns null for empty input", () => {
      expect(findPeakActivityDay([])).toBeNull();
    });
  });

  describe("calculateWeeklyCadence", () => {
    it("returns 7-length array", () => {
      const cadence = calculateWeeklyCadence([]);
      expect(cadence).toHaveLength(7);
    });
  });

  describe("calculateActivity (combined)", () => {
    it("returns complete ActivityResult", () => {
      const days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(2024, 0, i + 1);
        return makeDay(date.toISOString().slice(0, 10), 3);
      });
      const result = calculateActivity(days);
      expect(result.heatScore).toBeGreaterThan(0);
      expect(result.weeklyCadence).toHaveLength(7);
      expect(result.monthlyCadence).toHaveLength(12);
      expect(result.peak).not.toBeNull();
    });
  });
});
