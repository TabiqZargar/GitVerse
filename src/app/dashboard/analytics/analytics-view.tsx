"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { useProfileStore } from "@/features/profile/store/profile-store";
import { StatsCard } from "@/components/shared/stats-card";
import { GlassCard } from "@/components/shared/glass-card";
import { SectionHeader } from "@/components/shared/section-header";
import { Skeleton } from "@/components/ui/skeleton";

export function AnalyticsView() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const profile = useProfileStore((s) => s.profile);

  const { data, isLoading, error } = useQuery({
    queryKey: ["analytics", username],
    queryFn: async () => {
      const endpoint = username
        ? `/analytics?username=${encodeURIComponent(username)}`
        : "/analytics";
      const res = await apiClient.get<{
        data: {
          streaks: { currentStreak: number };
          statistics: { totalContributions: number };
          repository: { starCount: number; total: number };
        };
      }>(endpoint);
      if (!res.success) throw new Error(res.error.message);
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const totalContributions = data?.statistics.totalContributions ?? 0;
  const currentStreak = data?.streaks.currentStreak ?? 0;
  const totalStars = data?.repository.starCount ?? 0;
  const totalRepos = data?.repository.total ?? 0;

  return (
    <div className="px-gutter py-unit-xxl max-w-container-max mx-auto space-y-gutter">
      <SectionHeader 
        title={profile?.name ? `${profile.name}'s Analytics` : "Analytics"}
        subtitle="Deep insights into development activity"
      />

      <div className="grid gap-gutter md:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Total Contributions" value={isLoading ? "..." : totalContributions.toLocaleString()} icon="analytics" />
        <StatsCard label="Stars Earned" value={isLoading ? "..." : totalStars.toLocaleString()} icon="star" />
        <StatsCard label="Repositories" value={isLoading ? "..." : totalRepos.toLocaleString()} icon="code" />
        <StatsCard label="Current Streak" value={isLoading ? "..." : `${currentStreak} days`} icon="local_fire_department" />
      </div>

      <GlassCard padding="lg" glow>
        <SectionHeader title="Activity Overview" subtitle="Monthly contribution breakdown" />
        <div className="mt-unit-md">
          {isLoading ? (
            <Skeleton className="h-48 w-full rounded-xl" />
          ) : error ? (
            <p className="text-on-surface-variant text-sm">Unable to load activity data.</p>
          ) : (
            <p className="text-on-surface-variant text-sm text-center py-12">
              Advanced activity charts will render here.
            </p>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
