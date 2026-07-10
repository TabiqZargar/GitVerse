import type { DeveloperSummary } from "@/features/analytics/types";
import type { Prediction } from "../types";

export function generatePredictions(summary: DeveloperSummary): Prediction[] {
  const predictions: Prediction[] = [];

  const stats = summary.statistics;
  const trends = summary.trends;
  const activity = summary.activity;

  const dailyAvg = stats.averages.daily;
  const projectedYearly = Math.round(dailyAvg * 365);

  if (projectedYearly > stats.totalContributions) {
    predictions.push({
      title: "Contribution growth ahead",
      description: `At your current pace, you're on track to reach ${projectedYearly.toLocaleString()} contributions next year — a ${projectedYearly > 0 ? Math.round((projectedYearly / stats.totalContributions) * 100) : 0}% increase from this year.`,
      confidence: "medium",
      metric: projectedYearly,
    });
  }

  if (trends.growthScore > 10) {
    predictions.push({
      title: "Accelerating momentum",
      description: `Your growth score of ${trends.growthScore} indicates accelerating momentum. If this trend continues, your output could double within ${Math.ceil(100 / Math.max(trends.growthScore, 1))} months.`,
      confidence: "medium",
      metric: trends.growthScore,
    });
  }

  if (summary.language.newLanguages.length > 0) {
    predictions.push({
      title: "Expanding your toolkit",
      description: `You explored ${summary.language.newLanguages.length} new language${summary.language.newLanguages.length > 1 ? "s" : ""} this year. Based on your learning pattern, you may dive deeper into ${summary.language.newLanguages[0] ?? "a new technology"} in the coming months.`,
      confidence: "low",
    });
  }

  if (stats.totalContributions > 1000) {
    const nextMilestone = stats.totalContributions > 5000 ? 10000 : 5000;
    predictions.push({
      title: `${nextMilestone.toLocaleString()} contributions`,
      description: `Crossing ${nextMilestone.toLocaleString()} contributions is within reach. At your current average of ${dailyAvg.toFixed(1)} per day, you could hit this milestone in approximately ${Math.ceil((nextMilestone - stats.totalContributions) / Math.max(dailyAvg, 1))} days.`,
      confidence: "high",
      metric: nextMilestone,
    });
  }

  if (summary.streaks.currentStreak >= 7) {
    predictions.push({
      title: "Streak milestone incoming",
      description: `Your current ${summary.streaks.currentStreak}-day streak shows strong consistency. If you maintain this habit, you could surpass your personal best of ${summary.streaks.longestStreak} days.`,
      confidence: "high",
      metric: summary.streaks.currentStreak,
    });
  }

  if (summary.repository.starCount > 0) {
    const projectedStars = Math.round(summary.repository.starCount * (1 + Math.max(trends.growthScore, 0) / 100));
    if (projectedStars > summary.repository.starCount) {
      predictions.push({
        title: "Growing recognition",
        description: `Your repositories could reach ${projectedStars.toLocaleString()} stars, growing from ${summary.repository.starCount.toLocaleString()}. Keep sharing your work with the community.`,
        confidence: "low",
        metric: projectedStars,
      });
    }
  }

  const sun = activity.weeklyCadence[0];
  const sat = activity.weeklyCadence[6];
  const hasWeekendActivity = (sun ?? 0) > 0 || (sat ?? 0) > 0;
  if (hasWeekendActivity && activity.heatScore > 50) {
    predictions.push({
      title: "Sustainable pace",
      description: "You maintain consistent activity across both weekdays and weekends. This balanced approach suggests sustainable long-term productivity rather than burnout-prone bursts.",
      confidence: "medium",
    });
  }

  return predictions;
}
