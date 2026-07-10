"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api-client";

interface ShareButtonProps {
  userId: string;
  type: "profile-snapshot" | "achievement" | "wrapped" | "streak";
  data: Record<string, unknown>;
  label?: string;
}

export function ShareButton({ userId, type, data, label = "Share" }: ShareButtonProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [copying, setCopying] = useState(false);

  const handleCreate = async () => {
    const res = await apiClient.post<{ url: string }>("/share", { userId, type, data });
    if (res.success) {
      setUrl(res.data.url);
      setCopying(false);
    }
  };

  const handleCopy = async () => {
    if (!url) return;
    setCopying(true);
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${url}`);
      setTimeout(() => setCopying(false), 1500);
    } catch {
      setCopying(false);
    }
  };

  if (url) {
    return (
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-2 rounded-xl border border-glass-border bg-glass px-4 py-2 text-sm transition-all hover:bg-glass/80"
      >
        {copying ? "Copied!" : "Copy link"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCreate}
      className="inline-flex items-center gap-2 rounded-xl border border-glass-border bg-glass px-4 py-2 text-sm transition-all hover:bg-glass/80"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" x2="12" y1="2" y2="15" />
      </svg>
      {label}
    </button>
  );
}
