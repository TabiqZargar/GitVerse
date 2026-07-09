"use client";

import { StatsCard } from "@/features/analytics/components/stats-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-2">Deep insights into your development activity</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Commits" value={0} description="All time commits" />
        <StatsCard title="Pull Requests" value={0} description="Total PRs created" />
        <StatsCard title="Issues" value={0} description="Issues opened" />
        <StatsCard title="Streak Days" value={0} description="Current streak" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Overview</CardTitle>
          <CardDescription>Monthly contribution breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Activity charts will appear once sufficient data is collected.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
