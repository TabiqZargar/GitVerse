import type { DeveloperSummary } from "@/features/analytics/types";
import { ACHIEVEMENT_DEFINITIONS } from "../engine/achievement-rules";
import { evaluateAchievements } from "../engine/achievement-engine";

export interface WrappedAchievementData {
  totalUnlocked: number;
  totalAchievements: number;
  completionPercentage: number;
  rarestUnlocked: { name: string; rarity: string } | null;
  categoryBreakdown: Record<string, { unlocked: number; total: number }>;
  highlights: { name: string; category: string; rarity: string }[];
}

export function computeWrappedAchievementData(summary: DeveloperSummary): WrappedAchievementData {
  const previousUnlocks = new Map();
  const { evaluations } = evaluateAchievements(summary, previousUnlocks);

  const unlocked: { name: string; category: string; rarity: import("../types").Rarity }[] = [];
  const categoryBreakdown: Record<string, { unlocked: number; total: number }> = {};
  const rarityOrder = { mythic: 0, legendary: 1, epic: 2, rare: 3, common: 4 };

  let rarestUnlocked: { name: string; rarity: string } | null = null;
  let rarestLevel = 99;

  for (const achievement of ACHIEVEMENT_DEFINITIONS) {
    const cat = achievement.category;
    const current = categoryBreakdown[cat] ?? { unlocked: 0, total: 0 };
    categoryBreakdown[cat] = { ...current, total: current.total + 1 };

    const ev = evaluations.get(achievement.id);
    if (ev?.unlocked) {
      categoryBreakdown[cat] = {
        ...categoryBreakdown[cat],
        unlocked: (categoryBreakdown[cat]?.unlocked ?? 0) + 1,
        total: (categoryBreakdown[cat]?.total ?? 0),
      };
      unlocked.push({ name: achievement.name, category: achievement.category, rarity: achievement.rarity });

      const level = rarityOrder[achievement.rarity] ?? 99;
      if (level < rarestLevel) {
        rarestLevel = level;
        rarestUnlocked = { name: achievement.name, rarity: achievement.rarity };
      }
    }
  }

  const highlights = unlocked
    .sort((a, b) => (rarityOrder[a.rarity] ?? 99) - (rarityOrder[b.rarity] ?? 99))
    .slice(0, 5);

  return {
    totalUnlocked: unlocked.length,
    totalAchievements: ACHIEVEMENT_DEFINITIONS.length,
    completionPercentage: ACHIEVEMENT_DEFINITIONS.length > 0
      ? Math.round((unlocked.length / ACHIEVEMENT_DEFINITIONS.length) * 100)
      : 0,
    rarestUnlocked,
    categoryBreakdown,
    highlights,
  };
}
