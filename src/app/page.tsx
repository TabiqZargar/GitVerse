import type { Metadata } from "next";
import { LandingContent } from "./landing-content";

export const metadata: Metadata = {
  title: "Explore Your Coding Universe",
  description:
    "Every commit tells a story. Watch yours come alive through high-fidelity visualizations, deep repository insights, and an immersive developer identity experience.",
};

export default function LandingPage() {
  return <LandingContent />;
}
