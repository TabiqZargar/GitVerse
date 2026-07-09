"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { GlassPanel, GlassPanelContent } from "@/components/design-system/glass-panel";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <GlassPanel className={cn("", className)}>
        <GlassPanelContent className="flex flex-col items-center gap-4 py-12 text-center">
          {icon && <div className="text-muted-foreground/50">{icon}</div>}
          <h3 className="text-base font-semibold">{title}</h3>
          {description && <p className="text-muted-foreground max-w-xs text-sm">{description}</p>}
          {action && <div className="mt-2">{action}</div>}
        </GlassPanelContent>
      </GlassPanel>
    </motion.div>
  );
}
