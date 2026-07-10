"use client";

import { motion } from "framer-motion";
import { useAchievementStore } from "../store";
export function MilestoneDisplay() {
  const milestoneEvents = useAchievementStore((s) => s.milestoneEvents);
  const loading = useAchievementStore((s) => s.loading);

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
      </div>
    );
  }

  if (milestoneEvents.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-sm text-muted-foreground">No milestones detected yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold tracking-tight">
        Milestones
        <span className="ml-2 text-sm font-normal text-muted-foreground">
          ({milestoneEvents.length})
        </span>
      </h3>

      <div className="relative">
        <div className="absolute left-4 top-0 h-full w-0.5 bg-muted" />

        <div className="flex flex-col gap-4">
          {milestoneEvents.map((event, i) => (
            <motion.div
              key={event.id}
              className="relative flex items-start gap-4 pl-10"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <div className="absolute left-2.5 top-1 h-3 w-3 rounded-full border-2 border-chart-1 bg-background" />

              <div className="flex-1">
                <p className="text-sm font-medium">{event.label}</p>
                <p className="text-xs text-muted-foreground">
                  {event.date.replace(/-/g, "/")}
                  {event.value > 0 && ` \u00B7 ${event.value.toLocaleString()}`}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
