"use client";

import { useState, useCallback, useMemo, lazy, Suspense } from "react";
import dynamic from "next/dynamic";
import { SceneContainer } from "@/components/design-system/scene-container";
import { Tooltip } from "./tooltip";
import { LandscapeControls } from "./landscape-controls";
import { buildTerrainGrid } from "./utils";
import type { TileData } from "./types";

const LazyCanvas = dynamic(
  () => import("@react-three/fiber").then((mod) => ({ default: mod.Canvas })),
  { ssr: false }
);

const LandscapeLighting = lazy(() =>
  import("./lighting").then((mod) => ({ default: mod.LandscapeLighting }))
);

const CameraRig = lazy(() =>
  import("./camera-rig").then((mod) => ({ default: mod.CameraRig }))
);

const Terrain = lazy(() =>
  import("./terrain").then((mod) => ({ default: mod.Terrain }))
);

const ParticlesComponent = lazy(() =>
  import("./particles").then((mod) => ({ default: mod.Particles }))
);

interface LandscapeSceneProps {
  days?: TileData[];
  isLoading?: boolean;
  className?: string;
  currentDate?: Date;
}

function LoadingFallback() {
  return (
    <div className="flex h-full min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
        <p className="text-xs text-muted-foreground">Preparing landscape...</p>
      </div>
    </div>
  );
}

export function LandscapeScene({ days, isLoading, className, currentDate }: LandscapeSceneProps) {
  const [hoveredTile, setHoveredTile] = useState<TileData | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const grid = useMemo(() => (days ? buildTerrainGrid(days) : null), [days]);

  const handleResetView = useCallback(() => {}, []);
  const handleZoomIn = useCallback(() => {}, []);
  const handleZoomOut = useCallback(() => {}, []);
  const handleRotateLeft = useCallback(() => {}, []);
  const handleRotateRight = useCallback(() => {}, []);

  return (
    <SceneContainer
      className={className}
      isLoading={isLoading}
      loadingOverlay={<LoadingFallback />}
      label="3D Contribution Landscape"
    >
      <LandscapeControls
        onResetView={handleResetView}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onRotateLeft={handleRotateLeft}
        onRotateRight={handleRotateRight}
        reducedMotion={reducedMotion}
      />

      <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
        <button
          onClick={() => setReducedMotion((p) => !p)}
          className="rounded-lg border border-glass-border bg-glass/50 px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground backdrop-blur-[12px] transition-colors hover:bg-glass-hover hover:text-foreground"
          aria-label={reducedMotion ? "Enable animations" : "Reduce motion"}
        >
          {reducedMotion ? "Animate" : "Static"}
        </button>
      </div>

      <div className="pointer-events-none absolute left-1/2 z-10">
        <Tooltip tile={hoveredTile} />
      </div>

      <Suspense fallback={<LoadingFallback />}>
        <div className="h-full w-full">
          <LazyCanvas
            camera={{ position: [0, 6, 10], fov: 45, near: 0.1, far: 50 }}
            shadows
            gl={{
              antialias: true,
              toneMapping: 3,
              toneMappingExposure: 1.2,
              outputColorSpace: "srgb",
            }}
            dpr={[1, 2]}
          >
            <LandscapeLighting reducedMotion={reducedMotion} />
            <CameraRig reducedMotion={reducedMotion} />
            {grid && (
              <Terrain
                tiles={grid.tiles}
                totalWeeks={grid.weeks}
                maxCount={grid.maxCount}
                reducedMotion={reducedMotion}
                currentDate={currentDate}
                onTileHover={setHoveredTile}
              />
            )}
            <ParticlesComponent reducedMotion={reducedMotion} />
          </LazyCanvas>
        </div>
      </Suspense>
    </SceneContainer>
  );
}
