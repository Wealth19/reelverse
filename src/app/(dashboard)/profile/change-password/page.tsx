"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";

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
    formState: { errors },
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordSchema) => {
    try {
      setLoading(true);

      const response = await changePassword(data);

      toast.success(response.message);

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
    <main className="mx-auto mt-20 max-w-xl px-6">
      {/* BACK BUTTON */}

      <Button
        type="button"
        variant="ghost"
        onClick={() => router.push("/profile")}
        className="mb-6 cursor-pointer text-slate-400 hover:text-white"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Profile
      </Button>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-white">
        {/* HEADER */}

        <div className="mb-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-600">
            <Lock className="h-6 w-6" />
          </div>

          <h1 className="text-3xl font-bold">Change Password</h1>

          <p className="mt-2 text-slate-400">Update your account password.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* CURRENT PASSWORD */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Current Password
            </label>

            <div className="relative">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Enter current password"
                {...register("currentPassword")}
                className="pr-12"
              />

              <button
                type="button"
                onClick={() => setShowCurrentPassword((previous) => !previous)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition hover:text-white"
                aria-label={
                  showCurrentPassword
                    ? "Hide current password"
                    : "Show current password"
                }
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {errors.currentPassword && (
              <p className="mt-2 text-sm text-red-500">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* NEW PASSWORD */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              New Password
            </label>

            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                {...register("newPassword")}
                className="pr-12"
              />

              <button
                type="button"
                onClick={() => setShowNewPassword((previous) => !previous)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition hover:text-white"
                aria-label={
                  showNewPassword ? "Hide new password" : "Show new password"
                }
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {errors.newPassword && (
              <p className="mt-2 text-sm text-red-500">
                {errors.newPassword.message}
              </p>
            )}

            <p className="mt-2 text-xs text-slate-500">
              Minimum 8 characters with uppercase, lowercase, number, and
              special character.
            </p>
          </div>

          {/* SUBMIT */}

          <Button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer bg-red-600 hover:bg-red-700"
          >
            {loading ? "Changing Password..." : "Change Password"}
          </Button>
        </form>
      </div>
    </main>
  );
}
