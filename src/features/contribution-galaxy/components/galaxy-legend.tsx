"use client";

import { useMemo } from "react";
import { useGalaxyStore } from "../store";
import type { GalaxyParticle } from "../types";

const LANGUAGE_COLORS: Record<string, [number, number, number]> = {
  TypeScript: [0.19, 0.47, 0.78],
  JavaScript: [0.95, 0.88, 0.35],
  Python: [0.21, 0.46, 0.65],
  Rust: [0.87, 0.65, 0.52],
  Go: [0.0, 0.68, 0.85],
  Java: [0.69, 0.45, 0.1],
  C: [0.4, 0.5, 0.6],
  "C++": [0.24, 0.44, 0.64],
  "C#": [0.1, 0.52, 0.22],
  Ruby: [0.6, 0.12, 0.12],
  Swift: [0.87, 0.35, 0.27],
  Kotlin: [0.48, 0.34, 0.57],
  Dart: [0.0, 0.53, 0.75],
  PHP: [0.47, 0.34, 0.7],
  HTML: [0.87, 0.36, 0.14],
  CSS: [0.21, 0.41, 0.69],
  Shell: [0.53, 0.79, 0.28],
};

function getLanguageColor(language: string): [number, number, number] {
  return LANGUAGE_COLORS[language] ?? [0.5, 0.5, 0.5];
}

export function GalaxyLegend() {
  const particles = useGalaxyStore((s) => s.particles);

  const languages = useMemo(() => {
    const langSet = new Map<string, number>();
    for (const p of particles) {
      const lang = p.language ?? "Unknown";
      langSet.set(lang, (langSet.get(lang) ?? 0) + 1);
    }
    return Array.from(langSet.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [particles]);

  if (particles.length === 0 || languages.length === 0) return null;

  return (
    <div className="pointer-events-auto absolute bottom-20 left-4 z-30 rounded-xl border border-white/10 bg-black/50 p-3 backdrop-blur-lg">
      <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/30">
        Languages
      </h4>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
        {languages.map(([label, count]) => {
          const color = getLanguageColor(label);
          return (
            <div key={label} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: `rgb(${(color[0] * 255).toFixed(0)}, ${(
                    color[1] * 255
                  ).toFixed(0)}, ${(color[2] * 255).toFixed(0)})`,
                }}
              />
              <span className="text-[10px] text-white/50">{label}</span>
              <span className="text-[8px] text-white/20">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
