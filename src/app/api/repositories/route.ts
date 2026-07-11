import { NextRequest } from "next/server";
import { createServices, getGitHubToken } from "@/features/github/services";
import { apiSuccessResponse, apiErrorResponse } from "@/lib/api-error";
import { refreshQuerySchema, safeParseQuery } from "@/lib/api-query-schemas";

const GITHUB_API = "https://api.github.com";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const { refresh: forceRefresh } = safeParseQuery(refreshQuerySchema, searchParams);

    let token: string | null = null;
    try {
      token = await getGitHubToken();
    } catch {
      // OAuth optional
    }

    if (token) {
      const services = createServices(token);
      const repos = await services.repository.getRepositories(forceRefresh);
      return apiSuccessResponse(repos);
    }

    if (!username) {
      return apiErrorResponse(new Error("Username required"));
    }

    const res = await fetch(`${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated`, {
      headers: { Accept: "application/vnd.github.v3+json" },
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      return apiErrorResponse(new Error("User not found or API rate limited"));
    }
    const repos = await res.json();
    return apiSuccessResponse(repos);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
