"use client";

import { motion } from "framer-motion";
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
  const { user, isAuthenticated, isLoading } = useAuth();

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
                <span className="text-3xl font-bold tracking-tight">0</span>
                <span className="text-muted-foreground text-sm">days</span>
              </div>
              <div className="mt-2 flex gap-2">
                <StatBadge label="longest" value="0" color="primary" />
                <StatBadge label="total" value="0" />
              </div>
            </GlassPanelContent>
          </GlassPanelMotion>

          <GlassPanelMotion delay={0.2}>
            <GlassPanelHeader>
              <SectionHeader title="Contributions" />
            </GlassPanelHeader>
            <GlassPanelContent className="space-y-3 pt-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold tracking-tight">0</span>
                <span className="text-muted-foreground text-sm">this year</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatBadge label="this week" value="0" />
                <StatBadge label="today" value="0" />
              </div>
            </GlassPanelContent>
          </GlassPanelMotion>

          <GlassPanelMotion delay={0.3}>
            <GlassPanelHeader>
              <SectionHeader title="Languages" />
            </GlassPanelHeader>
            <GlassPanelContent className="space-y-2.5 pt-0">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">No data yet</span>
              </div>
              <div className="flex h-1.5 gap-0.5 overflow-hidden rounded-full">
                <div className="h-full w-full rounded-full bg-muted" />
              </div>
            </GlassPanelContent>
          </GlassPanelMotion>

          <GlassPanelMotion delay={0.35}>
            <GlassPanelHeader>
              <SectionHeader title="Developer Score" />
            </GlassPanelHeader>
            <GlassPanelContent className="pt-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold tracking-tight">&mdash;</span>
                <span className="text-muted-foreground text-sm">/ 100</span>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                Score will appear once data is collected
              </p>
            </GlassPanelContent>
          </GlassPanelMotion>

          <GlassPanelMotion delay={0.4}>
            <GlassPanelHeader>
              <SectionHeader title="Recent Activity" />
            </GlassPanelHeader>
            <GlassPanelContent className="pt-0">
              <p className="text-muted-foreground py-6 text-center text-xs">
                Connect your GitHub account to see activity
              </p>
            </GlassPanelContent>
          </GlassPanelMotion>
        </>
      ) : isLoading ? (
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
