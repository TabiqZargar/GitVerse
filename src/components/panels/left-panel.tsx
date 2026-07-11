"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  GlassPanel,
  GlassPanelContent,
  GlassPanelHeader,
  SectionHeader,
  StatBadge,
  DeveloperAvatar,
} from "@/components/design-system";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { cn } from "@/lib/utils";

interface LeftPanelProps {
  className?: string;
}

export function LeftPanel({ className }: LeftPanelProps) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const { data: analytics } = useQuery({
    queryKey: ["analytics", "left-panel"],
    queryFn: async () => {
      const res = await apiClient.get<{
        data: {
          streaks: { currentStreak: number; longestStreak: number };
          statistics: { totalContributions: number; totalActiveDays: number; weeklyAverage: number };
          language: { diversity: number; languages: { name: string; percentage: number }[]; primaryLanguage: { name: string; percentage: number } | null };
          scores: { developer: { overall: number; level: string } };
        };
      }>("/analytics");
      if (!res.success) throw new Error(res.error.message);
      return res.data.data;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });

  const streak = analytics?.streaks;
  const stats = analytics?.statistics;
  const lang = analytics?.language;
  const score = analytics?.scores?.developer;

  return (
    <aside
      className={cn("flex flex-col gap-4 overflow-y-auto scrollbar-thin", className)}
      aria-label="Developer information"
    >
      {isAuthenticated && user ? (
        <>
          <GlassPanelMotion delay={0}>
            <GlassPanelContent className="space-y-4 pt-5">
              <div className="flex items-center gap-4">
                <DeveloperAvatar
                  name={user.name}
                  image={user.image}
                  size="lg"
                  glow
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-semibold">{user.name ?? "Developer"}</p>
                  <p className="text-muted-foreground truncate text-sm">{user.email ?? ""}</p>
                </div>
              </div>
            </GlassPanelContent>
          </GlassPanelMotion>

          <GlassPanelMotion delay={0.1}>
            <GlassPanelHeader>
              <SectionHeader title="Current Streak" />
            </GlassPanelHeader>
            <GlassPanelContent className="pt-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold tracking-tight">{streak?.currentStreak ?? 0}</span>
                <span className="text-muted-foreground text-sm">days</span>
              </div>
              <div className="mt-2 flex gap-2">
                <StatBadge label="longest" value={String(streak?.longestStreak ?? 0)} color="primary" />
                <StatBadge label="active days" value={String(stats?.totalActiveDays ?? 0)} />
              </div>
            </GlassPanelContent>
          </GlassPanelMotion>

          <GlassPanelMotion delay={0.2}>
            <GlassPanelHeader>
              <SectionHeader title="Contributions" />
            </GlassPanelHeader>
            <GlassPanelContent className="space-y-3 pt-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold tracking-tight">{stats?.totalContributions ?? 0}</span>
                <span className="text-muted-foreground text-sm">this year</span>
              </div>
              {stats && (
                <div className="flex flex-wrap gap-2">
                  <StatBadge label="weekly avg" value={String(stats.weeklyAverage)} />
                </div>
              )}
            </GlassPanelContent>
          </GlassPanelMotion>

          <GlassPanelMotion delay={0.3}>
            <GlassPanelHeader>
              <SectionHeader title="Languages" />
            </GlassPanelHeader>
            <GlassPanelContent className="space-y-2.5 pt-0">
              {lang && lang.languages.length > 0 ? (
                <>
                  {lang.languages.slice(0, 4).map((l) => (
                    <div key={l.name} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground truncate">{l.name}</span>
                      <span className="text-foreground font-medium">{Math.round(l.percentage)}%</span>
                    </div>
                  ))}
                  <div className="flex h-1.5 gap-0.5 overflow-hidden rounded-full">
                    {lang.languages.slice(0, 5).map((l, i) => (
                      <div
                        key={l.name}
                        className="h-full rounded-full first:rounded-l-full last:rounded-r-full"
                        style={{
                          width: `${Math.max(l.percentage, 2)}%`,
                          backgroundColor: `hsl(${i * 50 + 200}, 70%, 55%)`,
                        }}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">No data yet</span>
                </div>
              )}
              {lang && lang.primaryLanguage && (
                <p className="text-xs text-muted-foreground">
                  Primary: {lang.primaryLanguage.name} ({Math.round(lang.primaryLanguage.percentage)}%)
                </p>
              )}
            </GlassPanelContent>
          </GlassPanelMotion>

          <GlassPanelMotion delay={0.35}>
            <GlassPanelHeader>
              <SectionHeader title="Developer Score" />
            </GlassPanelHeader>
            <GlassPanelContent className="pt-0">
              {score ? (
                <>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold tracking-tight">{score.overall}</span>
                    <span className="text-muted-foreground text-sm">/ 100</span>
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Grade: {score.level}
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold tracking-tight">&mdash;</span>
                    <span className="text-muted-foreground text-sm">/ 100</span>
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Score will appear once data is collected
                  </p>
                </>
              )}
            </GlassPanelContent>
          </GlassPanelMotion>

          <GlassPanelMotion delay={0.4}>
            <GlassPanelHeader>
              <SectionHeader title="Recent Activity" />
            </GlassPanelHeader>
            <GlassPanelContent className="pt-0">
              {stats && stats.totalContributions > 0 ? (
                <p className="text-muted-foreground py-6 text-center text-xs">
                  {stats.totalContributions} contributions across {stats.totalActiveDays} active days
                </p>
              ) : (
                <p className="text-muted-foreground py-6 text-center text-xs">
                  Connect your GitHub account to see activity
                </p>
              )}
            </GlassPanelContent>
          </GlassPanelMotion>
        </>
      ) : authLoading ? (
        <GlassPanel>
          <GlassPanelContent className="flex items-center justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" role="status" aria-label="Loading profile" />
          </GlassPanelContent>
        </GlassPanel>
      ) : (
        <GlassPanel>
          <GlassPanelContent className="flex flex-col items-center gap-3 py-10 text-center">
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 flex h-12 w-12 items-center justify-center rounded-2xl">
              <span className="text-lg">G</span>
            </div>
            <p className="text-sm font-medium">Sign in to view your profile</p>
            <a href="/login" className="text-primary text-sm font-medium hover:underline mt-2">Sign in with GitHub</a>
          </GlassPanelContent>
        </GlassPanel>
      )}
    </aside>
  );
}

function GlassPanelMotion({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <GlassPanel>{children}</GlassPanel>
    </motion.div>
  );
}
