import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request a Free Quote",
  description:
    "Describe your job and get free quotes from rated tradespeople across Guyana. No sign-up needed, no obligation — pros contact you directly via WhatsApp.",
};

export default function RequestQuoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
