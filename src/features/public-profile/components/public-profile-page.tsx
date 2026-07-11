"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useProfileStore } from "@/features/profile/store/profile-store";
import { ProfileHero } from "./profile-hero";
import { ProfileSummary } from "./profile-summary";
import { ProfileRepos } from "./profile-repos";
import { ProfileAchievements } from "./profile-achievements";
import { ProfileScore } from "./profile-score";
import { ProfileWrapped } from "./profile-wrapped";

interface PublicProfilePageProps {
  username: string;
}

export function PublicProfilePage({ username }: PublicProfilePageProps) {
  const { profile, isLoading, error, fetchProfile } = useProfileStore();

  useEffect(() => {
    fetchProfile(username);
  }, [username, fetchProfile]);

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

  if (error || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-lg font-semibold text-destructive">Profile not found</p>
          <p className="text-sm text-muted-foreground">
            This user does not exist or has no public data.
          </p>
          <Link href="/" className="text-sm text-chart-1 hover:underline">Go home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <ProfileHero profile={profile} />
      <ProfileSummary profile={profile} />
      <ProfileScore profile={profile} />
      <ProfileRepos repos={profile.pinnedRepositories} />
      <ProfileAchievements />
      <ProfileWrapped username={profile.username} />
    </div>
  );
}
