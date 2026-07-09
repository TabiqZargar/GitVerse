"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchContributions } from "../api/contributions";

export function useContributions(username: string | undefined, year?: number) {
  return useQuery({
    queryKey: ["github", "contributions", username, year],
    queryFn: () => fetchContributions(username!, year),
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
  });
}
