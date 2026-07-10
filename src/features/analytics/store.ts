import { create } from "zustand";
import type {
  AnalyticsState, AnalyticsInput,
  StreakResult, StatisticsResult, LanguageResult, RepositoryResult,
  ActivityResult, ProductivityResult, TrendResult, MilestoneResult,
  InsightCollection,
} from "./types";
import { computeDeveloperSummary } from "./services/summary.service";

interface AnalyticsStore extends AnalyticsState {
  compute: (input: AnalyticsInput) => void;
  updateStreaks: (streaks: StreakResult) => void;
  updateStatistics: (stats: StatisticsResult) => void;
  updateLanguage: (lang: LanguageResult) => void;
  updateRepository: (repo: RepositoryResult) => void;
  updateActivity: (activity: ActivityResult) => void;
  updateProductivity: (productivity: ProductivityResult) => void;
  updateTrends: (trends: TrendResult) => void;
  updateMilestones: (milestones: MilestoneResult) => void;
  updateInsights: (insights: InsightCollection) => void;
  reset: () => void;
}

const initialState: AnalyticsState = {
  streaks: null,
  statistics: null,
  language: null,
  repository: null,
  activity: null,
  productivity: null,
  trends: null,
  milestones: null,
  summary: null,
  insights: null,
  scores: null,
  isCalculating: false,
  lastUpdated: null,
};

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
  ...initialState,

  compute: (input: AnalyticsInput) => {
    set({ isCalculating: true });
    const summary = computeDeveloperSummary(input);
    set({
      ...summary,
      summary,
      insights: summary.insights,
      scores: summary.scores,
      isCalculating: false,
      lastUpdated: summary.computedAt,
    });
  },

  updateStreaks: (streaks) => set({ streaks }),
  updateStatistics: (stats) => set({ statistics: stats }),
  updateLanguage: (lang) => set({ language: lang }),
  updateRepository: (repo) => set({ repository: repo }),
  updateActivity: (activity) => set({ activity }),
  updateProductivity: (productivity) => set({ productivity }),
  updateTrends: (trends) => set({ trends }),
  updateMilestones: (milestones) => set({ milestones }),
  updateInsights: (insights) => set({ insights }),
  reset: () => set(initialState),
}));
