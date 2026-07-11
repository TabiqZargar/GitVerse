"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AchievementCardProps {
  title: string;
  date?: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary" | "mythic";
  locked?: boolean;
  progress?: number;
}

// Production Spring Config
const springConfig = { type: "spring", stiffness: 400, damping: 25 };

export function AchievementCard({ title, date, icon, rarity, locked, progress }: AchievementCardProps) {
  const borderClass = locked 
    ? "border-white/5" 
    : `border-${rarity === "legendary" ? "chart-5" : rarity === "epic" ? "chart-4" : "chart-1"}/30`;

  return (
    <motion.div
      className={cn(
        "glass-case group relative rounded-3xl p-unit-md aspect-square flex flex-col items-center justify-center text-center border transition-all duration-300",
        borderClass,
        locked && "locked-shimmer"
      )}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={springConfig}
    >
      <motion.div 
        className={cn(
          "badge-glow w-28 h-28 mb-unit-md rounded-full flex items-center justify-center relative shadow-inner",
          locked ? "bg-white/5" : "bg-gradient-to-br from-secondary/20 to-secondary/5"
        )}
        whileHover={{ rotate: locked ? 0 : 5 }}
      >
        <div className="absolute inset-0 bg-white/5 rounded-full backdrop-blur-md border border-white/10" />
        {locked ? (
          <span className="material-symbols-outlined text-on-surface-variant text-4xl opacity-20">lock</span>
        ) : (
          <span className="text-4xl relative z-10 transition-transform duration-500 group-hover:scale-110">{icon}</span>
        )}
      </motion.div>
      
      <h3 className={cn("font-headline-sm text-headline-sm truncate w-full px-2", locked ? "text-on-surface-variant" : "text-on-surface")}>
        {title}
      </h3>
      
      {locked ? (
        <div className="w-2/3 bg-white/5 h-1 mt-unit-md rounded-full overflow-hidden" role="progressbar" aria-valuenow={progress ?? 0} aria-valuemin={0} aria-valuemax={100} aria-label={`${title} progress`}>
          <motion.div 
            className="bg-secondary/60 h-full" 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      ) : (
        <p className="text-label-mono font-label-mono text-on-surface-variant mt-unit-xs opacity-60 text-[10px]">
          {date}
        </p>
      )}
    </motion.div>
  );
}
