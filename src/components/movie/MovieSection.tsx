"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MovieCard from "./MovieCard";
import FadeIn from "../shared/FadeIn";
import { getMovies } from "@/services/movie.service";
import type { Movie } from "@/types/movie";

export default function MovieSection() {
  const [items, setItems] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMovies()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <FadeIn>
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="border-l-2 border-[#d4a24c] pl-3 text-xl font-bold">
              Now on the marquee
            </h2>
            <Link href="/movies" className="text-xs text-[#cbbba4] hover:text-white">
              View all
            </Link>
          </div>

          {loading ? (
            <p className="text-sm text-[#b8ab98]">Loading titles...</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-[#b8ab98]">
              No movies yet. Authors can upload the first title from Studio.
            </p>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-3 [&::-webkit-scrollbar]:hidden">
              {items.map((movie) => (
                <div key={movie.id} className="w-40 shrink-0 sm:w-44">
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </FadeIn>
  );
}
