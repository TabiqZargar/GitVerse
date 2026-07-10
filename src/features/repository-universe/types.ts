import type { Repository, LanguageUsage } from "@/features/github/types/domain";

export interface CelestialBody {
  id: string;
  repo: Repository;
  position: [number, number, number];
  size: number;
  color: string;
  glowIntensity: number;
  rotationSpeed: number;
  orbitRadius: number;
  orbitAngle: number;
  connections: string[];
  connectionStrength: number;
}

export interface UniverseState {
  bodies: CelestialBody[];
  selectedId: string | null;
  hoveredId: string | null;
  focusedId: string | null;
  searchQuery: string;
  filters: UniverseFilters;
  inspectorOpen: boolean;
  cameraTarget: [number, number, number] | null;
  isIdle: boolean;
}

export interface UniverseFilters {
  language: string | null;
  visibility: "all" | "public" | "private";
  minStars: number;
  maxStars: number;
  showArchived: boolean;
  search: string;
}

export interface PlanetProps {
  body: CelestialBody;
  isSelected: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  isFocused: boolean;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
  onDoubleClick: (id: string) => void;
  reducedMotion: boolean;
}

export interface ConnectionData {
  source: string;
  target: string;
  strength: number;
  sourcePos: [number, number, number];
  targetPos: [number, number, number];
}

export interface LanguageColorMap {
  [language: string]: string;
}

export interface RepositoryInspectorData {
  repo: Repository;
  languages: LanguageUsage[];
  totalCommits: number;
  recentActivity: number;
  activityScore: number;
}

export const GITHUB_LANGUAGE_COLORS: LanguageColorMap = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Ruby: "#701516",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  PHP: "#4F5D95",
  Scala: "#c22d40",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Lua: "#000080",
  Zig: "#ec915c",
  Haskell: "#5e5086",
  Elixir: "#6e4a7e",
  Clojure: "#db5855",
  Nix: "#7e7eff",
  Solidity: "#AA6746",
  R: "#198CE7",
  Dockerfile: "#384d54",
  YAML: "#cb171e",
  Markdown: "#083fa1",
  Terraform: "#844fba",
  GraphQL: "#e10098",
};
