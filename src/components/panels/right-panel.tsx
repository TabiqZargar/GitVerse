"use client";

import { motion } from "framer-motion";
import {
  GlassPanel,
  GlassPanelContent,
  GlassPanelHeader,
  SectionHeader,
  StatBadge,
  GradientButton,
} from "@/components/design-system";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/hooks/use-auth";

interface RightPanelProps {
  className?: string;
}

export function RightPanel({ className }: RightPanelProps) {
  const { isAuthenticated } = useAuth();

  return (
    <aside
      className={cn("flex flex-col gap-4 overflow-y-auto scrollbar-thin", className)}
      aria-label="Repository and insights panel"
    >
      <GlassPanelMotion delay={0.05}>
        <GlassPanelHeader>
          <SectionHeader title="Repositories" action={<StatBadge label="total" value="0" />} />
        </GlassPanelHeader>
        <GlassPanelContent className="space-y-2 pt-0">
          <div className="flex items-center gap-2 rounded-lg border border-glass-border px-3 py-2 text-sm">
            <input
              type="text"
              placeholder="Filter repositories..."
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 w-full outline-none"
              aria-label="Filter repositories"
            />
          </div>
          <p className="text-muted-foreground py-4 text-center text-xs">
            No repositories tracked yet
          </p>
        </GlassPanelContent>
      </GlassPanelMotion>

      <GlassPanelMotion delay={0.1}>
        <GlassPanelHeader>
          <SectionHeader title="Achievements" />
        </GlassPanelHeader>
        <GlassPanelContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-glass-border bg-glass/50 px-3 py-2 text-xs text-muted-foreground">
              <span>Coming soon</span>
            </div>
          </div>
        </GlassPanelContent>
      </GlassPanelMotion>

      <GlassPanelMotion delay={0.15}>
        <GlassPanelHeader>
          <SectionHeader title="Insights" />
        </GlassPanelHeader>
        <GlassPanelContent className="pt-0">
          <p className="text-muted-foreground py-4 text-center text-xs">
            AI-powered insights will appear here
          </p>
        </GlassPanelContent>
      </GlassPanelMotion>

      <GlassPanelMotion delay={0.2}>
        <GlassPanelHeader>
          <SectionHeader title="Export" />
        </GlassPanelHeader>
        <GlassPanelContent className="space-y-2 pt-0">
          <GradientButton variant="subtle" size="sm" className="w-full justify-center text-xs">
            Export as PNG
          </GradientButton>
          <GradientButton variant="subtle" size="sm" className="w-full justify-center text-xs">
            Export as SVG
          </GradientButton>
        </GlassPanelContent>
      </GlassPanelMotion>

      {!isAuthenticated && (
        <GlassPanel>
          <GlassPanelContent className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm font-medium">Sign in to manage repositories</p>
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
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <GlassPanel>{children}</GlassPanel>
    </motion.div>
  );
}
