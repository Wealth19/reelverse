"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";

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
    formState: { errors },
  } = useForm<EditProfileSchema>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  // LOAD CURRENT USER INTO FORM
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, reset]);

  // SUBMIT PROFILE UPDATE
  const onSubmit = async (data: EditProfileSchema) => {
    if (!user) {
      toast.error("You must be logged in to update your profile.");
      return;
    }

    try {
      setLoading(true);

      const response = await updateProfile(data);

      /*
       * Keep AuthContext and localStorage synchronized.
       */
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

  // WAIT FOR AUTH RESTORATION
  if (authLoading) {
    return (
      <main className="mx-auto mt-32 max-w-xl px-6">
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-8 text-center">
          Loading profile...
        </div>
      </main>
    );
  }

  // USER IS NOT AUTHENTICATED
  if (!user) {
    return (
      <main className="mx-auto mt-32 max-w-xl px-6">
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-8 text-center">
          <h1 className="mb-4 text-2xl font-bold">Authentication Required</h1>

          <p className="mb-6 text-slate-400">
            Please log in to edit your profile.
          </p>

          <Button onClick={() => router.push("/login")}>Go to Login</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto mt-32 max-w-xl px-6">
      <h1 className="mb-8 text-3xl font-bold">Edit Profile</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-xl border border-slate-700 bg-slate-900 p-8"
      >
        {/* NAME */}
        <div>
          <label className="mb-2 block text-sm font-medium">Full Name</label>

          <Input
            placeholder="Full Name"
            {...register("name")}
            disabled={loading}
          />

          {errors.name && (
            <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Email Address
          </label>

          <Input
            type="email"
            placeholder="Email Address"
            {...register("email")}
            disabled={loading}
          />

          {errors.email && (
            <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => router.push("/profile")}
            className="flex-1 cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={loading}
            className="flex-1 cursor-pointer"
          >
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </div>
      </form>
    </main>
  );
}
