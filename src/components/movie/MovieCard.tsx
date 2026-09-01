"use client";

import Image from "next/image";
import { Heart, Play, Star } from "lucide-react";
import { motion } from "framer-motion";
import type { Movie } from "@/types/movie";
import { Button } from "@/components/ui/button";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.25 }}
      className="group w-37 shrink-0 overflow-hidden rounded-lg border border-slate-800 bg-slate-900 sm:w-42.5"
    >
      <div className="relative aspect-3/4 overflow-hidden">
        <Image
          src={movie.image}
          alt={movie.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-110"
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />

        {/* Favorite */}
        <Button className="absolute right-3 cursor-pointer top-3 rounded-full bg-black/50 p-2 backdrop-blur-md transition hover:bg-red-500">
          <Heart size={18} />
        </Button>

        {/* Play Button */}
        <Button
          size="icon"
          className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600 opacity-0 transition group-hover:opacity-100 hover:bg-red-700 cursor-pointer"
        >
          <Play className="fill-white" size={22} />
        </Button>

        {/* Genre */}
        <span className="absolute bottom-3 left-3 rounded-sm bg-red-500 px-3 py-1 text-xs font-semibold">
          {movie.genre}
        </span>
      </div>

      <div className="space-y-1 p-2">
        <h3 className="truncate text-xs font-semibold">{movie.title}</h3>

        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span>{movie.year}</span>

          <span>{movie.duration}</span>
        </div>

        <div className="flex items-center gap-1">
          <Star className="fill-yellow-400 text-yellow-400" size={12} />
          <span className="text-[10px] font-semibold">{movie.rating}</span>
        </div>
      </div>
    </motion.div>
  );
}
