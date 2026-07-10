import * as THREE from "three";
import type { TileData, TerrainGrid } from "./types";

const COLOR_STOPS = [
  { threshold: 0, color: new THREE.Color("#0a1628") },
  { threshold: 1, color: new THREE.Color("#6b3fa0") },
  { threshold: 4, color: new THREE.Color("#22d3ee") },
  { threshold: 9, color: new THREE.Color("#34d399") },
  { threshold: 15, color: new THREE.Color("#fbbf24") },
  { threshold: 25, color: new THREE.Color("#fb923c") },
];

export function getElevationColor(count: number): THREE.Color {
  const firstStop = COLOR_STOPS[0];
  if (!firstStop) return new THREE.Color("#0a1628");
  if (count <= 0) return firstStop.color.clone();

  for (let i = 1; i < COLOR_STOPS.length; i++) {
    const prev = COLOR_STOPS[i - 1];
    const curr = COLOR_STOPS[i];
    if (!prev || !curr) continue;

    if (count >= prev.threshold && count < curr.threshold) {
      const range = curr.threshold - prev.threshold;
      const t = range === 0 ? 0 : (count - prev.threshold) / range;
      return prev.color.clone().lerp(curr.color, t);
    }
  }

  const lastStop = COLOR_STOPS[COLOR_STOPS.length - 1];
  return lastStop ? lastStop.color.clone() : new THREE.Color("#fb923c");
}

export function getElevationColorHex(count: number): string {
  return getElevationColor(count).getStyle();
}

export function getTileHeight(count: number, maxCount: number): number {
  if (count === 0) return 0.01;

  const normalized = Math.min(count / Math.max(maxCount, 1), 1);
  const minH = 0.15;
  const maxH = 2.5;

  const curved = Math.pow(normalized, 0.6);
  return minH + curved * (maxH - minH);
}

export const TILE_WIDTH = 0.4;
export const TILE_DEPTH = 0.4;
export const TILE_GAP = 0.06;

export function getTilePosition(
  week: number,
  dayOfWeek: number,
  totalWeeks: number
): [number, number, number] {
  const x = (week - totalWeeks / 2) * (TILE_WIDTH + TILE_GAP);
  const z = (dayOfWeek - 3) * (TILE_DEPTH + TILE_GAP);
  return [x, 0, z];
}

export const ANIMATION_DURATION = 2000;
export const TILE_RAISE_DELAY = 4;

export const CAMERA_DEFAULT: [number, number, number] = [0, 6, 10];
export const CAMERA_IDLE_SPEED = 0.08;
export const CAMERA_ZOOM_MIN = 4;
export const CAMERA_ZOOM_MAX = 20;
export const CAMERA_ORBIT_MIN_POLAR = Math.PI / 6;
export const CAMERA_ORBIT_MAX_POLAR = Math.PI / 2.2;

export const PARTICLE_COUNT = 1200;

export function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function buildTerrainGrid(days: TileData[]): TerrainGrid {
  let maxCount = 0;
  for (const d of days) {
    if (d.count > maxCount) maxCount = d.count;
  }

  let weeks = 0;
  for (const d of days) {
    if (d.week > weeks) weeks = d.week;
  }
  weeks += 1;

  return { tiles: days, weeks, maxCount };
}
