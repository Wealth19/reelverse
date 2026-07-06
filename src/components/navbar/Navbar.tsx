"use client";

import Link from "next/link";
import { Film } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/genres", label: "Genres" },
  { href: "/pricing", label: "Pricing" },
];

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Film className="h-8 w-8 text-red-600" />
          <span className="text-4xl font-bold tracking-tight">
            Reel<span className="text-red-600">Verse</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden gap-10 lg:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-lg text-slate-300 transition hover:text-red-500"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="rounded-xl border border-red-600 px-6 py-3 transition hover:bg-red-600"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-xl bg-red-600 px-6 py-3 transition hover:bg-red-700"
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}
