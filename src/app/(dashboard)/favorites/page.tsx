"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Heart,
  Film,
  Sparkles,
  Trash2,
  Play,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import PosterArt from "@/components/movie/PosterArt";
import CinemaPlayerModal from "@/components/movie/CinemaPlayerModal";
import { formatMoney } from "@/lib/format";
import { getWatchlist, toggleWatchlist } from "@/services/watchlist.service";
import type { Movie } from "@/types/movie";

export default function FavoritesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const loadFavorites = async () => {
    try {
      const data = await getWatchlist();
      setMovies(data);
    } catch {
      toast.error("Could not load your favorites.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadFavorites();
  }, []);

  const handleRemove = async (movieId: number, title: string) => {
    try {
      await toggleWatchlist(movieId);
      setMovies((prev) => prev.filter((m) => m.id !== movieId));
      toast.info(`Removed "${title}" from favorites.`);
    } catch {
      toast.error("Could not remove from favorites.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Link
            href="/movies"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#b8ab98] transition hover:text-[#d4a24c]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Catalog
          </Link>
          <div className="mt-3 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#d4a24c]/30 bg-[#d4a24c]/10 text-[#d4a24c]">
              <Heart className="h-5 w-5 fill-current" />
            </span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                My Favorites
              </h1>
              <p className="text-xs text-[#b8ab98]">
                {movies.length} {movies.length === 1 ? "saved movie" : "saved movies"} in your personal collection
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/movies"
          className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#d4a24c] px-4 text-xs font-semibold text-[#08070b] transition hover:bg-amber-300"
        >
          <Film className="h-3.5 w-3.5" />
          Browse More Titles
        </Link>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-36 animate-pulse rounded-2xl border border-[#2a241c] bg-[#141118]"
            />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-[#2a241c] bg-[#141118]/70 px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#2a241c] bg-[#1b1522] text-[#d4a24c]">
            <Heart className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-white">
            No favorite movies yet
          </h3>
          <p className="mt-1 max-w-sm text-xs text-[#b8ab98]">
            Click the bookmark or favorite icon on any movie card while browsing to save titles here for easy access.
          </p>
          <Link
            href="/movies"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#d4a24c] px-5 py-2.5 text-xs font-semibold text-[#08070b] transition hover:bg-amber-300"
          >
            <Sparkles className="h-4 w-4" />
            Explore Movie Catalog
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {movies.map((movie) => (
            <article
              key={movie.id}
              className="group flex flex-col justify-between rounded-2xl border border-[#2a241c] bg-[#141118] p-4 transition hover:border-[#d4a24c]/40"
            >
              <div className="flex gap-4">
                <div className="h-28 w-20 shrink-0 overflow-hidden rounded-xl border border-[#2a241c]">
                  <PosterArt title={movie.title} image={movie.image} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-1">
                    <Link
                      href={`/movies/${movie.id}`}
                      className="truncate text-base font-bold text-white transition hover:text-[#d4a24c]"
                    >
                      {movie.title}
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleRemove(movie.id, movie.title)}
                      className="cursor-pointer text-[#6b6070] transition hover:text-rose-400 p-1"
                      title="Remove from favorites"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <p className="mt-0.5 text-xs text-[#b8ab98]">
                    {[movie.year, movie.genre].filter(Boolean).join(" · ")}
                  </p>

                  <div className="mt-2 text-xs">
                    <span className="text-[#b8ab98]">Rent: </span>
                    <strong className="text-white">
                      {formatMoney(movie.rental_price)}
                    </strong>
                    <span className="mx-1 text-[#6b6070]">·</span>
                    <span className="text-[#b8ab98]">Own: </span>
                    <strong className="text-[#d4a24c]">
                      {formatMoney(movie.purchase_price)}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-[#2a241c] pt-3">
                <Link
                  href={`/movies/${movie.id}`}
                  className="flex-1 inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-[#d4a24c] px-3 text-xs font-bold text-[#08070b] transition hover:bg-amber-300"
                >
                  <ExternalLink className="h-3 w-3" />
                  Rent &amp; Buy
                </Link>

                {movie.trailer_url && (
                  <button
                    type="button"
                    onClick={() => setSelectedMovie(movie)}
                    className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-[#2a241c] bg-[#08070b] px-3 text-xs font-semibold text-[#cbbba4] transition hover:border-[#d4a24c]/50 hover:text-white"
                  >
                    <Play className="h-3 w-3 fill-current text-[#d4a24c]" />
                    Trailer
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* THEATER CINEMA MODAL */}
      <CinemaPlayerModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  );
}

