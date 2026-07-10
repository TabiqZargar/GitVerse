import type { ExportTheme, AspectRatio } from "../types";
import { THEME_DEFINITIONS } from "../types";

export interface WallpaperConfig {
  theme: ExportTheme;
  aspectRatio: AspectRatio;
  resolution: { width: number; height: number };
  visualization: "landscape" | "galaxy" | "universe";
  pattern?: "grid" | "dots" | "waves" | "none";
  showStats?: boolean;
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

export function generateWallpaperSvg(config: WallpaperConfig): string {
  const theme = THEME_DEFINITIONS[config.theme];
  const { width, height } = config.resolution;
  const rng = seededRandom(width * height);

  let patternElements = "";
  const pattern = config.pattern ?? "grid";

  if (pattern === "grid") {
    const gridSize = Math.max(Math.round(width / 40), 10);
    const lines: string[] = [];
    for (let x = 0; x <= width; x += gridSize) {
      lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="${theme.border}" stroke-width="0.5" opacity="0.3"/>`);
    }
    for (let y = 0; y <= height; y += gridSize) {
      lines.push(`<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="${theme.border}" stroke-width="0.5" opacity="0.3"/>`);
    }
    patternElements = lines.join("\n    ");
  } else if (pattern === "dots") {
    const spacing = Math.max(Math.round(width / 50), 12);
    const dots: string[] = [];
    for (let x = spacing; x < width; x += spacing) {
      for (let y = spacing; y < height; y += spacing) {
        const size = rng() * 2 + 1;
        dots.push(`<circle cx="${x}" cy="${y}" r="${size}" fill="${theme.accent}" opacity="${0.1 + rng() * 0.2}"/>`);
      }
    }
    patternElements = dots.join("\n    ");
  } else if (pattern === "waves") {
    const waves: string[] = [];
    for (let i = 0; i < 3; i++) {
      const amp = 20 + rng() * 40;
      const freq = 0.005 + rng() * 0.01;
      const phase = rng() * Math.PI * 2;
      const yOffset = height * (0.2 + rng() * 0.6);
      const points: string[] = [];
      for (let x = 0; x <= width; x += 2) {
        const y = yOffset + Math.sin(x * freq + phase) * amp;
        points.push(`${x},${y}`);
      }
      waves.push(`<polyline points="${points.join(" ")}" fill="none" stroke="${theme.accent}" stroke-width="1" opacity="${0.1 + i * 0.05}"/>`);
    }
    patternElements = waves.join("\n    ");
  }

  let statsOverlay = "";
  if (config.showStats) {
    statsOverlay = `
    <text x="${width / 2}" y="${height - 60}" text-anchor="middle" fill="${theme.mutedText}" font-family="system-ui" font-size="14" opacity="0.6">gitverse.dev</text>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.background}"/>
      <stop offset="50%" stop-color="${theme.surface}"/>
      <stop offset="100%" stop-color="${theme.background}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${theme.glow}" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="${theme.glow}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect width="${width}" height="${height}" fill="url(#glow)"/>
  ${patternElements}
  ${statsOverlay}
</svg>`;
}
