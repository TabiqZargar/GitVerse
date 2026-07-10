"use client";

import { useWrappedStore } from "../store";
import type { ChapterId } from "../types";
import { GradientBackground } from "./shared/gradient-background";

const chapterThemes: Record<
  ChapterId,
  { colors: [string, string, string]; speed?: number }
> = {
  welcome: {
    colors: ["oklch(0.2 0.06 265)", "oklch(0.15 0.05 200)", "oklch(0.18 0.05 300)"],
  },
  summary: {
    colors: ["oklch(0.2 0.06 265)", "oklch(0.16 0.04 200)", "oklch(0.15 0.04 280)"],
  },
  contribution: {
    colors: ["oklch(0.2 0.06 265)", "oklch(0.18 0.05 170)", "oklch(0.15 0.04 265)"],
  },
  repository: {
    colors: ["oklch(0.18 0.05 200)", "oklch(0.2 0.06 265)", "oklch(0.16 0.04 170)"],
  },
  language: {
    colors: ["oklch(0.2 0.06 265)", "oklch(0.18 0.06 320)", "oklch(0.16 0.04 85)"],
  },
  habits: {
    colors: ["oklch(0.18 0.05 170)", "oklch(0.2 0.06 265)", "oklch(0.16 0.04 300)"],
  },
  milestones: {
    colors: ["oklch(0.22 0.08 265)", "oklch(0.2 0.06 170)", "oklch(0.18 0.06 320)"],
  },
  predictions: {
    colors: ["oklch(0.2 0.06 265)", "oklch(0.18 0.05 300)", "oklch(0.16 0.04 200)"],
  },
  recommendations: {
    colors: ["oklch(0.2 0.06 200)", "oklch(0.18 0.05 280)", "oklch(0.16 0.04 170)"],
  },
  celebration: {
    colors: ["oklch(0.25 0.1 265)", "oklch(0.22 0.08 170)", "oklch(0.2 0.08 320)"],
    speed: 6,
  },
};

export function ThemeManager() {
  const currentChapter = useWrappedStore((s) => s.currentChapter);
  const theme = chapterThemes[currentChapter] ?? chapterThemes.welcome;

  return <GradientBackground colors={theme.colors} speed={theme.speed} />;
}
