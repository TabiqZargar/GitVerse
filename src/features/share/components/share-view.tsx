"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { ShareContentType } from "../engine/share-engine";

interface ShareData {
  type: ShareContentType;
  data: Record<string, unknown>;
  createdAt: string;
  views: number;
}

interface ShareViewProps {
  id: string;
}

export function ShareView({ id }: ShareViewProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["share", id],
    queryFn: async () => {
      const res = await apiClient.get<{ data: ShareData }>(`/share/${id}`);
      if (!res.success) throw new Error(res.error.message);
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-semibold text-destructive">Share link not found or expired</p>
      </div>
    );
  }

  // Render based on content type
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <div className="rounded-xl border border-glass-border bg-glass p-6 text-center">
        <p className="text-2xl font-bold">
          {data.type === "achievement" ? "🏆" : data.type === "wrapped" ? "🎁" : "📊"}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {data.type.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
        </p>
        <p className="mt-1 text-xs text-muted-foreground/60">{data.views} views</p>
      </div>
      <pre className="rounded-xl border border-glass-border bg-glass p-4 text-xs text-muted-foreground overflow-auto max-h-96">
        {JSON.stringify(data.data, null, 2)}
      </pre>
    </div>
  );
}
