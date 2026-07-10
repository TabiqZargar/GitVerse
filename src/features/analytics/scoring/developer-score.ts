import type { StreakResult, StatisticsResult, ActivityResult, ProductivityResult, TrendResult } from "../types";
import type { DeveloperScoreResult, ScoreComponent } from "../types";

const WEIGHTS = {
  consistency: 0.25,
  activity: 0.20,
  diversity: 0.15,
  growth: 0.15,
  productivity: 0.15,
  longevity: 0.10,
};

export function calculateDeveloperScore(
  streaks: StreakResult | null,
  statistics: StatisticsResult | null,
  activity: ActivityResult | null,
  productivity: ProductivityResult | null,
  trends: TrendResult | null,
  repoCount: number,
  langCount: number
): DeveloperScoreResult {
  const components: ScoreComponent[] = [];

  const consistencyValue = calculateConsistencyComponent(streaks);
  components.push({
    label: "Consistency",
    value: consistencyValue,
    weight: WEIGHTS.consistency,
    contribution: Math.round(consistencyValue * WEIGHTS.consistency),
  });

  const activityValue = calculateActivityComponent(statistics, activity);
  components.push({
    label: "Activity",
    value: activityValue,
    weight: WEIGHTS.activity,
    contribution: Math.round(activityValue * WEIGHTS.activity),
  });

  const diversityValue = calculateDiversityComponent(repoCount, langCount);
  components.push({
    label: "Diversity",
    value: diversityValue,
    weight: WEIGHTS.diversity,
    contribution: Math.round(diversityValue * WEIGHTS.diversity),
  });

  const growthValue = calculateGrowthComponent(trends);
  components.push({
    label: "Growth",
    value: growthValue,
    weight: WEIGHTS.growth,
    contribution: Math.round(growthValue * WEIGHTS.growth),
  });

  const productivityValue = calculateProductivityComponent(productivity);
  components.push({
    label: "Productivity",
    value: productivityValue,
    weight: WEIGHTS.productivity,
    contribution: Math.round(productivityValue * WEIGHTS.productivity),
  });

  const longevityValue = calculateLongevityComponent(statistics);
  components.push({
    label: "Longevity",
    value: longevityValue,
    weight: WEIGHTS.longevity,
    contribution: Math.round(longevityValue * WEIGHTS.longevity),
  });

  const total = Math.min(100, components.reduce((s, c) => s + c.contribution, 0));
  const grade = scoreToGrade(total);

  return { total, components, grade };
}

function calculateConsistencyComponent(streaks: StreakResult | null): number {
  if (!streaks) return 0;
  const currentScore = Math.min(streaks.currentStreak * 3, 40);
  const longestScore = Math.min(streaks.longestStreak * 1.5, 40);
  const inactivePenalty = Math.min((streaks.longestInactiveDays / 30) * 5, 20);
  return Math.max(0, Math.min(100, currentScore + longestScore - inactivePenalty));
}

function calculateActivityComponent(
  statistics: StatisticsResult | null,
  activity: ActivityResult | null
): number {
  if (!statistics || !activity) return 0;

  const totalContribs = statistics.totalContributions;
  const totalDays = statistics.totalActiveDays;
  const averages = statistics.averages;

  const volumeScore = Math.min(totalContribs / 100, 30);
  const frequencyScore = Math.min(totalDays * 0.2, 20);
  const heatScore = activity.heatScore * 0.3;
  const averageScore = Math.min(averages.daily * 5, 20);

  return Math.min(100, Math.round(volumeScore + frequencyScore + heatScore + averageScore));
}

function calculateDiversityComponent(repoCount: number, langCount: number): number {
  const repoScore = Math.min(repoCount * 2, 40);
  const langScore = Math.min(langCount * 8, 60);
  return Math.min(100, Math.round(repoScore + langScore));
}

function calculateGrowthComponent(trends: TrendResult | null): number {
  if (!trends) return 0;
  return Math.max(0, Math.min(100, 50 + trends.growthScore * 0.5));
}

function calculateProductivityComponent(productivity: ProductivityResult | null): number {
  if (!productivity) return 0;
  return Math.round(
    productivity.consistencyScore * 0.4 +
    productivity.productivityScore * 0.4 +
    productivity.activeDaysRatio * 0.2
  );
}

function calculateLongevityComponent(statistics: StatisticsResult | null): number {
  if (!statistics) return 0;

  const yearlyTotals = statistics.yearlyTotals;
  const yearCount = yearlyTotals.length;
  const yearScore = Math.min(yearCount * 15, 60);

  const totalContribs = statistics.totalContributions;
  const volumeScore = Math.min(totalContribs / 200, 40);

  return Math.min(100, Math.round(yearScore + volumeScore));
}

function scoreToGrade(score: number): string {
  if (score >= 90) return "S";
  if (score >= 80) return "A";
  if (score >= 65) return "B";
  if (score >= 50) return "C";
  if (score >= 30) return "D";
  return "F";
}
