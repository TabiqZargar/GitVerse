/**
 * GET /api/repositories
 *
 * Returns the authenticated user's GitHub repositories with metadata.
 *
 * Query params:
 *   refresh — set to "true" to bypass cache
 *
 * Response shape:
 * {
 *   data: Repository[]
 * }
 *
 * Powers the repository list, language breakdown, and flow map features.
 */

import { NextRequest } from "next/server";
import { createServices, getGitHubToken } from "@/features/github/services";
import { apiSuccessResponse, apiErrorResponse } from "@/lib/api-error";
import { refreshQuerySchema, safeParseQuery } from "@/lib/api-query-schemas";

export async function GET(request: NextRequest) {
  try {
    const token = await getGitHubToken();
    const services = createServices(token);

    const { searchParams } = new URL(request.url);
    const { refresh: forceRefresh } = safeParseQuery(refreshQuerySchema, searchParams);

    const repos = await services.repository.getRepositories(forceRefresh);

    return apiSuccessResponse(repos);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
