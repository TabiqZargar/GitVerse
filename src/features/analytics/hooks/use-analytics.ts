"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { DeveloperSummary } from "../types";

export function useAnalytics(username: string | undefined) {
  return useQuery({
    queryKey: ["analytics", username],
    queryFn: async () => {
      const endpoint = username
        ? `/analytics?username=${encodeURIComponent(username)}`
        : "/analytics";
      const res = await apiClient.get<DeveloperSummary>(endpoint);
      if (!res.success) throw new Error(res.error.message);
      return res.data;
    },
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
  });
}
