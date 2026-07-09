import { apiClient } from "@/lib/api-client";
import type { ContributionCalendar } from "../types";

export async function fetchContributions(username: string, year?: number) {
  const params = new URLSearchParams({ username });
  if (year) params.set("year", String(year));

  return apiClient.get<ContributionCalendar>(`/github/contributions?${params.toString()}`);
}
