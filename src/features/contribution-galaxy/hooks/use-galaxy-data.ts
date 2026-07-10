"use client";

import { useEffect, useMemo } from "react";
import type { GitHubDay } from "@/features/github/types";
import { adaptDaysToParticles, computePositions } from "../data-adapter";
import { useGalaxyStore } from "../store";
import type { GalaxyLayout } from "../types";

export function useGalaxyData(
  days: GitHubDay[],
  layout: GalaxyLayout = "spiral"
) {
  const setParticles = useGalaxyStore((s) => s.setParticles);
  const setLayout = useGalaxyStore((s) => s.setLayout);

  const rawParticles = useMemo(() => adaptDaysToParticles(days), [days]);

  const particles = useMemo(
    () => computePositions(rawParticles, layout),
    [rawParticles, layout]
  );

  useEffect(() => {
    setParticles(particles);
  }, [particles, setParticles]);

  useEffect(() => {
    setLayout(layout);
  }, [layout, setLayout]);

  return particles;
}
