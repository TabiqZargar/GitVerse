"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useExportStore } from "../store";
import { AspectRatioPicker, ResolutionPicker, FormatPicker } from "./export-options";
import { ExportProgress } from "./export-progress";
import { VISUALIZATION_LABELS, THEME_LABELS } from "../types";
import type { ExportVisualization, ExportTheme } from "../types";

const VISUALIZATIONS: ExportVisualization[] = [
  "landscape", "repository-universe", "contribution-galaxy",
  "wrapped", "achievements", "timeline",
];

const THEMES: ExportTheme[] = ["dark", "aurora", "midnight", "neon", "minimal"];

export function ExportStudio() {
  const isOpen = useExportStore((s) => s.isOpen);
  const close = useExportStore((s) => s.close);
  const options = useExportStore((s) => s.options);
  const setVisualization = useExportStore((s) => s.setVisualization);
  const setTheme = useExportStore((s) => s.setTheme);
  const previewUrl = useExportStore((s) => s.previewUrl);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            onClick={close}
          />

          <motion.div
            className="relative ml-auto flex h-full w-full max-w-lg flex-col gap-6 overflow-y-auto border-l border-glass-border bg-background p-6 shadow-glass-lg"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">Export Studio</h2>
              <button
                onClick={close}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
                aria-label="Close export studio"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Visualization
              </label>
              <div className="grid grid-cols-2 gap-2">
                {VISUALIZATIONS.map((v) => (
                  <button
                    key={v}
                    onClick={() => setVisualization(v)}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                      options.visualization === v
                        ? "border-chart-1 bg-chart-1/10 text-chart-1"
                        : "border-glass-border text-muted-foreground hover:border-glass-border/60"
                    }`}
                  >
                    {VISUALIZATION_LABELS[v]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Theme
              </label>
              <div className="flex flex-wrap gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                      options.theme === t
                        ? "border-chart-1 bg-chart-1/10 text-chart-1"
                        : "border-glass-border text-muted-foreground hover:border-glass-border/60"
                    }`}
                  >
                    {THEME_LABELS[t]}
                  </button>
                ))}
              </div>
            </div>

            <AspectRatioPicker />
            <ResolutionPicker />
            <FormatPicker />

            <div className="flex items-center gap-3 rounded-xl border border-glass-border bg-glass p-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="show-watermark"
                  checked={options.showWatermark}
                  onChange={(e) => useExportStore.getState().setOptions({ showWatermark: e.target.checked })}
                  className="h-4 w-4 rounded border-glass-border"
                />
                <label htmlFor="show-watermark" className="text-xs text-muted-foreground">
                  Watermark
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="show-stats"
                  checked={options.showStats}
                  onChange={(e) => useExportStore.getState().setOptions({ showStats: e.target.checked })}
                  className="h-4 w-4 rounded border-glass-border"
                />
                <label htmlFor="show-stats" className="text-xs text-muted-foreground">
                  Stats overlay
                </label>
              </div>
            </div>

            <ExportProgress />

            {previewUrl && (
              <div className="rounded-xl border border-glass-border overflow-hidden">
                <Image src={previewUrl} alt="Export preview" width={400} height={400} className="w-full" />
              </div>
            )}

            <div className="mt-auto flex gap-3">
              <button
                onClick={close}
                className="flex-1 rounded-xl border border-glass-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                className="flex-1 rounded-xl bg-chart-1 px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition-all hover:brightness-110"
              >
                Export
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
