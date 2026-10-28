"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { Movie } from "@/types/movie";
import PosterArt from "./PosterArt";
import WatchlistButton from "./WatchlistButton";
import { formatMoney } from "@/lib/format";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.2 }}>
      <div className="group relative block w-full overflow-hidden rounded-xl border border-[#2a241c] bg-[#141118]">
        <div className="relative aspect-3/4 overflow-hidden">
          <Link href={`/movies/${movie.id}`}>
            <PosterArt title={movie.title} image={movie.image} />
          </Link>

          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#d4a24c] backdrop-blur">
            {movie.genre || "Feature"}
          </span>

          <div className="absolute right-3 top-3 z-10">
            <WatchlistButton movieId={movie.id} />
          </div>

          {Number(movie.avg_rating || 0) > 0 && (
            <span className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-1 rounded-md bg-black/75 px-2 py-0.5 text-[11px] font-bold text-amber-400 backdrop-blur">
              <Star className="h-3 w-3 fill-current text-amber-400" />
              {Number(movie.avg_rating).toFixed(1)}
            </span>
          )}
        </div>

        <Link href={`/movies/${movie.id}`} className="block space-y-1 p-3">
          <h3 className="line-clamp-1 text-sm font-semibold text-white group-hover:text-[#d4a24c] transition">
            {movie.title}
          </h3>
          <p className="text-[11px] text-[#b8ab98]">
            {[movie.year, movie.duration].filter(Boolean).join(" · ")}
          </p>
          <div className="flex items-center justify-between pt-0.5 text-[11px]">
            <span className="text-[#b8ab98]">
              Rent {formatMoney(movie.rental_price)}
            </span>
            <span className="font-semibold text-[#d4a24c]">
              Own {formatMoney(movie.purchase_price)}
            </span>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
