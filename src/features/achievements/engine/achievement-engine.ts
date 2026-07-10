import type { DeveloperSummary } from "@/features/analytics/types";
import type { AchievementDefinition, AchievementEvaluation, UserAchievementRecord } from "../types";
import { ACHIEVEMENT_DEFINITIONS, getAchievementById } from "./achievement-rules";

export interface EngineResult {
  evaluations: Map<string, AchievementEvaluation>;
  newlyUnlocked: { achievement: AchievementDefinition; evaluation: AchievementEvaluation }[];
}

export function evaluateAchievements(
  summary: DeveloperSummary,
  previousUnlocks: Map<string, UserAchievementRecord>,
  filterIds?: string[]
): EngineResult {
  const targets = filterIds
    ? filterIds.map((id) => getAchievementById(id)).filter(Boolean) as AchievementDefinition[]
    : ACHIEVEMENT_DEFINITIONS;

  const evaluations = new Map<string, AchievementEvaluation>();
  const newlyUnlocked: { achievement: AchievementDefinition; evaluation: AchievementEvaluation }[] = [];

  for (const achievement of targets) {
    const prevProgress = previousUnlocks.get(achievement.id);
    const result = achievement.evaluate(summary, prevProgress?.progress);

    evaluations.set(achievement.id, result);

    if (result.unlocked && !prevProgress) {
      newlyUnlocked.push({ achievement, evaluation: result });
    }
  }

  return { evaluations, newlyUnlocked };
}

export function evaluateSingleAchievement(
  achievementId: string,
  summary: DeveloperSummary
): AchievementEvaluation | null {
  const achievement = getAchievementById(achievementId);
  if (!achievement) return null;
  return achievement.evaluate(summary);
}

export function getNewlyCompleted(
  summary: DeveloperSummary,
  previousUnlocks: Map<string, UserAchievementRecord>
): { achievement: AchievementDefinition; evaluation: AchievementEvaluation }[] {
  const { newlyUnlocked } = evaluateAchievements(summary, previousUnlocks);
  return newlyUnlocked;
}

export function getUnlockProgress(
  summary: DeveloperSummary,
  achievementId: string
): number {
  const achievement = getAchievementById(achievementId);
  if (!achievement) return 0;
  const result = achievement.evaluate(summary);
  return result.progress;
}

export function getTotalCompletionPercentage(
  summary: DeveloperSummary,
  previousUnlocks: Map<string, UserAchievementRecord>
): number {
  const { evaluations } = evaluateAchievements(summary, previousUnlocks);
  let total = 0;
  for (const ev of evaluations.values()) {
    total += ev.progress;
  }
  const max = ACHIEVEMENT_DEFINITIONS.length;
  return max > 0 ? Math.round((total / max) * 100) : 0;
}

export function getCategoryCompletion(
  summary: DeveloperSummary,
  previousUnlocks: Map<string, UserAchievementRecord>
): Record<string, { unlocked: number; total: number; percentage: number }> {
  const categoryMap = new Map<string, { unlocked: number; total: number }>();

  for (const achievement of ACHIEVEMENT_DEFINITIONS) {
    const cat = achievement.category;
    const current = categoryMap.get(cat);
    const existing = current ?? { unlocked: 0, total: 0 };
    categoryMap.set(cat, { ...existing, total: existing.total + 1 });

    const prev = previousUnlocks.get(achievement.id);
    if (prev) {
      categoryMap.set(cat, { ...existing, unlocked: existing.unlocked + 1, total: existing.total + 1 });
    } else {
      const result = achievement.evaluate(summary);
      if (result.unlocked) {
        categoryMap.set(cat, { ...existing, unlocked: existing.unlocked + 1, total: existing.total + 1 });
      }
    }
  }

  const result: Record<string, { unlocked: number; total: number; percentage: number }> = {};
  for (const [cat, data] of categoryMap) {
    result[cat] = {
      unlocked: data.unlocked,
      total: data.total,
      percentage: data.total > 0 ? Math.round((data.unlocked / data.total) * 100) : 0,
    };
  }

  return result;
}

export function getHiddenAchievements(
  summary: DeveloperSummary,
  previousUnlocks: Map<string, UserAchievementRecord>
): { achievement: AchievementDefinition; unlocked: boolean; progress: number }[] {
  return ACHIEVEMENT_DEFINITIONS
    .filter((a) => a.hidden)
    .map((a) => {
      const prev = previousUnlocks.get(a.id);
      if (prev) return { achievement: a, unlocked: true, progress: 1 };
      const result = a.evaluate(summary);
      return { achievement: a, unlocked: result.unlocked, progress: result.progress };
    });
}
