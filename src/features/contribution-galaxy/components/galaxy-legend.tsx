"use client";

import { useGalaxyStore } from "../store";

const LEGEND_COLORS: { label: string; color: [number, number, number] }[] = [
  { label: "TypeScript", color: [0.19, 0.47, 0.78] },
  { label: "JavaScript", color: [0.95, 0.88, 0.35] },
  { label: "Python", color: [0.21, 0.46, 0.65] },
  { label: "Rust", color: [0.87, 0.65, 0.52] },
  { label: "Go", color: [0.0, 0.68, 0.85] },
  { label: "Java", color: [0.69, 0.45, 0.10] },
];

export function GalaxyLegend() {
  const particles = useGalaxyStore((s) => s.particles);

  if (particles.length === 0) return null;

  return (
    <div className="pointer-events-auto absolute bottom-20 left-4 z-30 rounded-xl border border-white/10 bg-black/50 p-3 backdrop-blur-lg">
      <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/30">
        Languages
      </h4>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
        {LEGEND_COLORS.map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor: `rgb(${(l.color[0] * 255).toFixed(0)}, ${(
                  l.color[1] * 255
                ).toFixed(0)}, ${(l.color[2] * 255).toFixed(0)})`,
              }}
            />
            <span className="text-[10px] text-white/50">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
