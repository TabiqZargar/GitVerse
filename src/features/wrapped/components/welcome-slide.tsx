"use client";

import { motion } from "framer-motion";
import { useWrappedStore } from "../store";
import { getSlideContent } from "../services/insight-composer";

export function WelcomeSlide() {
  const narrative = useWrappedStore((s) => s.narrative);
  const analytics = useWrappedStore((s) => s.analytics);
  const content = getSlideContent("welcome", narrative);

  const grade = analytics?.scores.developer.grade ?? "S";
  const score = analytics?.scores.developer.total ?? 0;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-8">
      <motion.div
        className="flex flex-col items-center gap-6 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="text-sm font-medium tracking-widest uppercase text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Your Developer Year
        </motion.div>

        <motion.h1
          className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {content.title}
        </motion.h1>

        <motion.p
          className="max-w-xl text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {content.subtitle}
        </motion.p>

        <motion.div
          className="mt-8 flex items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="text-7xl font-black tracking-tighter text-chart-1">{grade}</div>
          <div className="flex flex-col items-start text-left">
            <span className="text-sm text-muted-foreground">Developer Score</span>
            <span className="text-2xl font-bold">{score}/100</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
