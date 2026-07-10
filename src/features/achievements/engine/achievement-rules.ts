import type { AchievementDefinition, AchievementEvaluation, Rarity, AchievementCategory } from "../types";
import type { DeveloperSummary } from "@/features/analytics/types";

function progress(val: number, max: number, unlocked: boolean, unlockedAt?: string): AchievementEvaluation {
  return { unlocked, progress: Math.min(val / max, 1), progressLabel: `${Math.min(val, max)}/${max}`, unlockedAt };
}

function makeDef(
  id: string,
  name: string,
  description: string,
  category: AchievementCategory,
  rarity: Rarity,
  icon: string,
  maxProgress: number,
  hidden: boolean,
  evaluate: (summary: DeveloperSummary, previousProgress?: number) => AchievementEvaluation
): AchievementDefinition {
  return { id, name, description, category, rarity, icon, maxProgress, hidden, evaluate };
}

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  // ─── Consistency ────────────────────────────────────────────────
  makeDef("first-day", "First Day", "Made your first contribution", "consistency", "common", "\u{1F4BB}", 1, false, (s) => {
    const v = s.statistics.totalActiveDays >= 1 ? 1 : 0;
    return progress(v, 1, v >= 1);
  }),
  makeDef("streak-7", "Week Warrior", "Maintained a 7-day contribution streak", "consistency", "common", "\u{1F525}", 7, false, (s) => {
    const v = Math.min(s.streaks.longestStreak, 7);
    return progress(v, 7, s.streaks.longestStreak >= 7);
  }),
  makeDef("streak-30", "Monthly Dedication", "Achieved a 30-day contribution streak", "consistency", "rare", "\u{1F4AA}", 30, false, (s) => {
    const v = Math.min(s.streaks.longestStreak, 30);
    return progress(v, 30, s.streaks.longestStreak >= 30);
  }),
  makeDef("streak-100", "Century Streak", "Reached a 100-day contribution streak", "consistency", "epic", "\u{1F3AF}", 100, false, (s) => {
    const v = Math.min(s.streaks.longestStreak, 100);
    return progress(v, 100, s.streaks.longestStreak >= 100);
  }),
  makeDef("streak-365", "Year of Code", "Committed code every day for an entire year", "consistency", "legendary", "\u{1F31F}", 365, false, (s) => {
    const v = Math.min(s.streaks.longestStreak, 365);
    return progress(v, 365, s.streaks.longestStreak >= 365);
  }),
  makeDef("streak-current-7", "On a Roll", "Currently on a 7+ day streak", "consistency", "common", "\u{1F525}", 7, false, (s) => {
    const v = Math.min(s.streaks.currentStreak, 7);
    return progress(v, 7, s.streaks.currentStreak >= 7);
  }),
  makeDef("streak-current-30", "Unstoppable", "Currently on a 30+ day streak", "consistency", "rare", "\u{26A1}", 30, false, (s) => {
    const v = Math.min(s.streaks.currentStreak, 30);
    return progress(v, 30, s.streaks.currentStreak >= 30);
  }),

  // ─── Learning ───────────────────────────────────────────────────
  makeDef("first-language", "First Language", "Learned your first programming language", "learning", "common", "\u{1F4D6}", 1, false, (s) => {
    const v = s.language.diversity >= 1 ? 1 : 0;
    return progress(v, 1, v >= 1);
  }),
  makeDef("polyglot", "Polyglot", "Used 3 or more programming languages", "learning", "rare", "\u{1F30D}", 3, false, (s) => {
    const v = Math.min(s.language.diversity, 3);
    return progress(v, 3, s.language.diversity >= 3);
  }),
  makeDef("languages-5", "Language Explorer", "Written code in 5 different languages", "learning", "epic", "\u{1F30D}", 5, false, (s) => {
    const v = Math.min(s.language.diversity, 5);
    return progress(v, 5, s.language.diversity >= 5);
  }),
  makeDef("languages-10", "Polyglot Master", "Written code in 10 different languages", "learning", "legendary", "\u{1F30D}", 10, false, (s) => {
    const v = Math.min(s.language.diversity, 10);
    return progress(v, 10, s.language.diversity >= 10);
  }),
  makeDef("new-language-explorer", "New Horizons", "Explored a new language this year", "learning", "rare", "\u{1F680}", 1, false, (s) => {
    const v = s.language.newLanguages.length >= 1 ? 1 : 0;
    return progress(v, 1, v >= 1);
  }),

  // ─── Open Source ─────────────────────────────────────────────────
  makeDef("repo-public-1", "Going Public", "Made your first public repository", "open-source", "common", "\u{1F30D}", 1, false, (s) => {
    const v = s.repository.public >= 1 ? 1 : 0;
    return progress(v, 1, v >= 1);
  }),
  makeDef("repo-public-5", "Open Source Contributor", "Created 5 public repositories", "open-source", "rare", "\u{1F31F}", 5, false, (s) => {
    const v = Math.min(s.repository.public, 5);
    return progress(v, 5, s.repository.public >= 5);
  }),
  makeDef("repo-public-10", "Open Source Advocate", "Created 10 public repositories", "open-source", "epic", "\u{2B50}", 10, false, (s) => {
    const v = Math.min(s.repository.public, 10);
    return progress(v, 10, s.repository.public >= 10);
  }),
  makeDef("stars-10", "Star Seeker", "Earned 10 stars across repositories", "open-source", "common", "\u{2B50}", 10, false, (s) => {
    const v = Math.min(s.repository.starCount, 10);
    return progress(v, 10, s.repository.starCount >= 10);
  }),
  makeDef("stars-100", "Star Collector", "Earned 100 stars across repositories", "open-source", "epic", "\u{1F31F}", 100, false, (s) => {
    const v = Math.min(s.repository.starCount, 100);
    return progress(v, 100, s.repository.starCount >= 100);
  }),

  // ─── Repositories ────────────────────────────────────────────────
  makeDef("repo-1", "First Repository", "Created your first repository", "repositories", "common", "\u{1F4C1}", 1, false, (s) => {
    const v = s.repository.total >= 1 ? 1 : 0;
    return progress(v, 1, v >= 1);
  }),
  makeDef("repo-10", "Double Digits", "Created 10 repositories", "repositories", "rare", "\u{1F4CA}", 10, false, (s) => {
    const v = Math.min(s.repository.total, 10);
    return progress(v, 10, s.repository.total >= 10);
  }),
  makeDef("repo-50", "Repository Collector", "Created 50 repositories", "repositories", "epic", "\u{1F4E6}", 50, false, (s) => {
    const v = Math.min(s.repository.total, 50);
    return progress(v, 50, s.repository.total >= 50);
  }),
  makeDef("repo-100", "Century of Repos", "Created 100 repositories", "repositories", "legendary", "\u{1F3C6}", 100, false, (s) => {
    const v = Math.min(s.repository.total, 100);
    return progress(v, 100, s.repository.total >= 100);
  }),
  makeDef("repo-health", "Health Nut", "Average repository health score above 80", "repositories", "rare", "\u{1F4AA}", 100, false, (s) => {
    const v = Math.min(s.repository.healthAverage, 100);
    return progress(v, 80, s.repository.healthAverage >= 80);
  }),

  // ─── Languages ───────────────────────────────────────────────────
  makeDef("lang-primary-strong", "True Main", "Primary language accounts for 50%+ of your code", "languages", "common", "\u{1F4DD}", 100, false, (s) => {
    const primary = s.language.languages[0];
    const pct = primary?.percentage ?? 0;
    return progress(pct, 50, pct >= 50, undefined);
  }),
  makeDef("lang-balanced", "Balanced", "Top 3 languages each have at least 20% share", "languages", "epic", "\u{2696}\u{FE0F}", 100, false, (s) => {
    const top3 = s.language.languages.slice(0, 3);
    const minShare = Math.min(...top3.map((l) => l.percentage), 0);
    return progress(minShare, 20, minShare >= 20);
  }),
  makeDef("lang-diverse", "Jack of All Trades", "Achieved language diversity score of 8+", "languages", "legendary", "\u{1F30D}", 10, false, (s) => {
    const v = Math.min(s.language.diversity, 10);
    return progress(v, 8, s.language.diversity >= 8);
  }),

  // ─── Collaboration ───────────────────────────────────────────────
  makeDef("forked-first", "Forker", "Forked your first repository", "collaboration", "common", "\u{1F500}", 1, false, (s) => {
    const v = s.repository.forked >= 1 ? 1 : 0;
    return progress(v, 1, v >= 1);
  }),
  makeDef("forked-10", "Collaborator", "Forked 10 repositories", "collaboration", "rare", "\u{1F91D}", 10, false, (s) => {
    const v = Math.min(s.repository.forked, 10);
    return progress(v, 10, s.repository.forked >= 10);
  }),

  // ─── Exploration ─────────────────────────────────────────────────
  makeDef("contrib-milestone-100", "First 100", "Reached 100 contributions", "exploration", "common", "\u{1F4B0}", 100, false, (s) => {
    const v = Math.min(s.statistics.totalContributions, 100);
    return progress(v, 100, s.statistics.totalContributions >= 100);
  }),
  makeDef("contrib-milestone-1000", "Four-Figure Club", "Reached 1,000 contributions", "exploration", "epic", "\u{1F3C6}", 1000, false, (s) => {
    const v = Math.min(s.statistics.totalContributions, 1000);
    return progress(v, 1000, s.statistics.totalContributions >= 1000);
  }),
  makeDef("contrib-milestone-10000", "Five-Figure Club", "Reached 10,000 contributions", "exploration", "legendary", "\u{1F451}", 10000, false, (s) => {
    const v = Math.min(s.statistics.totalContributions, 10000);
    return progress(v, 10000, s.statistics.totalContributions >= 10000);
  }),
  makeDef("contrib-milestone-50000", "Code Legend", "Reached 50,000 contributions", "exploration", "mythic", "\u{1F31F}", 50000, false, (s) => {
    const v = Math.min(s.statistics.totalContributions, 50000);
    return progress(v, 50000, s.statistics.totalContributions >= 50000);
  }),
  makeDef("peak-day", "Peak Performer", "Had a single day with 50+ contributions", "exploration", "rare", "\u{26A1}", 50, false, (s) => {
    const peak = s.activity.peak?.count ?? 0;
    return progress(peak, 50, peak >= 50);
  }),

  // ─── Milestones ──────────────────────────────────────────────────
  makeDef("milestone-5", "Milestone Hunter", "Triggered 5 unique milestones", "milestones", "common", "\u{1F3F7}\u{FE0F}", 5, false, (s) => {
    const v = Math.min(s.milestones.total, 5);
    return progress(v, 5, s.milestones.total >= 5);
  }),
  makeDef("milestone-15", "Milestone Collector", "Triggered 15 unique milestones", "milestones", "rare", "\u{1F3F7}\u{FE0F}", 15, false, (s) => {
    const v = Math.min(s.milestones.total, 15);
    return progress(v, 15, s.milestones.total >= 15);
  }),
  makeDef("milestone-25", "Milestone Master", "Triggered 25 unique milestones", "milestones", "epic", "\u{1F3F7}\u{FE0F}", 25, false, (s) => {
    const v = Math.min(s.milestones.total, 25);
    return progress(v, 25, s.milestones.total >= 25);
  }),
  makeDef("score-grade-a", "A-Player", "Achieved a Developer Score grade of A", "milestones", "epic", "\u{1F4AF}", 100, false, (s) => {
    return progress(s.scores.developer.total, 90, s.scores.developer.grade === "A");
  }),
  makeDef("score-grade-s", "S-Tier Developer", "Achieved a Developer Score grade of S", "milestones", "legendary", "\u{1F451}", 100, false, (s) => {
    return progress(s.scores.developer.total, 100, s.scores.developer.grade === "S");
  }),
  makeDef("positive-insights-10", "Glass Half Full", "Received 10+ positive insights", "milestones", "rare", "\u{1F60A}", 10, false, (s) => {
    const v = Math.min(s.insights.positive, 10);
    return progress(v, 10, s.insights.positive >= 10);
  }),

  // ─── Legacy ──────────────────────────────────────────────────────
  makeDef("active-1", "First Year", "Been active on GitHub for 1 year", "legacy", "common", "\u{1F4C5}", 1, false, (s) => {
    const years = s.trends.comparisons.length;
    return progress(years, 1, years >= 1);
  }),
  makeDef("active-3", "Veteran", "Been active on GitHub for 3 years", "legacy", "rare", "\u{1F4C5}", 3, false, (s) => {
    const years = s.trends.comparisons.length;
    return progress(years, 3, years >= 3);
  }),
  makeDef("active-5", "Half Decade", "Been active on GitHub for 5 years", "legacy", "epic", "\u{1F4C5}", 5, false, (s) => {
    const years = s.trends.comparisons.length;
    return progress(years, 5, years >= 5);
  }),
  makeDef("active-10", "Decade of Code", "Been active on GitHub for 10 years", "legacy", "legendary", "\u{1F3C6}", 10, false, (s) => {
    const years = s.trends.comparisons.length;
    return progress(years, 10, years >= 10);
  }),
  makeDef("growth-surge", "Growth Surge", "Year-over-year growth of 50%+", "legacy", "rare", "\u{1F4C8}", 100, false, (s) => {
    const growth = s.trends.yearOverYearGrowth;
    return progress(growth, 50, growth >= 50);
  }),

  // ─── Hidden ──────────────────────────────────────────────────────
  makeDef("weekend-warrior", "Weekend Warrior", "Contributed on 10+ weekends", "hidden", "rare", "\u{1F3C6}", 10, true, (s) => {
    const sun = s.activity.weeklyCadence[0] ?? 0;
    const sat = s.activity.weeklyCadence[6] ?? 0;
    const total = sun + sat;
    return progress(total, 10, total >= 10);
  }),
  makeDef("night-owl", "Night Owl", "Peak productivity on late hours (not tracked directly, inferred from low consistency + high output)", "hidden", "rare", "\u{1F319}", 1, true, (s) => {
    const isNightOwl = s.productivity.consistencyScore < 40 && s.activity.heatScore > 60;
    return progress(isNightOwl ? 1 : 0, 1, isNightOwl);
  }),
  makeDef("comeback-kid", "Comeback Kid", "Had an inactive period of 30+ days followed by a 14+ day streak", "hidden", "epic", "\u{1F4AA}", 1, true, (s) => {
    const hadComeback = s.streaks.longestInactiveDays >= 30 && s.streaks.longestStreak >= 14;
    return progress(hadComeback ? 1 : 0, 1, hadComeback);
  }),
  makeDef("steady-hand", "Steady Hand", "Consistency score of 80+ with volatility under 20%", "hidden", "epic", "\u{270D}\u{FE0F}", 100, true, (s) => {
    const score = s.productivity.consistencyScore >= 80 && s.activity.volatility < 20 ? 1 : 0;
    return progress(score, 1, score >= 1);
  }),
  makeDef("momentum-machine", "Momentum Machine", "Momentum score of 80+", "hidden", "rare", "\u{1F680}", 100, true, (s) => {
    const v = Math.min(s.activity.momentum, 100);
    return progress(v, 80, s.activity.momentum >= 80);
  }),
  makeDef("one-hit-wonder", "One-Hit Wonder", "Peak day accounts for 20%+ of total contributions", "hidden", "epic", "\u{26A1}", 100, true, (s) => {
    const peak = s.activity.peak?.count ?? 0;
    const total = s.statistics.totalContributions;
    const ratio = total > 0 ? (peak / total) * 100 : 0;
    return progress(ratio, 20, ratio >= 20);
  }),
  makeDef("health-conscious", "Health Conscious", "Every repository has a health score above 50", "hidden", "epic", "\u{1F4AA}", 100, true, (s) => {
    const allHealthy = s.repository.health.every((h) => h.healthScore > 50);
    return progress(allHealthy ? 100 : 0, 100, allHealthy);
  }),
];

export const ACHIEVEMENT_MAP = new Map<string, AchievementDefinition>(
  ACHIEVEMENT_DEFINITIONS.map((a) => [a.id, a])
);

export function getAchievementById(id: string): AchievementDefinition | undefined {
  return ACHIEVEMENT_MAP.get(id);
}

export function getAchievementsByCategory(category: AchievementCategory): AchievementDefinition[] {
  return ACHIEVEMENT_DEFINITIONS.filter((a) => a.category === category);
}

export function getAchievementsByRarity(rarity: Rarity): AchievementDefinition[] {
  return ACHIEVEMENT_DEFINITIONS.filter((a) => a.rarity === rarity);
}
