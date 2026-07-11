import { Suspense } from "react";
import { UniverseView } from "./universe-view";

export default function UniversePage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-[#050816]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    }>
      <UniverseView />
    </Suspense>
  );
}
