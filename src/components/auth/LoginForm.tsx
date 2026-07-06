"use client";

import Link from "next/link";

import AuthHeader from "./AuthHeader";
import AuthFooter from "./AuthFooter";
import PasswordInput from "./PasswordInput";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import SocialLogin from "./SocialLogin";

export default function LoginForm() {
  return (
    <Card className="w-full max-w-md border-slate-800 bg-slate-900/70 backdrop-blur-xl">
      <CardContent className="p-8">
        <AuthHeader
          title="Welcome Back"
          subtitle="Login to continue your movie journey."
        />

        <div className="space-y-5">
          <Input type="email" placeholder="Email address" />

          <PasswordInput />

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 cursor-pointer">
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

          <Button className="w-full bg-red-600 hover:bg-red-700 cursor-pointer">
            Login
          </Button>

          <Separator />

          <SocialLogin />
        </div>

        <AuthFooter
          text="Don't have an account?"
          linkText="Register"
          href="/register"
        />
      </CardContent>
    </Card>
  );
}
