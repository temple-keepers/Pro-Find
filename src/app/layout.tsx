import type { Metadata } from "next";
import { DM_Serif_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/components/auth/AuthContext";

const displayFont = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://profindguyana.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ProFind Guyana — Find Trusted Tradespeople",
    template: "%s | ProFind Guyana",
  },
  description:
    "Find rated, reviewed plumbers, electricians, AC techs, carpenters, masons, painters, welders and mechanics in Georgetown and across Guyana. One tap to WhatsApp.",
  keywords: [
    "Guyana",
    "Georgetown",
    "plumber",
    "electrician",
    "AC technician",
    "carpenter",
    "mason",
    "painter",
    "welder",
    "mechanic",
    "trades",
    "contractor",
    "home repair",
    "ProFind",
  ],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ProFind",
  },
  openGraph: {
    title: "ProFind Guyana — Find Trusted Tradespeople",
    description:
      "Find rated, reviewed tradespeople in Georgetown and across Guyana. One tap to WhatsApp.",
    type: "website",
    locale: "en_GY",
    siteName: "ProFind Guyana",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "ProFind Guyana — Find Trusted Tradespeople",
    description:
      "Find rated, reviewed tradespeople in Georgetown. One tap to WhatsApp.",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="font-body min-h-screen flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:bg-brand-green-500 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold"
        >
          Skip to main content
        </a>
        <AuthProvider>
          <Header />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
