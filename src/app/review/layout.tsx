import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leave a Review",
  description:
    "Review a tradesperson on ProFind Guyana. Your honest review helps neighbours find trustworthy tradespeople.",
};

export default function ReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
