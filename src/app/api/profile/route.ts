/**
 * GET /api/profile
 *
 * Returns the authenticated user's GitHub profile and contribution summary.
 *
 * Response shape:
 * {
 *   data: DeveloperProfile
 * }
 *
 * This is the primary endpoint for the dashboard header / user card.
 */

import { createServices, getGitHubToken } from "@/features/github/services";
import { auth } from "@/lib/auth";
import { apiSuccessResponse, apiErrorResponse } from "@/lib/api-error";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return apiErrorResponse(new Error("Not authenticated"));
    }

    const token = await getGitHubToken();
    const services = createServices(token);
    const profile = await services.user.getProfile();

    return apiSuccessResponse(profile);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
