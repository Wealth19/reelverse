// "use client";

// import Link from "next/link";

// import AuthHeader from "./AuthHeader";
// import AuthFooter from "./AuthFooter";
// import PasswordInput from "./PasswordInput";
// import SocialLogin from "./SocialLogin";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Input } from "@/components/ui/input";
// import { Separator } from "@/components/ui/separator";

// export default function RegisterForm() {
//   return (
//     <Card className="w-full max-w-md border-slate-800 bg-slate-900/70 shadow-2xl backdrop-blur-xl">
//       <CardContent className="space-y-6 p-8">
//         <AuthHeader
//           title="Create your account"
//           subtitle="Create an account and start exploring thousands of movies."
//         />

//         <Input type="text" placeholder="Full Name" />

//         <Input type="text" placeholder="Username" />

//         <Input type="email" placeholder="Email Address" />

//         <PasswordInput placeholder="Password" />

//         <PasswordInput placeholder="Confirm Password" />

//         <div className="flex items-start gap-3 cursor-pointer">
//           <Checkbox id="terms" />

//           <label htmlFor="terms" className="text-sm leading-6 text-slate-400">
//             I agree to the{" "}
//             <Link href="/terms" className="text-red-500 hover:underline">
//               Terms of Service
//             </Link>{" "}
//             and{" "}
//             <Link href="/privacy" className="text-red-500 hover:underline">
//               Privacy Policy
//             </Link>
//             .
//           </label>
//         </div>

//         <Button className="h-12 w-full bg-red-600 text-base hover:bg-red-700 cursor-pointer">
//           Create Account
//         </Button>

//         <div className="relative">
//           <Separator />

//           <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-3 text-sm text-slate-400">
//             OR
//           </span>
//         </div>

//         <SocialLogin />

//         <AuthFooter
//           text="Already have an account?"
//           linkText="Login"
//           href="/login"
//         />
//       </CardContent>
//     </Card>
//   );
// }

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

import { registerSchema, RegisterSchema } from "@/schemas/register.schema";
import { register as registerUser } from "@/services/auth.service";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    try {
      setLoading(true);

      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      toast.success("Account created successfully!");

      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg border-slate-800 bg-slate-900/70 shadow-2xl backdrop-blur-xl">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <AuthHeader
            title="Create your account"
            subtitle="Create an account and start exploring thousands of movies."
          />

          <div className="space-y-2">
            <Input placeholder="Full Name" {...register("name")} />

            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

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

          <div className="space-y-2">
            <PasswordInput
              placeholder="Confirm Password"
              {...register("confirmPassword")}
            />

            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex items-start gap-3 cursor-pointer">
            <Checkbox id="terms" />

            <label htmlFor="terms" className="text-sm leading-6 text-slate-400">
              I agree to the{" "}
              <Link href="/terms" className="text-red-500 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-red-500 hover:underline">
                Privacy Policy
              </Link>
              .
            </label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full bg-red-600 text-base cursor-pointer hover:bg-red-700"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>

          <div className="relative">
            <Separator />

            <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-3 text-sm text-slate-400">
              OR
            </span>
          </div>

          <SocialLogin />

          <AuthFooter
            text="Already have an account?"
            linkText="Login"
            href="/login"
          />
        </form>
      </CardContent>
    </Card>
  );
}
