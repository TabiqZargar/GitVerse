"use client";

import { motion } from "framer-motion";
import { useWrappedStore } from "../store";
import { getSlideContent } from "../services/insight-composer";
import { GlassCard } from "./shared/glass-card";

export function LanguageSlide() {
  const narrative = useWrappedStore((s) => s.narrative);
  const analytics = useWrappedStore((s) => s.analytics);
  const content = getSlideContent("language", narrative);

  const langs = analytics?.language;
  const topLanguages = langs?.languages.slice(0, 5) ?? [];
  const primary = langs?.primaryLanguage;

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

      {primary && (
        <GlassCard delay={0.2} variant="accent" className="mb-6 text-center">
          <p className="text-sm text-muted-foreground">Primary Language</p>
          <p className="text-4xl font-bold text-chart-1">{primary}</p>
        </GlassCard>
      )}

      <div className="grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
        {topLanguages.map((lang, i) => (
          <GlassCard key={lang.name} delay={0.3 + i * 0.1}>
            <div className="flex items-center justify-between">
              <span className="font-semibold">{lang.name}</span>
              <span className="text-sm text-muted-foreground">{lang.percentage.toFixed(1)}%</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-chart-1"
                initial={{ width: 0 }}
                animate={{ width: `${lang.percentage}%` }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </GlassCard>
        ))}
      </div>

      {langs && langs.newLanguages.length > 0 && (
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <span className="text-sm text-muted-foreground">
            New: {langs.newLanguages.join(", ")}
          </span>
        </motion.div>
      )}

      <motion.div
        className="mt-6 max-w-lg text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <p className="text-muted-foreground">{content.story}</p>
      </motion.div>
    </div>
  );
}
