"use client";

import dynamic from "next/dynamic";

const WrappedEngine = dynamic(
  () => import("@/features/wrapped/components/wrapped-engine").then((mod) => ({ default: mod.WrappedEngine })),
  { ssr: false }
);

export default function WrappedPage() {
  return <WrappedEngine />;
}
