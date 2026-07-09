"use client";

import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineYear {
  year: number;
  label?: string;
  isActive?: boolean;
}

interface TimelineProps {
  years: TimelineYear[];
  selectedYear: number;
  onYearChange: (year: number) => void;
  isPlaying?: boolean;
  onPlayToggle?: () => void;
  className?: string;
}

export function Timeline({
  years,
  selectedYear,
  onYearChange,
  isPlaying = false,
  onPlayToggle,
  className,
}: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleYearClick = useCallback(
    (year: number) => {
      onYearChange(year);
    },
    [onYearChange]
  );

  const handlePrev = useCallback(() => {
    const idx = years.findIndex((y) => y.year === selectedYear);
    if (idx > 0) onYearChange(years[idx - 1]!.year);
  }, [years, selectedYear, onYearChange]);

  const handleNext = useCallback(() => {
    const idx = years.findIndex((y) => y.year === selectedYear);
    if (idx < years.length - 1) onYearChange(years[idx + 1]!.year);
  }, [years, selectedYear, onYearChange]);

  return (
    <div className={cn("w-full", className)} role="region" aria-label="Contribution timeline">
      <div className="glass rounded-2xl border-glass-border px-4 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={onPlayToggle}
            className="text-muted-foreground hover:text-foreground hover:bg-glass-border flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200"
            aria-label={isPlaying ? "Pause timeline" : "Play timeline"}
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>

          <button
            onClick={handlePrev}
            className="text-muted-foreground hover:text-foreground hover:bg-glass-border flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200"
            aria-label="Previous year"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          <div
            ref={containerRef}
            className="relative flex flex-1 items-center gap-1 overflow-x-auto scrollbar-thin py-1"
            role="tablist"
            aria-label="Select year"
          >
            {years.map((year) => {
              const isSelected = year.year === selectedYear;
              return (
                <button
                  key={year.year}
                  onClick={() => handleYearClick(year.year)}
                  className={cn(
                    "relative flex shrink-0 cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300",
                    isSelected
                      ? "text-foreground"
                      : "text-muted-foreground/60 hover:text-muted-foreground hover:bg-glass-border/50"
                  )}
                  role="tab"
                  aria-selected={isSelected}
                  aria-label={`${year.year}${year.label ? ` - ${year.label}` : ""}`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="timeline-pill"
                      className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 shadow-glow"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{year.year}</span>
                  {year.label && (
                    <span className="relative z-10 ml-1.5 text-xs opacity-60">{year.label}</span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            className="text-muted-foreground hover:text-foreground hover:bg-glass-border flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200"
            aria-label="Next year"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
