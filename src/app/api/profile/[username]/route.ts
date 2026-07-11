import { NextRequest, NextResponse } from "next/server";
import { apiSuccessResponse, apiErrorResponse } from "@/lib/api-error";
import { fetchProfileData } from "@/features/public-profile/api/[username]/route";
import { getGitHubToken } from "@/features/github/services";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    // Validate the token is present (user is authenticated)
    await getGitHubToken();

    const data = await fetchProfileData(username);
    if (!data) {
      return NextResponse.json(
        { code: "NOT_FOUND", message: "User not found", status: 404 },
        { status: 404 }
      );
    }

    return apiSuccessResponse(data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
