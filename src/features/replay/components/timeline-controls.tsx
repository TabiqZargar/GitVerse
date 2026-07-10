"use client";

import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import type { PlaybackSpeed } from "../types";
import { cn } from "@/lib/utils";

interface TimelineControlsProps {
  isPlaying: boolean;
  speed: PlaybackSpeed;
  loop: boolean;
  isAtStart: boolean;
  isAtEnd: boolean;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSpeedChange: (speed: PlaybackSpeed) => void;
  onLoopToggle: () => void;
  onJumpToStart: () => void;
  onJumpToEnd: () => void;
  reducedMotion?: boolean;
}

const SPEEDS: PlaybackSpeed[] = [0.5, 1, 2, 4];

export function TimelineControls({
  isPlaying,
  speed,
  loop,
  isAtStart,
  isAtEnd,
  onTogglePlay,
  onPrev,
  onNext,
  onSpeedChange,
  onLoopToggle,
  onJumpToStart,
  onJumpToEnd,
}: TimelineControlsProps) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Playback controls">
      <button
        onClick={onJumpToStart}
        disabled={isAtStart}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground/50 transition-all duration-200 hover:bg-glass-border/50 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Jump to start"
      >
        <SkipBack className="h-3.5 w-3.5" />
      </button>

      <button
        onClick={onPrev}
        disabled={isAtStart}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground/50 transition-all duration-200 hover:bg-glass-border/50 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Previous day"
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </button>

      <button
        onClick={onTogglePlay}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground transition-all duration-200 hover:bg-glass-border/50"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </button>

      <button
        onClick={onNext}
        disabled={isAtEnd}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground/50 transition-all duration-200 hover:bg-glass-border/50 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Next day"
      >
        <RotateCw className="h-3.5 w-3.5" />
      </button>

      <button
        onClick={onJumpToEnd}
        disabled={isAtEnd}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground/50 transition-all duration-200 hover:bg-glass-border/50 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Jump to end"
      >
        <SkipForward className="h-3.5 w-3.5" />
      </button>

      <div className="mx-2 h-5 w-px bg-glass-border" />

      <div className="flex items-center gap-1" role="group" aria-label="Playback speed">
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => onSpeedChange(s)}
            className={cn(
              "flex h-6 min-w-[28px] items-center justify-center rounded-md px-1.5 text-[10px] font-medium transition-all duration-200",
              speed === s
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground/50 hover:text-muted-foreground hover:bg-glass-border/30"
            )}
            aria-label={`${s}x speed`}
            aria-pressed={speed === s}
          >
            {s}x
          </button>
        ))}
      </div>

      <div className="mx-2 h-5 w-px bg-glass-border" />

      <button
        onClick={onLoopToggle}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200",
          loop
            ? "text-primary"
            : "text-muted-foreground/50 hover:text-muted-foreground hover:bg-glass-border/30"
        )}
        aria-label="Toggle loop"
        aria-pressed={loop}
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
