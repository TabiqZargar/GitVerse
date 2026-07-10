"use client";

import { useRef, useCallback, useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn, formatDate } from "@/lib/utils";
import { usePlaybackState } from "../hooks";
import { TimelineControls } from "./timeline-controls";
import { TimelineMarkers } from "./timeline-markers";

interface ReplayTimelineProps {
  className?: string;
}

export function ReplayTimeline({ className }: ReplayTimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverProgress, setHoverProgress] = useState<number | null>(null);

  const {
    isPlaying,
    speed,
    loop,
    progress,
    currentDate,
    isAtEnd,
    isAtStart,
    dateRange,
    togglePlay,
    setSpeed,
    toggleLoop,
    setProgress,
    nextStep,
    prevStep,
    jumpToStart,
    jumpToEnd,
  } = usePlaybackState();

  const progressPct = useMemo(() => `${(hoverProgress ?? progress) * 100}%`, [progress, hoverProgress]);

  const getProgressFromEvent = useCallback(
    (e: React.MouseEvent | MouseEvent | React.TouchEvent | TouchEvent) => {
      const track = trackRef.current;
      if (!track || !dateRange) return 0;

      const rect = track.getBoundingClientRect();
      let clientX: number;

      if ("touches" in e) {
        const touch = e.touches[0] ?? e.changedTouches[0];
        if (!touch) return progress;
        clientX = touch.clientX;
      } else {
        clientX = e.clientX;
      }

      const x = clientX - rect.left;
      return Math.max(0, Math.min(1, x / rect.width));
    },
    [dateRange, progress]
  );

  const handleTrackClick = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) return;
      const p = getProgressFromEvent(e);
      setProgress(p);
    },
    [isDragging, getProgressFromEvent, setProgress]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true);
      const p = getProgressFromEvent(e);
      setProgress(p);
      e.preventDefault();
    },
    [getProgressFromEvent, setProgress]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      const p = getProgressFromEvent(e);
      setProgress(p);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, getProgressFromEvent, setProgress]);

  const handleHover = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) return;
      const p = getProgressFromEvent(e);
      setHoverProgress(p);
    },
    [isDragging, getProgressFromEvent]
  );

  const handleHoverEnd = useCallback(() => {
    if (!isDragging) setHoverProgress(null);
  }, [isDragging]);

  if (!dateRange) {
    return (
      <div className={cn("glass rounded-2xl border-glass-border px-4 py-3", className)}>
        <p className="text-center text-xs text-muted-foreground/50">
          Load contribution data to begin replay
        </p>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)} role="region" aria-label="Timeline replay">
      <div className="glass rounded-2xl border-glass-border px-4 py-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-medium text-muted-foreground/70">
            {formatDate(currentDate)}
          </span>
          <span className="text-[10px] text-muted-foreground/40">
            {isAtStart ? "Start" : isAtEnd ? "Latest" : ""}
          </span>
        </div>

        <div
          ref={trackRef}
          className="relative h-8 cursor-pointer rounded-lg px-0.5"
          onClick={handleTrackClick}
          onPointerDown={handlePointerDown}
          onMouseMove={handleHover}
          onMouseLeave={handleHoverEnd}
          role="slider"
          aria-label="Timeline scrubber"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          tabIndex={0}
        >
          <div className="absolute inset-x-0.5 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-glass-border">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary/40 to-primary"
              style={{ width: progressPct }}
              layout="position"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>

          <motion.div
            className="absolute top-1/2 z-10 h-4 w-4 -translate-y-1/2 -translate-x-1/2 cursor-grab rounded-full border-2 border-primary bg-background shadow-glow transition-shadow"
            style={{ left: progressPct }}
            layout="position"
            transition={isDragging ? { type: "spring", stiffness: 500, damping: 40 } : { type: "spring", stiffness: 300, damping: 25 }}
            whileHover={{ scale: 1.2 }}
            whileTap={{
              scale: 0.9,
              cursor: "grabbing",
              boxShadow: "0 0 20px oklch(0.65 0.2 265 / 0.3)",
            }}
          />

          <div className="pointer-events-none absolute inset-x-0.5 top-1/2 h-6 -translate-y-1/2" />
        </div>

        <TimelineMarkers
          startDate={dateRange.start}
          endDate={dateRange.end}
          totalDays={dateRange.totalDays}
          onYearClick={(year) => {
            const d = new Date(year, 0, 1);
            if (d < dateRange.start) d.setTime(dateRange.start.getTime());
            if (d > dateRange.end) d.setTime(dateRange.end.getTime());
            const ms = d.getTime() - dateRange.start.getTime();
            const dayOffset = Math.round(ms / (1000 * 60 * 60 * 24));
            setProgress(dayOffset / (dateRange.totalDays - 1));
          }}
        />

        <div className="mt-3 flex items-center justify-between">
          <TimelineControls
            isPlaying={isPlaying}
            speed={speed}
            loop={loop}
            isAtStart={isAtStart}
            isAtEnd={isAtEnd}
            onTogglePlay={togglePlay}
            onPrev={prevStep}
            onNext={nextStep}
            onSpeedChange={setSpeed}
            onLoopToggle={toggleLoop}
            onJumpToStart={jumpToStart}
            onJumpToEnd={jumpToEnd}
          />

          <div className="flex items-center gap-2">
            {loop && (
              <span className="text-[10px] font-medium text-primary/60">Looping</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
