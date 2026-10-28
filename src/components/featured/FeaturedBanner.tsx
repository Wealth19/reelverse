"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import FeaturedActions from "./FeaturedActions";
import featuredMovie from "./featuredMovie";

export default function FeaturedBanner() {
  return (
    <section className="bg-slate-950 py-3">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-lg bg-indigo-950/40">
          <Image
            src={featuredMovie.image || "/images/featured/avatar.jpg"}
            alt={featuredMovie.title}
            width={1600}
            height={900}
            className="h-24 w-full object-cover opacity-35"
            priority
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-transparent" />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="absolute inset-0 flex items-center justify-between px-5"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">🍿</span>
              <div>
                <h2 className="text-sm font-bold">
                  Enjoy unlimited movies, anytime, anywhere.
                </h2>
                <p className="text-xs text-slate-300">
                  Join MovieBox Premium and get access to exclusive content.
                </p>
              </div>
            </div>

            <FeaturedActions />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
