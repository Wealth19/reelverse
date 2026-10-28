import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReelVerse — Sign In",
  description: "Sign in or create an account on ReelVerse.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
