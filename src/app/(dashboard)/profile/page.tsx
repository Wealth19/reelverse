"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  ShieldCheck,
  Calendar,
  Pencil,
  Loader2,
  KeyRound,
  Wallet,
  Sparkles,
  LogOut,
  ChevronRight,
  Clapperboard,
  Ticket,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { formatMoney, roleLabel } from "@/lib/format";
import { getProfile } from "@/services/user.service";
import { getWallet } from "@/services/wallet.service";
import { getMyPurchases, getMyRentals } from "@/services/library.service";
import { getMyMovies } from "@/services/movie.service";

import { Button } from "@/components/ui/button";

interface ProfileUser {
  id: number;
  name: string;
  email: string;
  role: "customer" | "producer" | "admin";
  created_at: string;
  updated_at?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUser, logout, loading: authLoading } = useAuth();

  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [activeRentals, setActiveRentals] = useState<number>(0);
  const [ownedCount, setOwnedCount] = useState<number>(0);
  const [authorStats, setAuthorStats] = useState<{
    uploadedCount: number;
    totalOrders: number;
    totalRevenue: number;
  }>({
    uploadedCount: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const userId = user?.id;

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        if (!userId) {
          setLoading(false);
          return;
        }

        const response = await getProfile();
        if (!active) return;

        const data: ProfileUser = response.data;
        setProfile(data);

        if (
          user &&
          (user.name !== data.name ||
            user.email !== data.email ||
            user.role !== data.role)
        ) {
          updateUser({
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role,
          });
        }

        if (data.role === "customer") {
          getWallet()
            .then((w) => {
              if (active) setWalletBalance(Number(w.balance || 0));
            })
            .catch(() => null);

          Promise.all([getMyRentals(), getMyPurchases()])
            .then(([rentals, purchases]) => {
              if (!active) return;
              setActiveRentals(
                rentals.filter((r) => r.status === "active").length,
              );
              setOwnedCount(purchases.length);
            })
            .catch(() => null);
        } else if (data.role === "producer") {
          getMyMovies()
            .then((movies) => {
              if (!active) return;
              let orders = 0;
              let revenue = 0;
              for (const m of movies) {
                orders +=
                  Number(m.rental_count || 0) + Number(m.purchase_count || 0);
                revenue += Number(m.total_revenue || 0);
              }
              setAuthorStats({
                uploadedCount: movies.length,
                totalOrders: orders,
                totalRevenue: revenue,
              });
            })
            .catch(() => null);
        }
      } catch (error: any) {
        console.error("PROFILE LOAD ERROR:", error);

        if (error.response?.status === 401) {
          router.push("/login");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    if (!authLoading) {
      void loadProfile();
    }

    return () => {
      active = false;
    };
  }, [userId, authLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (authLoading || loading) {
    return (
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
        <div className="h-52 animate-pulse rounded-3xl border border-[#2a241c] bg-[#141118]" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-24 animate-pulse rounded-2xl border border-[#2a241c] bg-[#141118]"
            />
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 py-4 text-sm text-[#b8ab98]">
          <Loader2 className="h-4 w-4 animate-spin text-[#d4a24c]" />
          Loading your profile...
        </div>
      </div>
    );
  }

  const displayUser = profile || user;

  if (!displayUser) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20">
        <div className="rounded-3xl border border-[#2a241c] bg-[#141118] p-10 text-center">
          <h1 className="text-2xl font-bold text-white">
            Authentication Required
          </h1>
          <p className="mt-2 text-sm text-[#cbbba4]">
            Please sign in to view and manage your ReelVerse profile.
          </p>
          <Button
            onClick={() => router.push("/login")}
            className="mt-6 cursor-pointer rounded-xl bg-[#d4a24c] px-6 text-[#08070b] hover:bg-amber-300"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const firstLetter = displayUser.name?.charAt(0).toUpperCase() || "U";

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Active Member";

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      {/* PAGE HEADER */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d4a24c]">
          Account & Identity
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">
          My Profile
        </h1>
        <p className="mt-2 text-sm text-[#cbbba4]">
          Manage your personal details, security credentials, and screening
          preferences.
        </p>
      </div>

      {/* HERO PROFILE BANNER */}
      <div className="relative mt-8 overflow-hidden rounded-3xl border border-[#2a241c] bg-linear-to-br from-[#1b1420] via-[#141118] to-[#0d0a10] p-6 sm:p-8 shadow-2xl">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#d4a24c]/10 blur-3xl" />

        <div className="relative flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
            <div className="relative">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#d4a24c] to-[#b8842f] text-4xl font-bold text-[#08070b] shadow-lg ring-4 ring-[#d4a24c]/20">
                {firstLetter}
              </div>
              <span
                className="absolute right-1 bottom-1 h-4 w-4 rounded-full border-2 border-[#141118] bg-emerald-400"
                title="Active account"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:justify-start">
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  {displayUser.name}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full border border-[#d4a24c]/30 bg-[#d4a24c]/10 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-[#d4a24c]">
                  <Sparkles className="h-3 w-3" />
                  {roleLabel(displayUser.role)}
                </span>
              </div>

              <p className="mt-1.5 text-sm text-[#cbbba4]">
                {displayUser.email}
              </p>

              <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#b8ab98]">
                <Calendar className="h-3.5 w-3.5 text-[#d4a24c]" />
                Member since {memberSince}
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
            <Button
              onClick={() => router.push("/profile/edit")}
              className="h-10 cursor-pointer rounded-xl bg-[#d4a24c] px-4 text-xs font-semibold text-[#08070b] transition hover:bg-amber-300"
            >
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Edit Profile
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/profile/change-password")}
              className="h-10 cursor-pointer rounded-xl border-[#2a241c] bg-[#08070b]/60 px-4 text-xs font-medium text-[#cbbba4] transition hover:border-[#d4a24c]/50 hover:text-white"
            >
              <KeyRound className="mr-2 h-3.5 w-3.5 text-[#d4a24c]" />
              Change Password
            </Button>
          </div>
        </div>
      </div>

      {/* ROLE-SPECIFIC QUICK STATS / SHORTCUTS */}
      {displayUser.role === "customer" && (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Link
            href="/wallet"
            className="group flex items-center justify-between rounded-2xl border border-[#2a241c] bg-[#141118] p-5 transition hover:border-[#d4a24c]/50 hover:bg-[#1b1522]/40"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#2a241c] bg-[#1b1522] text-[#d4a24c]">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-[#b8ab98]">Wallet Balance</p>
                <p className="mt-0.5 text-lg font-bold text-[#d4a24c]">
                  {walletBalance === null ? "—" : formatMoney(walletBalance)}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-[#b8ab98] transition group-hover:translate-x-0.5 group-hover:text-[#d4a24c]" />
          </Link>

          <Link
            href="/library"
            className="group flex items-center justify-between rounded-2xl border border-[#2a241c] bg-[#141118] p-5 transition hover:border-[#d4a24c]/50 hover:bg-[#1b1522]/40"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#2a241c] bg-[#1b1522] text-[#d4a24c]">
                <Ticket className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-[#b8ab98]">Active Rentals</p>
                <p className="mt-0.5 text-lg font-bold text-white">
                  {activeRentals}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-[#b8ab98] transition group-hover:translate-x-0.5 group-hover:text-[#d4a24c]" />
          </Link>

          <Link
            href="/library"
            className="group flex items-center justify-between rounded-2xl border border-[#2a241c] bg-[#141118] p-5 transition hover:border-[#d4a24c]/50 hover:bg-[#1b1522]/40"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#2a241c] bg-[#1b1522] text-[#d4a24c]">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-[#b8ab98]">Owned Movies</p>
                <p className="mt-0.5 text-lg font-bold text-white">
                  {ownedCount}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-[#b8ab98] transition group-hover:translate-x-0.5 group-hover:text-[#d4a24c]" />
          </Link>
        </div>
      )}

      {displayUser.role === "producer" && (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Link
            href="/studio"
            className="group flex items-center justify-between rounded-2xl border border-[#2a241c] bg-[#141118] p-5 transition hover:border-[#d4a24c]/50 hover:bg-[#1b1522]/40"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#2a241c] bg-[#1b1522] text-[#d4a24c]">
                <Clapperboard className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-[#b8ab98]">Videos Uploaded</p>
                <p className="mt-0.5 text-lg font-bold text-white">
                  {authorStats.uploadedCount}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-[#b8ab98] transition group-hover:translate-x-0.5 group-hover:text-[#d4a24c]" />
          </Link>

          <Link
            href="/studio"
            className="group flex items-center justify-between rounded-2xl border border-[#2a241c] bg-[#141118] p-5 transition hover:border-[#d4a24c]/50 hover:bg-[#1b1522]/40"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#2a241c] bg-[#1b1522] text-[#d4a24c]">
                <Ticket className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-[#b8ab98]">Rentals & Sales</p>
                <p className="mt-0.5 text-lg font-bold text-white">
                  {authorStats.totalOrders}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-[#b8ab98] transition group-hover:translate-x-0.5 group-hover:text-[#d4a24c]" />
          </Link>

          <Link
            href="/studio"
            className="group flex items-center justify-between rounded-2xl border border-[#2a241c] bg-[#141118] p-5 transition hover:border-[#d4a24c]/50 hover:bg-[#1b1522]/40"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#2a241c] bg-[#1b1522] text-[#d4a24c]">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-[#b8ab98]">Catalog Revenue</p>
                <p className="mt-0.5 text-lg font-bold text-[#d4a24c]">
                  {formatMoney(authorStats.totalRevenue)}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-[#b8ab98] transition group-hover:translate-x-0.5 group-hover:text-[#d4a24c]" />
          </Link>
        </div>
      )}

      {/* PERSONAL DETAILS */}
      <div className="mt-8 rounded-3xl border border-[#2a241c] bg-[#141118] p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Account Information
            </h3>
            <p className="mt-1 text-xs text-[#b8ab98]">
              Verified identity and membership details associated with your
              account.
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => router.push("/profile/edit")}
            className="cursor-pointer text-xs text-[#d4a24c] hover:bg-[#1b1522] hover:text-[#d4a24c]"
          >
            <Pencil className="mr-1.5 h-3.5 w-3.5" />
            Update
          </Button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {/* FULL NAME */}
          <div className="flex items-start gap-4 rounded-2xl border border-[#2a241c] bg-[#08070b]/50 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#2a241c] bg-[#1b1522] text-[#d4a24c]">
              <User className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#b8ab98]">Full Name</p>
              <p className="mt-1 truncate text-base font-semibold text-white">
                {displayUser.name}
              </p>
            </div>
          </div>

          {/* EMAIL */}
          <div className="flex items-start gap-4 rounded-2xl border border-[#2a241c] bg-[#08070b]/50 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#2a241c] bg-[#1b1522] text-[#d4a24c]">
              <Mail className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#b8ab98]">
                Email Address
              </p>
              <p className="mt-1 break-all text-base font-semibold text-white">
                {displayUser.email}
              </p>
            </div>
          </div>

          {/* ROLE */}
          <div className="flex items-start gap-4 rounded-2xl border border-[#2a241c] bg-[#08070b]/50 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#2a241c] bg-[#1b1522] text-[#d4a24c]">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#b8ab98]">Account Role</p>
              <p className="mt-1 capitalize text-base font-semibold text-white">
                {roleLabel(displayUser.role)}
              </p>
            </div>
          </div>

          {/* MEMBER SINCE */}
          <div className="flex items-start gap-4 rounded-2xl border border-[#2a241c] bg-[#08070b]/50 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#2a241c] bg-[#1b1522] text-[#d4a24c]">
              <Calendar className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#b8ab98]">Member Since</p>
              <p className="mt-1 text-base font-semibold text-white">
                {memberSince}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECURITY & QUICK ACTIONS */}
      <div className="mt-6 rounded-3xl border border-[#2a241c] bg-[#141118] p-6 sm:p-8">
        <h3 className="text-lg font-semibold text-white">
          Security & Account Actions
        </h3>
        <p className="mt-1 text-xs text-[#b8ab98]">
          Keep your account protected or manage your current session.
        </p>

        <div className="mt-5 divide-y divide-[#2a241c] rounded-2xl border border-[#2a241c] bg-[#08070b]/40">
          <div className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#2a241c] bg-[#1b1522] text-[#d4a24c]">
                <KeyRound className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Password & Authentication
                </p>
                <p className="text-xs text-[#b8ab98]">
                  Update your password regularly to keep your account secure.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/profile/change-password")}
              className="h-9 cursor-pointer rounded-xl border-[#2a241c] bg-[#141118] text-xs text-[#cbbba4] hover:border-[#d4a24c]/50 hover:text-white"
            >
              Change Password
            </Button>
          </div>

          <div className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                <LogOut className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Sign Out</p>
                <p className="text-xs text-[#b8ab98]">
                  End your active session on this browser.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="h-9 cursor-pointer rounded-xl border-amber-500/30 bg-amber-500/10 text-xs text-amber-400 hover:bg-amber-500/20 hover:text-amber-300"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
