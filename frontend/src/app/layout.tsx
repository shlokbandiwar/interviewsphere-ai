import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "InterviewSphere AI — Master Your Interviews with AI",
    template: "%s | InterviewSphere AI",
  },
  description:
    "AI-powered mock interview platform with adaptive questioning, voice support, coding challenges, and real-time performance analytics. Practice with a human-like AI interviewer.",
  keywords: [
    "AI interview",
    "mock interview",
    "interview preparation",
    "coding interview",
    "behavioral interview",
    "system design interview",
    "technical interview",
  ],
  authors: [{ name: "InterviewSphere AI" }],
  openGraph: {
    type: "website",
    title: "InterviewSphere AI — Master Your Interviews with AI",
    description:
      "Practice realistic interviews with an AI that adapts to your level. Voice support, coding challenges, and detailed feedback.",
    siteName: "InterviewSphere AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "InterviewSphere AI",
    description: "AI-powered mock interview platform",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
