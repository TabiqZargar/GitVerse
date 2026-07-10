"use client";

import { useMemo } from "react";

interface TimelineMarkersProps {
  startDate: Date;
  endDate: Date;
  totalDays: number;
  onYearClick?: (year: number) => void;
}

export function TimelineMarkers({
  startDate,
  endDate,
  totalDays,
  onYearClick,
}: TimelineMarkersProps) {
  const years = useMemo(() => {
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    const result: { year: number; position: number }[] = [];

    for (let y = startYear; y <= endYear; y++) {
      const yearStart = new Date(y, 0, 1);
      const msFromStart = yearStart.getTime() - startDate.getTime();
      const dayFromStart = msFromStart / (1000 * 60 * 60 * 24);
      const position = Math.max(0, Math.min(1, dayFromStart / (totalDays - 1)));
      result.push({ year: y, position });
    }

    return result;
  }, [startDate, endDate, totalDays]);

  return (
    <div className="relative mx-[1px] mt-1.5 h-3 select-none">
      <div className="flex justify-between px-0">
        {years.map(({ year, position }) => (
          <div
            key={year}
            className="absolute flex flex-col items-center"
            style={{ left: `${position * 100}%`, transform: "translateX(-50%)" }}
          >
            <div
              className="h-[3px] w-px bg-glass-border/50"
              aria-hidden="true"
            />
            {years.length <= 10 && (
              <button
                onClick={() => onYearClick?.(year)}
                className="text-[9px] font-medium tracking-wider text-muted-foreground/40 transition-colors hover:text-muted-foreground/70"
                aria-label={`Jump to ${year}`}
              >
                {year}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
