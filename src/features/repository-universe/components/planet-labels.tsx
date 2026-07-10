"use client";

import { Html } from "@react-three/drei";
import { useUniverseStore } from "../store";
import { formatNumber } from "@/lib/utils";

export function PlanetLabels() {
  const selectedId = useUniverseStore((s) => s.selectedId);
  const hoveredId = useUniverseStore((s) => s.hoveredId);
  const focusedId = useUniverseStore((s) => s.focusedId);
  const bodies = useUniverseStore((s) => s.bodies);
  const searchQuery = useUniverseStore((s) => s.searchQuery);

  return (
    <>
      {bodies.map((body) => {
        const isVisible = selectedId === body.id || hoveredId === body.id || focusedId === body.id;
        const isDimmed = searchQuery.length > 0 && !body.repo.name.toLowerCase().includes(searchQuery.toLowerCase());

        return (
          <group key={body.id} position={body.position}>
            {(isVisible) && (
              <Html
                center
                distanceFactor={8}
                style={{
                  pointerEvents: "none",
                  opacity: isDimmed ? 0.2 : 1,
                  transition: "opacity 0.3s",
                }}
              >
                <div className="flex flex-col items-center gap-0.5">
                  <span className="max-w-[120px] truncate text-center text-[10px] font-medium text-white/90 drop-shadow-lg">
                    {body.repo.name}
                  </span>
                  <span className="text-[9px] text-white/50">
                    {formatNumber(body.repo.stars)} ★
                  </span>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </>
  );
}
