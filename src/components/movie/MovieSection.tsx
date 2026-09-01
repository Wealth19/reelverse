"use client";

import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";

import { Button } from "@/components/ui/button";
import movies from "./Movies";
import FadeIn from "../shared/FadeIn";
import { getMovies } from "@/services/movie.service";
import type { Movie } from "@/types/movie";

export default function MovieSection() {
  const [items, setItems] = useState<Movie[]>(movies);

  useEffect(() => {
    getMovies()
      .then((remoteMovies) => {
        if (remoteMovies.length > 0) setItems(remoteMovies);
      })
      .catch(() => undefined);
  }, []);

  return (
    <FadeIn className="relative z-20 -mt-16 sm:-mt-20">
      <section className="bg-slate-950/95 py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="border-l-2 border-red-500 pl-3 text-xl font-bold">
                Now Playing
              </h2>
            </div>

            <Button className="cursor-pointer bg-transparent px-2 text-xs text-slate-300 hover:bg-transparent hover:text-white">
              View All
            </Button>
          </div>

          <div className="scrollbar-none flex gap-3 overflow-x-auto pb-3 [&::-webkit-scrollbar]:hidden">
            {items.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
