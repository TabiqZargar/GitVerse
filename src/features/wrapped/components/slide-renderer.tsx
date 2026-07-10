"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useWrappedStore } from "../store";
import { type ChapterId } from "../types";
import { WelcomeSlide } from "./welcome-slide";
import { SummarySlide } from "./summary-slide";
import { ContributionSlide } from "./contribution-slide";
import { RepositorySlide } from "./repository-slide";
import { LanguageSlide } from "./language-slide";
import { HabitsSlide } from "./habits-slide";
import { MilestonesSlide } from "./milestones-slide";
import { PredictionsSlide } from "./predictions-slide";
import { RecommendationsSlide } from "./recommendations-slide";
import { CelebrationSlide } from "./celebration-slide";

const slideComponents: Record<ChapterId, React.FC> = {
  welcome: WelcomeSlide,
  summary: SummarySlide,
  contribution: ContributionSlide,
  repository: RepositorySlide,
  language: LanguageSlide,
  habits: HabitsSlide,
  milestones: MilestonesSlide,
  predictions: PredictionsSlide,
  recommendations: RecommendationsSlide,
  celebration: CelebrationSlide,
};

export function SlideRenderer() {
  const currentChapter = useWrappedStore((s) => s.currentChapter);
  const reducedMotion = useWrappedStore((s) => s.reducedMotion);
  const SlideComponent = slideComponents[currentChapter];

  if (!SlideComponent) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentChapter}
        className="absolute inset-0"
        initial={
          reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }
        }
        animate={{ opacity: 1, y: 0 }}
        exit={
          reducedMotion ? { opacity: 1 } : { opacity: 0, y: -20 }
        }
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <SlideComponent />
      </motion.div>
    </AnimatePresence>
  );
}
