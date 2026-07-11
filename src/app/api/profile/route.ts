import { createServices } from "@/features/github/services";
import { getGitHubToken } from "@/features/github/services/token";
import { apiSuccessResponse, apiErrorResponse } from "@/lib/api-error";

export async function GET() {
  try {
    const token = await getGitHubToken();
    const services = createServices(token);
    const profile = await services.user.getProfile();
    return apiSuccessResponse(profile);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
