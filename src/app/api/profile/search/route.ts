import { NextRequest, NextResponse } from "next/server";

const GITHUB_API = "https://api.github.com";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  if (!q || typeof q !== "string") {
    return NextResponse.json({ data: [] });
  }

  try {
    const res = await fetch(`${GITHUB_API}/search/users?q=${encodeURIComponent(q)}&per_page=5`, {
      headers: { Accept: "application/vnd.github.v3+json" },
      next: { revalidate: 30 },
    });
    if (!res.ok) {
      return NextResponse.json({ data: [] });
    }

    const body = await res.json();
    const items = (body.items ?? []).map((u: { login: string; avatar_url: string; type: string }) => ({
      username: u.login,
      avatarUrl: u.avatar_url,
      type: u.type,
    }));

    return NextResponse.json({ data: items.slice(0, 5) });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
