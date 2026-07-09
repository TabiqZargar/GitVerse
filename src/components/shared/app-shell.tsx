"use client";

import { useState, useCallback } from "react";
import { NavigationBar } from "@/components/design-system/navigation-bar";
import { Timeline } from "@/components/design-system/timeline";
import { LeftPanel } from "@/components/panels/left-panel";
import { RightPanel } from "@/components/panels/right-panel";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children?: React.ReactNode;
}

const CURRENT_YEAR = new Date().getFullYear();
const TIMELINE_YEARS = Array.from({ length: 5 }, (_, i) => ({
  year: CURRENT_YEAR - 4 + i,
})).filter((y) => y.year >= 2016 && y.year <= CURRENT_YEAR);

export function AppShell({ children }: AppShellProps) {
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [isPlaying, setIsPlaying] = useState(false);
  const [leftOpen] = useState(true);
  const [rightOpen] = useState(true);

  const handleYearChange = useCallback((year: number) => {
    setSelectedYear(year);
  }, []);

  const handlePlayToggle = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <NavigationBar />

      <div className="flex-1 pt-16">
        <div
          className={cn(
            "mx-auto flex h-[calc(100vh-8rem)] w-full max-w-7xl gap-4 px-4 py-4 sm:px-6 lg:px-8",
            "transition-all duration-500"
          )}
        >
          <LeftPanel
            className={cn(
              "w-72 shrink-0 transition-all duration-500",
              leftOpen ? "opacity-100" : "w-0 overflow-hidden opacity-0 px-0"
            )}
          />

          <main
            className="flex min-w-0 flex-1 flex-col gap-4"
            role="main"
            aria-label="Main visualization area"
          >
            <div className="relative flex-1">
              {children ?? (
                <div className="flex h-full items-center justify-center">
                  <div className="scene-placeholder" />
                </div>
              )}
            </div>
          </main>

          <RightPanel
            className={cn(
              "w-72 shrink-0 transition-all duration-500",
              rightOpen ? "opacity-100" : "w-0 overflow-hidden opacity-0 px-0"
            )}
          />
        </div>
      </div>

      <div className="fixed bottom-0 right-0 left-0 z-50 px-4 pb-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Timeline
            years={TIMELINE_YEARS}
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
            isPlaying={isPlaying}
            onPlayToggle={handlePlayToggle}
          />
        </div>
      </div>
    </div>
  );
}
