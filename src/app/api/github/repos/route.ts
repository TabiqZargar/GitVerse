/**
 * GET /api/github/repos (legacy — prefer /api/repositories)
 *
 * Returns the authenticated user's repositories.
 * Maintained for backward compatibility with existing hooks.
 */

import { NextRequest } from "next/server";
import { createServices, getGitHubToken } from "@/features/github/services";
import { apiSuccessResponse, apiErrorResponse } from "@/lib/api-error";

export async function GET(request: NextRequest) {
  try {
    const token = await getGitHubToken();
    const services = createServices(token);

    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get("refresh") === "true";

    const repos = await services.repository.getRepositories(forceRefresh);
    return apiSuccessResponse(repos);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
