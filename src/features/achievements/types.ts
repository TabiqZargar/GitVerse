import type { DeveloperSummary } from "@/features/analytics/types";

export type AchievementCategory =
  | "consistency"
  | "learning"
  | "open-source"
  | "repositories"
  | "languages"
  | "collaboration"
  | "exploration"
  | "milestones"
  | "legacy"
  | "hidden";

export type Rarity = "common" | "rare" | "epic" | "legendary" | "mythic";

export const RARITY_ORDER: Record<Rarity, number> = {
  common: 0,
  rare: 1,
  epic: 2,
  legendary: 3,
  mythic: 4,
};

export const CATEGORY_LABELS: Record<AchievementCategory, string> = {
  consistency: "Consistency",
  learning: "Learning",
  "open-source": "Open Source",
  repositories: "Repositories",
  languages: "Languages",
  collaboration: "Collaboration",
  exploration: "Exploration",
  milestones: "Milestones",
  legacy: "Legacy",
  hidden: "Hidden",
};

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  rarity: Rarity;
  icon: string;
  maxProgress: number;
  hidden: boolean;
  evaluate: (summary: DeveloperSummary, previousProgress?: number) => AchievementEvaluation;
}

export interface AchievementEvaluation {
  unlocked: boolean;
  progress: number;
  progressLabel?: string;
  unlockedAt?: string;
}

export interface AchievementProgress {
  achievementId: string;
  currentValue: number;
  targetValue: number;
  unlocked: boolean;
  unlockedAt: string | null;
  celebrationSeen: boolean;
}

export interface AchievementState {
  unlocked: UserAchievementRecord[];
  progress: AchievementProgress[];
  totalUnlocked: number;
  totalAchievements: number;
  completionPercentage: number;
  recentUnlocks: UserAchievementRecord[];
  categoryProgress: Record<AchievementCategory, { unlocked: number; total: number }>;
}

export interface UserAchievementRecord {
  id: string;
  achievementId: string;
  unlockedAt: string;
  progress: number;
  celebrationSeen: boolean;
  definition: AchievementDefinition;
}

export interface UserMilestoneRecord {
  id: string;
  milestoneId: string;
  label: string;
  date: string;
  value: number;
  metadata?: Record<string, string>;
}

export interface MilestoneEvent {
  id: string;
  type: string;
  label: string;
  date: string;
  value: number;
  metadata?: Record<string, string>;
}

export interface CelebrationEvent {
  achievementId: string;
  name: string;
  rarity: Rarity;
  unlockedAt: string;
}

export interface AchievementFilter {
  category?: AchievementCategory;
  rarity?: Rarity;
  search?: string;
  unlocked?: "all" | "unlocked" | "locked";
}
