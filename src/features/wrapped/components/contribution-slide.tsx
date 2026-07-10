"use client";

import { motion } from "framer-motion";
import { useWrappedStore } from "../store";
import { getSlideContent } from "../services/insight-composer";
import { GlassCard } from "./shared/glass-card";

export function ContributionSlide() {
  const narrative = useWrappedStore((s) => s.narrative);
  const analytics = useWrappedStore((s) => s.analytics);
  const content = getSlideContent("contribution", narrative);

  const stats = analytics?.statistics;
  const activity = analytics?.activity;

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

      <div className="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        <GlassCard delay={0.2} variant="accent">
          <p className="text-sm text-muted-foreground">Most Productive Month</p>
          <p className="text-2xl font-bold">{stats?.mostProductiveMonth.label}</p>
          <p className="text-lg text-chart-1">{stats?.mostProductiveMonth.contributions.toLocaleString()} contributions</p>
        </GlassCard>

        <GlassCard delay={0.3} variant="success">
          <p className="text-sm text-muted-foreground">Most Productive Day</p>
          <p className="text-2xl font-bold">{stats?.mostProductiveWeekday.label}</p>
          <p className="text-lg text-chart-2">{stats?.mostProductiveWeekday.contributions.toLocaleString()} contributions</p>
        </GlassCard>

        <GlassCard delay={0.4}>
          <p className="text-sm text-muted-foreground">Daily Average</p>
          <p className="text-3xl font-bold">{stats?.averages.daily.toFixed(1)}</p>
          <p className="text-sm text-muted-foreground">contributions per day</p>
        </GlassCard>

        <GlassCard delay={0.5}>
          <p className="text-sm text-muted-foreground">Peak Day</p>
          <p className="text-3xl font-bold">{activity?.peak?.count.toLocaleString() ?? 0}</p>
          <p className="text-sm text-muted-foreground">{activity?.peak?.date ?? "N/A"}</p>
        </GlassCard>
      </div>

      <motion.div
        className="mt-6 max-w-lg text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <p className="text-muted-foreground">{content.story}</p>
      </motion.div>
    </div>
  );
}
