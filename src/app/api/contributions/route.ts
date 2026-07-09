/**
 * GET /api/contributions
 *
 * Returns the contribution calendar for the authenticated user or a specified user.
 *
 * Query params:
 *   username  — GitHub login (defaults to authenticated user)
 *   year      — Calendar year (defaults to current year)
 *
 * Response shape:
 * {
 *   data: ContributionStats
 * }
 *
 * Used by the contribution graph, 3D landscape, and timeline features.
 */

import { NextRequest } from "next/server";
import { createServices, getGitHubToken } from "@/features/github/services";
import { apiSuccessResponse, apiErrorResponse } from "@/lib/api-error";

export async function GET(request: NextRequest) {
  try {
    const token = await getGitHubToken();
    const services = createServices(token);

    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const yearParam = searchParams.get("year");

    const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();
    const login = username ?? (await services.user.getProfile()).login;

    const contributions = await services.contribution.getContributions(login, year);

    return apiSuccessResponse(contributions);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
