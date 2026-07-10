"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { DeveloperSummary } from "../types";

export function useAnalytics(username: string | undefined) {
  return useQuery({
    queryKey: ["analytics", "summary", username],
    queryFn: () =>
      apiClient.get<DeveloperSummary>(`/analytics/summary?username=${encodeURIComponent(username!)}`),
    enabled: !!username,
  });
}
