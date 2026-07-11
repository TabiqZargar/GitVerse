"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useWrappedStore } from "../store";
import { SlideRenderer } from "./slide-renderer";
import { ChapterNavigator } from "./chapter-navigator";
import { AnimationController } from "./animation-controller";
import { ThemeManager } from "./theme-manager";
import { generateFallbackNarrative } from "../services/narrative.service";
import { generatePredictions } from "../services/predictions.service";
import { generateRecommendations } from "../services/recommendations.service";
import type { DeveloperSummary } from "@/features/analytics/types";

interface WrappedEngineProps {
  username?: string;
}

export function WrappedEngine({ username }: WrappedEngineProps) {
  const setNarrative = useWrappedStore((s) => s.setNarrative);
  const setPredictions = useWrappedStore((s) => s.setPredictions);
  const setRecommendations = useWrappedStore((s) => s.setRecommendations);
  const setAnalytics = useWrappedStore((s) => s.setAnalytics);
  const setLoadingNarrative = useWrappedStore((s) => s.setLoadingNarrative);
  const setNarrativeError = useWrappedStore((s) => s.setNarrativeError);
  const setReducedMotion = useWrappedStore((s) => s.setReducedMotion);

  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useQuery({
    queryKey: ["wrapped", "analytics", username],
    queryFn: async () => {
      const endpoint = username
        ? `/wrapped?username=${encodeURIComponent(username)}`
        : "/wrapped";
      const res = await apiClient.get<{ data: DeveloperSummary; username: string }>(endpoint);
      if (!res.success) throw new Error(res.error.message);
      return res.data;
    },
    staleTime: 30 * 60 * 1000,
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [setReducedMotion]);

  useEffect(() => {
    if (!analyticsData) return;

    const summary = analyticsData.data;
    const activeUsername = analyticsData.username;

    setAnalytics(summary);
    setLoadingNarrative(true);

    const narrative = generateFallbackNarrative(activeUsername);
    const predictions = generatePredictions(summary);
    const recommendations = generateRecommendations(summary);

    setNarrative(narrative);
    setPredictions(predictions);
    setRecommendations(recommendations);
    setLoadingNarrative(false);
    setNarrativeError(null);
  }, [
    analyticsData,
    setAnalytics,
    setNarrative,
    setPredictions,
    setRecommendations,
    setLoadingNarrative,
    setNarrativeError,
  ]);

  if (analyticsLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
          <p className="text-sm text-muted-foreground">Loading your developer story...</p>
        </div>
      </div>
    );
  }

  if (analyticsError) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-lg font-semibold text-destructive">Failed to load analytics</p>
          <p className="text-sm text-muted-foreground">
            Please ensure you are logged in and have GitHub data available.
          </p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <p className="text-muted-foreground">No analytics data available.</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <ThemeManager />
      <SlideRenderer />
      <ChapterNavigator />
      <AnimationController />
    </div>
  );
}
