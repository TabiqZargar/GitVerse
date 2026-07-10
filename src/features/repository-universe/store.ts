import { create } from "zustand";
import type { CelestialBody, UniverseFilters } from "./types";

interface UniverseStore {
  bodies: CelestialBody[];
  selectedId: string | null;
  hoveredId: string | null;
  focusedId: string | null;
  searchQuery: string;
  filters: UniverseFilters;
  inspectorOpen: boolean;
  inspectorId: string | null;
  cameraTarget: [number, number, number] | null;

  setBodies: (bodies: CelestialBody[]) => void;
  selectBody: (id: string | null) => void;
  hoverBody: (id: string | null) => void;
  focusBody: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<UniverseFilters>) => void;
  openInspector: (id: string) => void;
  closeInspector: () => void;
  setCameraTarget: (target: [number, number, number] | null) => void;
}

const defaultFilters: UniverseFilters = {
  language: null,
  visibility: "all",
  minStars: 0,
  maxStars: Infinity,
  showArchived: true,
  search: "",
};

export const useUniverseStore = create<UniverseStore>((set) => ({
  bodies: [],
  selectedId: null,
  hoveredId: null,
  focusedId: null,
  searchQuery: "",
  filters: { ...defaultFilters },
  inspectorOpen: false,
  inspectorId: null,
  cameraTarget: null,

  setBodies: (bodies) => set({ bodies }),

  selectBody: (id) =>
    set((s) => ({
      selectedId: id,
      inspectorOpen: id !== null,
      inspectorId: id,
      cameraTarget: id !== null
        ? s.bodies.find((b) => b.id === id)?.position ?? null
        : null,
    })),

  hoverBody: (id) => set({ hoveredId: id }),

  focusBody: (id) => set({ focusedId: id }),

  setSearchQuery: (query) => set({ searchQuery: query, filters: { ...defaultFilters, search: query } }),

  setFilters: (partial) =>
    set((s) => ({ filters: { ...s.filters, ...partial } })),

  openInspector: (id) =>
    set((s) => ({
      inspectorOpen: true,
      inspectorId: id,
      selectedId: id,
      cameraTarget: s.bodies.find((b) => b.id === id)?.position ?? null,
    })),

  closeInspector: () =>
    set({ inspectorOpen: false, inspectorId: null, selectedId: null, cameraTarget: null }),

  setCameraTarget: (target) => set({ cameraTarget: target }),
}));
