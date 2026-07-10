"use client";

import { motion } from "framer-motion";
import { useWrappedStore } from "../store";
import { getSlideContent } from "../services/insight-composer";
import { GlassCard } from "./shared/glass-card";

const milestoneIcons: Record<string, string> = {
  first_commit: "\u{1F4BB}",
  longest_streak: "\u{1F525}",
  contribution_1000: "\u{1F3C6}",
  contribution_5000: "\u{1F3C6}",
  contribution_10000: "\u{1F3C6}",
  commit_100: "\u{2B50}",
  commit_500: "\u{2B50}",
  commit_1000: "\u{2B50}",
  streak_7: "\u{1F4AA}",
  streak_30: "\u{1F4AA}",
  streak_365: "\u{1F3AF}",
  stars_10: "\u{2B50}",
  stars_100: "\u{1F31F}",
  default: "\u{1F3C6}",
};

export function MilestonesSlide() {
  const narrative = useWrappedStore((s) => s.narrative);
  const analytics = useWrappedStore((s) => s.analytics);
  const content = getSlideContent("milestones", narrative);

  const milestones = analytics?.milestones.milestones ?? [];
  const displayMilestones = milestones.slice(0, 8);

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

      {displayMilestones.length === 0 ? (
        <p className="text-muted-foreground">No milestones recorded yet. Keep building!</p>
      ) : (
        <div className="grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
          {displayMilestones.map((m, i) => (
            <GlassCard key={m.type + m.date} delay={0.2 + i * 0.08} variant={i === 0 ? "accent" : "default"}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{milestoneIcons[m.type] ?? milestoneIcons.default}</span>
                <div className="flex-1">
                  <p className="font-semibold">{m.label}</p>
                  <p className="text-sm text-muted-foreground">{m.date.replace(/-/g, "/")}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

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
