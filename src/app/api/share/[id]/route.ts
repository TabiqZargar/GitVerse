import { NextRequest, NextResponse } from "next/server";
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
      return NextResponse.json(
        { code: "NOT_FOUND", message: "Share not found", status: 404 },
        { status: 404 }
      );
    }
    return apiSuccessResponse(data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
