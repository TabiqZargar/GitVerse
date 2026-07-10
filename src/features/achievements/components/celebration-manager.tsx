"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAchievementStore } from "../store";
import type { Rarity } from "../types";

const rarityColors: Record<Rarity, { bg: string; text: string; border: string }> = {
  common: { bg: "from-muted-foreground/20 to-muted-foreground/5", text: "text-muted-foreground", border: "border-muted-foreground/20" },
  rare: { bg: "from-chart-1/20 to-chart-1/5", text: "text-chart-1", border: "border-chart-1/20" },
  epic: { bg: "from-chart-4/20 to-chart-4/5", text: "text-chart-4", border: "border-chart-4/20" },
  legendary: { bg: "from-chart-5/20 to-chart-5/5", text: "text-chart-5", border: "border-chart-5/20" },
  mythic: { bg: "from-yellow-500/20 to-yellow-500/5", text: "text-yellow-400", border: "border-yellow-500/20" },
};

const particleCounts: Record<Rarity, number> = {
  common: 10,
  rare: 20,
  epic: 35,
  legendary: 50,
  mythic: 80,
};

const colorMap: Record<Rarity, string> = {
  common: "oklch(0.6 0.03 265)",
  rare: "oklch(0.65 0.2 265)",
  epic: "oklch(0.65 0.2 320)",
  legendary: "oklch(0.6 0.22 15)",
  mythic: "oklch(0.8 0.2 85)",
};

interface ParticleData {
  x: number;
  y: number;
  size: number;
  delay: number;
  color: string;
  yOffset: number;
  xOffset: number;
  duration: number;
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function generateParticles(count: number, rarity: Rarity, seed: number): ParticleData[] {
  const rng = seededRandom(seed);
  return Array.from({ length: count }, () => ({
    x: rng() * 100,
    y: rng() * 100,
    size: rng() * 4 + 2,
    delay: rng() * 0.5,
    color: colorMap[rarity],
    yOffset: -(30 + rng() * 40),
    xOffset: (rng() - 0.5) * 60,
    duration: 1.5 + rng(),
  }));
}

function CelebrationParticles({ rarity, count }: { rarity: Rarity; count: number }) {
  const seed = count * 7 + rarity.length * 13;
  const particles = useMemo(() => generateParticles(count, rarity, seed), [count, rarity, seed]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0],
            y: [0, p.yOffset],
            x: [0, p.xOffset],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

export function CelebrationManager() {
  const recentCelebrations = useAchievementStore((s) => s.recentCelebrations);
  const dismissCelebration = useAchievementStore((s) => s.dismissCelebration);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentEvent = recentCelebrations[currentIndex];

  const dismiss = useCallback(() => {
    if (!currentEvent) return;
    dismissCelebration(currentEvent.achievementId);
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, [currentEvent, dismissCelebration]);

  useEffect(() => {
    if (!currentEvent) return;
    const timer = setTimeout(dismiss, 4000);
    return () => clearTimeout(timer);
  }, [currentEvent, dismiss]);

  if (!currentEvent) return null;

  const colors = rarityColors[currentEvent.rarity];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[400] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="absolute inset-0 bg-background/60 backdrop-blur-sm"
          onClick={dismiss}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        <CelebrationParticles rarity={currentEvent.rarity} count={particleCounts[currentEvent.rarity]} />

        <motion.div
          className={`relative z-10 flex flex-col items-center gap-4 rounded-2xl border bg-gradient-to-b p-8 text-center ${colors.bg} ${colors.border}`}
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: -20 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
        >
          <motion.div
            className="text-6xl"
            initial={{ rotate: -20, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", damping: 10, stiffness: 200, delay: 0.1 }}
          >
            {"\u{1F3C6}"}
          </motion.div>

          <div className="flex flex-col gap-1">
            <span className={`text-sm font-semibold uppercase tracking-widest ${colors.text}`}>
              Achievement Unlocked
            </span>
            <h3 className="text-2xl font-bold">{currentEvent.name}</h3>
          </div>

          <span className={`rounded-full border px-3 py-0.5 text-xs font-semibold uppercase ${colors.text} ${colors.border}`}>
            {currentEvent.rarity}
          </span>

          {recentCelebrations.length > 1 && (
            <span className="text-xs text-muted-foreground">
              {currentIndex + 1} of {recentCelebrations.length}
            </span>
          )}

          <motion.button
            onClick={dismiss}
            className="mt-2 rounded-lg bg-foreground/10 px-4 py-2 text-sm font-medium text-foreground/70 hover:bg-foreground/20 hover:text-foreground"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continue
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
