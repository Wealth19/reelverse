"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Film, Mail, ArrowRight, Loader2 } from "lucide-react";

import PasswordInput from "./PasswordInput";
import AuthLayout from "./AuthLayout";
import GoogleAuthButton from "./GoogleAuthButton";

import { loginSchema, LoginSchema } from "@/schemas/login.schema";
import { login } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";

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
      loginUser(response.data.user, response.data.access.token);
      toast.success(response.message);
      const destination =
        response.data.user.role === "admin"
          ? "/admin"
          : response.data.user.role === "producer"
            ? "/studio"
            : "/movies";
      router.push(destination);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="lf-card">
        {/* Logo for mobile */}
        <Link href="/" className="lf-mobile-logo">
          <Film size={22} />
          Reel<span>Verse</span>
        </Link>

        {/* Header */}
        <div className="lf-header">
          <h1 className="lf-title">Welcome back</h1>
          <p className="lf-subtitle">Sign in to continue your movie journey</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="lf-form">
          {/* Email */}
          <div className="lf-field">
            <label htmlFor="login-email" className="lf-label">
              Email address
            </label>
            <div className="lf-input-wrap">
              <Mail className="lf-input-icon" size={17} />
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                className={`lf-input ${errors.email ? "lf-input--error" : ""}`}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="lf-error">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="lf-field">
            <div className="lf-label-row">
              <label htmlFor="login-password" className="lf-label">
                Password
              </label>
              <Link href="/forgot-password" className="lf-forgot">
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="login-password"
              placeholder="Enter your password"
              className={errors.password ? "lf-input--error" : ""}
              {...register("password")}
            />
            {errors.password && (
              <p className="lf-error">{errors.password.message}</p>
            )}
          </div>

          {/* Remember me */}
          <label className="lf-remember">
            <input type="checkbox" className="lf-checkbox" />
            <span>Keep me signed in</span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="lf-submit"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="lf-spin" />
                Signing in…
              </>
            ) : (
              <>
                Sign in
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="lf-divider">
          <span className="lf-divider-line" />
          <span className="lf-divider-text">or continue with</span>
          <span className="lf-divider-line" />
        </div>

        {/* Social buttons */}
        <div className="lf-socials">
          <GoogleAuthButton mode="login" />
        </div>

        {/* Footer */}
        <p className="lf-footer">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="lf-footer-link">
            Create one
          </Link>
        </p>
      </div>

      <style>{`
        /* ── Card ── */
        .lf-card {
          display: flex;
          flex-direction: column;
          gap: 1.6rem;
        }

        /* ── Mobile logo ── */
        .lf-mobile-logo {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 1.5rem;
          font-weight: 900;
          color: #fff;
          text-decoration: none;
          letter-spacing: -0.02em;
        }
        .lf-mobile-logo svg { color: #d4a24c; }
        .lf-mobile-logo span { color: #d4a24c; }
        @media (min-width: 1024px) { .lf-mobile-logo { display: none; } }

        /* ── Header ── */
        .lf-header { display: flex; flex-direction: column; gap: 0.3rem; }
        .lf-title {
          font-size: 2rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.03em;
          line-height: 1.2;
        }
        .lf-subtitle { color: #9b8f7f; font-size: 0.95rem; }

        /* ── Form ── */
        .lf-form { display: flex; flex-direction: column; gap: 1.2rem; }

        /* ── Field ── */
        .lf-field { display: flex; flex-direction: column; gap: 0.45rem; }
        .lf-label { font-size: 0.85rem; font-weight: 600; color: #cbbba4; }
        .lf-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .lf-forgot {
          font-size: 0.82rem;
          color: #d4a24c;
          text-decoration: none;
          transition: color 0.2s;
        }
        .lf-forgot:hover { color: #e8c77a; }

        /* ── Input wrapper ── */
        .lf-input-wrap { position: relative; }
        .lf-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b6070;
          pointer-events: none;
        }
        .lf-input {
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
        .lf-input::placeholder { color: #4a4050; }
        .lf-input:focus {
          border-color: #d4a24c;
          box-shadow: 0 0 0 3px rgba(212,162,76,0.12);
        }
        .lf-input--error { border-color: #e05252 !important; }
        .lf-error { font-size: 0.8rem; color: #e05252; margin-top: 0.1rem; }

        /* ── Remember ── */
        .lf-remember {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          cursor: pointer;
          color: #9b8f7f;
          font-size: 0.87rem;
        }
        .lf-checkbox {
          width: 16px;
          height: 16px;
          accent-color: #d4a24c;
          cursor: pointer;
        }

        /* ── Submit ── */
        .lf-submit {
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
        .lf-submit:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .lf-submit:disabled { opacity: 0.55; cursor: not-allowed; }
        .lf-spin {
          animation: lf-rotate 0.8s linear infinite;
        }
        @keyframes lf-rotate { to { transform: rotate(360deg); } }

        /* ── Divider ── */
        .lf-divider {
          display: flex;
          align-items: center;
          gap: 0.9rem;
        }
        .lf-divider-line {
          flex: 1;
          height: 1px;
          background: #2a241c;
        }
        .lf-divider-text { font-size: 0.78rem; color: #6b6070; white-space: nowrap; }

        /* ── Social buttons ── */
        .lf-socials { display: flex; gap: 0.75rem; }
        .lf-social-btn {
          flex: 1;
          height: 46px;
          border-radius: 10px;
          border: 1.5px solid #2a241c;
          background: #141118;
          color: #cbbba4;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
          transition: border-color 0.2s, background 0.2s;
          font-family: inherit;
        }
        .lf-social-btn:hover:not(:disabled) {
          border-color: #3a3228;
          background: #1a1520;
        }
        .lf-social-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        /* ── Footer ── */
        .lf-footer { text-align: center; color: #6b6070; font-size: 0.88rem; }
        .lf-footer-link {
          color: #d4a24c;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }
        .lf-footer-link:hover { color: #e8c77a; }
      `}</style>
    </AuthLayout>
  );
}
