"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAchievementStore } from "../store";
import type { AchievementCategory, Rarity } from "../types";

interface AchievementsResponse {
  total: number;
  unlocked: number;
  completion: number;
  progress: {
    achievementId: string;
    definition: {
      id: string;
      name: string;
      description: string;
      category: AchievementCategory;
      rarity: Rarity;
      icon: string;
      hidden: boolean;
    };
    unlocked: boolean;
    progress: number;
    progressLabel?: string;
  }[];
  milestones: { id: string; type: string; label: string; date: string; value: number }[];
  upcoming: {
    id: string;
    name: string;
    description: string;
    category: AchievementCategory;
    rarity: Rarity;
    icon: string;
    progress: number;
  }[];
}

export function useAchievements() {
  const setUnlocked = useAchievementStore((s) => s.setUnlocked);
  const setProgress = useAchievementStore((s) => s.setProgress);
  const setLoading = useAchievementStore((s) => s.setLoading);
  const setError = useAchievementStore((s) => s.setError);
  const setMilestoneEvents = useAchievementStore((s) => s.setMilestoneEvents);

  return useQuery({
    queryKey: ["achievements", "all"],
    queryFn: async () => {
      setLoading(true);
      const res = await apiClient.get<{ data: AchievementsResponse }>("/achievements");
      if (!res.success) {
        setError(res.error.message);
        setLoading(false);
        throw new Error(res.error.message);
      }

      const data = res.data.data;
      setUnlocked(
        data.progress
          .filter((p) => p.unlocked)
          .map((p) => ({
            id: p.achievementId,
            achievementId: p.achievementId,
            unlockedAt: new Date().toISOString(),
            progress: p.progress,
            celebrationSeen: false,
            definition: {
              id: p.definition.id,
              name: p.definition.name,
              description: p.definition.description,
              category: p.definition.category,
              rarity: p.definition.rarity,
              icon: p.definition.icon,
              maxProgress: 1,
              hidden: p.definition.hidden,
              evaluate: () => ({ unlocked: true, progress: 1 }),
            },
          }))
      );

      setProgress(
        data.progress.map((p) => ({
          achievementId: p.achievementId,
          currentValue: p.progress,
          targetValue: 1,
          unlocked: p.unlocked,
          unlockedAt: p.unlocked ? new Date().toISOString() : null,
          celebrationSeen: false,
        }))
      );

      setMilestoneEvents(
        data.milestones.map((m) => ({
          id: m.id,
          type: m.type,
          label: m.label,
          date: m.date,
          value: m.value,
        }))
      );

      setLoading(false);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpcomingAchievements() {
  return useQuery({
    queryKey: ["achievements", "upcoming"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: { achievementId: string; name: string; progress: number; progressPercent: number; rarity: Rarity; icon: string }[] }>(
        "/achievements/progress"
      );
      if (!res.success) throw new Error(res.error.message);
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useDismissCelebration() {
  return useMutation({
    mutationFn: async (achievementId: string) => {
      useAchievementStore.getState().dismissCelebration(achievementId);
      return { success: true };
    },
  });
}
