import { apiClient } from "@/lib/api-client";
import type { GitHubRepo } from "../types";

export async function fetchUserRepos(username: string) {
  return apiClient.get<GitHubRepo[]>(`/github/repos?username=${encodeURIComponent(username)}`);
}

export async function fetchRepoDetails(owner: string, repo: string) {
  return apiClient.get<GitHubRepo>(`/github/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`);
}
