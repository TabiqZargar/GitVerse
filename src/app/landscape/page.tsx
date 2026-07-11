import { Metadata } from "next";
import { Suspense } from "react";
import { LandscapeContent } from "./landscape-content";

export const metadata: Metadata = {
  title: "Contribution Landscape",
  description: "Explore your contribution history in a 3D landscape",
};

export default function LandscapePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LandscapeContent />
    </Suspense>
  );
}
