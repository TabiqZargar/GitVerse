"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { DeveloperSummary } from "@/features/analytics/types";

export function useWrappedAnalytics(username: string | undefined) {
  return useQuery({
    queryKey: ["wrapped", "analytics", username],
    queryFn: async () => {
      const res = await apiClient.get<{ data: DeveloperSummary }>(
        `/analytics?username=${encodeURIComponent(username ?? "")}`
      );
      if (!res.success) throw new Error(res.error.message);
      return res.data.data;
    },
    enabled: !!username,
    staleTime: 30 * 60 * 1000,
  });
}
