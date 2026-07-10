"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { useAchievements } from "../hooks/use-achievements";
import { useAchievementStore } from "../store";
import { AchievementCard } from "./achievement-card";
import type { AchievementCategory } from "../types";
import { CATEGORY_LABELS } from "../types";
import { ACHIEVEMENT_DEFINITIONS } from "../engine/achievement-rules";

const CATEGORIES: AchievementCategory[] = [
  "consistency", "learning", "open-source", "repositories", "languages",
  "collaboration", "exploration", "milestones", "legacy", "hidden",
];



export function AchievementGallery() {
  const { isLoading, error } = useAchievements();
  const unlocked = useAchievementStore((s) => s.unlocked);
  const progress = useAchievementStore((s) => s.progress);
  const completionPercentage = useAchievementStore((s) => s.completionPercentage);
  const totalUnlocked = useAchievementStore((s) => s.totalUnlocked);
  const totalAchievements = useAchievementStore((s) => s.totalAchievements);
  const categoryProgress = useAchievementStore((s) => s.categoryProgress);

  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const unlockedIds = useMemo(() => new Set(unlocked.map((u) => u.achievementId)), [unlocked]);

  const filteredDefinitions = useMemo(() => {
    let defs = ACHIEVEMENT_DEFINITIONS;

    if (selectedCategory !== "all") {
      defs = defs.filter((a) => a.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      defs = defs.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          CATEGORY_LABELS[a.category].toLowerCase().includes(q)
      );
    }

    return defs;
  }, [selectedCategory, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
          <p className="text-sm text-muted-foreground">Loading achievements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-destructive">Failed to load achievements.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">Achievements</h2>
        <p className="text-sm text-muted-foreground">
          {totalUnlocked} of {totalAchievements} unlocked ({completionPercentage}% complete)
        </p>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-chart-1 to-chart-4"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
            selectedCategory === "all"
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => {
          const catProg = categoryProgress[cat];
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {CATEGORY_LABELS[cat]}
              {catProg && (
                <span className="ml-1 text-[10px] opacity-60">
                  ({catProg.unlocked}/{catProg.total})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search achievements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-glass-border bg-glass py-2.5 pl-10 pr-4 text-sm text-foreground placeholder-muted-foreground/50 outline-none focus:border-ring"
          aria-label="Search achievements"
        />
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDefinitions.map((achievement) => {
            const prog = progress.find((p) => p.achievementId === achievement.id);
            const isUnlocked = unlockedIds.has(achievement.id);
            const unlockRecord = unlocked.find((u) => u.achievementId === achievement.id);

            return (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                progress={prog}
                unlocked={isUnlocked}
                unlockedAt={unlockRecord?.unlockedAt ?? null}
              />
            );
          })}
        </div>
      </AnimatePresence>

      {filteredDefinitions.length === 0 && (
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-sm text-muted-foreground">No achievements match your search.</p>
        </div>
      )}
    </div>
  );
}
