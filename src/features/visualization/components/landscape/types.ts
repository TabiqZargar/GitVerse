import type * as THREE from "three";

export interface TileData {
  date: string;
  count: number;
  week: number;
  dayOfWeek: number;
  repos?: string[];
  isCurrentStreak: boolean;
}

export interface TileTransform {
  position: [number, number, number];
  targetHeight: number;
  color: THREE.Color;
}

export interface TerrainGrid {
  tiles: TileData[];
  weeks: number;
  maxCount: number;
}

export interface TooltipState {
  tile: TileData;
  screenX: number;
  screenY: number;
}

export type ElevationLevel = "very-low" | "low" | "medium" | "high" | "very-high";

export interface LandscapeSceneProps {
  days?: TileData[];
  isLoading?: boolean;
  className?: string;
  streakDays?: string[];
}
