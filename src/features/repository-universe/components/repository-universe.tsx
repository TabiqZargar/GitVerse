"use client";

import { useMemo, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { SceneContainer } from "@/components/design-system/scene-container";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { useUniverseStore } from "../store";
import { UniverseFilters } from "./universe-filters";
import { RepositoryInspector } from "./inspector";
import { OrbitConnections } from "./orbit-connections";
import { PlanetLabels } from "./planet-labels";
import type { CelestialBody } from "../types";

const LazyCanvas = dynamic(
  () => import("@react-three/fiber").then((mod) => ({ default: mod.Canvas })),
  { ssr: false }
);

const UniverseLighting = dynamic(
  () => import("./universe-lighting").then((mod) => ({ default: mod.UniverseLighting })),
  { ssr: false }
);

const UniverseCamera = dynamic(
  () => import("./universe-camera").then((mod) => ({ default: mod.UniverseCamera })),
  { ssr: false }
);

const Planet = dynamic(
  () => import("./planet").then((mod) => ({ default: mod.Planet })),
  { ssr: false }
);

interface RepositoryUniverseProps {
  bodies: CelestialBody[];
  isLoading?: boolean;
  className?: string;
}

function LoadingFallback() {
  return (
    <div className="flex h-full min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
        <p className="text-xs text-muted-foreground">Loading universe...</p>
      </div>
    </div>
  );
}

function SceneInner({ bodies, reducedMotion }: { bodies: CelestialBody[]; reducedMotion: boolean }) {
  const selectedId = useUniverseStore((s) => s.selectedId);
  const hoveredId = useUniverseStore((s) => s.hoveredId);
  const focusedId = useUniverseStore((s) => s.focusedId);
  const searchQuery = useUniverseStore((s) => s.searchQuery);
  const filters = useUniverseStore((s) => s.filters);
  const hoverBody = useUniverseStore((s) => s.hoverBody);
  const selectBody = useUniverseStore((s) => s.selectBody);
  const focusBody = useUniverseStore((s) => s.focusBody);

  const filteredBodies = useMemo(() => {
    return bodies.filter((body) => {
      if (filters.language && body.repo.primaryLanguage !== filters.language) return false;
      if (filters.visibility === "public" && body.repo.visibility !== "PUBLIC") return false;
      if (filters.visibility === "private" && body.repo.visibility !== "PRIVATE") return false;
      if (body.repo.stars < filters.minStars) return false;
      if (!filters.showArchived && body.repo.isArchived) return false;
      if (filters.search && !body.repo.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [bodies, filters]);

  const dimmedIds = useMemo(() => {
    if (!searchQuery) return new Set<string>();
    const q = searchQuery.toLowerCase();
    const set = new Set<string>();
    for (const b of bodies) {
      if (!b.repo.name.toLowerCase().includes(q)) set.add(b.id);
    }
    return set;
  }, [bodies, searchQuery]);

  const handleHover = useCallback((id: string | null) => hoverBody(id), [hoverBody]);
  const handleClick = useCallback((id: string) => selectBody(id), [selectBody]);
  const handleDoubleClick = useCallback((id: string) => focusBody(id), [focusBody]);

  return (
    <>
      <UniverseLighting reducedMotion={reducedMotion} />
      <UniverseCamera reducedMotion={reducedMotion} />
      <OrbitConnections bodies={bodies} />
      <PlanetLabels />

      {filteredBodies.map((body) => (
        <Planet
          key={body.id}
          body={body}
          isSelected={selectedId === body.id}
          isHovered={hoveredId === body.id}
          isDimmed={dimmedIds.has(body.id) && !(selectedId === body.id || hoveredId === body.id || focusedId === body.id)}
          reducedMotion={reducedMotion}
          onHover={handleHover}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
        />
      ))}
    </>
  );
}

export function RepositoryUniverse({ bodies, isLoading, className }: RepositoryUniverseProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  return (
    <SceneContainer
      className={className}
      isLoading={isLoading}
      loadingOverlay={<LoadingFallback />}
      label="Repository Universe"
    >
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="pointer-events-auto absolute left-4 top-4">
          <UniverseFilters />
        </div>
        <RepositoryInspector />
        <div className="absolute bottom-4 left-4">
          <button
            onClick={() => setReducedMotion((p) => !p)}
            className="pointer-events-auto rounded-lg border border-white/10 bg-black/40 px-2.5 py-1.5 text-[11px] font-medium text-white/50 backdrop-blur-xl transition-colors hover:border-white/20 hover:text-white/80"
            aria-label={reducedMotion ? "Enable animations" : "Reduce motion"}
          >
            {reducedMotion ? "Animate" : "Static"}
          </button>
        </div>
      </div>

      <div className="h-full w-full">
        <ErrorBoundary>
          <LazyCanvas
            camera={{ position: [0, 8, 16], fov: 50, near: 0.1, far: 100 }}
            gl={{
              antialias: true,
              toneMapping: 3,
              toneMappingExposure: 1.0,
              outputColorSpace: "srgb",
            }}
            dpr={[1, 2]}
          >
            <SceneInner bodies={bodies} reducedMotion={reducedMotion} />
          </LazyCanvas>
        </ErrorBoundary>
      </div>
    </SceneContainer>
  );
}
