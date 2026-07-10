"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { ProfileHero } from "./profile-hero";
import { ProfileSummary } from "./profile-summary";
import { ProfileRepos } from "./profile-repos";
import { ProfileAchievements } from "./profile-achievements";
import { ProfileScore } from "./profile-score";
import { ProfileWrapped } from "./profile-wrapped";
import type { ProfileData } from "@/features/export/types";

interface PublicProfilePageProps {
  username: string;
}

export function PublicProfilePage({ username }: PublicProfilePageProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["public-profile", username],
    queryFn: async () => {
      const res = await apiClient.get<{ data: ProfileData }>(
        `/profile/${encodeURIComponent(username)}`
      );
      if (!res.success) throw new Error(res.error.message);
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-lg font-semibold text-destructive">Profile not found</p>
          <p className="text-sm text-muted-foreground">
            This user does not exist or has no public data.
          </p>
          <Link href="/" className="text-sm text-chart-1 hover:underline">
            Go home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <ProfileHero profile={data} />
      <ProfileSummary stats={data.stats} />
      <ProfileScore score={data.stats.developerScore} grade={data.stats.developerGrade} />
      <ProfileRepos repos={data.topRepos} />
      <ProfileAchievements achievements={data.achievements} />
      <ProfileWrapped username={username} />
    </div>
  );
}
