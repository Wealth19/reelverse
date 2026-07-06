"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import FeaturedActions from "./FeaturedActions";
import featuredMovie from "./featuredMovie";

export default function FeaturedBanner() {
  return (
    <section className="py-24 bg-slate-950">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-3xl">
          <Image
            src={featuredMovie.image}
            alt={featuredMovie.title}
            width={1600}
            height={900}
            className="h-[550px] w-full object-cover"
            priority
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="absolute left-10 top-1/2 max-w-xl -translate-y-1/2"
          >
            <p className="mb-3 uppercase tracking-[0.3em] text-red-500 font-semibold">
              Featured Movie
            </p>

            <h2 className="mb-6 text-5xl font-bold">{featuredMovie.title}</h2>

            <div className="mb-6 flex flex-wrap gap-5 text-slate-200">
              <span className="flex items-center gap-2">
                <Star className="fill-yellow-400 text-yellow-400 h-5 w-5" />
                {featuredMovie.rating}
              </span>

              <span>{featuredMovie.year}</span>

              <span>{featuredMovie.genre}</span>

              <span>{featuredMovie.duration}</span>
            </div>

            <p className="text-lg text-slate-300">
              Experience breathtaking visuals, unforgettable adventures, and the
              next evolution of cinematic storytelling.
            </p>

            <FeaturedActions />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
