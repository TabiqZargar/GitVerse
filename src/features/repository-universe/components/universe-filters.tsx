"use client";

import { useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useUniverseStore } from "../store";
import { SearchController } from "./search-controller";

export function UniverseFilters() {
  const bodies = useUniverseStore((s) => s.bodies);
  const filters = useUniverseStore((s) => s.filters);
  const setFilters = useUniverseStore((s) => s.setFilters);

  const languages = useMemo(() => {
    const langs = new Set<string>();
    for (const b of bodies) {
      if (b.repo.primaryLanguage) langs.add(b.repo.primaryLanguage);
    }
    return Array.from(langs).sort();
  }, [bodies]);

  const hasActiveFilters = filters.language || filters.visibility !== "all" || filters.minStars > 0 || !filters.showArchived;

  const handleReset = useCallback(() => {
    setFilters({
      language: null,
      visibility: "all",
      minStars: 0,
      maxStars: Infinity,
      showArchived: true,
      search: "",
    });
  }, [setFilters]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pointer-events-auto flex items-center gap-2"
    >
      <SearchController />

      <div className="flex items-center gap-1.5">
        <select
          value={filters.language ?? ""}
          onChange={(e) => setFilters({ language: e.target.value || null })}
          className="appearance-none rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] text-white/60 backdrop-blur-xl outline-none transition-colors hover:border-white/20"
          aria-label="Filter by language"
        >
          <option value="">All languages</option>
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>

        <select
          value={filters.visibility}
          onChange={(e) => setFilters({ visibility: e.target.value as "all" | "public" | "private" })}
          className="appearance-none rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] text-white/60 backdrop-blur-xl outline-none transition-colors hover:border-white/20"
          aria-label="Filter by visibility"
        >
          <option value="all">All visibility</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>

        <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] text-white/60 backdrop-blur-xl transition-colors hover:border-white/20">
          <input
            type="checkbox"
            checked={filters.showArchived}
            onChange={(e) => setFilters({ showArchived: e.target.checked })}
            className="h-3 w-3 rounded border-white/20 bg-white/5 accent-purple-500"
          />
          Archived
        </label>

        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1.5 text-[11px] text-white/40 backdrop-blur-xl transition-colors hover:border-white/20 hover:text-white/60"
            aria-label="Reset filters"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
