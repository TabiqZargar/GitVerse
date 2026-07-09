/**
 * GET /api/github/contributions (legacy — prefer /api/contributions)
 *
 * Returns contribution calendar data.
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
