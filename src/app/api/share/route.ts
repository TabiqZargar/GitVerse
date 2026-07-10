import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createShareLink } from "@/features/share/engine/share-engine";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  }

  try {
    const { type, data } = await request.json();
    const result = await createShareLink({
      userId: session.user.id,
      type,
      data,
    });
    return NextResponse.json({ data: result });
  } catch {
    return NextResponse.json({ error: { message: "Failed to create share link" } }, { status: 500 });
  }
}
