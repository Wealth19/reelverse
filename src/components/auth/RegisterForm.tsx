"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Film, Mail, User, ArrowRight, Loader2, Clapperboard, ShoppingBag } from "lucide-react";

import PasswordInput from "./PasswordInput";
import AuthLayout from "./AuthLayout";
import GoogleAuthButton from "./GoogleAuthButton";

import { registerSchema, RegisterSchema } from "@/schemas/register.schema";
import { register as registerUser } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";

export default function RegisterForm() {
  const router = useRouter();
  const { login: loginUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "customer" },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterSchema) => {
    if (!agreed) {
      toast.error("Please accept the Terms of Service to continue.");
      return;
    }
    try {
      setLoading(true);
      const response = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });

      if (response?.data?.user && response?.data?.access?.token) {
        loginUser(response.data.user, response.data.access.token);
        toast.success("Account created! Welcome to ReelVerse.");
        const destination =
          response.data.user.role === "producer" ? "/studio" : "/movies";
        router.push(destination);
      } else {
        toast.success("Account created! Please sign in.");
        router.push("/login");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="rf-card">
        {/* Mobile logo */}
        <Link href="/" className="rf-mobile-logo">
          <Film size={22} />
          Reel<span>Verse</span>
        </Link>

        {/* Header */}
        <div className="rf-header">
          <h1 className="rf-title">Create your account</h1>
          <p className="rf-subtitle">
            Start exploring thousands of movies today
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="rf-form">
          {/* Full name */}
          <div className="rf-field">
            <label htmlFor="reg-name" className="rf-label">
              Full name
            </label>
            <div className="rf-input-wrap">
              <User className="rf-input-icon" size={17} />
              <input
                id="reg-name"
                type="text"
                placeholder="John Doe"
                className={`rf-input ${errors.name ? "rf-input--error" : ""}`}
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p className="rf-error">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="rf-field">
            <label htmlFor="reg-email" className="rf-label">
              Email address
            </label>
            <div className="rf-input-wrap">
              <Mail className="rf-input-icon" size={17} />
              <input
                id="reg-email"
                type="email"
                placeholder="you@example.com"
                className={`rf-input ${errors.email ? "rf-input--error" : ""}`}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="rf-error">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="rf-field">
            <label htmlFor="reg-password" className="rf-label">
              Password
            </label>
            <PasswordInput
              id="reg-password"
              placeholder="Create a strong password"
              className={errors.password ? "rf-input--error" : ""}
              {...register("password")}
            />
            {errors.password && (
              <p className="rf-error">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm password */}
          <div className="rf-field">
            <label htmlFor="reg-confirm" className="rf-label">
              Confirm password
            </label>
            <PasswordInput
              id="reg-confirm"
              placeholder="Repeat your password"
              className={errors.confirmPassword ? "rf-input--error" : ""}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="rf-error">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Role picker */}
          <div className="rf-field">
            <p className="rf-label">I want to</p>
            <div className="rf-roles">
              <label
                className={`rf-role-card ${selectedRole === "customer" ? "rf-role-card--active" : ""}`}
              >
                <input
                  type="radio"
                  value="customer"
                  className="rf-radio"
                  {...register("role")}
                />
                <ShoppingBag size={22} className="rf-role-icon" />
                <span className="rf-role-name">Customer</span>
                <span className="rf-role-desc">Rent &amp; buy movies</span>
              </label>

              <label
                className={`rf-role-card ${selectedRole === "producer" ? "rf-role-card--active" : ""}`}
              >
                <input
                  type="radio"
                  value="producer"
                  className="rf-radio"
                  {...register("role")}
                />
                <Clapperboard size={22} className="rf-role-icon" />
                <span className="rf-role-name">Author</span>
                <span className="rf-role-desc">Publish your catalog</span>
              </label>
            </div>
          </div>

          {/* Terms */}
          <label className="rf-terms">
            <input
              type="checkbox"
              className="rf-checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>
              I agree to the{" "}
              <Link href="/terms" className="rf-link">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="rf-link">
                Privacy Policy
              </Link>
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="rf-submit"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="rf-spin" />
                Creating account…
              </>
            ) : (
              <>
                Create account
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-[#2a241c]" />
          <span className="text-xs text-[#6b6070]">or sign up with</span>
          <span className="h-px flex-1 bg-[#2a241c]" />
        </div>

        {/* Google Signup */}
        <GoogleAuthButton
          mode="register"
          defaultRole={selectedRole || "customer"}
        />

        {/* Footer */}
        <p className="rf-footer">
          Already have an account?{" "}
          <Link href="/login" className="rf-footer-link">
            Sign in
          </Link>
        </p>
      </div>

      <style>{`
        /* ── Card ── */
        .rf-card {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* ── Mobile logo ── */
        .rf-mobile-logo {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 1.5rem;
          font-weight: 900;
          color: #fff;
          text-decoration: none;
          letter-spacing: -0.02em;
        }
        .rf-mobile-logo svg { color: #d4a24c; }
        .rf-mobile-logo span { color: #d4a24c; }
        @media (min-width: 1024px) { .rf-mobile-logo { display: none; } }

        /* ── Header ── */
        .rf-header { display: flex; flex-direction: column; gap: 0.3rem; }
        .rf-title {
          font-size: 2rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.03em;
          line-height: 1.2;
        }
        .rf-subtitle { color: #9b8f7f; font-size: 0.95rem; }

        /* ── Form ── */
        .rf-form { display: flex; flex-direction: column; gap: 1.1rem; }

        /* ── Field ── */
        .rf-field { display: flex; flex-direction: column; gap: 0.42rem; }
        .rf-label { font-size: 0.85rem; font-weight: 600; color: #cbbba4; }

        /* ── Input wrapper ── */
        .rf-input-wrap { position: relative; }
        .rf-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b6070;
          pointer-events: none;
        }
        .rf-input {
          width: 100%;
          height: 48px;
          padding: 0 14px 0 42px;
          border-radius: 10px;
          border: 1.5px solid #2a241c;
          background: #141118;
          color: #fff;
          font-size: 0.92rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: inherit;
          box-sizing: border-box;
        }
        .rf-input::placeholder { color: #4a4050; }
        .rf-input:focus {
          border-color: #d4a24c;
          box-shadow: 0 0 0 3px rgba(212,162,76,0.12);
        }
        .rf-input--error { border-color: #e05252 !important; }
        .rf-error { font-size: 0.8rem; color: #e05252; }

        /* ── Role picker ── */
        .rf-roles {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.7rem;
        }
        .rf-radio { display: none; }
        .rf-role-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.3rem;
          padding: 1rem;
          border-radius: 12px;
          border: 1.5px solid #2a241c;
          background: #141118;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .rf-role-card:hover { border-color: #3a3228; }
        .rf-role-card--active {
          border-color: #d4a24c;
          background: rgba(212,162,76,0.07);
        }
        .rf-role-icon {
          color: #6b6070;
          transition: color 0.2s;
        }
        .rf-role-card--active .rf-role-icon { color: #d4a24c; }
        .rf-role-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: #cbbba4;
        }
        .rf-role-card--active .rf-role-name { color: #fff; }
        .rf-role-desc { font-size: 0.75rem; color: #6b6070; }

        /* ── Terms ── */
        .rf-terms {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          cursor: pointer;
          color: #9b8f7f;
          font-size: 0.85rem;
          line-height: 1.55;
        }
        .rf-checkbox {
          width: 16px;
          height: 16px;
          margin-top: 2px;
          accent-color: #d4a24c;
          cursor: pointer;
          flex-shrink: 0;
        }
        .rf-link {
          color: #d4a24c;
          text-decoration: none;
          transition: color 0.2s;
        }
        .rf-link:hover { color: #e8c77a; }

        /* ── Submit ── */
        .rf-submit {
          height: 50px;
          width: 100%;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #d4a24c 0%, #c47d28 100%);
          color: #08070b;
          font-size: 0.96rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: opacity 0.2s, transform 0.15s;
          font-family: inherit;
          letter-spacing: 0.01em;
        }
        .rf-submit:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .rf-submit:disabled { opacity: 0.55; cursor: not-allowed; }
        .rf-spin { animation: rf-rotate 0.8s linear infinite; }
        @keyframes rf-rotate { to { transform: rotate(360deg); } }

        /* ── Footer ── */
        .rf-footer { text-align: center; color: #6b6070; font-size: 0.88rem; }
        .rf-footer-link {
          color: #d4a24c;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }
        .rf-footer-link:hover { color: #e8c77a; }
      `}</style>
    </AuthLayout>
  );
}
