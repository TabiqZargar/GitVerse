import { create } from "zustand";
import type { ExportOptions, ExportJob, ExportStudioState, AspectRatio, ExportResolution, ExportTheme, ExportVisualization, ExportFormat } from "./types";
import { DEFAULT_EXPORT_OPTIONS } from "./types";

interface ExportStoreActions {
  open: () => void;
  close: () => void;
  setOptions: (partial: Partial<ExportOptions>) => void;
  setVisualization: (v: ExportVisualization) => void;
  setTheme: (t: ExportTheme) => void;
  setAspectRatio: (r: AspectRatio) => void;
  setResolution: (r: ExportResolution) => void;
  setFormat: (f: ExportFormat) => void;
  addJob: (job: ExportJob) => void;
  updateJob: (id: string, partial: Partial<ExportJob>) => void;
  setActiveJob: (id: string | null) => void;
  setPreviewUrl: (url: string | null) => void;
  reset: () => void;
}

const initialStudioState: ExportStudioState = {
  isOpen: false,
  options: { ...DEFAULT_EXPORT_OPTIONS },
  jobs: [],
  activeJobId: null,
  previewUrl: null,
};

export const useExportStore = create<ExportStoreActions & ExportStudioState>((set) => ({
  ...initialStudioState,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setOptions: (partial) => set((s) => ({ options: { ...s.options, ...partial } })),
  setVisualization: (v) => set((s) => ({ options: { ...s.options, visualization: v } })),
  setTheme: (t) => set((s) => ({ options: { ...s.options, theme: t } })),
  setAspectRatio: (r) => set((s) => ({ options: { ...s.options, aspectRatio: r } })),
  setResolution: (r) => set((s) => ({ options: { ...s.options, resolution: r } })),
  setFormat: (f) => set((s) => ({ options: { ...s.options, format: f } })),
  addJob: (job) => set((s) => ({ jobs: [job, ...s.jobs] })),
  updateJob: (id, partial) =>
    set((s) => ({
      jobs: s.jobs.map((j) => (j.id === id ? { ...j, ...partial } : j)),
    })),
  setActiveJob: (id) => set({ activeJobId: id }),
  setPreviewUrl: (url) => set({ previewUrl: url }),
  reset: () => set(initialStudioState),
}));
