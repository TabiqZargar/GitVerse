import { NextRequest, NextResponse } from "next/server";
import { getShareData } from "@/features/share/engine/share-engine";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await getShareData(id);
    if (!data) {
      return NextResponse.json({ data: null });
    }
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: { message: "Failed to fetch share" } }, { status: 500 });
  }
}
