import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account — ReelVerse",
  description: "Join ReelVerse. Rent movies, buy them, or publish your own catalog.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
