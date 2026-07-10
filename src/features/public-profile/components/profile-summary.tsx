"use client";

import { motion } from "framer-motion";
import type { ProfileData } from "@/features/export/types";
interface ProfileSummaryProps {
  stats: ProfileData["stats"];
}

const statItems = [
  { key: "totalContributions", label: "Contributions", suffix: "" },
  { key: "totalRepos", label: "Repositories", suffix: "" },
  { key: "totalStars", label: "Stars", suffix: "" },
  { key: "longestStreak", label: "Longest Streak", suffix: " days" },
  { key: "currentStreak", label: "Current Streak", suffix: " days" },
  { key: "languagesCount", label: "Languages", suffix: "" },
] as const;

export function ProfileSummary({ stats }: ProfileSummaryProps) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
      {statItems.map((item, i) => {
        const val = stats[item.key];
        return (
          <motion.div
            key={item.key}
            className="flex flex-col items-center rounded-xl border border-glass-border bg-glass p-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.05, duration: 0.4 }}
          >
            <span className="text-xl font-bold tracking-tight">
              {val.toLocaleString()}
            </span>
            <span className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              {item.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
