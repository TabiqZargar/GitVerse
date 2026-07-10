import { create } from "zustand";
import type { GalaxyParticle, GalaxyLayout, GalaxyFilters } from "./types";

interface GalaxyStore {
  particles: GalaxyParticle[];
  layout: GalaxyLayout;
  selectedId: string | null;
  hoveredId: string | null;
  focusedCluster: string | null;
  filters: GalaxyFilters;
  inspectorOpen: boolean;
  inspectorData: GalaxyParticle | null;
  transitionProgress: number;
  targetLayout: GalaxyLayout | null;

  setParticles: (particles: GalaxyParticle[]) => void;
  setLayout: (layout: GalaxyLayout) => void;
  selectParticle: (id: string | null) => void;
  hoverParticle: (id: string | null) => void;
  focusCluster: (clusterId: string | null) => void;
  setFilters: (filters: Partial<GalaxyFilters>) => void;
  openInspector: (particle: GalaxyParticle) => void;
  closeInspector: () => void;
  setTransitionProgress: (v: number) => void;
}

const defaultFilters: GalaxyFilters = {
  languages: [],
  years: [],
  minIntensity: 0,
  showWeekdays: true,
  showWeekends: true,
  repos: [],
  search: "",
};

export const useGalaxyStore = create<GalaxyStore>((set) => ({
  particles: [],
  layout: "spiral",
  selectedId: null,
  hoveredId: null,
  focusedCluster: null,
  filters: { ...defaultFilters },
  inspectorOpen: false,
  inspectorData: null,
  transitionProgress: 1,
  targetLayout: null,

  setParticles: (particles) => set({ particles }),

  setLayout: (layout) =>
    set(() => ({
      targetLayout: layout,
      transitionProgress: 0,
      layout,
    })),

  selectParticle: (id) =>
    set((s) => ({
      selectedId: id,
      inspectorOpen: id !== null,
      inspectorData: id !== null ? s.particles.find((p) => p.id === id) ?? null : null,
    })),

  hoverParticle: (id) => set({ hoveredId: id }),

  focusCluster: (clusterId) => set({ focusedCluster: clusterId }),

  setFilters: (partial) =>
    set((s) => ({ filters: { ...s.filters, ...partial } })),

  openInspector: (particle) =>
    set({ inspectorOpen: true, inspectorData: particle, selectedId: particle.id }),

  closeInspector: () =>
    set({ inspectorOpen: false, inspectorData: null, selectedId: null }),

  setTransitionProgress: (v) => set({ transitionProgress: v }),
}));
