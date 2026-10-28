"use client";

import Link from "next/link";
import { Play, Ticket } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function Hero() {
  const { isAuthenticated, user } = useAuth();
  const studio = user?.role === "producer";

  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-20 sm:pt-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,162,76,0.18),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(196,92,38,0.16),transparent_35%)]" />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-[#d4a24c]">
            Independent cinema, on demand
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">
            Rent a night. Own a favorite. Keep your wallet in one place.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-[#cbbba4] sm:text-base">
            ReelVerse is a two-sided movie house. Customers browse, rent with an
            expiry, or buy forever. Authors upload titles and watch them go live
            in the catalog.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/movies"
              className="inline-flex items-center gap-2 rounded-md bg-[#d4a24c] px-5 py-3 text-sm font-semibold text-[#08070b] transition hover:bg-[#d4a24c]"
            >
              <Play size={15} fill="currentColor" /> Browse catalog
            </Link>
            {!isAuthenticated ? (
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-md border border-[#2a241c] bg-white/5 px-5 py-3 text-sm hover:bg-white/10"
              >
                <Ticket size={15} /> Create account
              </Link>
            ) : studio ? (
              <Link
                href="/studio"
                className="inline-flex items-center gap-2 rounded-md border border-[#2a241c] bg-white/5 px-5 py-3 text-sm hover:bg-white/10"
              >
                Open studio
              </Link>
            ) : (
              <Link
                href="/library"
                className="inline-flex items-center gap-2 rounded-md border border-[#2a241c] bg-white/5 px-5 py-3 text-sm hover:bg-white/10"
              >
                My library
              </Link>
            )}
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              label: "Timed rentals",
              copy: "1, 3 or 7 days. Access ends at expiry.",
            },
            {
              label: "Permanent buys",
              copy: "Pay once from your wallet and keep it.",
            },
            {
              label: "Customer wallet",
              copy: "Fund, rent, buy, and track every debit.",
            },
            {
              label: "Author studio",
              copy: "Upload a title with rental and purchase prices.",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[#2a241c] bg-[#141118]/80 p-5"
            >
              <p className="text-sm font-semibold text-[#d4a24c]">
                {item.label}
              </p>
              <p className="mt-2 text-sm text-[#cbbba4]">{item.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
