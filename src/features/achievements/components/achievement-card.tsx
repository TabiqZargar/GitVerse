"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { RarityBadge } from "./rarity-badge";
import type { AchievementDefinition, AchievementProgress } from "../types";
import { CATEGORY_LABELS } from "../types";

interface AchievementCardProps {
  achievement: AchievementDefinition;
  progress?: AchievementProgress;
  unlocked?: boolean;
  unlockedAt?: string | null;
  showProgress?: boolean;
  className?: string;
  onClick?: () => void;
  compact?: boolean;
}

export function AchievementCard({
  achievement,
  progress,
  unlocked = false,
  unlockedAt,
  showProgress = true,
  className,
  onClick,
  compact = false,
}: AchievementCardProps) {
  const progressValue = progress?.currentValue ?? 0;
  const targetValue = progress?.targetValue ?? achievement.maxProgress;
  const progressPercent = targetValue > 0 ? Math.min((progressValue / targetValue) * 100, 100) : 0;

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "glass relative overflow-hidden rounded-xl border p-4 text-left transition-all duration-300",
        unlocked
          ? "border-chart-1/20 hover:border-chart-1/40"
          : "border-glass-border/30 opacity-60 hover:opacity-80 hover:border-glass-border/60",
        className
      )}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {unlocked && (
        <div className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 opacity-10">
          <div className="h-full w-full rounded-full bg-chart-1 blur-xl" />
        </div>
      )}

      <div className="flex items-start gap-3">
        <span className={cn("text-2xl", unlocked ? "opacity-100" : "opacity-40")}>
          {achievement.icon}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className={cn("truncate text-sm font-semibold", unlocked ? "text-foreground" : "text-muted-foreground")}>
              {achievement.name}
            </p>
            <RarityBadge rarity={achievement.rarity} showLabel={false} />
          </div>

          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
            {achievement.description}
          </p>

          <div className="mt-1 flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">
              {CATEGORY_LABELS[achievement.category]}
            </span>
            {unlockedAt && (
              <span className="text-[10px] text-chart-1">
                {new Date(unlockedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {showProgress && !compact && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{unlocked ? "Complete" : `${Math.round(progressPercent)}%`}</span>
            {progress && (
              <span>
                {Math.round(progressValue)}/{targetValue}
              </span>
            )}
          </div>
          <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted">
            <motion.div
              className={cn(
                "h-full rounded-full",
                unlocked ? "bg-chart-1" : "bg-muted-foreground/30"
              )}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      )}

      {compact && progress && (
        <div className="mt-2 h-0.5 overflow-hidden rounded-full bg-muted">
          <motion.div
            className={cn(
              "h-full rounded-full",
              unlocked ? "bg-chart-1" : "bg-muted-foreground/30"
            )}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
      )}
    </motion.button>
  );
}
