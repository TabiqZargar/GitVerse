import type { DeveloperSummary } from "@/features/analytics/types";
import type { AchievementDefinition, AchievementProgress } from "../types";
import { ACHIEVEMENT_DEFINITIONS } from "./achievement-rules";

export interface ProgressUpdate {
  achievementId: string;
  currentValue: number;
  targetValue: number;
  unlocked: boolean;
}

export function calculateProgress(
  summary: DeveloperSummary,
  previousProgress: Map<string, AchievementProgress>
): ProgressUpdate[] {
  const updates: ProgressUpdate[] = [];

  for (const achievement of ACHIEVEMENT_DEFINITIONS) {
    const prev = previousProgress.get(achievement.id);
    const evaluation = achievement.evaluate(summary, prev?.currentValue);

    updates.push({
      achievementId: achievement.id,
      currentValue: evaluation.progress * achievement.maxProgress,
      targetValue: achievement.maxProgress,
      unlocked: evaluation.unlocked,
    });
  }

  return updates;
}

export function getUpcomingAchievements(
  summary: DeveloperSummary,
  unlockedIds: Set<string>,
  limit: number = 6
): { achievement: AchievementDefinition; progress: number }[] {
  const upcoming: { achievement: AchievementDefinition; progress: number }[] = [];

  for (const achievement of ACHIEVEMENT_DEFINITIONS) {
    if (unlockedIds.has(achievement.id)) continue;
    if (achievement.hidden) continue;

    const evaluation = achievement.evaluate(summary);
    upcoming.push({ achievement, progress: evaluation.progress });
  }

  return upcoming
    .sort((a, b) => b.progress - a.progress)
    .slice(0, limit);
}

export function getNextAchievementInCategory(
  summary: DeveloperSummary,
  category: string,
  unlockedIds: Set<string>
): { achievement: AchievementDefinition; progress: number } | null {
  const candidates = ACHIEVEMENT_DEFINITIONS
    .filter((a) => a.category === category && !unlockedIds.has(a.id))
    .map((a) => {
      const evaluation = a.evaluate(summary);
      return { achievement: a, progress: evaluation.progress };
    })
    .sort((a, b) => b.progress - a.progress);

  return candidates[0] ?? null;
}
