"use client";

import { useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useContributions } from "@/features/github/hooks/use-contributions";
import { LandscapeScene } from "@/features/visualization/components/landscape/landscape-scene";
import { adaptGitHubDaysToTiles, computeStreakDays } from "@/features/visualization/components/landscape/data-adapter";
import { useReplayStore } from "@/features/replay/store";
import { useUniverseData } from "@/features/repository-universe/hooks/use-universe-data";
import { useUniverseStore } from "@/features/repository-universe/store";

const RepositoryUniverse = dynamic(
  () => import("@/features/repository-universe/components/repository-universe")
    .then((mod) => ({ default: mod.RepositoryUniverse })),
  { ssr: false }
);

const ContributionGalaxy = dynamic(
  () => import("@/features/contribution-galaxy/components/contribution-galaxy")
    .then((mod) => ({ default: mod.ContributionGalaxy })),
  { ssr: false }
);

export default function VisualizationPage() {
  const { user } = useAuth();
  const username = user?.name ?? undefined;

  const { data: contributions, isLoading: contribsLoading } = useContributions(username);
  const { bodies, isLoading: reposLoading } = useUniverseData();
  const setTiles = useReplayStore((s) => s.setTiles);
  const currentDate = useReplayStore((s) => s.currentDate);
  const setBodies = useUniverseStore((s) => s.setBodies);

  useEffect(() => {
    if (bodies && bodies.length > 0) {
      setBodies(bodies);
    }
  }, [bodies, setBodies]);

  const days = useMemo(() => {
    if (!contributions?.success) return [];
    const calendar = contributions.data;
    if (!calendar?.days) return [];
    return calendar.days;
  }, [contributions]);

  const tileData = useMemo(() => {
    if (days.length === 0) return undefined;
    const tiles = adaptGitHubDaysToTiles(days);
    const streakDays = computeStreakDays(tiles);
    return tiles.map((t) => ({
      ...t,
      isCurrentStreak: streakDays.has(t.date),
    }));
  }, [days]);

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
          <CardTitle>Repository Universe</CardTitle>
          <CardDescription>
            Every repository becomes a celestial body in an interactive galaxy
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[700px] w-full">
            <RepositoryUniverse
              bodies={bodies ?? []}
              isLoading={reposLoading}
            />
          </div>
        </CardContent>
      </Card>

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
              isLoading={contribsLoading}
              currentDate={currentDate}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Contribution Galaxy</CardTitle>
          <CardDescription>
            Every contribution becomes a glowing star in a living galaxy
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[700px] w-full">
            <ContributionGalaxy
              days={days}
              layout="spiral"
              reducedMotion={false}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
