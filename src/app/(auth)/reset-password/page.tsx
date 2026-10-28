"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { isAxiosError } from "axios";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Film,
  KeyRound,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import AuthLayout from "@/components/auth/AuthLayout";
import PasswordInput from "@/components/auth/PasswordInput";
import { resetPassword } from "@/services/auth.service";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const checks = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One lowercase letter", valid: /[a-z]/.test(password) },
    { label: "One number", valid: /[0-9]/.test(password) },
    { label: "One special character", valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const allChecksValid = checks.every((c) => c.valid);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Missing or invalid reset token. Please request a new link.");
      return;
    }

    if (!allChecksValid) {
      setError("Please satisfy all password security requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await resetPassword({ token, password });
      setDone(true);
      toast.success("Password reset successfully!");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: unknown) {
      const msg = isAxiosError<{ message?: string }>(err)
        ? err.response?.data?.message
        : undefined;
      setError(msg || "Reset link has expired or is invalid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col gap-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-2xl font-black text-white lg:hidden"
        >
          <Film size={22} className="text-[#d4a24c]" />
          Reel<span className="text-[#d4a24c]">Verse</span>
        </Link>

        {done ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              Password Updated!
            </h1>
            <p className="text-sm text-[#cbbba4]">
              Your password has been reset. Redirecting you to sign in…
            </p>
            <Link
              href="/login"
              className="mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-[#d4a24c] text-sm font-bold text-[#08070b] transition hover:bg-amber-300"
            >
              Sign In Now
            </Link>
          </div>
        ) : (
          <>
            <div>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d4a24c]/30 bg-[#d4a24c]/10 text-[#d4a24c]">
                <KeyRound className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">
                Set new password
              </h1>
              <p className="mt-1.5 text-sm text-[#9b8f7f]">
                Choose a strong password for your ReelVerse account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#cbbba4]">
                  New Password
                </label>
                <PasswordInput
                  id="reset-password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#cbbba4]">
                  Confirm New Password
                </label>
                <PasswordInput
                  id="reset-confirm-password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {/* Password checklist */}
              <div className="rounded-xl border border-[#2a241c] bg-[#141118] p-3.5">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#b8ab98]">
                  Password Requirements
                </p>
                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {checks.map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center gap-2 text-xs ${
                        item.valid ? "text-emerald-400" : "text-[#6b6070]"
                      }`}
                    >
                      <Check className="h-3.5 w-3.5 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {error && <p className="text-xs text-rose-400">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#d4a24c] to-[#c47d28] text-sm font-bold text-[#08070b] transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating password…
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>

            <Link
              href="/login"
              className="mx-auto inline-flex items-center gap-2 text-xs text-[#9b8f7f] transition hover:text-[#cbbba4]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to sign in
            </Link>
          </>
        )}
      </div>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}

