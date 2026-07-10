import type { NarrativeData, SlideContent, ChapterId } from "../types";
import { CHAPTER_ORDER } from "../types";
import { generateFallbackNarrative } from "./narrative.service";
import { generatePredictions } from "./predictions.service";
import { generateRecommendations } from "./recommendations.service";
import type { DeveloperSummary } from "@/features/analytics/types";

export interface ComposedReport {
  narrative: NarrativeData;
  predictions: ReturnType<typeof generatePredictions>;
  recommendations: ReturnType<typeof generateRecommendations>;
}

export function composeReport(
  summary: DeveloperSummary,
  narrativeOverride?: NarrativeData
): ComposedReport {
  const narrative = narrativeOverride ?? generateFallbackNarrative("Developer");
  const predictions = generatePredictions(summary);
  const recommendations = generateRecommendations(summary);

  return { narrative, predictions, recommendations };
}

export function getSlideContent(
  chapterId: ChapterId,
  narrative: NarrativeData | null
): SlideContent {
  const defaultContent: SlideContent = {
    title: "Loading...",
    subtitle: "Preparing your story",
    story: "",
    highlights: [],
  };

  if (!narrative) return defaultContent;
  return narrative.slides[chapterId] ?? defaultContent;
}

export function getChapterIndex(chapterId: ChapterId): number {
  return CHAPTER_ORDER.indexOf(chapterId);
}

export function getTotalChapters(): number {
  return CHAPTER_ORDER.length;
}
