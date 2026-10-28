"use client";

import Link from "next/link";
import { useState } from "react";
import { isAxiosError } from "axios";
import {
  Film,
  Mail,
  ArrowLeft,
  ArrowRight,
  Loader2,
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import { forgotPassword } from "@/services/auth.service";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResetUrl(null);

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const response = await forgotPassword(email.trim());
      if (response?.data?.resetUrl) {
        setResetUrl(response.data.resetUrl);
      }
      setSent(true);
    } catch (err: unknown) {
      const msg = isAxiosError<{ message?: string }>(err)
        ? err.response?.data?.message
        : undefined;
      setError(msg || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="fp-card">
        {/* Mobile logo */}
        <Link href="/" className="fp-mobile-logo">
          <Film size={22} />
          Reel<span>Verse</span>
        </Link>

        {!sent ? (
          <>
            {/* Header */}
            <div className="fp-header">
              <div className="fp-icon-wrap">
                <Mail size={28} className="fp-icon" />
              </div>
              <h1 className="fp-title">Forgot your password?</h1>
              <p className="fp-subtitle">
                No worries — enter your email and we&apos;ll generate a secure
                password reset link right away.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="fp-form">
              <div className="fp-field">
                <label htmlFor="fp-email" className="fp-label">
                  Email address
                </label>
                <div className="fp-input-wrap">
                  <Mail className="fp-input-icon" size={17} />
                  <input
                    id="fp-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`fp-input ${error ? "fp-input--error" : ""}`}
                  />
                </div>
                {error && <p className="fp-error">{error}</p>}
              </div>

              <button type="submit" disabled={loading} className="fp-submit">
                {loading ? (
                  <>
                    <Loader2 size={18} className="fp-spin" />
                    Generating link…
                  </>
                ) : (
                  <>
                    Send reset link
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Back to login */}
            <Link href="/login" className="fp-back">
              <ArrowLeft size={16} />
              Back to sign in
            </Link>
          </>
        ) : (
          /* ── Success state ── */
          <div className="fp-success">
            <div className="fp-success-icon-wrap">
              <CheckCircle2 size={44} className="fp-success-icon" />
            </div>
            <h2 className="fp-success-title">Reset link ready</h2>
            <p className="fp-success-desc">
              We&apos;ve prepared a password reset link for{" "}
              <strong className="fp-success-email">{email}</strong>.
            </p>

            {resetUrl && (
              <div className="w-full rounded-xl border border-[#d4a24c]/30 bg-[#d4a24c]/10 p-4 text-left">
                <p className="text-xs font-semibold text-[#d4a24c]">
                  Instant Reset Link
                </p>
                <p className="mt-1 text-xs text-[#cbbba4]">
                  Click below to set your new password immediately:
                </p>
                <Link
                  href={resetUrl}
                  className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#d4a24c] px-4 text-xs font-bold text-[#08070b] transition hover:bg-amber-300"
                >
                  <KeyRound size={15} />
                  Reset Password Now
                </Link>
              </div>
            )}

            <p className="fp-success-hint">
              Entered the wrong email?{" "}
              <button
                type="button"
                onClick={() => setSent(false)}
                className="fp-resend"
              >
                Try again
              </button>
            </p>
            <Link
              href="/login"
              className="fp-back"
              style={{ marginTop: "0.25rem" }}
            >
              <ArrowLeft size={16} />
              Back to sign in
            </Link>
          </div>
        )}
      </div>

      <style>{`
        .fp-card {
          display: flex;
          flex-direction: column;
          gap: 1.8rem;
        }
        .fp-mobile-logo {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 1.5rem;
          font-weight: 900;
          color: #fff;
          text-decoration: none;
          letter-spacing: -0.02em;
        }
        .fp-mobile-logo svg { color: #d4a24c; }
        .fp-mobile-logo span { color: #d4a24c; }
        @media (min-width: 1024px) { .fp-mobile-logo { display: none; } }
        .fp-header { display: flex; flex-direction: column; gap: 0.6rem; }
        .fp-icon-wrap {
          width: 58px;
          height: 58px;
          border-radius: 14px;
          background: rgba(212,162,76,0.1);
          border: 1.5px solid rgba(212,162,76,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d4a24c;
          margin-bottom: 0.4rem;
        }
        .fp-icon { color: #d4a24c; }
        .fp-title {
          font-size: 1.9rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.03em;
          line-height: 1.2;
        }
        .fp-subtitle { color: #9b8f7f; font-size: 0.92rem; line-height: 1.6; }
        .fp-form { display: flex; flex-direction: column; gap: 1.2rem; }
        .fp-field { display: flex; flex-direction: column; gap: 0.45rem; }
        .fp-label { font-size: 0.85rem; font-weight: 600; color: #cbbba4; }
        .fp-input-wrap { position: relative; }
        .fp-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b6070;
          pointer-events: none;
        }
        .fp-input {
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
        .fp-input::placeholder { color: #4a4050; }
        .fp-input:focus {
          border-color: #d4a24c;
          box-shadow: 0 0 0 3px rgba(212,162,76,0.12);
        }
        .fp-input--error { border-color: #e05252 !important; }
        .fp-error { font-size: 0.8rem; color: #e05252; }
        .fp-submit {
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
        .fp-submit:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .fp-submit:disabled { opacity: 0.55; cursor: not-allowed; }
        .fp-spin { animation: fp-rotate 0.8s linear infinite; }
        @keyframes fp-rotate { to { transform: rotate(360deg); } }
        .fp-back {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          color: #9b8f7f;
          font-size: 0.88rem;
          text-decoration: none;
          transition: color 0.2s;
          width: fit-content;
          margin: 0 auto;
        }
        .fp-back:hover { color: #cbbba4; }
        .fp-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          text-align: center;
        }
        .fp-success-icon-wrap {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(52,193,98,0.1);
          border: 2px solid rgba(52,193,98,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fp-pop 0.4s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes fp-pop {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .fp-success-icon { color: #34c162; }
        .fp-success-title {
          font-size: 1.7rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
        }
        .fp-success-desc {
          color: #9b8f7f;
          font-size: 0.93rem;
          line-height: 1.65;
          max-width: 340px;
        }
        .fp-success-email { color: #d4a24c; }
        .fp-success-hint { font-size: 0.85rem; color: #6b6070; }
        .fp-resend {
          background: none;
          border: none;
          color: #d4a24c;
          font-size: 0.85rem;
          cursor: pointer;
          font-family: inherit;
          padding: 0;
          text-decoration: underline;
          transition: color 0.2s;
        }
        .fp-resend:hover { color: #e8c77a; }
      `}</style>
    </AuthLayout>
  );
}
