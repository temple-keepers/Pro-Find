import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Claim Your Free Profile",
  description:
    "Create your free tradesperson profile on ProFind Guyana. Get found by customers, collect reviews, and grow your business.",
};

export default function ClaimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
