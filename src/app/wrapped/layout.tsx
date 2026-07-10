import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "GitVerse Wrapped — Your Developer Year",
  description:
    "An immersive, Spotify Wrapped-style narrative of your developer journey — contributions, languages, milestones, and more.",
};

export default function WrappedLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <style>{`body { margin: 0; overflow: hidden; }`}</style>
      </head>
      <body className="bg-background text-foreground">{children}</body>
    </html>
  );
}
