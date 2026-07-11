import { Metadata } from "next";
import { ExportContent } from "./export-content";

export const metadata: Metadata = {
  title: "Export Studio",
  description: "Create and export beautiful visuals of your developer identity",
};

export default function ExportPage() {
  return <ExportContent />;
}
