import type { Metadata } from "next";
import { Inter, Anek_Latin } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { StickyBar } from "@/components/sticky-bar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { StructuredData } from "@/components/structured-data";
import { WaitlistModalProvider } from "@/components/waitlist-modal";

const anekLatin = Anek_Latin({
  variable: "--font-anek",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://getshift.co";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Shift - AI Career Matching | Find Jobs You're Already Qualified For",
    template: "%s | Shift",
  },
  description:
    "Discover careers you're already qualified for with AI-powered matching. Upload your resume, get personalized job matches, and receive a 90-day action plan to land your next role.",
  keywords: [
    "career matching",
    "AI career advisor",
    "job matching",
    "career change",
    "career pivot",
    "resume analysis",
    "career planning",
    "job search",
    "career transition",
    "skills assessment",
    "career roadmap",
    "professional development",
  ],
  authors: [{ name: "WhatMatters" }],
  creator: "WhatMatters",
  publisher: "WhatMatters",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Shift",
    title: "Shift - AI Career Matching | Find Jobs You're Already Qualified For",
    description:
      "Discover careers you're already qualified for with AI-powered matching. Get a personalized 90-day action plan to land your next role.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Shift - AI-Powered Career Matching Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shift - AI Career Matching | Find Jobs You're Already Qualified For",
    description:
      "Discover careers you're already qualified for with AI-powered matching. Get a personalized 90-day action plan.",
    images: ["/og-image.png"],
    creator: "@randydigital",
    site: "@randydigital",
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${anekLatin.variable} ${inter.variable} antialiased`} suppressHydrationWarning>
        <StructuredData />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <WaitlistModalProvider>
            {/* <StickyBar /> */}
            <Navbar />
            <main className="bg-background text-foreground">{children}</main>
            <Footer />
          </WaitlistModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
