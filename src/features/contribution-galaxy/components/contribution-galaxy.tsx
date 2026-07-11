"use client";

import { useEffect, Suspense, lazy, useMemo } from "react";
import type { GitHubDay } from "@/features/github/types";
import { SceneContainer } from "@/components/design-system/scene-container";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { GalaxyRenderer } from "./galaxy-renderer";
import { GalaxyCamera } from "./galaxy-camera";
import { GalaxyLighting } from "./galaxy-lighting";
import { GalaxyControls } from "./galaxy-controls";
import { GalaxyFilters } from "./galaxy-filters";
import { InspectorOverlay } from "./inspector-overlay";
import { GalaxyLegend } from "./galaxy-legend";
import { adaptDaysToParticles, computePositions } from "../data-adapter";
import { useGalaxyStore } from "../store";
import type { GalaxyLayout } from "../types";

const LazyCanvas = lazy(() =>
  import("@react-three/fiber").then((m) => ({ default: m.Canvas }))
);

interface ContributionGalaxyProps {
  days: GitHubDay[];
  layout?: GalaxyLayout;
  reducedMotion?: boolean;
}

export function ContributionGalaxy({
  days,
  layout = "spiral",
  reducedMotion = false,
}: ContributionGalaxyProps) {
  const setParticles = useGalaxyStore((s) => s.setParticles);

  const particles = useMemo(() => {
    const raw = adaptDaysToParticles(days);
    return computePositions(raw, layout);
  }, [days, layout]);

  useEffect(() => {
    setParticles(particles);
    useGalaxyStore.setState({ layout });
  }, [particles, setParticles, layout]);

  return (
    <SceneContainer className="relative h-full w-full">
      <div className="absolute inset-0">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
            </div>
          }
        >
          <ErrorBoundary>
            <LazyCanvas
              camera={{ position: [0, 5, 14], fov: 50, near: 0.1, far: 50 }}
              gl={{
                antialias: !reducedMotion,
                alpha: false,
                powerPreference: "high-performance",
              }}
              dpr={[1, reducedMotion ? 1 : 1.5]}
            >
              <GalaxyLighting />
              <GalaxyCamera reducedMotion={reducedMotion} />
              <GalaxyRenderer
                particles={particles}
                reducedMotion={reducedMotion}
              />
            </LazyCanvas>
          </ErrorBoundary>
        </Suspense>
      </div>

      <GalaxyControls />
      <GalaxyFilters />
      <InspectorOverlay />
      <GalaxyLegend />
    </SceneContainer>
  );
}
