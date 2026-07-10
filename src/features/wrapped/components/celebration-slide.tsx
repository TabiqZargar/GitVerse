"use client";

import { motion } from "framer-motion";
import { useWrappedStore } from "../store";
import { getSlideContent } from "../services/insight-composer";

export function CelebrationSlide() {
  const narrative = useWrappedStore((s) => s.narrative);
  const analytics = useWrappedStore((s) => s.analytics);
  const content = getSlideContent("celebration", narrative);

  const grade = analytics?.scores.developer.grade ?? "S";
  const score = analytics?.scores.developer.total ?? 0;
  const contributions = analytics?.statistics.totalContributions ?? 0;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-8">
      <motion.div
        className="flex flex-col items-center gap-6 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="text-8xl font-black tracking-tighter text-chart-1"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {grade}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <p className="text-lg text-muted-foreground">
            Developer Score: {score}/100
          </p>
        </motion.div>

        <motion.h1
          className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {content.title}
        </motion.h1>

        <motion.p
          className="max-w-xl text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          {content.subtitle}
        </motion.p>

        <motion.p
          className="max-w-lg text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          {contributions.toLocaleString()} contributions across{" "}
          {analytics?.repository.total ?? 0} repositories.
        </motion.p>
      </motion.div>
    </div>
  );
}
