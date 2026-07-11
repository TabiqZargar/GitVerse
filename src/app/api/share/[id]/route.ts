import { NextRequest } from "next/server";
import { apiSuccessResponse, apiErrorResponse } from "@/lib/api-error";
import { getShareData } from "@/features/share/engine/share-engine";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await getShareData(id);
    if (!data) {
      return apiErrorResponse(new Error("Share not found"));
    }
    return apiSuccessResponse(data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
