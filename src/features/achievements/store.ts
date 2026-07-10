import { create } from "zustand";
import type { AchievementState, UserAchievementRecord, AchievementProgress, CelebrationEvent, AchievementFilter, MilestoneEvent } from "./types";
import type { AchievementCategory } from "./types";
import { ACHIEVEMENT_DEFINITIONS } from "./engine/achievement-rules";

interface AchievementStoreState extends AchievementState {
  loading: boolean;
  error: string | null;
  recentCelebrations: CelebrationEvent[];
  milestoneEvents: MilestoneEvent[];
  filter: AchievementFilter;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUnlocked: (records: UserAchievementRecord[]) => void;
  setProgress: (progress: AchievementProgress[]) => void;
  addCelebration: (event: CelebrationEvent) => void;
  dismissCelebration: (achievementId: string) => void;
  clearCelebrations: () => void;
  setMilestoneEvents: (events: MilestoneEvent[]) => void;
  setFilter: (filter: Partial<AchievementFilter>) => void;
  resetFilter: () => void;
  refresh: () => void;
}

const defaultFilter: AchievementFilter = {
  unlocked: "all",
};

export const useAchievementStore = create<AchievementStoreState>((set) => ({
  loading: false,
  error: null,
  unlocked: [],
  progress: [],
  totalUnlocked: 0,
  totalAchievements: ACHIEVEMENT_DEFINITIONS.length,
  completionPercentage: 0,
  recentUnlocks: [],
  categoryProgress: {} as Record<AchievementCategory, { unlocked: number; total: number }>,
  recentCelebrations: [],
  milestoneEvents: [],
  filter: { ...defaultFilter },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  setUnlocked: (records) => {
    const sorted = [...records].sort(
      (a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime()
    );
    set({
      unlocked: records,
      totalUnlocked: records.length,
      completionPercentage: ACHIEVEMENT_DEFINITIONS.length > 0
        ? Math.round((records.length / ACHIEVEMENT_DEFINITIONS.length) * 100)
        : 0,
      recentUnlocks: sorted.slice(0, 3),
    });
  },

  setProgress: (progressList) => {
    const categoryProgress: Record<string, { unlocked: number; total: number }> = {};
    for (const achievement of ACHIEVEMENT_DEFINITIONS) {
      const cat = achievement.category;
      const current = categoryProgress[cat] ?? { unlocked: 0, total: 0 };
      categoryProgress[cat] = { ...current, total: current.total + 1 };

      const prog = progressList.find((p) => p.achievementId === achievement.id);
      if (prog?.unlocked) {
        categoryProgress[cat] = {
          ...categoryProgress[cat],
          unlocked: (categoryProgress[cat]?.unlocked ?? 0) + 1,
          total: (categoryProgress[cat]?.total ?? 0),
        };
      }
    }

    set({ progress: progressList, categoryProgress: categoryProgress as Record<AchievementCategory, { unlocked: number; total: number }> });
  },

  addCelebration: (event) => {
    set((state) => ({
      recentCelebrations: [event, ...state.recentCelebrations].slice(0, 10),
    }));
  },

  dismissCelebration: (achievementId) => {
    set((state) => ({
      recentCelebrations: state.recentCelebrations.filter((c) => c.achievementId !== achievementId),
    }));
  },

  clearCelebrations: () => set({ recentCelebrations: [] }),

  setMilestoneEvents: (events) => set({ milestoneEvents: events }),

  setFilter: (partial) => {
    set((state) => ({ filter: { ...state.filter, ...partial } }));
  },

  resetFilter: () => set({ filter: { ...defaultFilter } }),

  refresh: () => {
    set((state) => ({ ...state }));
  },
}));
