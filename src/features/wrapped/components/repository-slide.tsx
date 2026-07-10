"use client";

import { motion } from "framer-motion";
import { useWrappedStore } from "../store";
import { getSlideContent } from "../services/insight-composer";
import { GlassCard } from "./shared/glass-card";

export function RepositorySlide() {
  const narrative = useWrappedStore((s) => s.narrative);
  const analytics = useWrappedStore((s) => s.analytics);
  const content = getSlideContent("repository", narrative);

  const repos = analytics?.repository;

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
          <p className="text-sm text-muted-foreground">Most Active</p>
          <p className="text-xl font-bold truncate">{repos?.mostActive?.name ?? "N/A"}</p>
          <p className="text-sm text-chart-1">
            {repos?.mostActive?.contributionCount.toLocaleString()} contributions
          </p>
        </GlassCard>

        <GlassCard delay={0.3}>
          <p className="text-sm text-muted-foreground">Total Stars</p>
          <p className="text-3xl font-bold">{repos?.starCount.toLocaleString() ?? 0}</p>
        </GlassCard>

        <GlassCard delay={0.4}>
          <p className="text-sm text-muted-foreground">Health Score</p>
          <p className="text-3xl font-bold">{repos?.healthAverage ?? 0}/100</p>
        </GlassCard>

        <GlassCard delay={0.5}>
          <p className="text-sm text-muted-foreground">Repository Breakdown</p>
          <div className="mt-1 flex gap-4 text-sm">
            <span className="text-chart-2">{repos?.public ?? 0} public</span>
            <span className="text-muted-foreground">/</span>
            <span>{repos?.private ?? 0} private</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-chart-4">{repos?.forked ?? 0} forked</span>
          </div>
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
