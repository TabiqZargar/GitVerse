"use client";

import { motion } from "framer-motion";
import { useWrappedStore } from "../store";
import { getSlideContent } from "../services/insight-composer";
import { GlassCard } from "./shared/glass-card";

const priorityColors: Record<string, string> = {
  high: "border-destructive/30 bg-destructive/10 text-destructive",
  medium: "border-chart-1/30 bg-chart-1/10 text-chart-1",
  low: "border-chart-2/30 bg-chart-2/10 text-chart-2",
};

const categoryLabels: Record<string, string> = {
  language: "Language",
  "open-source": "Open Source",
  repository: "Repository",
  consistency: "Consistency",
  learning: "Learning",
};

export function RecommendationsSlide() {
  const narrative = useWrappedStore((s) => s.narrative);
  const recommendations = useWrappedStore((s) => s.recommendations);
  const content = getSlideContent("recommendations", narrative);

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

      {recommendations.length === 0 ? (
        <p className="text-muted-foreground">No recommendations at this time.</p>
      ) : (
        <div className="grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
          {recommendations.slice(0, 6).map((r, i) => (
            <GlassCard key={r.title} delay={0.2 + i * 0.08}>
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {categoryLabels[r.category] ?? r.category}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${
                      priorityColors[r.priority] ?? priorityColors.medium
                    }`}
                  >
                    {r.priority}
                  </span>
                </div>
                <p className="font-semibold">{r.title}</p>
                <p className="text-sm text-muted-foreground">{r.description}</p>
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
