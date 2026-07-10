"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useGalaxyStore } from "../store";

export function InspectorOverlay() {
  const inspectorOpen = useGalaxyStore((s) => s.inspectorOpen);
  const inspectorData = useGalaxyStore((s) => s.inspectorData);
  const closeInspector = useGalaxyStore((s) => s.closeInspector);

  return (
    <AnimatePresence>
      {inspectorOpen && inspectorData && (
        <motion.div
          initial={{ opacity: 0, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="pointer-events-auto absolute right-4 top-24 z-30 w-64 overflow-hidden rounded-xl border border-white/10 bg-black/70 backdrop-blur-2xl"
        >
          <div className="border-b border-white/10 px-4 py-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white/90">
                Contribution
              </h3>
              <button
                onClick={closeInspector}
                className="text-xs text-white/40 transition-colors hover:text-white/80"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="space-y-3 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">Date</span>
              <span className="text-sm text-white/80">
                {inspectorData.date}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">Count</span>
              <span className="text-sm font-mono text-purple-300">
                {inspectorData.count}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">Level</span>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-2 w-2 rounded-sm ${
                      i < inspectorData.level
                        ? "bg-purple-500"
                        : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">Brightness</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-purple-500 transition-all"
                  style={{
                    width: `${(inspectorData.brightness * 100).toFixed(0)}%`,
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/40">
              <span>Cluster ID</span>
              <span className="font-mono text-white/50">
                {inspectorData.clusterId}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
