"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  User,
  Mail,
  ShieldCheck,
  Loader2,
  Check,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import { roleLabel } from "@/lib/format";
import {
  editProfileSchema,
  EditProfileSchema,
} from "@/schemas/edit-profile.schema";
import { updateProfile } from "@/services/user.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, updateUser, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<EditProfileSchema>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const watchedName = watch("name");

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: EditProfileSchema) => {
    if (!user) {
      toast.error("You must be logged in to update your profile.");
      return;
    }

    try {
      setLoading(true);
      const response = await updateProfile(data);

      updateUser(response.data);
      toast.success(response.message || "Profile updated successfully.");
      router.push("/profile");
    } catch (error: any) {
      console.error("PROFILE UPDATE ERROR:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update profile. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="flex items-center justify-center gap-2 rounded-3xl border border-[#2a241c] bg-[#141118] p-12 text-sm text-[#b8ab98]">
          <Loader2 className="h-4 w-4 animate-spin text-[#d4a24c]" />
          Loading profile settings...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-6 py-16">
        <div className="rounded-3xl border border-[#2a241c] bg-[#141118] p-10 text-center">
          <h1 className="text-2xl font-bold text-white">
            Authentication Required
          </h1>
          <p className="mt-2 text-sm text-[#cbbba4]">
            Please log in to edit your profile details.
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

  const avatarInitial =
    (watchedName || user.name)?.trim().charAt(0).toUpperCase() || "U";

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
          Account Settings
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Edit Profile
        </h1>
        <p className="mt-2 text-sm text-[#cbbba4]">
          Update your display name and primary email address used across
          ReelVerse.
        </p>
      </div>

      {/* LIVE IDENTITY PREVIEW BANNER */}
      <div className="relative mt-8 overflow-hidden rounded-3xl border border-[#2a241c] bg-linear-to-br from-[#1b1420] via-[#141118] to-[#0d0a10] p-6">
        <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[#d4a24c]/10 blur-2xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#d4a24c] to-[#b8842f] text-2xl font-bold text-[#08070b] ring-4 ring-[#d4a24c]/20">
            {avatarInitial}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-lg font-bold text-white">
                {watchedName?.trim() || user.name}
              </p>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#d4a24c]/30 bg-[#d4a24c]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#d4a24c]">
                <Sparkles className="h-2.5 w-2.5" />
                {roleLabel(user.role)}
              </span>
            </div>
            <p className="mt-0.5 truncate text-xs text-[#b8ab98]">
              Live preview of how your profile appears
            </p>
          </div>
        </div>
      </div>

      {/* FORM CARD */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-6 rounded-3xl border border-[#2a241c] bg-[#141118] p-6 sm:p-8 shadow-xl"
      >
        {/* FULL NAME */}
        <div>
          <label
            htmlFor="edit-name"
            className="mb-2 block text-xs font-medium text-[#cbbba4]"
          >
            Full Name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#d4a24c]" />
            <Input
              id="edit-name"
              placeholder="Enter your full name"
              {...register("name")}
              disabled={loading}
              className="h-11 rounded-xl border-[#2a241c] bg-[#08070b]/70 pl-10 text-sm text-white placeholder:text-[#6f6558] focus-visible:border-[#d4a24c]"
            />
          </div>
          {errors.name && (
            <p className="mt-2 text-xs text-amber-400">{errors.name.message}</p>
          )}
        </div>

        {/* EMAIL ADDRESS */}
        <div>
          <label
            htmlFor="edit-email"
            className="mb-2 block text-xs font-medium text-[#cbbba4]"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#d4a24c]" />
            <Input
              id="edit-email"
              type="email"
              placeholder="Enter your email address"
              {...register("email")}
              disabled={loading}
              className="h-11 rounded-xl border-[#2a241c] bg-[#08070b]/70 pl-10 text-sm text-white placeholder:text-[#6f6558] focus-visible:border-[#d4a24c]"
            />
          </div>
          {errors.email && (
            <p className="mt-2 text-xs text-amber-400">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* READ-ONLY ACCOUNT ROLE */}
        <div>
          <label className="mb-2 block text-xs font-medium text-[#cbbba4]">
            Account Role
          </label>
          <div className="flex h-11 items-center justify-between rounded-xl border border-[#2a241c]/80 bg-[#08070b]/40 px-3.5 text-sm text-[#b8ab98]">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-4 w-4 text-[#d4a24c]" />
              <span className="capitalize">{roleLabel(user.role)}</span>
            </div>
            <span className="text-[11px] text-[#6f6558]">Managed by Admin</span>
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
            disabled={loading || !isDirty}
            className="h-11 cursor-pointer rounded-xl bg-[#d4a24c] px-6 text-xs font-semibold text-[#08070b] transition hover:bg-amber-300 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
