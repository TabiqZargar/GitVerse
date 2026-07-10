import type { TileData } from "@/features/visualization/components/landscape/types";

export type PlaybackSpeed = 0.5 | 1 | 2 | 4;

export interface DateRange {
  start: Date;
  end: Date;
  totalDays: number;
}

export interface ReplaySnapshot {
  currentDate: Date;
  progress: number;
  visibleTiles: TileData[];
  totalContributionsSoFar: number;
}

export interface ReplayStore {
  currentDate: Date;
  progress: number;
  isPlaying: boolean;
  speed: PlaybackSpeed;
  loop: boolean;
  dateRange: DateRange | null;
  tiles: TileData[];
  isAtEnd: boolean;
  isAtStart: boolean;

  setTiles: (tiles: TileData[]) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setSpeed: (speed: PlaybackSpeed) => void;
  toggleLoop: () => void;
  setProgress: (progress: number) => void;
  setCurrentDate: (date: Date) => void;
  nextStep: () => void;
  prevStep: () => void;
  jumpToStart: () => void;
  jumpToEnd: () => void;
}
