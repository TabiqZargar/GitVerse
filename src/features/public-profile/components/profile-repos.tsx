"use client";

import { motion } from "framer-motion";
import type { ProfileRepo } from "@/features/profile/types";

interface ProfileReposProps {
  repos: ProfileRepo[];
}

export function ProfileRepos({ repos }: ProfileReposProps) {
  if (repos.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Top Repositories
      </h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {repos.map((repo, i) => (
          <motion.a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-glass-border bg-glass p-3 transition-all hover:border-glass-border/60"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.05, duration: 0.3 }}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="truncate text-sm font-semibold">{repo.name}</p>
              <div className="flex items-center gap-1 text-xs text-yellow-400 shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>{repo.stars}</span>
              </div>
            </div>
            {repo.description && (
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{repo.description}</p>
            )}
            {repo.language && (
              <span className="mt-2 inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                {repo.language}
              </span>
            )}
          </motion.a>
        ))}
      </div>
    </div>
  );
}
