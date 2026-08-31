import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getDbShape } from "@/lib/db/repo";
import { baseMetadata } from "@/lib/seo";
import "./globals.css";
import { SkipLink } from "@/components/layout/SkipLink";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const db = await getDbShape();
  return baseMetadata(db.site, db.profile);
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0c",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const db = await getDbShape();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      style={{ "--color-accent": db.site.accentColor } as React.CSSProperties}
    >
      <body className="min-h-screen bg-background font-sans text-foreground">
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
