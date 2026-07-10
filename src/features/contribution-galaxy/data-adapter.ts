import type { GitHubDay } from "@/features/github/types";
import type { GalaxyParticle, GalaxyLayout } from "./types";

const LANGUAGE_COLORS: Record<string, [number, number, number]> = {
  TypeScript: [0.19, 0.47, 0.78],
  JavaScript: [0.95, 0.88, 0.35],
  Python: [0.21, 0.46, 0.65],
  Rust: [0.87, 0.65, 0.52],
  Go: [0.0, 0.68, 0.85],
  Java: [0.69, 0.45, 0.10],
  "C++": [0.95, 0.30, 0.49],
  C: [0.33, 0.33, 0.33],
  "C#": [0.09, 0.53, 0.0],
  Ruby: [0.44, 0.08, 0.09],
  Swift: [0.94, 0.32, 0.22],
  Kotlin: [0.66, 0.48, 1.0],
  Dart: [0.0, 0.71, 0.67],
  PHP: [0.31, 0.37, 0.58],
  HTML: [0.89, 0.30, 0.15],
  CSS: [0.34, 0.24, 0.49],
  Shell: [0.54, 0.88, 0.32],
};

const FALLBACK_COLORS: [number, number, number][] = [
  [0.42, 0.25, 0.63],
  [0.13, 0.83, 0.93],
  [0.20, 0.83, 0.60],
  [0.98, 0.75, 0.14],
  [0.98, 0.57, 0.24],
  [0.65, 0.48, 0.98],
  [0.96, 0.45, 0.71],
];

function getLanguageColor(language: string | undefined): [number, number, number] {
  if (!language) return FALLBACK_COLORS[0] ?? [0.42, 0.25, 0.63];
  return LANGUAGE_COLORS[language] ?? FALLBACK_COLORS[language.length % FALLBACK_COLORS.length] ?? [0.42, 0.25, 0.63];
}

function getBrightness(count: number): number {
  return Math.min(Math.log2(count + 1) / 5, 1);
}

function getSize(level: number): number {
  const sizes = [0.02, 0.04, 0.08, 0.14, 0.22];
  return sizes[level] ?? sizes[0] ?? 0.02;
}

export function adaptDaysToParticles(days: GitHubDay[]): GalaxyParticle[] {
  const particles: GalaxyParticle[] = [];

  for (const day of days) {
    const count = day.count;
    const level = day.level;
    if (count === 0) continue;

    const brightness = getBrightness(count);
    const baseSize = getSize(level);
    const color = getLanguageColor(undefined);

    for (let i = 0; i < Math.min(count, 5); i++) {
      const id = `${day.date}-${i}`;
      particles.push({
        id,
        date: day.date,
        count,
        level,
        position: [0, 0, 0],
        targetPosition: [0, 0, 0],
        size: baseSize * (0.6 + Math.random() * 0.4),
        baseSize,
        brightness,
        color,
        pulsePhase: Math.random() * Math.PI * 2,
        clusterId: day.date,
      });
    }
  }

  return particles;
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function getDateInfo(date: string): { year: number; dayOfYear: number; totalDays: number } {
  const d = new Date(date);
  const year = d.getFullYear();
  const start = new Date(year, 0, 0);
  const diff = d.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const totalDays = isLeap ? 366 : 365;
  return { year, dayOfYear, totalDays };
}

export function computePositions(
  particles: GalaxyParticle[],
  layout: GalaxyLayout
): GalaxyParticle[] {
  if (particles.length === 0) return particles;

  const sorted = [...particles].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  if (!first || !last) return particles;

  const startDate = new Date(first.date);
  const endDate = new Date(last.date);
  const totalMs = endDate.getTime() - startDate.getTime();

  const rng = seededRandom(42);

  return sorted.map((p, i) => {
    const date = new Date(p.date);
    const progress = totalMs > 0 ? (date.getTime() - startDate.getTime()) / totalMs : 0;
    const { year, dayOfYear } = getDateInfo(p.date);
    const yearIndex = year - startDate.getFullYear();

    let targetPosition: [number, number, number];

    switch (layout) {
      case "spiral": {
        const arms = 3;
        const armIndex = yearIndex % arms;
        const angleOffset = (armIndex / arms) * Math.PI * 2;
        const radius = 2 + progress * 12;
        const angle = angleOffset + progress * Math.PI * 6 + (dayOfYear / 365) * 0.5;
        const noiseY = (rng() - 0.5) * 0.3;
        targetPosition = [
          Math.cos(angle) * radius,
          noiseY + Math.sin(progress * Math.PI * 2) * 0.2,
          Math.sin(angle) * radius,
        ];
        break;
      }
      case "cluster": {
        const clusterSpread = 0.3;
        const clusterRadius = 3 + (yearIndex % 5) * 2;
        const clusterAngle = ((yearIndex * 2.5) % (Math.PI * 2));
        const cx = Math.cos(clusterAngle) * clusterRadius;
        const cz = Math.sin(clusterAngle) * clusterRadius;
        targetPosition = [
          cx + (rng() - 0.5) * clusterSpread,
          (rng() - 0.5) * 0.2,
          cz + (rng() - 0.5) * clusterSpread,
        ];
        break;
      }
      case "constellation": {
        const angle = (i / sorted.length) * Math.PI * 2;
        const radius = 3 + (p.level || 1) * 1.5;
        const connX = radius * Math.cos(angle);
        const connZ = radius * Math.sin(angle);
        targetPosition = [
          connX + (rng() - 0.5) * 0.5,
          (rng() - 0.5) * 0.5,
          connZ + (rng() - 0.5) * 0.5,
        ];
        break;
      }
      case "timeline-spiral": {
        const revolutions = 4;
        const angle2 = progress * Math.PI * 2 * revolutions;
        const radius2 = 1 + progress * 10;
        targetPosition = [
          Math.cos(angle2) * radius2,
          (progress - 0.5) * 2,
          Math.sin(angle2) * radius2,
        ];
        break;
      }
      case "radial": {
        const ring = yearIndex * 2 + 1;
        const angle3 = (dayOfYear / 365) * Math.PI * 2 + yearIndex * 0.5;
        targetPosition = [
          Math.cos(angle3) * ring,
          (rng() - 0.5) * 0.3,
          Math.sin(angle3) * ring,
        ];
        break;
      }
      case "grid": {
        const cols = 52;
        const row = Math.floor(i / cols);
        const col = i % cols;
        targetPosition = [
          (col - cols / 2) * 0.15,
          (row * 0.15 - 2) + yearIndex * 0.5,
          (rng() - 0.5) * 0.1,
        ];
        break;
      }
      default:
        targetPosition = [0, 0, 0];
    }

    return { ...p, targetPosition, position: [...targetPosition] };
  });
}
