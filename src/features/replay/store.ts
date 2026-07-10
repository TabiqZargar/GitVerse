import { create } from "zustand";
import type { ReplayStore } from "./types";

export const useReplayStore = create<ReplayStore>((set, get) => ({
  currentDate: new Date(),
  progress: 0,
  isPlaying: false,
  speed: 1,
  loop: false,
  dateRange: null,
  tiles: [],
  isAtEnd: false,
  isAtStart: true,

  setTiles: (tiles) => {
    if (tiles.length === 0) return;

    const sorted = [...tiles].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    if (!first || !last) return;

    const start = new Date(first.date);
    const end = new Date(last.date);
    const totalDays = Math.round(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

    set({
      tiles: sorted,
      dateRange: { start, end, totalDays },
      currentDate: new Date(start),
      progress: 0,
      isAtStart: true,
      isAtEnd: false,
    });
  },

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),

  setSpeed: (speed) => set({ speed }),

  toggleLoop: () => set((s) => ({ loop: !s.loop })),

  setProgress: (progress) => {
    const { dateRange } = get();
    if (!dateRange) return;

    const clamped = Math.max(0, Math.min(1, progress));
    const dayOffset = Math.round(clamped * (dateRange.totalDays - 1));
    const newDate = new Date(dateRange.start);
    newDate.setDate(newDate.getDate() + dayOffset);

    set({
      progress: clamped,
      currentDate: newDate,
      isAtStart: clamped <= 0,
      isAtEnd: clamped >= 1,
    });
  },

  setCurrentDate: (date) => {
    const { dateRange } = get();
    if (!dateRange) return;

    const ms = date.getTime() - dateRange.start.getTime();
    const dayOffset = Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
    const progress = Math.min(dayOffset / (dateRange.totalDays - 1), 1);

    set({
      currentDate: date,
      progress,
      isAtStart: progress <= 0,
      isAtEnd: progress >= 1,
    });
  },

  nextStep: () => {
    const { dateRange, currentDate, loop } = get();
    if (!dateRange) return;

    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);

    if (next > dateRange.end) {
      if (loop) {
        set({
          currentDate: new Date(dateRange.start),
          progress: 0,
          isAtStart: true,
          isAtEnd: false,
        });
      }
      return;
    }

    const ms = next.getTime() - dateRange.start.getTime();
    const dayOffset = Math.round(ms / (1000 * 60 * 60 * 24));
    const progress = Math.min(dayOffset / (dateRange.totalDays - 1), 1);

    set({
      currentDate: next,
      progress,
      isAtStart: false,
      isAtEnd: next >= dateRange.end,
    });
  },

  prevStep: () => {
    const { dateRange, currentDate } = get();
    if (!dateRange) return;

    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);

    if (prev < dateRange.start) {
      set({
        currentDate: new Date(dateRange.start),
        progress: 0,
        isAtStart: true,
      });
      return;
    }

    const ms = prev.getTime() - dateRange.start.getTime();
    const dayOffset = Math.round(ms / (1000 * 60 * 60 * 24));
    const progress = Math.max(dayOffset / (dateRange.totalDays - 1), 0);

    set({
      currentDate: prev,
      progress,
      isAtEnd: false,
      isAtStart: prev <= dateRange.start,
    });
  },

  jumpToStart: () => {
    const { dateRange } = get();
    if (!dateRange) return;
    set({
      currentDate: new Date(dateRange.start),
      progress: 0,
      isAtStart: true,
      isAtEnd: false,
    });
  },

  jumpToEnd: () => {
    const { dateRange } = get();
    if (!dateRange) return;
    set({
      currentDate: new Date(dateRange.end),
      progress: 1,
      isAtStart: false,
      isAtEnd: true,
    });
  },
}));
