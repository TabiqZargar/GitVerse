import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GitVerse",
  description: "Visualize your GitHub contributions in a whole new dimension",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className + " bg-background text-foreground antialiased"}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
