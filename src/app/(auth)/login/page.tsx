import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In — ReelVerse",
  description: "Sign in to your ReelVerse account to rent, buy and enjoy movies.",
};

export default function LoginPage() {
  return <LoginForm />;
}
