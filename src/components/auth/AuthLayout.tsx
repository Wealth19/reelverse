"use client";

import Link from "next/link";
import { Film, Star, Play, Clock, ShoppingBag } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const features = [
  { icon: Play, text: "Rent movies with flexible durations" },
  { icon: ShoppingBag, text: "Own movies permanently in your library" },
  { icon: Clock, text: "Timed rentals — watch anytime before expiry" },
  { icon: Star, text: "Authors publish & manage their own catalog" },
];

export default function AuthLayout({
  children,
  title,
  subtitle,
}: AuthLayoutProps) {
  return (
    <div className="auth-root">
      {/* ── LEFT CINEMATIC PANEL ───────────────────────── */}
      <aside className="auth-panel">
        {/* Gradient overlays */}
        <div className="auth-panel-glow auth-panel-glow--top" />
        <div className="auth-panel-glow auth-panel-glow--bottom" />

        {/* Film strip decorations */}
        <div className="film-strip film-strip--left" aria-hidden="true">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="film-hole" />
          ))}
        </div>
        <div className="film-strip film-strip--right" aria-hidden="true">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="film-hole" />
          ))}
        </div>

        {/* Content */}
        <div className="auth-panel-content">
          {/* Logo */}
          <Link href="/" className="auth-logo">
            <Film size={28} />
            <span>
              Reel<span className="auth-logo-accent">Verse</span>
            </span>
          </Link>

          {/* Headline */}
          <div className="auth-panel-headline">
            <h2 className="auth-panel-title">
              Your cinema,{" "}
              <span className="auth-panel-title-accent">your rules.</span>
            </h2>
            <p className="auth-panel-desc">
              Customers rent and buy. Authors publish. One wallet, one catalog —
              the whole experience in one place.
            </p>
          </div>

          {/* Feature list */}
          <ul className="auth-features">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="auth-feature-item">
                <span className="auth-feature-icon">
                  <Icon size={16} />
                </span>
                <span>{text}</span>
              </li>
            ))}
          </ul>

          {/* Decorative floating badge */}
          <div className="auth-badge">
            <span className="auth-badge-dot" />
            <span>Streaming · Renting · Purchasing</span>
          </div>
        </div>
      </aside>

      {/* ── RIGHT FORM PANEL ───────────────────────────── */}
      <main className="auth-form-panel">
        {/* Background noise texture */}
        <div className="auth-form-bg" />

        <div className="auth-form-inner">{children}</div>
      </main>

      <style>{`
        /* ─────────── ROOT ─────────── */
        .auth-root {
          display: grid;
          grid-template-columns: 1fr;
          min-height: 100vh;
          background: #08070b;
          font-family: 'Inter', sans-serif;
        }
        @media (min-width: 1024px) {
          .auth-root {
            grid-template-columns: 1fr 1fr;
          }
        }

        /* ─────────── LEFT PANEL ─────────── */
        .auth-panel {
          position: relative;
          display: none;
          overflow: hidden;
          background: #0e0c12;
        }
        @media (min-width: 1024px) {
          .auth-panel {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }

        .auth-panel-glow--top {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 30% -10%, rgba(212,162,76,0.25) 0%, transparent 65%);
          pointer-events: none;
        }
        .auth-panel-glow--bottom {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 60% 50% at 80% 110%, rgba(196,92,38,0.18) 0%, transparent 60%);
          pointer-events: none;
        }

        /* Film strips */
        .film-strip {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 28px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 10px 0;
          opacity: 0.12;
        }
        .film-strip--left  { left: 0;  background: #1a1520; }
        .film-strip--right { right: 0; background: #1a1520; }
        .film-hole {
          flex-shrink: 0;
          height: 18px;
          margin: 0 4px;
          border-radius: 3px;
          background: #08070b;
        }

        /* Panel content */
        .auth-panel-content {
          position: relative;
          z-index: 1;
          padding: 3rem 3.5rem;
          max-width: 440px;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        /* Logo */
        .auth-logo {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 1.75rem;
          font-weight: 900;
          color: #fff;
          text-decoration: none;
          letter-spacing: -0.02em;
        }
        .auth-logo svg { color: #d4a24c; }
        .auth-logo-accent { color: #d4a24c; }

        /* Headline */
        .auth-panel-title {
          font-size: 2.4rem;
          font-weight: 800;
          line-height: 1.15;
          color: #fff;
          letter-spacing: -0.03em;
        }
        .auth-panel-title-accent {
          background: linear-gradient(135deg, #d4a24c 0%, #e8c77a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .auth-panel-desc {
          margin-top: 1rem;
          color: #9b8f7f;
          line-height: 1.7;
          font-size: 0.96rem;
        }

        /* Features */
        .auth-features {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .auth-feature-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #cbbba4;
          font-size: 0.9rem;
        }
        .auth-feature-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(212,162,76,0.12);
          border: 1px solid rgba(212,162,76,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d4a24c;
          flex-shrink: 0;
        }

        /* Badge */
        .auth-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.9rem;
          border-radius: 999px;
          background: rgba(212,162,76,0.08);
          border: 1px solid rgba(212,162,76,0.18);
          color: #9b8f7f;
          font-size: 0.78rem;
          letter-spacing: 0.04em;
          width: fit-content;
        }
        .auth-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #d4a24c;
          animation: auth-pulse 2s infinite;
        }
        @keyframes auth-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }

        /* ─────────── RIGHT PANEL ─────────── */
        .auth-form-panel {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 1.5rem;
          background: #08070b;
          min-height: 100vh;
        }
        .auth-form-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 55% at 50% 0%, rgba(212,162,76,0.06) 0%, transparent 65%);
          pointer-events: none;
        }
        .auth-form-inner {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 460px;
        }
      `}</style>
    </div>
  );
}
