import type {
  Insight, InsightCollection, StreakResult, StatisticsResult,
  LanguageResult, RepositoryResult, ActivityResult, ProductivityResult, TrendResult, MilestoneResult,
} from "../types";

function makeId(): string {
  return `insight-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function now(): string {
  return new Date().toISOString();
}

export function generateStreakInsights(streaks: StreakResult | null): Insight[] {
  const insights: Insight[] = [];
  if (!streaks) return insights;

  if (streaks.currentStreak >= 30) {
    insights.push({
      id: makeId(),
      category: "streak",
      message: `You're on a ${streaks.currentStreak}-day streak. Consistent work is building momentum.`,
      severity: "positive",
      metric: streaks.currentStreak,
      timestamp: now(),
    });
  } else if (streaks.currentStreak >= 7) {
    insights.push({
      id: makeId(),
      category: "streak",
      message: `Current streak is ${streaks.currentStreak} days. Try to reach 30 for a full month.`,
      severity: "positive",
      metric: streaks.currentStreak,
      timestamp: now(),
    });
  }

  if (streaks.longestStreak >= 100) {
    insights.push({
      id: makeId(),
      category: "streak",
      message: `Your longest streak is ${streaks.longestStreak} days — exceptional dedication.`,
      severity: "positive",
      metric: streaks.longestStreak,
      timestamp: now(),
    });
  }

  if (streaks.currentStreak === 0 && streaks.longestInactiveDays > 14) {
    insights.push({
      id: makeId(),
      category: "streak",
      message: `Current streak is broken. Longest inactive period: ${streaks.longestInactiveDays} days.`,
      severity: "negative",
      metric: streaks.longestInactiveDays,
      timestamp: now(),
    });
  }

  return insights;
}

export function generateStatisticsInsights(stats: StatisticsResult | null): Insight[] {
  const insights: Insight[] = [];
  if (!stats) return insights;

  if (stats.totalContributions > 10000) {
    insights.push({
      id: makeId(),
      category: "statistics",
      message: `Over ${(stats.totalContributions / 1000).toFixed(1)}k total contributions — prolific output.`,
      severity: "positive",
      metric: stats.totalContributions,
      timestamp: now(),
    });
  }

  const weekendContributions = stats.byWeekday
    .filter((d) => d.weekday === 0 || d.weekday === 6)
    .reduce((s, d) => s + d.contributions, 0);
  const totalContribs = stats.totalContributions;
  const weekendRatio = totalContribs > 0 ? (weekendContributions / totalContribs) * 100 : 0;

  if (weekendRatio > 25) {
    insights.push({
      id: makeId(),
      category: "statistics",
      message: `You contribute on weekends ${weekendRatio.toFixed(0)}% of the time.`,
      severity: "neutral",
      metric: Math.round(weekendRatio),
      timestamp: now(),
    });
  }

  const productiveMonth = stats.mostProductiveMonth;
  if (productiveMonth.contributions > 0) {
    insights.push({
      id: makeId(),
      category: "statistics",
      message: `Your most productive month is ${productiveMonth.label} with ${productiveMonth.contributions.toLocaleString()} contributions.`,
      severity: "positive",
      metric: productiveMonth.contributions,
      timestamp: now(),
    });
  }

  return insights;
}

export function generateLanguageInsights(language: LanguageResult | null): Insight[] {
  const insights: Insight[] = [];
  if (!language) return insights;

  if (language.diversity >= 5) {
    insights.push({
      id: makeId(),
      category: "language",
      message: `You've worked with ${language.diversity} different languages — versatile developer.`,
      severity: "positive",
      metric: language.diversity,
      timestamp: now(),
    });
  }

  if (language.newLanguages.length > 0) {
    insights.push({
      id: makeId(),
      category: "language",
      message: `Explored ${language.newLanguages.length} new language${language.newLanguages.length > 1 ? "s" : ""}: ${language.newLanguages.join(", ")}.`,
      severity: "positive",
      metric: language.newLanguages.length,
      timestamp: now(),
    });
  }

  if (language.mostActive) {
    insights.push({
      id: makeId(),
      category: "language",
      message: `${language.mostActive.name} is your dominant language (${language.mostActive.percentage}% of code).`,
      severity: "neutral",
      metric: Math.round(language.mostActive.percentage),
      timestamp: now(),
    });
  }

  return insights;
}

export function generateRepositoryInsights(repo: RepositoryResult | null): Insight[] {
  const insights: Insight[] = [];
  if (!repo || repo.total === 0) return insights;

  if (repo.healthAverage < 50) {
    insights.push({
      id: makeId(),
      category: "repository",
      message: `Average repository health score is ${repo.healthAverage}/100 — consider maintenance.`,
      severity: "negative",
      metric: repo.healthAverage,
      timestamp: now(),
    });
  }

  if (repo.starCount > 100) {
    insights.push({
      id: makeId(),
      category: "repository",
      message: `${repo.starCount} stars across ${repo.total} repositories.`,
      severity: "positive",
      metric: repo.starCount,
      timestamp: now(),
    });
  }

  return insights;
}

export function generateActivityInsights(activity: ActivityResult | null): Insight[] {
  const insights: Insight[] = [];
  if (!activity) return insights;

  if (activity.heatScore >= 70) {
    insights.push({
      id: makeId(),
      category: "activity",
      message: `Activity heat score is ${activity.heatScore}/100 — highly engaged.`,
      severity: "positive",
      metric: activity.heatScore,
      timestamp: now(),
    });
  }

  if (activity.momentum > 30) {
    insights.push({
      id: makeId(),
      category: "activity",
      message: `Activity is trending up (+${activity.momentum}% momentum). Keep it going.`,
      severity: "positive",
      metric: activity.momentum,
      timestamp: now(),
    });
  } else if (activity.momentum < -30) {
    insights.push({
      id: makeId(),
      category: "activity",
      message: `Activity has declined (${activity.momentum}% momentum). Consider a reset.`,
      severity: "negative",
      metric: activity.momentum,
      timestamp: now(),
    });
  }

  if (activity.volatility > 50) {
    insights.push({
      id: makeId(),
      category: "activity",
      message: `Contribution pattern is highly volatile (${activity.volatility}%). Aim for steadier output.`,
      severity: "negative",
      metric: activity.volatility,
      timestamp: now(),
    });
  }

  if (activity.peak) {
    insights.push({
      id: makeId(),
      category: "activity",
      message: `Peak day: ${activity.peak.count} contributions on ${activity.peak.date}.`,
      severity: "neutral",
      metric: activity.peak.count,
      timestamp: now(),
    });
  }

  return insights;
}

export function generateProductivityInsights(prod: ProductivityResult | null): Insight[] {
  const insights: Insight[] = [];
  if (!prod) return insights;

  if (prod.consistencyScore >= 70) {
    insights.push({
      id: makeId(),
      category: "productivity",
      message: `Consistency score: ${prod.consistencyScore}/100 — reliable contributor.`,
      severity: "positive",
      metric: prod.consistencyScore,
      timestamp: now(),
    });
  }

  if (prod.activeDaysRatio > 60) {
    insights.push({
      id: makeId(),
      category: "productivity",
      message: `Active on ${prod.activeDaysRatio}% of days — strong work ethic.`,
      severity: "positive",
      metric: Math.round(prod.activeDaysRatio),
      timestamp: now(),
    });
  } else if (prod.activeDaysRatio < 20) {
    insights.push({
      id: makeId(),
      category: "productivity",
      message: `Active on only ${prod.activeDaysRatio}% of days. Try building a consistent habit.`,
      severity: "negative",
      metric: Math.round(prod.activeDaysRatio),
      timestamp: now(),
    });
  }

  return insights;
}

export function generateTrendInsights(trends: TrendResult | null): Insight[] {
  const insights: Insight[] = [];
  if (!trends) return insights;

  if (trends.direction === "up") {
    insights.push({
      id: makeId(),
      category: "trend",
      message: `Growth is trending upward (score: ${trends.growthScore}). You're accelerating.`,
      severity: "positive",
      metric: trends.growthScore,
      timestamp: now(),
    });
  } else if (trends.direction === "down") {
    insights.push({
      id: makeId(),
      category: "trend",
      message: `Growth has slowed (score: ${trends.growthScore}). Consider increasing output.`,
      severity: "negative",
      metric: trends.growthScore,
      timestamp: now(),
    });
  }

  if (trends.sixMonthGrowth > 50) {
    insights.push({
      id: makeId(),
      category: "trend",
      message: `Productivity increased ${trends.sixMonthGrowth}% in the last 6 months.`,
      severity: "positive",
      metric: trends.sixMonthGrowth,
      timestamp: now(),
    });
  }

  return insights;
}

export function generateMilestoneInsights(milestones: MilestoneResult | null): Insight[] {
  const insights: Insight[] = [];
  if (!milestones || milestones.milestones.length === 0) return insights;

  const recent = milestones.milestones
    .filter((m) => m.type !== "repository_anniversary")
    .slice(-3);

  if (recent.length > 0) {
    insights.push({
      id: makeId(),
      category: "milestone",
      message: `Recent milestones: ${recent.map((m) => m.label).join(", ")}.`,
      severity: "positive",
      metric: recent.length,
      timestamp: now(),
    });
  }

  const has1000Commits = milestones.milestones.some((m) => m.type === "commit_1000");
  if (has1000Commits) {
    insights.push({
      id: makeId(),
      category: "milestone",
      message: `Crossed 1,000 commits — significant contribution milestone.`,
      severity: "positive",
      metric: 1000,
      timestamp: now(),
    });
  }

  return insights;
}

export function generateAllInsights(input: {
  streaks: StreakResult | null;
  statistics: StatisticsResult | null;
  language: LanguageResult | null;
  repository: RepositoryResult | null;
  activity: ActivityResult | null;
  productivity: ProductivityResult | null;
  trends: TrendResult | null;
  milestones: MilestoneResult | null;
}): InsightCollection {
  const all: Insight[] = [
    ...generateStreakInsights(input.streaks),
    ...generateStatisticsInsights(input.statistics),
    ...generateLanguageInsights(input.language),
    ...generateRepositoryInsights(input.repository),
    ...generateActivityInsights(input.activity),
    ...generateProductivityInsights(input.productivity),
    ...generateTrendInsights(input.trends),
    ...generateMilestoneInsights(input.milestones),
  ];

  const positive = all.filter((i) => i.severity === "positive").length;
  const neutral = all.filter((i) => i.severity === "neutral").length;
  const negative = all.filter((i) => i.severity === "negative").length;

  return {
    insights: all,
    total: all.length,
    positive,
    neutral,
    negative,
  };
}
