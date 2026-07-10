"use client";

import { motion, AnimatePresence } from "framer-motion";
import { formatDate, formatNumber } from "@/lib/utils";
import type { TileData } from "./types";

interface TooltipProps {
  tile: TileData | null;
}

export function Tooltip({ tile }: TooltipProps) {
  return (
    <AnimatePresence>
      {tile && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="pointer-events-none absolute z-[400]"
          style={{
            transform: "translate(-50%, -100%)",
            marginTop: "-12px",
          }}
        >
          <div
            className="min-w-[160px] rounded-xl border border-glass-border bg-glass p-3 shadow-glass-lg backdrop-blur-[20px]"
          >
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
              {formatDate(tile.date)}
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {tile.count === 0
                ? "No contributions"
                : `${formatNumber(tile.count)} contribution${tile.count === 1 ? "" : "s"}`}
            </p>
            {tile.repos && tile.repos.length > 0 && (
              <p className="mt-0.5 text-xs text-muted-foreground/60">
                {tile.repos.slice(0, 2).join(", ")}
                {tile.repos.length > 2 && ` +${tile.repos.length - 2} more`}
              </p>
            )}
            {tile.isCurrentStreak && (
              <div className="mt-1.5 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                <span className="text-[10px] font-medium text-amber-400/80">Current streak</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
