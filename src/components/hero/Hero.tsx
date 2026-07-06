"use client";

import { Play, Search, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/images/hero/hero-bg.jpg"
          alt="Cinema"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />

        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <p className="mb-4 text-lg font-semibold uppercase tracking-[0.3em] text-red-500">
            Featured Movie
          </p>

          <h1 className="mb-6 text-6xl font-bold leading-tight lg:text-7xl">
            Discover Movies
            <br />
            Worth Watching
          </h1>

          <p className="mb-8 text-lg text-slate-300">
            Stream, rent and purchase thousands of blockbuster movies in HD and
            4K. Anytime. Anywhere.
          </p>

          {/* Search */}

          <div className="mb-10 flex max-w-xl items-center rounded-xl bg-white/10 backdrop-blur-md">
            <Search className="ml-5 text-slate-300" />

            <input
              type="text"
              placeholder="Search movies..."
              className="w-full bg-transparent px-4 py-5 outline-none"
            />
          </div>

          {/* Buttons */}

          <div className="flex flex-wrap gap-4">
            <button className="cursor-pointer rounded-xl bg-red-600 px-8 py-4 text-lg font-semibold transition hover:bg-red-700">
              Explore Movies
            </button>

            <button className="cursor-pointer flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-lg backdrop-blur-md transition hover:bg-white/20">
              <Play size={22} />
              Watch Trailer
            </button>
          </div>

          {/* Stats */}

          <div className="mt-12 flex flex-wrap gap-8">
            <div className="flex items-center gap-2">
              <Star className="fill-yellow-400 text-yellow-400" />

              <span>9.5 Rating</span>
            </div>

            <span>2025</span>

            <span>Action</span>

            <span>Adventure</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
