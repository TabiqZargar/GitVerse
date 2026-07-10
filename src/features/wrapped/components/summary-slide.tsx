"use client";

import { motion } from "framer-motion";
import { useWrappedStore } from "../store";
import { getSlideContent } from "../services/insight-composer";
import { StatDisplay } from "./shared/stat-display";

export function SummarySlide() {
  const narrative = useWrappedStore((s) => s.narrative);
  const analytics = useWrappedStore((s) => s.analytics);
  const content = getSlideContent("summary", narrative);

  const stats = analytics?.statistics;
  const streaks = analytics?.streaks;
  const repos = analytics?.repository;
  const langs = analytics?.language;
  const scores = analytics?.scores;
  const trends = analytics?.trends;

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

      <div className="grid max-w-3xl grid-cols-3 gap-6 sm:grid-cols-3">
        <StatDisplay
          label="Contributions"
          value={stats?.totalContributions ?? 0}
          delay={0.2}
          size="md"
        />
        <StatDisplay
          label="Longest Streak"
          value={streaks?.longestStreak ?? 0}
          suffix="days"
          delay={0.3}
          size="md"
        />
        <StatDisplay
          label="Repositories"
          value={repos?.total ?? 0}
          delay={0.4}
          size="md"
        />
        <StatDisplay
          label="Languages"
          value={langs?.diversity ?? 0}
          delay={0.5}
          size="md"
        />
        <StatDisplay
          label="Dev Score"
          value={scores?.developer.total ?? 0}
          suffix={`/100 ${scores?.developer.grade ?? ""}`}
          delay={0.6}
          size="md"
        />
        <StatDisplay
          label="Growth"
          value={trends?.growthScore ?? 0}
          suffix="pts"
          delay={0.7}
          size="md"
        />
      </div>
    </div>
  );
}
