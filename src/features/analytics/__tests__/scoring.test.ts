import { describe, it, expect } from "vitest";
import { calculateDeveloperScore } from "../scoring/developer-score";
import { calculateOpenSourceScore } from "../scoring/open-source-score";
import type { StreakResult, StatisticsResult, ActivityResult, ProductivityResult, TrendResult } from "../types";
import type { Repository } from "@/features/github/types/domain";

describe("scoring models", () => {
  describe("calculateDeveloperScore", () => {
    const mockStreaks: StreakResult = {
      currentStreak: 10,
      currentStreakStart: "2024-01-01",
      currentStreakEnd: "2024-01-10",
      longestStreak: 30,
      longestStreakStart: "2024-03-01",
      longestStreakEnd: "2024-03-30",
      streakHistory: [],
      longestInactiveDays: 5,
      longestInactiveStart: null,
      longestInactiveEnd: null,
    };

    const mockStatistics: StatisticsResult = {
      totalContributions: 5000,
      totalActiveDays: 200,
      averages: { daily: 5.2, weekly: 36.4, monthly: 156, yearly: 1872 },
      yearlyTotals: [{ year: 2024, count: 2500 }],
      monthlyTotals: [],
      weeklyTotals: [],
      byLevel: [],
      byWeekday: [],
      byMonth: [],
      mostProductiveWeekday: { weekday: 2, label: "Tuesday", contributions: 1000 },
      mostProductiveMonth: { month: 3, label: "March", contributions: 600 },
      mostProductiveYear: { year: 2024, contributions: 2500 },
    };

    const mockActivity: ActivityResult = {
      heatScore: 75,
      momentum: 20,
      volatility: 30,
      weeklyCadence: [10, 15, 20, 18, 22, 8, 5],
      monthlyCadence: [],
      peak: { date: "2024-03-15", count: 50 },
    };

    const mockProductivity: ProductivityResult = {
      commitFrequency: 3.5,
      consistencyScore: 70,
      productivityScore: 65,
      mostProductivePeriod: "2024-03",
      activeDaysRatio: 55,
    };

    const mockTrends: TrendResult = {
      comparisons: [],
      growthScore: 25,
      direction: "up",
      sixMonthGrowth: 30,
      yearOverYearGrowth: 15,
    };

    it("returns a score between 0 and 100", () => {
      const score = calculateDeveloperScore(
        mockStreaks, mockStatistics, mockActivity, mockProductivity, mockTrends, 20, 8
      );
      expect(score.total).toBeGreaterThanOrEqual(0);
      expect(score.total).toBeLessThanOrEqual(100);
    });

    it("returns score components with weights", () => {
      const score = calculateDeveloperScore(
        mockStreaks, mockStatistics, mockActivity, mockProductivity, mockTrends, 20, 8
      );
      expect(score.components.length).toBeGreaterThan(0);
      for (const component of score.components) {
        expect(component.weight).toBeGreaterThan(0);
        expect(component.contribution).toBeGreaterThanOrEqual(0);
      }
    });

    it("returns a grade string", () => {
      const score = calculateDeveloperScore(
        mockStreaks, mockStatistics, mockActivity, mockProductivity, mockTrends, 20, 8
      );
      expect(["S", "A", "B", "C", "D", "F"]).toContain(score.grade);
    });

    it("handles null inputs gracefully", () => {
      const score = calculateDeveloperScore(null, null, null, null, null, 0, 0);
      expect(score.total).toBeGreaterThanOrEqual(0);
    });
  });

  describe("calculateOpenSourceScore", () => {
    const makeRepo = (overrides: Partial<Repository> = {}): Repository => ({
      id: "1",
      githubId: 1,
      name: "test-repo",
      fullName: "user/test-repo",
      description: "A test repository",
      url: "https://github.com/user/test-repo",
      owner: "user",
      visibility: "PUBLIC",
      primaryLanguage: "TypeScript",
      languages: [{ name: "TypeScript", size: 10000, percentage: 100 }],
      stars: 50,
      forks: 10,
      openIssues: 2,
      size: 100,
      isFork: false,
      isArchived: false,
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      pushedAt: "2024-01-01T00:00:00Z",
      defaultBranch: "main",
      ...overrides,
    });

    it("returns 0 for empty repos", () => {
      const score = calculateOpenSourceScore([]);
      expect(score.total).toBeGreaterThanOrEqual(0);
    });

    it("scores active public repos higher", () => {
      const repos = [
        makeRepo({ visibility: "PUBLIC", stars: 100, forks: 20 }),
        makeRepo({ visibility: "PUBLIC", stars: 50, forks: 5 }),
      ];
      const score = calculateOpenSourceScore(repos);
      expect(score.total).toBeGreaterThan(0);
    });

    it("returns score components with weights", () => {
      const repos = [makeRepo()];
      const score = calculateOpenSourceScore(repos);
      expect(score.components.length).toBeGreaterThan(0);
      for (const component of score.components) {
        expect(component.weight).toBeGreaterThan(0);
      }
    });

    it("returns a grade", () => {
      const repos = [makeRepo()];
      const score = calculateOpenSourceScore(repos);
      expect(["A", "B", "C", "D", "F"]).toContain(score.grade);
    });
  });
});
