"use client";

import { useMemo } from "react";
import { useGalaxyStore } from "../store";

export function GalaxyFilters() {
  const filters = useGalaxyStore((s) => s.filters);
  const setFilters = useGalaxyStore((s) => s.setFilters);

  const yearOptions = useMemo(() => {
    const current = new Date().getFullYear();
    const years: number[] = [];
    for (let y = current; y >= 2015; y--) {
      years.push(y);
    }
    return years;
  }, []);

  const handleYearToggle = (year: number) => {
    const current = filters.years;
    if (current.includes(year)) {
      setFilters({ years: current.filter((y) => y !== year) });
    } else {
      setFilters({ years: [...current, year] });
    }
  };

  return (
    <div className="pointer-events-auto absolute left-4 top-24 z-30 max-w-[220px] space-y-3 rounded-xl border border-white/10 bg-black/60 p-4 backdrop-blur-xl">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
        Filters
      </h3>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs text-white/60">
          <input
            type="checkbox"
            checked={filters.showWeekdays}
            onChange={(e) => setFilters({ showWeekdays: e.target.checked })}
            className="accent-purple-500"
          />
          Weekdays
        </label>
        <label className="flex items-center gap-2 text-xs text-white/60">
          <input
            type="checkbox"
            checked={filters.showWeekends}
            onChange={(e) => setFilters({ showWeekends: e.target.checked })}
            className="accent-purple-500"
          />
          Weekends
        </label>
      </div>

      <div>
        <label className="mb-1 block text-xs text-white/40">Min intensity</label>
        <input
          type="range"
          min={0}
          max={10}
          value={filters.minIntensity}
          onChange={(e) => setFilters({ minIntensity: Number(e.target.value) })}
          className="w-full accent-purple-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-white/40">Year</label>
        <div className="flex max-h-[120px] flex-wrap gap-1 overflow-y-auto">
          {yearOptions.map((y) => {
            const active = filters.years.length === 0 || filters.years.includes(y);
            return (
              <button
                key={y}
                onClick={() => handleYearToggle(y)}
                data-active={active}
                className="rounded px-1.5 py-0.5 text-[10px] transition-colors data-[active=true]:bg-purple-500/30 data-[active=true]:text-purple-200 data-[active=false]:text-white/30 data-[active=false]:hover:text-white/50"
              >
                {y}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
