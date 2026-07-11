"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { LandingSearch } from "@/features/profile/components/landing-search";
import { useProfileStore } from "@/features/profile/store/profile-store";
import { GlassCard } from "@/components/shared/glass-card";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const trendingDevelopers = [
  { username: "unclebob", name: "Robert Martin", focus: "Clean Code" },
  { username: "torvalds", name: "Linus Torvalds", focus: "Linux Kernel" },
  { username: "gaearon", name: "Dan Abramov", focus: "React" },
  { username: "addyosmani", name: "Addy Osmani", focus: "Performance" },
  { username: "sophiebits", name: "Sophie Alpert", focus: "React" },
];

export function LandingContent() {
  const recentSearches = useProfileStore((s) => s.recentSearches);

  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 min-h-screen flex flex-col items-center px-gutter pt-unit-xxl"
    >
      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl w-full">
        <motion.div variants={itemVariants}>
          <div className="inline-flex items-center gap-unit-sm px-4 py-1.5 rounded-full border border-white/10 bg-surface-container-low/60 backdrop-blur-xl mb-unit-md animate-fade-in shadow-[0_0_20px_-5px_rgba(210,187,255,0.1)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
            </span>
            <span className="font-label-mono text-label-mono text-secondary uppercase tracking-widest">New: Visual Commit Galaxy</span>
          </div>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="font-display-xl text-display-xl tracking-tighter text-white leading-none text-center"
        >
          Explore Any <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary-container animate-pulse">
            Coding Universe
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="font-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed opacity-80 text-center mt-unit-md"
        >
          Every commit tells a story. Enter a GitHub username to see theirs come alive through high-fidelity visualizations, deep repository insights, and an immersive developer identity experience.
        </motion.p>

        <motion.div variants={itemVariants} className="w-full max-w-2xl mt-unit-lg">
          <LandingSearch />
          <p className="text-xs text-on-surface-variant/50 text-center mt-3">
            No login required. Just enter any GitHub username to explore.
          </p>
        </motion.div>

        {recentSearches.length > 0 && (
          <motion.div variants={itemVariants} className="w-full max-w-2xl mt-unit-xl">
            <div className="flex items-center gap-2 mb-unit-sm">
              <span className="material-symbols-outlined text-sm text-on-surface-variant/50">history</span>
              <span className="text-xs text-on-surface-variant/50 uppercase tracking-widest font-label-mono">Recent Searches</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search) => (
                <Link
                  key={search.username}
                  href={`/u/${search.username}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high/40 border border-white/5 text-sm text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all duration-300"
                >
                  <div className="h-5 w-5 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center overflow-hidden">
                    {search.avatarUrl ? (
                      <Image src={search.avatarUrl} alt="" width={20} height={20} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-[8px] text-primary">{search.username.charAt(0)}</span>
                    )}
                  </div>
                  <span>{search.name || search.username}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="w-full max-w-2xl mt-unit-xl">
          <div className="flex items-center gap-2 mb-unit-sm">
            <span className="material-symbols-outlined text-sm text-on-surface-variant/50">trending_up</span>
            <span className="text-xs text-on-surface-variant/50 uppercase tracking-widest font-label-mono">Trending Developers</span>
          </div>
          <div className="flex -space-x-2">
            {trendingDevelopers.map((dev, i) => (
              <Link
                key={dev.username}
                href={`/u/${dev.username}`}
                className="group relative"
                style={{ zIndex: trendingDevelopers.length - i }}
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 border-2 border-background flex items-center justify-center overflow-hidden hover:scale-110 hover:z-50 transition-all duration-300">
                  <span className="text-xs font-medium text-primary">{dev.name.split(" ").map((n) => n.charAt(0)).join("")}</span>
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 rounded-lg bg-surface-container-high/95 backdrop-blur-xl border border-white/10 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  <p className="text-xs font-medium text-on-surface">{dev.name}</p>
                  <p className="text-[10px] text-on-surface-variant">@{dev.username} &middot; {dev.focus}</p>
                </div>
              </Link>
            ))}
            <Link
              href="/dashboard"
              style={{ zIndex: 0 }}
              className="h-10 w-10 rounded-full bg-surface-container-high border-2 border-dashed border-on-surface-variant/30 flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
            >
              <span className="material-symbols-outlined text-sm text-on-surface-variant/50">arrow_forward</span>
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div
        variants={itemVariants}
        className="w-full max-w-4xl pb-unit-xl mt-unit-xxl"
      >
        <GlassCard padding="sm" className="flex items-center justify-between px-unit-md py-unit-sm">
          <div className="flex items-center gap-unit-lg">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
              </span>
              <span className="text-xs text-on-surface-variant/60 font-label-mono">System: Online</span>
            </div>
            <span className="text-xs text-on-surface-variant/40 hidden sm:inline">v2.4 Orbit</span>
          </div>
          <div className="flex items-center gap-unit-lg text-xs text-on-surface-variant/50">
            <span className="hidden sm:inline">{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            <span className="hidden md:inline">&middot;</span>
            <span className="hidden md:inline">{Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
          </div>
        </GlassCard>
      </motion.div>
    </motion.main>
  );
}
