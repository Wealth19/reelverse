"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  ShieldCheck,
  Calendar,
  Pencil,
  Loader2,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { getProfile } from "@/services/user.service";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileUser {
  id: number;
  name: string;
  email: string;
  role: "customer" | "producer";
  created_at: string;
}

export default function ProfilePage() {
  const router = useRouter();

  const { user, updateUser, loading: authLoading } = useAuth();

  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        const response = await getProfile();

        setProfile(response.data);

        /*
         * Keep AuthContext synchronized with the latest
         * backend user information.
         */
        updateUser({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
        });
      } catch (error: any) {
        console.error("PROFILE LOAD ERROR:", error);

        if (error.response?.status === 401) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadProfile();
    }
  }, [user, authLoading, updateUser, router]);

  // AUTH IS STILL RESTORING
  if (authLoading || loading) {
    return (
      <main className="mx-auto flex max-w-5xl justify-center px-6 py-20">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading profile...
        </div>
      </main>
    );
  }

  // NOT AUTHENTICATED
  if (!user || !profile) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-20">
        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardContent className="flex flex-col items-center p-10 text-center">
            <h1 className="mb-3 text-2xl font-bold">Authentication Required</h1>

            <p className="mb-6 text-slate-400">
              Please log in to view your profile.
            </p>

            <Button
              onClick={() => router.push("/login")}
              className="bg-red-600 hover:bg-red-700"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const firstLetter = profile.name?.charAt(0).toUpperCase();

  const memberSince = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <Card className="border-slate-800 bg-slate-900 text-white">
        {/* PROFILE HEADER */}
        <CardHeader className="flex flex-col items-center space-y-4">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-red-600 text-5xl font-bold">
            {firstLetter}
          </div>

          <div className="text-center">
            <CardTitle className="text-3xl">{profile.name}</CardTitle>

            <p className="mt-2 text-slate-400">{profile.email}</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* PROFILE INFORMATION */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* NAME */}
            <div className="rounded-xl border border-slate-800 p-5">
              <div className="mb-3 flex items-center gap-3">
                <User className="text-red-500" />

                <span className="font-semibold">Full Name</span>
              </div>

              <p>{profile.name}</p>
            </div>

            {/* EMAIL */}
            <div className="rounded-xl border border-slate-800 p-5">
              <div className="mb-3 flex items-center gap-3">
                <Mail className="text-red-500" />

                <span className="font-semibold">Email</span>
              </div>

              <p className="break-all">{profile.email}</p>
            </div>

            {/* ROLE */}
            <div className="rounded-xl border border-slate-800 p-5">
              <div className="mb-3 flex items-center gap-3">
                <ShieldCheck className="text-red-500" />

                <span className="font-semibold">Role</span>
              </div>

              <p className="capitalize">{profile.role}</p>
            </div>

            {/* MEMBER SINCE */}
            <div className="rounded-xl border border-slate-800 p-5">
              <div className="mb-3 flex items-center gap-3">
                <Calendar className="text-red-500" />

                <span className="font-semibold">Member Since</span>
              </div>

              <p>{memberSince}</p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              onClick={() => router.push("/profile/edit")}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/profile/change-password")}
              className="border-slate-700 cursor-pointer"
            >
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
