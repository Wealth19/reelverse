"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/navbar/Navbar";
import { useAuth } from "@/context/AuthContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated, loading } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-lg">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navbar />

      <main className="pt-24">{children}</main>
    </>
  );
}
