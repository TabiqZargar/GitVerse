export type GalaxyLayout = "spiral" | "cluster" | "constellation" | "timeline-spiral" | "radial" | "grid";

export interface GalaxyParticle {
  id: string;
  date: string;
  count: number;
  level: number;
  repoName?: string;
  language?: string;
  position: [number, number, number];
  targetPosition: [number, number, number];
  size: number;
  baseSize: number;
  brightness: number;
  color: [number, number, number];
  pulsePhase: number;
  clusterId: string;
}

export interface GalaxyState {
  particles: GalaxyParticle[];
  layout: GalaxyLayout;
  selectedId: string | null;
  hoveredId: string | null;
  focusedCluster: string | null;
  totalParticles: number;
  visibleCount: number;
  filters: GalaxyFilters;
  inspectorOpen: boolean;
  inspectorData: GalaxyParticle | null;
}

export interface GalaxyFilters {
  languages: string[];
  years: number[];
  minIntensity: number;
  showWeekdays: boolean;
  showWeekends: boolean;
  repos: string[];
  search: string;
}

export interface LayoutConfig {
  spread: number;
  arms: number;
  twist: number;
  clusterRadius: number;
}

export type GalaxyMode = "explore" | "focus" | "cinematic";
