import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/components/providers";
import { AppShell } from "@/components/layout/AppShell";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  metadataBase: new URL("https://gitverse.dev"),
  title: {
    default: "GitVerse",
    template: "%s | GitVerse",
  },
  description: "Visualize your GitHub contributions in a whole new dimension",
  openGraph: {
    title: "GitVerse",
    description: "Visualize your GitHub contributions in a whole new dimension",
    type: "website",
    siteName: "GitVerse",
  },
  twitter: {
    card: "summary_large_image",
    title: "GitVerse",
    description: "Visualize your GitHub contributions in a whole new dimension",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className + " bg-background text-on-surface antialiased"}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
