import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In",
  description:
    "Log in to your ProFind Guyana account to manage your tradesperson profile, view analytics, and connect with customers.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
