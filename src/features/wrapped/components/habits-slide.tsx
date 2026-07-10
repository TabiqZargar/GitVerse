"use client";

import { motion } from "framer-motion";
import { useWrappedStore } from "../store";
import { getSlideContent } from "../services/insight-composer";
import { GlassCard } from "./shared/glass-card";
import { StatDisplay } from "./shared/stat-display";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function HabitsSlide() {
  const narrative = useWrappedStore((s) => s.narrative);
  const analytics = useWrappedStore((s) => s.analytics);
  const content = getSlideContent("habits", narrative);

  const activity = analytics?.activity;
  const productivity = analytics?.productivity;
  const weeklyCadence = activity?.weeklyCadence ?? [];
  const maxCadence = Math.max(...weeklyCadence, 1);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-8">
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">{content.title}</h2>
        <p className="mt-2 text-lg text-muted-foreground">{content.subtitle}</p>
      </motion.div>

      <div className="mb-6 grid max-w-lg grid-cols-3 gap-4">
        <StatDisplay label="Consistency" value={productivity?.consistencyScore ?? 0} suffix="/100" size="sm" delay={0.2} />
        <StatDisplay label="Momentum" value={activity?.momentum ?? 0} suffix="%" size="sm" delay={0.3} />
        <StatDisplay label="Active Days" value={productivity?.activeDaysRatio ?? 0} suffix="%" size="sm" delay={0.4} />
      </div>

      <GlassCard delay={0.5} className="w-full max-w-md">
        <p className="mb-3 text-sm font-medium text-muted-foreground">Weekly Activity Pattern</p>
        <div className="flex items-end gap-2">
          {weeklyCadence.map((count, i) => {
            const height = count > 0 ? (count / maxCadence) * 80 : 4;
            const label = WEEKDAY_LABELS[i];
            if (!label) return null;
            return (
              <div key={label} className="flex flex-1 flex-col items-center gap-1">
                <motion.div
                  className="w-full rounded-t-md bg-chart-1"
                  initial={{ height: 4 }}
                  animate={{ height: `${Math.max(height, 4)}px` }}
                  transition={{ duration: 0.6, delay: 0.6 + i * 0.05 }}
                />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            );
          })}
        </div>
      </GlassCard>

      <motion.div
        className="mt-6 max-w-lg text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <p className="text-muted-foreground">{content.story}</p>
      </motion.div>
    </div>
  );
}
