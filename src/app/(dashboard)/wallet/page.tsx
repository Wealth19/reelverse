"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { isAxiosError } from "axios";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Film,
  Library,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { formatMoney } from "@/lib/format";
import {
  getWallet,
  getWalletHistory,
  initializeWalletPayment,
  verifyWalletPayment,
  type WalletHistoryItem,
} from "@/services/wallet.service";

const QUICK_AMOUNTS = [1000, 2500, 5000, 10000, 25000];

export default function WalletPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState<WalletHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [funding, setFunding] = useState(false);
  const [filter, setFilter] = useState<"all" | "credit" | "debit">("all");

  const { register, handleSubmit, reset, setValue, watch } = useForm<{
    amount: number;
  }>();

  const watchedAmount = watch("amount");

  const load = async (silent = false) => {
    try {
      if (silent) setRefreshing(true);

      const pendingRef =
        typeof window !== "undefined"
          ? localStorage.getItem("pendingPaymentRef")
          : null;

      if (pendingRef) {
        try {
          const verified = await verifyWalletPayment(pendingRef);
          if (verified.paymentStatus === "PAID" && verified.walletCredited) {
            localStorage.removeItem("pendingPaymentRef");
          }
        } catch {
          // Backend getWallet() also reconciles pending payments automatically
        }
      }

      const [wallet, items] = await Promise.all([
        getWallet(),
        getWalletHistory(),
      ]);
      setBalance(Number(wallet.balance));
      setHistory(items);
    } catch {
      toast.error("Could not load wallet.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.role === "producer") {
      setLoading(false);
      return;
    }

    const paymentStatus = searchParams.get("payment");
    const amountParam = searchParams.get("amount");

    if (paymentStatus === "success") {
      if (typeof window !== "undefined") {
        localStorage.removeItem("pendingPaymentRef");
      }
      toast.success(
        amountParam
          ? `Payment of ${formatMoney(amountParam)} verified! Your wallet has been credited.`
          : "Payment verified! Your wallet has been credited.",
      );
      router.replace("/wallet");
    } else if (paymentStatus === "pending") {
      toast.info("Verifying your payment with Monnify...");
      router.replace("/wallet");
    }

    void load();
  }, [searchParams, router, user?.role]);

  const stats = useMemo(() => {
    let totalCredited = 0;
    let totalDebited = 0;
    for (const item of history) {
      const amt = Number(item.amount || 0);
      if (item.transaction_type === "credit") {
        totalCredited += amt;
      } else {
        totalDebited += amt;
      }
    }
    return {
      totalCredited,
      totalDebited,
      count: history.length,
    };
  }, [history]);

  const filteredHistory = useMemo(() => {
    if (filter === "all") return history;
    return history.filter((item) => item.transaction_type === filter);
  }, [history, filter]);

  const onDeposit = handleSubmit(async ({ amount }) => {
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      toast.error("Please enter a valid amount to fund.");
      return;
    }

    try {
      setFunding(true);
      const payment = await initializeWalletPayment(numAmount);
      if (!payment.checkoutUrl) {
        throw new Error("Payment provider did not return a checkout link.");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "pendingPaymentRef",
          payment.transactionReference || payment.paymentReference,
        );
      }

      toast.success("Opening Monnify checkout...");
      reset();
      window.location.assign(payment.checkoutUrl);
    } catch (error: unknown) {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(message || "Could not start wallet funding.");
    } finally {
      setFunding(false);
    }
  });

  if (user?.role === "producer") {
    return (
      <div className="mx-auto max-w-3xl px-6 py-14">
        <div className="rounded-3xl border border-[#2a241c] bg-[#141118] p-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            Wallet is for customers
          </h1>
          <p className="mt-3 text-sm text-[#cbbba4]">
            Author accounts publish movies and track catalog revenue in Studio.
          </p>
          <Link
            href="/studio"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#d4a24c] px-5 py-2.5 text-xs font-semibold text-[#08070b] transition hover:bg-amber-300"
          >
            Open Author Studio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d4a24c]">
            Purse & Payments
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">
            My Wallet
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[#cbbba4]">
            Top up your ReelVerse balance securely to rent or purchase titles
            instantly from the catalog.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/movies"
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#2a241c] bg-[#141118] px-3.5 text-xs font-medium text-[#cbbba4] transition hover:border-[#d4a24c]/50 hover:text-white"
          >
            <Film className="h-3.5 w-3.5 text-[#d4a24c]" />
            Browse Catalog
          </Link>
          <Link
            href="/library"
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#2a241c] bg-[#141118] px-3.5 text-xs font-medium text-[#cbbba4] transition hover:border-[#d4a24c]/50 hover:text-white"
          >
            <Library className="h-3.5 w-3.5 text-[#d4a24c]" />
            My Library
          </Link>
        </div>
      </div>

      {/* MAIN GRID: BALANCE CARD + TOP-UP FORM */}
      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        {/* AVAILABLE BALANCE CARD */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#2a241c] bg-linear-to-br from-[#1b1420] via-[#141118] to-[#0d0a10] p-8 shadow-2xl lg:col-span-7">
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#d4a24c]/10 blur-3xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d4a24c]/30 bg-[#d4a24c]/10 px-3 py-1 text-xs font-medium text-[#d4a24c]">
                <Sparkles className="h-3 w-3" />
                ReelVerse Purse
              </span>
              <p className="mt-5 text-sm font-medium text-[#b8ab98]">
                Available Balance
              </p>
              <p className="mt-2 text-5xl font-bold tracking-tight text-white sm:text-6xl">
                {loading ? (
                  <span className="inline-block h-14 w-48 animate-pulse rounded-xl bg-white/5" />
                ) : (
                  <span className="text-[#d4a24c]">{formatMoney(balance)}</span>
                )}
              </p>
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#2a241c] bg-[#08070b]/60 text-[#d4a24c] shadow-inner">
              <Wallet className="h-6 w-6" />
            </div>
          </div>

          <div className="relative mt-10 grid grid-cols-3 gap-4 border-t border-[#2a241c]/80 pt-6">
            <div>
              <p className="text-xs text-[#b8ab98]">Total Funded</p>
              <p className="mt-1 text-base font-semibold text-emerald-400 sm:text-lg">
                {loading ? "—" : formatMoney(stats.totalCredited)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#b8ab98]">Total Spent</p>
              <p className="mt-1 text-base font-semibold text-[#f6f0e6] sm:text-lg">
                {loading ? "—" : formatMoney(stats.totalDebited)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#b8ab98]">Transactions</p>
              <p className="mt-1 text-base font-semibold text-[#f6f0e6] sm:text-lg">
                {loading ? "—" : stats.count}
              </p>
            </div>
          </div>
        </div>

        {/* FUND WALLET CARD */}
        <div className="flex flex-col justify-between rounded-3xl border border-[#2a241c] bg-[#141118] p-8 shadow-xl lg:col-span-5">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Add Funds</h2>
              <span className="text-xs text-[#b8ab98]">Instant credit</span>
            </div>
            <p className="mt-1 text-xs text-[#b8ab98]">
              Select a preset amount or enter a custom top-up value below.
            </p>

            {/* QUICK AMOUNTS */}
            <div className="mt-5 flex flex-wrap gap-2">
              {QUICK_AMOUNTS.map((preset) => {
                const isSelected = Number(watchedAmount) === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() =>
                      setValue("amount", preset, { shouldValidate: true })
                    }
                    className={`cursor-pointer rounded-xl border px-3 py-2 text-xs font-medium transition ${
                      isSelected
                        ? "border-[#d4a24c] bg-[#d4a24c] text-[#08070b] font-semibold"
                        : "border-[#2a241c] bg-[#08070b]/60 text-[#cbbba4] hover:border-[#d4a24c]/50 hover:text-white"
                    }`}
                  >
                    {formatMoney(preset)}
                  </button>
                );
              })}
            </div>

            <form onSubmit={onDeposit} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="wallet-amount"
                  className="mb-2 block text-xs font-medium text-[#cbbba4]"
                >
                  Amount (NGN)
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#d4a24c]">
                    ₦
                  </span>
                  <Input
                    id="wallet-amount"
                    type="number"
                    min={100}
                    step="1"
                    placeholder="Enter amount (e.g. 5000)"
                    className="h-11 rounded-xl border-[#2a241c] bg-[#08070b]/70 pl-8 text-sm text-white placeholder:text-[#6f6558] focus-visible:border-[#d4a24c]"
                    {...register("amount", {
                      required: true,
                      valueAsNumber: true,
                    })}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={funding}
                className="h-11 w-full cursor-pointer rounded-xl bg-[#d4a24c] text-sm font-semibold text-[#08070b] transition hover:bg-amber-300"
              >
                <Plus className="mr-1.5 h-4 w-4" />
                {funding ? "Opening Monnify checkout..." : "Fund Wallet"}
              </Button>
            </form>
          </div>

          <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-[#2a241c]/60 bg-[#08070b]/40 px-3.5 py-2.5 text-xs text-[#b8ab98]">
            <ShieldCheck className="h-4 w-4 shrink-0 text-[#d4a24c]" />
            <span>Payments are processed securely via Monnify checkout.</span>
          </div>
        </div>
      </div>

      {/* TRANSACTION HISTORY */}
      <section className="mt-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Transaction History
            </h2>
            <p className="mt-1 text-xs text-[#b8ab98]">
              Record of wallet deposits, movie rentals, and permanent purchases.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-xl border border-[#2a241c] bg-[#141118] p-1">
              {(["all", "credit", "debit"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilter(tab)}
                  className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition ${
                    filter === tab
                      ? "bg-[#d4a24c] text-[#08070b]"
                      : "text-[#cbbba4] hover:text-white"
                  }`}
                >
                  {tab === "all"
                    ? "All"
                    : tab === "credit"
                      ? "Deposits"
                      : "Spent"}
                </button>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => void load(true)}
              disabled={refreshing}
              className="h-9 cursor-pointer rounded-xl border-[#2a241c] bg-[#141118] px-3 text-xs text-[#cbbba4] hover:text-white"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 space-y-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-18 animate-pulse rounded-2xl border border-[#2a241c] bg-[#141118]"
              />
            ))}
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center rounded-3xl border border-[#2a241c] bg-[#141118]/60 px-6 py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#2a241c] bg-[#1b1522] text-[#d4a24c]">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-white">
              No transactions found
            </h3>
            <p className="mt-1 max-w-sm text-xs text-[#b8ab98]">
              {filter === "all"
                ? "When you top up your wallet or rent a movie, your activity will appear here."
                : `You have no ${filter} transactions yet.`}
            </p>
          </div>
        ) : (
          <div className="mt-6 divide-y divide-[#2a241c] overflow-hidden rounded-2xl border border-[#2a241c] bg-[#141118]">
            {filteredHistory.map((item) => {
              const isCredit = item.transaction_type === "credit";
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-[#1b1522]/40"
                >
                  <div className="flex min-w-0 items-center gap-3.5">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                        isCredit
                          ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
                          : "border-[#d4a24c]/25 bg-[#d4a24c]/10 text-[#d4a24c]"
                      }`}
                    >
                      {isCredit ? (
                        <ArrowDownLeft className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-white">
                          {item.description ||
                            (isCredit ? "Wallet Top-up" : "Catalog Purchase")}
                        </p>
                        <span
                          className={`hidden rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider sm:inline-block ${
                            isCredit
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-[#d4a24c]/10 text-[#d4a24c]"
                          }`}
                        >
                          {item.transaction_type}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-[#b8ab98]">
                        {new Date(item.created_at).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p
                      className={`text-sm font-semibold tabular-nums sm:text-base ${
                        isCredit ? "text-emerald-400" : "text-[#f6f0e6]"
                      }`}
                    >
                      {isCredit ? "+" : "-"}
                      {formatMoney(item.amount)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
