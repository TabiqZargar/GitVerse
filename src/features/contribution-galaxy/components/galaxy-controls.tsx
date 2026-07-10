"use client";

import { useGalaxyStore } from "../store";
import type { GalaxyLayout } from "../types";

const LAYOUTS: { key: GalaxyLayout; label: string; icon: string }[] = [
  { key: "spiral", label: "Spiral", icon: "○" },
  { key: "cluster", label: "Cluster", icon: "⊞" },
  { key: "constellation", label: "Constellation", icon: "✦" },
  { key: "timeline-spiral", label: "Timeline", icon: "↻" },
  { key: "radial", label: "Radial", icon: "◎" },
  { key: "grid", label: "Grid", icon: "⊟" },
];

export function GalaxyControls() {
  const layout = useGalaxyStore((s) => s.layout);
  const setLayout = useGalaxyStore((s) => s.setLayout);
  const particles = useGalaxyStore((s) => s.particles);

  return (
    <div className="pointer-events-auto absolute bottom-6 left-1/2 z-30 -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/60 px-4 py-2 backdrop-blur-xl">
        <span className="mr-2 text-xs font-medium text-white/50">
          Layout
        </span>
        {LAYOUTS.map((l) => (
          <button
            key={l.key}
            onClick={() => setLayout(l.key)}
            data-active={l.key === layout}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 data-[active=true]:bg-purple-500/20 data-[active=true]:text-purple-300 data-[active=false]:text-white/50 data-[active=false]:hover:bg-white/5 data-[active=false]:hover:text-white/80"
            title={l.label}
          >
            <span className="text-sm">{l.icon}</span>
            <span className="hidden sm:inline">{l.label}</span>
          </button>
        ))}
        <div className="ml-3 border-l border-white/10 pl-3 text-xs text-white/30">
          {particles.length.toLocaleString()} particles
        </div>
      </div>
    </div>
  );
}
