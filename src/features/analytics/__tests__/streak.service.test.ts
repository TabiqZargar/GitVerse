import { describe, it, expect } from "vitest";
import { calculateStreaks, calculateCurrentStreak, calculateLongestStreak, calculateStreakHistory, calculateLongestInactivePeriod } from "../services/streak.service";
import type { StreakResult } from "../types";

function makeDay(date: string, count: number) {
  return { date, count };
}

describe("streak.service", () => {
  describe("calculateCurrentStreak", () => {
    it("returns 0 for empty days", () => {
      expect(calculateCurrentStreak([]).streak).toBe(0);
    });

    it("counts consecutive days from the end", () => {
      const days = [
        makeDay("2024-01-01", 5),
        makeDay("2024-01-02", 3),
        makeDay("2024-01-03", 7),
      ];
      const result = calculateCurrentStreak(days);
      expect(result.streak).toBe(3);
      expect(result.start).toBe("2024-01-01");
      expect(result.end).toBe("2024-01-03");
    });

    it("stops at zero-count days", () => {
      const days = [
        makeDay("2024-01-01", 5),
        makeDay("2024-01-02", 0),
        makeDay("2024-01-03", 7),
      ];
      const result = calculateCurrentStreak(days);
      expect(result.streak).toBe(1);
      expect(result.start).toBe("2024-01-03");
    });

    it("respects currentDate parameter", () => {
      const days = [
        makeDay("2024-01-01", 5),
        makeDay("2024-01-02", 3),
        makeDay("2024-01-03", 7),
        makeDay("2024-01-04", 2),
        makeDay("2024-01-05", 4),
      ];
      const result = calculateCurrentStreak(days, "2024-01-03");
      expect(result.streak).toBe(3);
    });
  });

  describe("calculateLongestStreak", () => {
    it("returns 0 for empty input", () => {
      expect(calculateLongestStreak([]).streak).toBe(0);
    });

    it("finds the longest streak", () => {
      const days = [
        makeDay("2024-01-01", 1),
        makeDay("2024-01-02", 1),
        makeDay("2024-01-03", 1),
        makeDay("2024-01-04", 0),
        makeDay("2024-01-05", 1),
        makeDay("2024-01-06", 1),
      ];
      const result = calculateLongestStreak(days);
      expect(result.streak).toBe(3);
      expect(result.start).toBe("2024-01-01");
      expect(result.end).toBe("2024-01-03");
    });

    it("handles streak at the end", () => {
      const days = [
        makeDay("2024-01-01", 1),
        makeDay("2024-01-02", 0),
        makeDay("2024-01-03", 1),
        makeDay("2024-01-04", 2),
        makeDay("2024-01-05", 3),
      ];
      const result = calculateLongestStreak(days);
      expect(result.streak).toBe(3);
      expect(result.start).toBe("2024-01-03");
    });
  });

  describe("calculateStreakHistory", () => {
    it("returns empty for no data", () => {
      expect(calculateStreakHistory([])).toEqual([]);
    });

    it("returns sorted segments", () => {
      const days = [
        makeDay("2024-01-01", 1),
        makeDay("2024-01-02", 1),
        makeDay("2024-01-03", 0),
        makeDay("2024-01-04", 1),
        makeDay("2024-01-05", 1),
        makeDay("2024-01-06", 1),
      ];
      const history = calculateStreakHistory(days);
      expect(history).toHaveLength(2);
      expect(history[0]?.length).toBe(3);
      expect(history[1]?.length).toBe(2);
    });
  });

  describe("calculateLongestInactivePeriod", () => {
    it("returns 0 for continuous activity", () => {
      const days = [
        makeDay("2024-01-01", 1),
        makeDay("2024-01-02", 2),
        makeDay("2024-01-03", 1),
      ];
      expect(calculateLongestInactivePeriod(days).days).toBe(0);
    });

    it("finds longest gap", () => {
      const days = [
        makeDay("2024-01-01", 1),
        makeDay("2024-01-02", 0),
        makeDay("2024-01-03", 0),
        makeDay("2024-01-04", 1),
        makeDay("2024-01-05", 1),
        makeDay("2024-01-06", 0),
        makeDay("2024-01-07", 1),
      ];
      expect(calculateLongestInactivePeriod(days).days).toBe(2);
    });
  });

  describe("calculateStreaks (combined)", () => {
    it("returns complete StreakResult with currentDate", () => {
      const days = [
        makeDay("2024-01-01", 1),
        makeDay("2024-01-02", 1),
        makeDay("2024-01-03", 1),
        makeDay("2024-01-04", 0),
        makeDay("2024-01-05", 1),
      ];

      const result: StreakResult = calculateStreaks(days, "2024-01-03");
      expect(result.currentStreak).toBe(3);
      expect(result.longestStreak).toBe(3);
      expect(result.longestInactiveDays).toBe(0);
      expect(result.streakHistory.length).toBeGreaterThanOrEqual(1);
    });

    it("handles gap between active days", () => {
      const days = [
        makeDay("2024-01-01", 1),
        makeDay("2024-01-02", 1),
        makeDay("2024-01-03", 0),
        makeDay("2024-01-04", 0),
        makeDay("2024-01-05", 1),
        makeDay("2024-01-06", 1),
        makeDay("2024-01-07", 1),
      ];

      const result: StreakResult = calculateStreaks(days);
      expect(result.longestStreak).toBe(3);
      expect(result.longestInactiveDays).toBe(2);
    });
  });
});
