import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Tradespeople — Search Plumbers, Electricians & More",
  description:
    "Search rated and reviewed tradespeople across Georgetown and Guyana. Filter by trade, area, and availability. One tap to WhatsApp them directly.",
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
