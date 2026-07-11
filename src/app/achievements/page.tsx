"use client";

import { useAchievements } from "@/features/achievements/hooks/use-achievements";
import { useAchievementStore } from "@/features/achievements/store";
import { AchievementCard } from "@/components/ui/achievement-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AchievementsPage() {
  const { isLoading, error } = useAchievements();
  const progress = useAchievementStore((s) => s.progress);
  const totalUnlocked = useAchievementStore((s) => s.totalUnlocked);
  const totalAchievements = useAchievementStore((s) => s.totalAchievements);
  const unlocked = useAchievementStore((s) => s.unlocked);

  if (isLoading) {
    return (
      <div className="max-w-container-max mx-auto px-gutter py-unit-xxl">
        <header className="mb-unit-xxl">
          <h1 className="font-display-xl text-display-xl text-on-surface mb-unit-sm">Hall of Honor</h1>
          <p className="text-on-surface-variant font-body-lg max-w-2xl">Your legacy across the GitVerse.</p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-unit-lg">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-container-max mx-auto px-gutter py-unit-xxl">
        <header className="mb-unit-xxl">
          <h1 className="font-display-xl text-display-xl text-on-surface mb-unit-sm">Hall of Honor</h1>
          <p className="text-on-surface-variant font-body-lg max-w-2xl">Your legacy across the GitVerse.</p>
        </header>
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-lg font-semibold text-destructive">Failed to load achievements</p>
          <p className="text-sm text-muted-foreground">Please ensure you are logged in and have GitHub data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto px-gutter py-unit-xxl">
      <header className="mb-unit-xxl">
        <h1 className="font-display-xl text-display-xl text-on-surface mb-unit-sm">Hall of Honor</h1>
        <p className="text-on-surface-variant font-body-lg max-w-2xl">
          Your legacy across the GitVerse, preserved in hyper-realistic glass relics.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {totalUnlocked}/{totalAchievements} achievements unlocked
        </p>
      </header>

      {progress.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-muted-foreground">No achievements data available yet.</p>
          <p className="text-xs text-muted-foreground/60">
            Achievements will appear once your GitHub data is analyzed.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-unit-lg">
          {progress.map((p) => {
            const unlockRecord = unlocked.find((u) => u.achievementId === p.achievementId);
            return (
              <AchievementCard
                key={p.achievementId}
                title={unlockRecord?.definition.name ?? p.achievementId}
                date={unlockRecord?.unlockedAt ? new Date(unlockRecord.unlockedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : undefined}
                icon={unlockRecord?.definition.icon ?? "🏆"}
                rarity={unlockRecord?.definition.rarity ?? "common"}
                locked={!p.unlocked}
                progress={p.unlocked ? undefined : Math.round(p.currentValue / p.targetValue * 100)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
