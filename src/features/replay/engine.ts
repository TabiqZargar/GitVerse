import type { TileData } from "@/features/visualization/components/landscape/types";
import { daysBetween, addDays, clamp } from "./anim-utils";
import type { ReplaySnapshot, DateRange } from "./types";
import { useReplayStore } from "./store";

export class ReplayEngine {
  private tiles: TileData[] = [];
  private tileMap = new Map<string, TileData>();
  private dateRange: DateRange | null = null;

  setTiles(tiles: TileData[]): void {
    this.tiles = [...tiles].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    this.tileMap.clear();
    for (const tile of this.tiles) {
      this.tileMap.set(tile.date, tile);
    }

    if (this.tiles.length > 0) {
      const first = this.tiles[0];
      const last = this.tiles[this.tiles.length - 1];
      if (!first || !last) return;
      const start = new Date(first.date);
      const end = new Date(last.date);
      const totalDays = daysBetween(start, end) + 1;
      this.dateRange = { start, end, totalDays };
    }
  }

  getDateRange(): DateRange | null {
    return this.dateRange;
  }

  getTileAtDate(date: string): TileData | undefined {
    return this.tileMap.get(date);
  }

  getSnapshotAtDate(date: Date): ReplaySnapshot {
    const dateStr = date.toISOString().split("T")[0] ?? "";
    const visible = this.tiles.filter((t) => t.date <= dateStr);
    const totalContributionsSoFar = visible.reduce((sum, t) => sum + t.count, 0);

    let progress = 0;
    if (this.dateRange) {
      const dayOffset = daysBetween(this.dateRange.start, date);
      progress = clamp(dayOffset / (this.dateRange.totalDays - 1), 0, 1);
    }

    return {
      currentDate: date,
      progress,
      visibleTiles: visible,
      totalContributionsSoFar,
    };
  }

  getProgressForDate(date: Date): number {
    if (!this.dateRange) return 0;
    const dayOffset = daysBetween(this.dateRange.start, date);
    return clamp(dayOffset / (this.dateRange.totalDays - 1), 0, 1);
  }

  getDateForProgress(progress: number): Date | null {
    if (!this.dateRange) return null;
    const dayOffset = Math.round(clamp(progress, 0, 1) * (this.dateRange.totalDays - 1));
    return addDays(this.dateRange.start, dayOffset);
  }

  getVisibleCount(date: Date): number {
    const dateStr = date.toISOString().split("T")[0] ?? "";
    let count = 0;
    for (const t of this.tiles) {
      if (t.date <= dateStr) count++;
      else break;
    }
    return count;
  }

  getTilesUpTo(date: Date): TileData[] {
    const dateStr = date.toISOString().split("T")[0] ?? "";
    const result: TileData[] = [];
    for (const t of this.tiles) {
      if (t.date <= dateStr) result.push(t);
      else break;
    }
    return result;
  }
}

let globalEngine: ReplayEngine | null = null;

export function getReplayEngine(): ReplayEngine {
  if (!globalEngine) {
    globalEngine = new ReplayEngine();
  }
  return globalEngine;
}

export function resetReplayEngine(): void {
  globalEngine = null;
}

export function syncReplayEngineWithStore(): void {
  const engine = getReplayEngine();
  const tiles = useReplayStore.getState().tiles;
  if (tiles.length > 0) {
    engine.setTiles(tiles);
  }
}
