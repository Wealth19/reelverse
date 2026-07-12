"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import AuthHeader from "./AuthHeader";
import AuthFooter from "./AuthFooter";
import PasswordInput from "./PasswordInput";
import SocialLogin from "./SocialLogin";

import { loginSchema, LoginSchema } from "@/schemas/login.schema";
import { login } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function LoginForm() {
  const router = useRouter();

  const { login: loginUser } = useAuth();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      setLoading(true);

      const response = await login(data);

      loginUser(
        response.data.user,
        response.data.access.token,
        response.data.refresh.token,
      );

      toast.success(response.message);

      router.push("/");
    } catch (error: any) {
      console.error(error);

      toast.error(error.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg border-slate-800 bg-slate-900/70 backdrop-blur-xl">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <AuthHeader
            title="Welcome Back"
            subtitle="Login to continue your movie journey."
          />

          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email Address"
              {...register("email")}
            />

            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <PasswordInput placeholder="Password" {...register("password")} />

            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Checkbox />
              <span>Remember me</span>
            </div>

            <Link
              href="/forgot-password"
              className="text-red-500 hover:text-red-400"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full bg-red-600 hover:bg-red-700"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <div className="relative">
            <Separator />

            <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-3 text-sm text-slate-400">
              OR
            </span>
          </div>

          <SocialLogin />

          <AuthFooter
            text="Don't have an account?"
            linkText="Register"
            href="/register"
          />
        </form>
      </CardContent>
    </Card>
  );
}
