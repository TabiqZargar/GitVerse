"use client";

import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const WrappedEngine = dynamic(
  () => import("@/features/wrapped/components/wrapped-engine").then((mod) => ({ default: mod.WrappedEngine })),
  { ssr: false }
);

export function WrappedContent() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  return <WrappedEngine username={username ?? undefined} />;
}
