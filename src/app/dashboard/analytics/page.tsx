"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { StatsCard } from "@/features/analytics/components/stats-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["analytics", "dashboard"],
    queryFn: async () => {
      const res = await apiClient.get<{
        data: {
          streaks: { currentStreak: number };
          statistics: { totalContributions: number };
          activity: { pullRequests: number; issues: number };
        };
      }>("/analytics");
      if (!res.success) throw new Error(res.error.message);
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-2">Deep insights into your development activity</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Commits" value={isLoading ? "..." : data?.statistics.totalContributions ?? 0} description="All time commits" />
        <StatsCard title="Pull Requests" value={isLoading ? "..." : data?.activity.pullRequests ?? 0} description="Total PRs created" />
        <StatsCard title="Issues" value={isLoading ? "..." : data?.activity.issues ?? 0} description="Issues opened" />
        <StatsCard title="Streak Days" value={isLoading ? "..." : data?.streaks.currentStreak ?? 0} description="Current streak" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Overview</CardTitle>
          <CardDescription>Monthly contribution breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : error ? (
            <p className="text-muted-foreground text-sm">
              Unable to load activity data.
            </p>
          ) : data && data.statistics.totalContributions > 0 ? (
            <p className="text-muted-foreground text-sm">
              Activity charts will render here based on your contribution history.
            </p>
          ) : (
            <p className="text-muted-foreground text-sm">
              Activity charts will appear once sufficient data is collected.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
