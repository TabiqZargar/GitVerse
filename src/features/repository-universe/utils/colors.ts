const LANGUAGE_COLORS: Record<string, string> = {
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
  Racket: "#3c5caa",
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

const FALLBACK_COLORS = [
  "#6b3fa0", "#22d3ee", "#34d399", "#fbbf24", "#fb923c",
  "#a78bfa", "#f472b6", "#2dd4bf", "#f87171", "#38bdf8",
];

export function getLanguageColor(language: string | null): string {
  if (!language) return FALLBACK_COLORS[0] ?? "#6b3fa0";
  return LANGUAGE_COLORS[language] ?? FALLBACK_COLORS[language.length % FALLBACK_COLORS.length] ?? "#6b3fa0";
}

export function getGlowIntensity(stars: number, forks: number): number {
  const score = Math.log2(Math.max(stars + forks, 1) + 1) / 10;
  return Math.min(Math.max(score, 0.15), 1);
}

export function getPlanetSize(size: number): number {
  const normalized = Math.log2(Math.max(size, 1) + 1) / 14;
  return 0.3 + normalized * 1.2;
}

export function getRotationSpeed(commits: number): number {
  const base = 0.2;
  const speed = Math.log2(Math.max(commits, 1) + 1) * 0.08;
  return base + Math.min(speed, 1.5);
}

export function getOrbitRadius(importance: number, index: number, total: number): number {
  const normalized = Math.log2(Math.max(importance, 1) + 1) / 12;
  const baseRadius = 2.5 + normalized * 8;
  const spread = index / Math.max(total - 1, 1) * 3 - 1.5;
  return baseRadius + spread * 0.6;
}

export function getOrbitAngle(index: number): number {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  return goldenAngle * index;
}
