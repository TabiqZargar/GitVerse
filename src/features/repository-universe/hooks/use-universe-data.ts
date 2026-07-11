"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import type { Repository } from "@/features/github/types/domain";
import { adaptReposToBodies } from "../data-adapter";
import type { CelestialBody } from "../types";

export function useUniverseData(username?: string): {
  bodies: CelestialBody[] | undefined;
  isLoading: boolean;
} {
  const { user } = useAuth();
  const activeUser = username ?? user?.name ?? undefined;

  const { data: repos, isLoading } = useQuery({
    queryKey: ["universe", "repos", activeUser],
    queryFn: async () => {
      const endpoint = activeUser
        ? `/api/repositories?username=${encodeURIComponent(activeUser)}`
        : "/api/repositories";
      const res = await fetch(endpoint);
      const json: { data: Repository[] } = await res.json();
      return json.data;
    },
    enabled: !!activeUser,
    staleTime: 5 * 60 * 1000,
  });

  const bodies = useMemo(() => {
    if (!repos || repos.length === 0) return undefined;
    return adaptReposToBodies(repos);
  }, [repos]);

  return { bodies, isLoading };
}
