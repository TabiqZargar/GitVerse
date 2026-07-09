"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchUserRepos } from "../api/repos";

export function useRepos(username: string | undefined) {
  return useQuery({
    queryKey: ["github", "repos", username],
    queryFn: () => fetchUserRepos(username!),
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
  });
}
