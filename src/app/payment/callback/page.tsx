"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { isAxiosError } from "axios";
import { Loader2, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import SiteShell from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/button";
import { verifyWalletPayment } from "@/services/wallet.service";

type CallbackState = "checking" | "success" | "pending" | "error";

function PaymentCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference =
    searchParams.get("transactionReference") ||
    searchParams.get("transaction_reference") ||
    searchParams.get("paymentReference") ||
    searchParams.get("payment_reference");
  const [status, setStatus] = useState<CallbackState>("checking");
  const [message, setMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.location.hostname === "lvh.me"
    ) {
      window.location.replace(
        window.location.href.replace("lvh.me", "localhost"),
      );
      return;
    }

    if (!reference) {
      router.replace("/wallet");
      return;
    }

    let isCurrent = true;
    verifyWalletPayment(reference)
      .then((payment) => {
        if (!isCurrent) return;
        if (payment.paymentStatus === "PAID" && payment.walletCredited) {
          setStatus("success");
          setMessage("Your payment is verified and your wallet is funded.");
          toast.success("Payment verified! Redirecting to your wallet...");
          router.replace("/wallet?payment=success");
        } else {
          setStatus("pending");
          setMessage(
            "Payment is being confirmed. Redirecting to your wallet...",
          );
          setTimeout(() => {
            if (isCurrent) router.replace("/wallet?payment=pending");
          }, 1500);
        }
      })
      .catch((error: unknown) => {
        if (!isCurrent) return;
        const errorMessage = isAxiosError<{ message?: string }>(error)
          ? error.response?.data?.message
          : undefined;
        setStatus("error");
        setMessage(errorMessage || "We could not verify this payment.");
      });

    return () => {
      isCurrent = false;
    };
  }, [reference, retryCount, router]);

  return (
    <main className="mx-auto max-w-xl px-6 py-20">
      <div className="rounded-3xl border border-[#2a241c] bg-[#141118] p-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#2a241c] bg-[#1b1522] text-[#d4a24c]">
          {status === "checking" && (
            <Loader2 className="h-5 w-5 animate-spin" />
          )}
          {status === "success" && (
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          )}
          {status === "pending" && <Clock className="h-5 w-5" />}
          {status === "error" && (
            <AlertCircle className="h-5 w-5 text-amber-400" />
          )}
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d4a24c]">
          Wallet Funding
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white">
          {status === "checking"
            ? "Verifying Payment..."
            : status === "success"
              ? "Payment Complete!"
              : status === "pending"
                ? "Payment Pending"
                : "Payment Not Confirmed"}
        </h1>
        <p className="mt-2 text-sm text-[#cbbba4]">
          {status === "checking"
            ? "Confirming your transaction with Monnify and crediting your wallet..."
            : message}
        </p>

        <div className="mt-6 flex justify-center gap-3">
          {status === "pending" && (
            <Button
              onClick={() => {
                setStatus("checking");
                setRetryCount((count) => count + 1);
              }}
              className="cursor-pointer rounded-xl bg-[#d4a24c] text-[#08070b]"
            >
              Check Again
            </Button>
          )}
          <Link
            href="/wallet"
            className="inline-flex h-10 items-center rounded-xl border border-[#2a241c] bg-[#08070b]/60 px-5 text-xs font-semibold text-[#d4a24c] transition hover:border-[#d4a24c]/50"
          >
            Return to Wallet
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function PaymentCallbackPage() {
  return (
    <SiteShell>
      <Suspense
        fallback={
          <main className="mx-auto max-w-xl px-6 py-20 text-center text-[#cbbba4]">
            Checking payment...
          </main>
        }
      >
        <PaymentCallbackContent />
      </Suspense>
    </SiteShell>
  );
}
