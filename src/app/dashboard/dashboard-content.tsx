"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useProfileStore } from "@/features/profile/store/profile-store";
import { SearchBar } from "@/features/profile/components/search-bar";
import { GlassCard } from "@/components/shared/glass-card";
import { StatsCard } from "@/components/shared/stats-card";
import { DeveloperScore } from "@/components/shared/developer-score";
import { SectionHeader } from "@/components/shared/section-header";
import { ContributionActivity } from "@/components/shared/contribution-activity";
import { SkillsBar } from "@/components/shared/skills-bar";

export function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const usernameParam = searchParams.get("username");
  const { profile, isLoading, error, fetchProfile, activeUsername } = useProfileStore();

  useEffect(() => {
    if (usernameParam) {
      fetchProfile(usernameParam);
    }
  }, [usernameParam, fetchProfile]);

  const handleSearch = (username: string) => {
    router.push(`/dashboard?username=${encodeURIComponent(username)}`);
  };

  if (!activeUsername && !usernameParam) {
    return (
      <div className="px-gutter py-unit-xxl max-w-container-max mx-auto">
        <SectionHeader title="Command Center" subtitle="Explore a developer universe" />
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-6">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">travel_explore</span>
          </div>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-3">Explore a Developer Universe</h2>
          <p className="text-on-surface-variant mb-8 max-w-md">
            Enter a GitHub username to visualize their contribution galaxy, repository universe, and developer analytics.
          </p>
          <div className="w-full max-w-md">
            <SearchBar variant="minimal" onNavigate={handleSearch} />
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="px-gutter py-unit-xxl max-w-container-max mx-auto space-y-gutter">
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 w-48 bg-white/10 rounded animate-pulse" />
          <div className="h-10 w-64 bg-white/10 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-12 gap-gutter">
          <div className="col-span-8 space-y-gutter">
            <div className="h-56 bg-white/5 rounded-2xl animate-pulse" />
            <div className="h-40 bg-white/5 rounded-2xl animate-pulse" />
            <div className="h-48 bg-white/5 rounded-2xl animate-pulse" />
          </div>
          <div className="col-span-4 space-y-gutter">
            <div className="h-48 bg-white/5 rounded-2xl animate-pulse" />
            <div className="h-32 bg-white/5 rounded-2xl animate-pulse" />
            <div className="h-40 bg-white/5 rounded-2xl animate-pulse" />
            <div className="h-40 bg-white/5 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-gutter py-unit-xxl max-w-container-max mx-auto">
        <SectionHeader title="Command Center" />
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="material-symbols-outlined text-6xl text-destructive/50 mb-4">error_outline</span>
          <h2 className="font-headline-md text-headline-md text-destructive mb-3">Profile Not Found</h2>
          <p className="text-on-surface-variant mb-8">{error}</p>
          <button onClick={() => useProfileStore.getState().clearProfile()} className="text-primary hover:underline text-sm">
            Try another username
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-gutter py-unit-xxl max-w-container-max mx-auto space-y-gutter"
    >
      <header className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="font-headline-lg text-headline-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Command Center
            </h1>
            <p className="text-sm text-on-surface-variant/60">Developer overview and insights</p>
          </div>
          {profile && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <Image src={profile.avatarUrl} alt="" width={20} height={20} className="rounded-full" />
              <span className="text-sm text-primary font-medium">@{profile.username}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <SearchBar variant="nav" onNavigate={handleSearch} />
        </div>
      </header>

      <div className="grid grid-cols-12 gap-gutter">
        <div className="col-span-12 lg:col-span-8 space-y-gutter">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard padding="lg" glow>
              <div className="flex items-start justify-between mb-unit-md">
                <div className="flex items-center gap-unit-md">
                  {profile && (
                    <Image
                      src={profile.avatarUrl}
                      alt={profile.name}
                      width={56}
                      height={56}
                      className="rounded-full border-2 border-primary/30"
                    />
                  )}
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface">{profile?.name ?? "@unknown"}</h2>
                    <p className="text-sm text-on-surface-variant/70">{profile?.bio ?? "No bio available"}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-on-surface-variant/50">
                      {profile?.location && <span>{profile.location}</span>}
                      {profile?.company && <span>{profile.company}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/dashboard/visualization?username=${profile?.username}`}>
                    <span className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer">public</span>
                  </Link>
                  <Link href={`/dashboard/analytics?username=${profile?.username}`}>
                    <span className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer">analytics</span>
                  </Link>
                  <Link href={`/wrapped?username=${profile?.username}`}>
                    <span className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer">all_inclusive</span>
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-unit-sm">
                <div className="bg-white/5 rounded-xl p-unit-sm text-center">
                  <span className="font-headline-sm text-headline-sm text-on-surface block">{profile?.totalCommits.toLocaleString()}</span>
                  <span className="text-[10px] text-on-surface-variant/60 font-label-mono uppercase tracking-widest">Commits</span>
                </div>
                <div className="bg-white/5 rounded-xl p-unit-sm text-center">
                  <span className="font-headline-sm text-headline-sm text-on-surface block">{profile?.publicRepos.toLocaleString()}</span>
                  <span className="text-[10px] text-on-surface-variant/60 font-label-mono uppercase tracking-widest">Repos</span>
                </div>
                <div className="bg-white/5 rounded-xl p-unit-sm text-center">
                  <span className="font-headline-sm text-headline-sm text-on-surface block">{profile?.totalStars.toLocaleString()}</span>
                  <span className="text-[10px] text-on-surface-variant/60 font-label-mono uppercase tracking-widest">Stars</span>
                </div>
                <div className="bg-white/5 rounded-xl p-unit-sm text-center">
                  <span className="font-headline-sm text-headline-sm text-on-surface block">{profile?.followers.toLocaleString()}</span>
                  <span className="text-[10px] text-on-surface-variant/60 font-label-mono uppercase tracking-widest">Followers</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard padding="lg" glow>
              <SectionHeader title="AI Insights" subtitle="Generated analysis based on activity" />
              <div className="mt-unit-md space-y-unit-sm">
                <div className="flex items-start gap-3 p-unit-sm rounded-xl bg-primary/5 border border-primary/10">
                  <span className="material-symbols-outlined text-primary mt-0.5">insights</span>
                  <div>
                    <p className="text-sm text-on-surface">
                      {(profile?.totalCommits ?? 0) > 1000
                        ? "Exceptional commit volume — this developer maintains a highly active contribution pattern."
                        : (profile?.totalCommits ?? 0) > 100
                          ? "Strong commit activity with consistent engagement across repositories."
                          : "Building momentum — continued contribution will unlock deeper insights."}
                    </p>
                    <p className="text-xs text-on-surface-variant/50 mt-1">Based on {(profile?.totalCommits ?? 0).toLocaleString()} total commits</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-unit-sm rounded-xl bg-secondary/5 border border-secondary/10">
                  <span className="material-symbols-outlined text-secondary mt-0.5">code</span>
                  <div>
                    <p className="text-sm text-on-surface">
                      {profile && profile.languages.length > 0
                        ? `Primary language: ${profile.languages[0]?.name ?? "Unknown"} — ${(profile.languages[0]?.percentage ?? 0).toFixed(0)}% of codebase.`
                        : "Language data not yet available for this profile."}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-unit-sm rounded-xl bg-tertiary/5 border border-tertiary/10">
                  <span className="material-symbols-outlined text-tertiary mt-0.5">group</span>
                  <div>
                    <p className="text-sm text-on-surface">
                      {profile?.followers && profile.followers > 10
                        ? `Influential developer with ${profile.followers} followers and ${profile.following} following.`
                        : `Network of ${profile?.followers ?? 0} followers and ${profile?.following ?? 0} following.`}
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard padding="lg" glow>
              <SectionHeader title="Contribution Activity" subtitle="Recent contribution grid" />
              {profile && profile.contributions.length > 0 ? (
                <ContributionActivity days={profile.contributions} className="mt-unit-md" />
              ) : (
                <div className="flex items-center justify-center py-8 text-sm text-on-surface-variant/50">
                  No contribution data available
                </div>
              )}
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard padding="lg" glow>
              <SectionHeader title="Repositories" subtitle={`${profile?.publicRepos ?? 0} public repositories`} />
              <div className="mt-unit-md space-y-unit-sm">
                {profile?.repositories.slice(0, 5).map((repo) => (
                  <a
                    key={repo.fullName}
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-unit-sm rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="material-symbols-outlined text-on-surface-variant/50 text-lg">code</span>
                      <div className="min-w-0">
                        <p className="text-sm text-on-surface truncate group-hover:text-primary transition-colors">{repo.name}</p>
                        {repo.description && (
                          <p className="text-xs text-on-surface-variant/50 truncate">{repo.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-on-surface-variant/50 shrink-0">
                      {repo.language && (
                        <span>{repo.language}</span>
                      )}
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">star</span>
                        {repo.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">call_split</span>
                        {repo.forks}
                      </span>
                    </div>
                  </a>
                ))}
                {(!profile?.repositories || profile.repositories.length === 0) && (
                  <p className="text-sm text-on-surface-variant/50 text-center py-4">No repositories found</p>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-gutter">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <GlassCard padding="lg" glow className="flex flex-col items-center">
              <DeveloperScore score={85} grade="S" size="lg" label="Developer Score" />
              <div className="grid grid-cols-2 gap-2 w-full mt-unit-md">
                <StatsCard label="Following" value={profile?.following ?? 0} icon="person_add" />
                <StatsCard label="Joined" value={profile?.createdAt ? new Date(profile.createdAt).getFullYear().toString() : "—"} icon="calendar_month" />
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard padding="lg" glow>
              <SectionHeader title="Skills & Languages" subtitle={profile?.languages.length ? `${profile.languages.length} languages` : "No data"} />
              {profile && profile.languages.length > 0 ? (
                <SkillsBar languages={profile.languages} className="mt-unit-md" />
              ) : (
                <p className="text-sm text-on-surface-variant/50 text-center py-4">No language data</p>
              )}
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard padding="lg" glow>
              <SectionHeader title="Quick Navigation" />
              <div className="mt-unit-md space-y-2">
                {[
                  { label: "Contribution Landscape", icon: "terrain", href: "/landscape", desc: "3D terrain view" },
                  { label: "Repository Universe", icon: "public", href: `/dashboard/visualization?username=${profile?.username}`, desc: "Orbital viz" },
                  { label: "Analytics Dashboard", icon: "analytics", href: `/dashboard/analytics?username=${profile?.username}`, desc: "Deep insights" },
                  { label: "Year Wrapped", icon: "all_inclusive", href: `/wrapped?username=${profile?.username}`, desc: "Developer story" },
                  { label: "Export Studio", icon: "file_present", href: "/export", desc: "Export your data" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
                  >
                    <span className="material-symbols-outlined text-primary/60 text-lg">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-on-surface group-hover:text-primary transition-colors">{item.label}</p>
                      <p className="text-[10px] text-on-surface-variant/50">{item.desc}</p>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant/30 text-sm group-hover:translate-x-0.5 transition-transform">chevron_right</span>
                  </Link>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {profile && profile.organizations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard padding="lg" glow>
                <SectionHeader title="Organizations" subtitle={`${profile.organizations.length} orgs`} />
                <div className="mt-unit-md flex flex-wrap gap-2">
                  {profile.organizations.map((org) => (
                    <div
                      key={org.login}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5"
                    >
                      <Image src={org.avatarUrl} alt={org.login} width={18} height={18} className="rounded-full" />
                      <span className="text-xs text-on-surface-variant">{org.login}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
