"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  KeyRound,
  CheckCircle2,
  Circle,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { changePassword } from "@/services/user.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  changePasswordSchema,
  ChangePasswordSchema,
} from "@/schemas/change-password.schema";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const newPasswordValue = watch("newPassword") || "";

  const rules = [
    { label: "At least 8 characters", met: newPasswordValue.length >= 8 },
    { label: "One uppercase letter (A-Z)", met: /[A-Z]/.test(newPasswordValue) },
    { label: "One lowercase letter (a-z)", met: /[a-z]/.test(newPasswordValue) },
    { label: "One number (0-9)", met: /[0-9]/.test(newPasswordValue) },
    {
      label: "One special character (@$!%*?&)",
      met: /[@$!%*?&]/.test(newPasswordValue),
    },
  ];

  const onSubmit = async (data: ChangePasswordSchema) => {
    try {
      setLoading(true);
      const response = await changePassword(data);
      toast.success(response.message || "Password changed successfully.");
      reset();
      router.push("/profile");
    } catch (error: any) {
      console.error("CHANGE PASSWORD ERROR:", error);
      toast.error(
        error.response?.data?.message || "Failed to change password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      {/* BACK NAVIGATION */}
      <button
        type="button"
        onClick={() => router.push("/profile")}
        className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-[#b8ab98] transition hover:text-[#d4a24c]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Profile
      </button>

      {/* HEADER */}
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d4a24c]">
          Security & Access
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Change Password
        </h1>
        <p className="mt-2 text-sm text-[#cbbba4]">
          Choose a strong, unique password to keep your ReelVerse account and
          wallet protected.
        </p>
      </div>

      {/* FORM CARD */}
      <div className="relative mt-8 overflow-hidden rounded-3xl border border-[#2a241c] bg-[#141118] p-6 sm:p-8 shadow-2xl">
        <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-[#d4a24c]/10 blur-3xl" />

        <div className="relative mb-6 flex items-center gap-3.5 border-b border-[#2a241c] pb-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#2a241c] bg-[#1b1522] text-[#d4a24c]">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">
              Update Credentials
            </h2>
            <p className="text-xs text-[#b8ab98]">
              Verify your current password before setting a new one.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-6">
          {/* CURRENT PASSWORD */}
          <div>
            <label
              htmlFor="current-password"
              className="mb-2 block text-xs font-medium text-[#cbbba4]"
            >
              Current Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#d4a24c]" />
              <Input
                id="current-password"
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Enter your current password"
                {...register("currentPassword")}
                disabled={loading}
                className="h-11 rounded-xl border-[#2a241c] bg-[#08070b]/70 pr-11 pl-10 text-sm text-white placeholder:text-[#6f6558] focus-visible:border-[#d4a24c]"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-[#b8ab98] transition hover:text-white"
                aria-label={
                  showCurrentPassword
                    ? "Hide current password"
                    : "Show current password"
                }
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="mt-2 text-xs text-amber-400">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* NEW PASSWORD */}
          <div>
            <label
              htmlFor="new-password"
              className="mb-2 block text-xs font-medium text-[#cbbba4]"
            >
              New Password
            </label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#d4a24c]" />
              <Input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                placeholder="Create a strong new password"
                {...register("newPassword")}
                disabled={loading}
                className="h-11 rounded-xl border-[#2a241c] bg-[#08070b]/70 pr-11 pl-10 text-sm text-white placeholder:text-[#6f6558] focus-visible:border-[#d4a24c]"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-[#b8ab98] transition hover:text-white"
                aria-label={
                  showNewPassword ? "Hide new password" : "Show new password"
                }
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-2 text-xs text-amber-400">
                {errors.newPassword.message}
              </p>
            )}

            {/* PASSWORD REQUIREMENTS CHECKLIST */}
            <div className="mt-4 rounded-2xl border border-[#2a241c] bg-[#08070b]/50 p-4">
              <p className="mb-2.5 text-xs font-medium text-[#cbbba4]">
                Password requirements
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {rules.map((rule) => (
                  <div
                    key={rule.label}
                    className={`flex items-center gap-2 text-xs transition ${
                      rule.met ? "text-emerald-400" : "text-[#b8ab98]"
                    }`}
                  >
                    {rule.met ? (
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                    ) : (
                      <Circle className="h-3.5 w-3.5 shrink-0 text-[#6f6558]" />
                    )}
                    <span>{rule.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col-reverse gap-3 border-t border-[#2a241c] pt-6 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => router.push("/profile")}
              className="h-11 cursor-pointer rounded-xl border-[#2a241c] bg-[#08070b]/60 px-6 text-xs font-medium text-[#cbbba4] hover:border-[#d4a24c]/50 hover:text-white"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="h-11 cursor-pointer rounded-xl bg-[#d4a24c] px-6 text-xs font-semibold text-[#08070b] transition hover:bg-amber-300"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Update Password
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
