"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, GitFork, Code2 } from "lucide-react";
import { useUniverseStore } from "../store";
import { formatNumber, formatDate } from "@/lib/utils";
import { getLanguageColor } from "../utils/colors";

export function RepositoryInspector() {
  const inspectorOpen = useUniverseStore((s) => s.inspectorOpen);
  const inspectorId = useUniverseStore((s) => s.inspectorId);
  const bodies = useUniverseStore((s) => s.bodies);
  const closeInspector = useUniverseStore((s) => s.closeInspector);

  const body = useMemo(
    () => bodies.find((b) => b.id === inspectorId),
    [bodies, inspectorId]
  );

  const langColor = body ? getLanguageColor(body.repo.primaryLanguage) : "#6b3fa0";

  return (
    <AnimatePresence>
      {inspectorOpen && body && (
        <motion.div
          initial={{ opacity: 0, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="pointer-events-auto absolute right-4 top-4 z-50 w-80"
        >
          <div className="overflow-hidden rounded-xl border border-white/10 bg-black/60 backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: langColor }}
                />
                <h3 className="truncate text-sm font-semibold text-white">
                  {body.repo.name}
                </h3>
              </div>
              <button
                onClick={closeInspector}
                className="ml-2 shrink-0 rounded-lg p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white/80"
                aria-label="Close inspector"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 px-4 py-3">
              {body.repo.description && (
                <p className="text-xs leading-relaxed text-white/60 line-clamp-3">
                  {body.repo.description}
                </p>
              )}

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-white/5 px-2.5 py-2">
                  <div className="flex items-center gap-1 text-[10px] text-white/40">
                    <Star className="h-3 w-3" />
                    Stars
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {formatNumber(body.repo.stars)}
                  </span>
                </div>
                <div className="rounded-lg bg-white/5 px-2.5 py-2">
                  <div className="flex items-center gap-1 text-[10px] text-white/40">
                    <GitFork className="h-3 w-3" />
                    Forks
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {formatNumber(body.repo.forks)}
                  </span>
                </div>
                <div className="rounded-lg bg-white/5 px-2.5 py-2">
                  <div className="flex items-center gap-1 text-[10px] text-white/40">
                    <Code2 className="h-3 w-3" />
                    Size
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {formatNumber(body.repo.size)} KB
                  </span>
                </div>
              </div>

              {body.repo.languages.length > 0 && (
                <div>
                  <h4 className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-white/40">
                    Languages
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {body.repo.languages.slice(0, 4).map((lang) => (
                      <span
                        key={lang.name}
                        className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-white/70"
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: getLanguageColor(lang.name) }}
                        />
                        {lang.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 text-[10px] text-white/40">
                <span>{body.repo.visibility === "PUBLIC" ? "Public" : "Private"}</span>
                {body.repo.isArchived && (
                  <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-amber-400">
                    Archived
                  </span>
                )}
                <span>Updated {formatDate(body.repo.updatedAt)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
