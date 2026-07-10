import type {
  AnalyticsInput, DeveloperSummary, StreakResult, StatisticsResult,
  LanguageResult, RepositoryResult, ActivityResult, ProductivityResult,
  TrendResult, MilestoneResult, DeveloperScoreResult, OpenSourceScoreResult,
} from "../types";
import { generateAllInsights } from "../insights/insight-generators";
import { calculateStreaks } from "./streak.service";
import { calculateStatistics } from "./statistics.service";
import { calculateLanguageAnalytics } from "./language.service";
import { calculateRepositoryAnalytics } from "./repository.service";
import { calculateActivity } from "./activity.service";
import { calculateProductivity } from "./productivity.service";
import { calculateTrends } from "./trend.service";
import { calculateMilestones } from "./milestone.service";
import { calculateDeveloperScore } from "../scoring/developer-score";
import { calculateOpenSourceScore } from "../scoring/open-source-score";

export function computeDeveloperSummary(input: AnalyticsInput): DeveloperSummary {
  const { days, repositories, currentDate } = input;
  const dayData = days.map((d) => ({ date: d.date, count: d.count }));
  const dayDataWithLevel = days.map((d) => ({ date: d.date, count: d.count, level: d.level }));

  const streaks: StreakResult = calculateStreaks(dayData, currentDate);
  const statistics: StatisticsResult = calculateStatistics(dayDataWithLevel, currentDate);
  const language: LanguageResult = calculateLanguageAnalytics(repositories);
  const repository: RepositoryResult = calculateRepositoryAnalytics(repositories);
  const activity: ActivityResult = calculateActivity(dayData, currentDate);
  const productivity: ProductivityResult = calculateProductivity(dayData, currentDate);
  const trends: TrendResult = calculateTrends(dayData, currentDate);
  const milestones: MilestoneResult = calculateMilestones({ days: dayData, repositories, currentDate });

  const developerScore: DeveloperScoreResult = calculateDeveloperScore(
    streaks, statistics, activity, productivity, trends,
    repository.total, language.diversity
  );

  const openSourceScore: OpenSourceScoreResult = calculateOpenSourceScore(repositories);

  const insights = generateAllInsights({
    streaks, statistics, language, repository, activity, productivity, trends, milestones,
  });

  return {
    streaks,
    statistics,
    language,
    repository,
    activity,
    productivity,
    trends,
    milestones,
    scores: { developer: developerScore, openSource: openSourceScore },
    insights,
    computedAt: new Date().toISOString(),
  };
}
