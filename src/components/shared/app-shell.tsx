"use client";

import { useEffect } from "react";
import { NavigationBar } from "@/components/design-system/navigation-bar";
import { ReplayTimeline } from "@/features/replay/components/timeline";
import { usePlayback } from "@/features/replay/hooks";
import { useReplayStore } from "@/features/replay/store";
import { LeftPanel } from "@/components/panels/left-panel";
import { RightPanel } from "@/components/panels/right-panel";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children?: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {

  usePlayback();

  const togglePlay = useReplayStore((s) => s.togglePlay);
  const nextStep = useReplayStore((s) => s.nextStep);
  const prevStep = useReplayStore((s) => s.prevStep);
  const jumpToStart = useReplayStore((s) => s.jumpToStart);
  const jumpToEnd = useReplayStore((s) => s.jumpToEnd);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          prevStep();
          break;
        case "ArrowRight":
          e.preventDefault();
          nextStep();
          break;
        case "Home":
          e.preventDefault();
          jumpToStart();
          break;
        case "End":
          e.preventDefault();
          jumpToEnd();
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, nextStep, prevStep, jumpToStart, jumpToEnd]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <NavigationBar />

      <div className="flex-1 pt-16">
        <div
          className={cn(
            "mx-auto flex h-[calc(100vh-14rem)] w-full max-w-7xl gap-4 px-4 py-4 sm:px-6 lg:px-8",
            "transition-all duration-500"
          )}
        >
          <LeftPanel className="w-72 shrink-0" />

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

          <RightPanel className="w-72 shrink-0" />
        </div>
      </div>

      <div className="fixed bottom-0 right-0 left-0 z-50 px-4 pb-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ReplayTimeline />
        </div>
      </div>
    </div>
  );
}
