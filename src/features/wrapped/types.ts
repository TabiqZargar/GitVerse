import type { DeveloperSummary } from "@/features/analytics/types";

export type ChapterId =
  | "welcome"
  | "summary"
  | "contribution"
  | "repository"
  | "language"
  | "habits"
  | "milestones"
  | "predictions"
  | "recommendations"
  | "celebration";

export const CHAPTER_ORDER: ChapterId[] = [
  "welcome",
  "summary",
  "contribution",
  "repository",
  "language",
  "habits",
  "milestones",
  "predictions",
  "recommendations",
  "celebration",
];

export const CHAPTER_LABELS: Record<ChapterId, string> = {
  welcome: "Welcome",
  summary: "Year in Review",
  contribution: "Contributions",
  repository: "Repositories",
  language: "Languages",
  habits: "Coding Habits",
  milestones: "Milestones",
  predictions: "Predictions",
  recommendations: "Recommendations",
  celebration: "Celebration",
};

export interface SlideContent {
  title: string;
  subtitle: string;
  story: string;
  highlights: string[];
}

export interface NarrativeData {
  slides: Record<ChapterId, SlideContent>;
}

export interface Prediction {
  title: string;
  description: string;
  confidence: "high" | "medium" | "low";
  metric?: number;
}

export interface Recommendation {
  title: string;
  description: string;
  category: "language" | "open-source" | "repository" | "consistency" | "learning";
  priority: "high" | "medium" | "low";
}

export interface WrappedState {
  currentChapter: ChapterId;
  isPlaying: boolean;
  reducedMotion: boolean;
  hasCompleted: boolean;
  narrative: NarrativeData | null;
  predictions: Prediction[];
  recommendations: Recommendation[];
  analytics: DeveloperSummary | null;
  isLoadingNarrative: boolean;
  narrativeError: string | null;
}

export interface WrappedReport {
  narrative: NarrativeData;
  predictions: Prediction[];
  recommendations: Recommendation[];
  analytics: DeveloperSummary;
  generatedAt: string;
}
