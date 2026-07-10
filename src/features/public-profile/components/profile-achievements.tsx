"use client";

import { motion } from "framer-motion";
import type { ProfileData } from "@/features/export/types";
import { cn } from "@/lib/utils";

interface ProfileAchievementsProps {
  achievements: ProfileData["achievements"];
}

export function ProfileAchievements({ achievements }: ProfileAchievementsProps) {
  if (achievements.recent.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Achievements
        <span className="ml-2 text-xs font-normal text-muted-foreground/60">
          {achievements.unlocked}/{achievements.total}
        </span>
      </h3>
      <div className="flex flex-wrap gap-2">
        {achievements.recent.map((a, i) => (
          <motion.div
            key={a.id}
            className="flex items-center gap-1.5 rounded-full border border-glass-border bg-glass px-3 py-1.5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.05, duration: 0.3 }}
          >
            <span className="text-sm">{a.icon}</span>
            <span className="text-xs font-medium">{a.name}</span>
            <span className={cn(
              "rounded px-1 py-0.5 text-[8px] font-semibold uppercase",
              a.rarity === "legendary" && "bg-chart-5/20 text-chart-5",
              a.rarity === "epic" && "bg-chart-4/20 text-chart-4",
              a.rarity === "rare" && "bg-chart-1/20 text-chart-1",
              a.rarity === "mythic" && "bg-yellow-500/20 text-yellow-400",
              a.rarity === "common" && "bg-muted text-muted-foreground"
            )}>
              {a.rarity}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
