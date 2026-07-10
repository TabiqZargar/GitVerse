"use client";

import { motion } from "framer-motion";
import { useWrappedStore } from "../store";
import { getSlideContent } from "../services/insight-composer";
import { GlassCard } from "./shared/glass-card";

const confidenceColors: Record<string, string> = {
  high: "border-chart-2/30 bg-chart-2/10 text-chart-2",
  medium: "border-chart-1/30 bg-chart-1/10 text-chart-1",
  low: "border-chart-4/30 bg-chart-4/10 text-chart-4",
};

export function PredictionsSlide() {
  const narrative = useWrappedStore((s) => s.narrative);
  const predictions = useWrappedStore((s) => s.predictions);
  const content = getSlideContent("predictions", narrative);

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

      {predictions.length === 0 ? (
        <p className="text-muted-foreground">Not enough data for predictions yet.</p>
      ) : (
        <div className="grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
          {predictions.slice(0, 6).map((p, i) => (
            <GlassCard key={p.title} delay={0.2 + i * 0.08}>
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold">{p.title}</p>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${
                      confidenceColors[p.confidence] ?? confidenceColors.medium
                    }`}
                  >
                    {p.confidence}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{p.description}</p>
                {p.metric !== undefined && (
                  <p className="text-lg font-bold text-chart-1">
                    {p.metric.toLocaleString()}
                  </p>
                )}
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
        <p className="text-sm text-muted-foreground">{content.story}</p>
      </motion.div>
    </div>
  );
}
