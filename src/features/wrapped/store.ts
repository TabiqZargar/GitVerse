import { create } from "zustand";
import type { WrappedState, ChapterId, NarrativeData, Prediction, Recommendation } from "./types";
import type { DeveloperSummary } from "@/features/analytics/types";
import { CHAPTER_ORDER } from "./types";

const initialState: WrappedState = {
  currentChapter: "welcome",
  isPlaying: false,
  reducedMotion: false,
  hasCompleted: false,
  narrative: null,
  predictions: [],
  recommendations: [],
  analytics: null,
  isLoadingNarrative: false,
  narrativeError: null,
};

export const useWrappedStore = create<WrappedState & {
  goToChapter: (id: ChapterId) => void;
  nextChapter: () => void;
  prevChapter: () => void;
  setPlaying: (playing: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  setCompleted: (completed: boolean) => void;
  setNarrative: (narrative: NarrativeData) => void;
  setPredictions: (predictions: Prediction[]) => void;
  setRecommendations: (recommendations: Recommendation[]) => void;
  setAnalytics: (analytics: DeveloperSummary) => void;
  setLoadingNarrative: (loading: boolean) => void;
  setNarrativeError: (error: string | null) => void;
  reset: () => void;
}>((set, get) => ({
  ...initialState,

  goToChapter: (id) => {
    set({ currentChapter: id, isPlaying: false });
  },

  nextChapter: () => {
    const { currentChapter } = get();
    const idx = CHAPTER_ORDER.indexOf(currentChapter);
    if (idx < CHAPTER_ORDER.length - 1) {
      set({ currentChapter: CHAPTER_ORDER[idx + 1] as ChapterId });
    } else {
      set({ hasCompleted: true, isPlaying: false });
    }
  },

  prevChapter: () => {
    const { currentChapter } = get();
    const idx = CHAPTER_ORDER.indexOf(currentChapter);
    if (idx > 0) {
      const prev = CHAPTER_ORDER[idx - 1];
      if (prev) set({ currentChapter: prev, isPlaying: false });
    }
  },

  setPlaying: (playing) => set({ isPlaying: playing }),
  setReducedMotion: (reduced) => set({ reducedMotion: reduced }),
  setCompleted: (completed) => set({ hasCompleted: completed }),
  setNarrative: (narrative) => set({ narrative }),
  setPredictions: (predictions) => set({ predictions }),
  setRecommendations: (recommendations) => set({ recommendations }),
  setAnalytics: (analytics) => set({ analytics }),
  setLoadingNarrative: (loading) => set({ isLoadingNarrative: loading }),
  setNarrativeError: (error) => set({ narrativeError: error }),
  reset: () => set(initialState),
}));
