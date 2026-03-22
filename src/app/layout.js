import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "../contexts/Providers";
import { CommandPalette } from "@/components/common/CommandPalette";

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

export const metadata = {
  title: "Bharat-Insight | Analytics Platform",
  description: "High-performance multi-tenant analytics platform for massive Indian public datasets. Built with Next.js 16, Supabase, and AI-powered insights.",
  keywords: ["Bharat-Insight", "analytics", "India", "public data", "dashboard", "multi-tenant", "AI insights"],
  authors: [{ name: "Bharat-Insight Team" }],
  openGraph: {
    title: "Bharat-Insight | Analytics Platform",
    description: "High-performance multi-tenant analytics for Indian public data.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f1117",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} data-scroll-behavior="smooth">
      <body suppressHydrationWarning>
        <Providers>
          {children}
          <CommandPalette />
        </Providers>
      </body>
    </html>
  );
}
