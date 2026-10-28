"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import SiteShell from "@/components/layout/SiteShell";
import MovieCard from "@/components/movie/MovieCard";
import { getMovies } from "@/services/movie.service";
import type { Movie } from "@/types/movie";

function Catalog() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";
  const [items, setItems] = useState<Movie[]>([]);
  const [genre, setGenre] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMovies()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const genres = useMemo(() => {
    const unique = Array.from(
      new Set(items.map((movie) => movie.genre).filter(Boolean)),
    ) as string[];
    return ["All", ...unique.sort()];
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((movie) => {
      const matchesQuery = `${movie.title} ${movie.producer || ""} ${movie.genre || ""}`
        .toLowerCase()
        .includes(query);
      const matchesGenre = genre === "All" || movie.genre === genre;
      return matchesQuery && matchesGenre;
    });
  }, [items, query, genre]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <p className="text-xs uppercase tracking-[0.28em] text-[#d4a24c]">Catalog</p>
      <h1 className="mt-2 text-4xl font-bold">Pick a title to rent or own</h1>
      <p className="mt-3 max-w-2xl text-[#cbbba4]">
        Browse posters, read the synopsis, then choose a timed rental or a
        permanent purchase from your wallet.
      </p>
      {query && (
        <p className="mt-4 text-sm text-[#d4a24c]">Showing results for “{query}”</p>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {genres.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setGenre(item)}
            className={`rounded-full px-3 py-1 text-xs ${genre === item ? "bg-[#d4a24c] text-[#08070b]" : "border border-[#2a241c] text-[#cbbba4]"}`}
          >
            {item}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-10 text-[#b8ab98]">Loading catalog...</p>
      ) : filtered.length === 0 ? (
        <p className="mt-10 text-[#b8ab98]">
          No movies in the catalog yet. Restart the backend so the seed titles
          can load, or publish one from Studio.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {filtered.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function MoviesPage() {
  return (
    <SiteShell>
      <Suspense fallback={<div className="px-6 py-16 text-[#cbbba4]">Loading catalog...</div>}>
        <Catalog />
      </Suspense>
    </SiteShell>
  );
}
