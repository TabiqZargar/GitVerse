"use client";

import { motion } from "framer-motion";
import type { ProfileData } from "@/features/profile/types";

interface ProfileSummaryProps {
  profile: ProfileData;
}

const statItems = [
  { key: "publicRepos", label: "Repositories", suffix: "", getValue: (p: ProfileData) => p.publicRepos },
  { key: "totalStars", label: "Stars", suffix: "", getValue: (p: ProfileData) => p.totalStars },
  { key: "followers", label: "Followers", suffix: "", getValue: (p: ProfileData) => p.followers },
  { key: "following", label: "Following", suffix: "", getValue: (p: ProfileData) => p.following },
  { key: "totalCommits", label: "Commits", suffix: "", getValue: (p: ProfileData) => p.totalCommits },
  { key: "languages", label: "Languages", suffix: "", getValue: (p: ProfileData) => p.languages.length },
];

export function ProfileSummary({ profile }: ProfileSummaryProps) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
      {statItems.map((item, i) => {
        const val = item.getValue(profile);
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
