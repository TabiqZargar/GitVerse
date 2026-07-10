"use client";

import { useEffect, useRef, useMemo } from "react";
import { useReplayStore } from "./store";
import type { TileData } from "@/features/visualization/components/landscape/types";

export function usePlayback(): void {
  const isPlaying = useReplayStore((s) => s.isPlaying);
  const speed = useReplayStore((s) => s.speed);
  const nextStep = useReplayStore((s) => s.nextStep);
  const lastFrameRef = useRef(0);

  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = 1000 / speed;

    let running = true;
    let accumulated = 0;

    function frame(time: number) {
      if (!running) return;
      const delta = time - lastFrameRef.current;
      lastFrameRef.current = time;
      accumulated += delta;

      while (accumulated >= intervalMs && running) {
        nextStep();
        accumulated -= intervalMs;
      }

      requestAnimationFrame(frame);
    }

    lastFrameRef.current = performance.now();
    requestAnimationFrame(frame);

    return () => {
      running = false;
    };
  }, [isPlaying, speed, nextStep]);
}

export function useRevealProgress(tileDate: string): number {
  const currentDate = useReplayStore((s) => s.currentDate);
  const dateRange = useReplayStore((s) => s.dateRange);

  return useMemo(() => {
    if (!dateRange) return 1;

    const tileMs = new Date(tileDate).getTime();
    const currentMs = currentDate.getTime();
    const diffDays = (currentMs - tileMs) / (1000 * 60 * 60 * 24);

    if (diffDays >= 1.5) return 1;
    if (diffDays <= -1.5) return 0;

    const t = (diffDays + 1.5) / 3;
    return t * t * (3 - 2 * t);
  }, [tileDate, currentDate, dateRange]);
}

export function useVisibleTiles(): TileData[] {
  const tiles = useReplayStore((s) => s.tiles);
  const currentDate = useReplayStore((s) => s.currentDate);

  return useMemo(() => {
    const dateStr = currentDate.toISOString().split("T")[0] ?? "";
    return tiles.filter((t) => t.date <= dateStr);
  }, [tiles, currentDate]);
}

export function useReplayStats() {
  const tiles = useReplayStore((s) => s.tiles);
  const currentDate = useReplayStore((s) => s.currentDate);
  const dateRange = useReplayStore((s) => s.dateRange);
  const progress = useReplayStore((s) => s.progress);

  return useMemo(() => {
    const dateStr = currentDate.toISOString().split("T")[0] ?? "";
    const visible = tiles.filter((t) => t.date <= dateStr);
    const totalSoFar = visible.reduce((sum, t) => sum + t.count, 0);
    const activeDays = visible.filter((t) => t.count > 0).length;
    const streakDays = computeCurrentStreak(visible);

    return {
      totalContributions: totalSoFar,
      activeDays,
      currentStreak: streakDays,
      visibleTiles: visible.length,
      totalTiles: tiles.length,
      progress,
      currentDate,
      dateRange,
    };
  }, [tiles, currentDate, progress, dateRange]);
}

function computeCurrentStreak(tiles: TileData[]): number {
  const sorted = [...tiles]
    .filter((t) => t.count > 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (sorted.length === 0) return 0;

  let streak = 1;
  for (let i = sorted.length - 1; i > 0; i--) {
    const curr = sorted[i];
    const prev = sorted[i - 1];
    if (!curr || !prev) break;
    const currDate = new Date(curr.date);
    const prevDate = new Date(prev.date);
    const diff = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diff <= 1.5) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function usePlaybackState() {
  const isPlaying = useReplayStore((s) => s.isPlaying);
  const speed = useReplayStore((s) => s.speed);
  const loop = useReplayStore((s) => s.loop);
  const progress = useReplayStore((s) => s.progress);
  const currentDate = useReplayStore((s) => s.currentDate);
  const isAtEnd = useReplayStore((s) => s.isAtEnd);
  const isAtStart = useReplayStore((s) => s.isAtStart);
  const dateRange = useReplayStore((s) => s.dateRange);

  const togglePlay = useReplayStore((s) => s.togglePlay);
  const setSpeed = useReplayStore((s) => s.setSpeed);
  const toggleLoop = useReplayStore((s) => s.toggleLoop);
  const setProgress = useReplayStore((s) => s.setProgress);
  const nextStep = useReplayStore((s) => s.nextStep);
  const prevStep = useReplayStore((s) => s.prevStep);
  const jumpToStart = useReplayStore((s) => s.jumpToStart);
  const jumpToEnd = useReplayStore((s) => s.jumpToEnd);

  return {
    isPlaying,
    speed,
    loop,
    progress,
    currentDate,
    isAtEnd,
    isAtStart,
    dateRange,
    togglePlay,
    setSpeed,
    toggleLoop,
    setProgress,
    nextStep,
    prevStep,
    jumpToStart,
    jumpToEnd,
  };
}
