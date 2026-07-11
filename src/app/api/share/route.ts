import { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { apiSuccessResponse, apiErrorResponse } from "@/lib/api-error";
import { createShareLink, type ShareContentType } from "@/features/share/engine/share-engine";

const shareSchema = z.object({
  type: z.string().min(1, "Type is required"),
  data: z.record(z.unknown()),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return apiErrorResponse(new Error("Unauthorized"));
    }

    const body = await request.json();
    const parsed = shareSchema.safeParse(body);
    if (!parsed.success) {
      return apiErrorResponse(new Error(parsed.error.errors[0]?.message ?? "Invalid request body"));
    }

    const { type, data } = parsed.data as { type: ShareContentType; data: Record<string, unknown> };
    const result = await createShareLink({
      userId: session.user.id,
      type,
      data,
    });
    return apiSuccessResponse(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
