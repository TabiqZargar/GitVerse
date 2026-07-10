"use client";

import { useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useContributions } from "@/features/github/hooks/use-contributions";
import { LandscapeScene } from "@/features/visualization/components/landscape/landscape-scene";
import { FlowCanvas } from "@/features/visualization/components/flow-canvas";
import { adaptGitHubDaysToTiles, computeStreakDays } from "@/features/visualization/components/landscape/data-adapter";
import { useReplayStore } from "@/features/replay/store";

export default function VisualizationPage() {
  const { user } = useAuth();
  const username = user?.name ?? undefined;

  const { data: contributions, isLoading } = useContributions(username);
  const setTiles = useReplayStore((s) => s.setTiles);
  const currentDate = useReplayStore((s) => s.currentDate);

  const tileData = useMemo(() => {
    if (!contributions?.success) return undefined;
    const calendar = contributions.data;
    if (!calendar?.days) return undefined;
    const tiles = adaptGitHubDaysToTiles(calendar.days);
    const streakDays = computeStreakDays(tiles);
    return tiles.map((t) => ({
      ...t,
      isCurrentStreak: streakDays.has(t.date),
    }));
  }, [contributions]);

  useEffect(() => {
    if (tileData && tileData.length > 0) {
      setTiles(tileData);
    }
  }, [tileData, setTiles]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Visualization</h1>
        <p className="text-muted-foreground mt-2">Explore your contributions in 3D and interactive flows</p>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Contribution Landscape</CardTitle>
          <CardDescription>
            Every day becomes terrain. Higher contributions create taller mountains.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[600px] w-full">
            <LandscapeScene
              days={tileData}
              isLoading={isLoading}
              currentDate={currentDate}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Repository Flow Map</CardTitle>
          <CardDescription>Visualize connections between your repositories</CardDescription>
        </CardHeader>
        <CardContent>
          <FlowCanvas />
        </CardContent>
      </Card>
    </div>
  );
}
