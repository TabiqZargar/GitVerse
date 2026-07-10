import type { DeveloperSummary } from "@/features/analytics/types";
import type { Recommendation } from "../types";

export function generateRecommendations(summary: DeveloperSummary): Recommendation[] {
  const recommendations: Recommendation[] = [];

  if (summary.language.diversity < 3) {
    recommendations.push({
      title: "Explore a new language",
      description: `You've worked with ${summary.language.diversity} language${summary.language.diversity === 1 ? "" : "s"} this year. Learning a language in a different paradigm — like Rust for systems or TypeScript for web — could broaden your perspective.`,
      category: "language",
      priority: "medium",
    });
  }

  if (summary.repository.public === 0) {
    recommendations.push({
      title: "Open source your work",
      description: "You have no public repositories yet. Open sourcing a project, even a small utility, invites collaboration and builds your developer portfolio.",
      category: "open-source",
      priority: "high",
    });
  } else if (summary.repository.public < 5) {
    recommendations.push({
      title: "Grow your open source presence",
      description: `With ${summary.repository.public} public repos, you're getting started. Consider contributing to an existing project or open-sourcing a tool you use regularly.`,
      category: "open-source",
      priority: "medium",
    });
  }

  if (summary.repository.healthAverage < 60) {
    recommendations.push({
      title: "Repository maintenance",
      description: `Your average repository health score is ${summary.repository.healthAverage}/100. Adding READMEs, issue templates, and cleaning up stale branches could improve discoverability and collaboration.`,
      category: "repository",
      priority: "high",
    });
  }

  if (summary.streaks.currentStreak < 7 && summary.streaks.longestStreak < 14) {
    recommendations.push({
      title: "Build a daily coding habit",
      description: "Even 15 minutes of coding per day builds momentum. Try committing something — a fix, a test, a comment — every day for two weeks to build consistency.",
      category: "consistency",
      priority: "high",
    });
  }

  if (summary.activity.volatility > 50) {
    recommendations.push({
      title: "Smooth out your contribution pattern",
      description: `Your contribution volatility is ${summary.activity.volatility}%, meaning your output varies significantly week to week. Aim for steady, sustainable contributions rather than feast-or-famine bursts.`,
      category: "consistency",
      priority: "medium",
    });
  }

  if (summary.productivity.activeDaysRatio < 30) {
    recommendations.push({
      title: "Increase coding frequency",
      description: `You're active on ${summary.productivity.activeDaysRatio}% of days. Even small daily commits build muscle memory and make coding a habit rather than a task.`,
      category: "consistency",
      priority: "medium",
    });
  }

  if (summary.productivity.consistencyScore < 50) {
    recommendations.push({
      title: "Regular coding schedule",
      description: "Setting aside dedicated time each day — even 30 minutes — can dramatically improve your consistency score. Morning or evening, find your rhythm and protect it.",
      category: "consistency",
      priority: "medium",
    });
  }

  if (summary.language.diversity >= 5) {
    recommendations.push({
      title: "Deepen your expertise",
      description: `You've explored ${summary.language.diversity} languages — impressive breadth. Consider deepening your expertise in ${summary.language.primaryLanguage ?? "your primary language"} by building a substantial project or contributing to a major library.`,
      category: "learning",
      priority: "low",
    });
  }

  if (summary.repository.archived > 0) {
    recommendations.push({
      title: "Revive old projects",
      description: `You have ${summary.repository.archived} archived repositories. Some may contain ideas worth revisiting or code worth extracting into reusable libraries.`,
      category: "repository",
      priority: "low",
    });
  }

  return recommendations.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return (order[a.priority] ?? 1) - (order[b.priority] ?? 1);
  });
}
