"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { Play, Sparkles } from "lucide-react";
import { toast } from "sonner";
import SiteShell from "@/components/layout/SiteShell";
import PosterArt from "@/components/movie/PosterArt";
import TrailerPlayer from "@/components/movie/TrailerPlayer";
import CinemaPlayerModal from "@/components/movie/CinemaPlayerModal";
import WatchlistButton from "@/components/movie/WatchlistButton";
import MovieReviewsSection from "@/components/movie/MovieReviewsSection";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { formatMoney } from "@/lib/format";
import { getMovie } from "@/services/movie.service";
import {
  getMyPurchases,
  getMyRentals,
  purchaseMovie,
  rentMovie,
} from "@/services/library.service";
import type { Movie } from "@/types/movie";

const durations = [
  { days: 1 as const, label: "1 night" },
  { days: 3 as const, label: "3 days" },
  { days: 7 as const, label: "1 week" },
];

const getErrorMessage = (error: unknown, fallback: string) =>
  isAxiosError<{ message?: string }>(error)
    ? error.response?.data?.message || fallback
    : fallback;

const getMovieAccess = async (movieId: number) => {
  const [rentals, purchases] = await Promise.all([
    getMyRentals(),
    getMyPurchases(),
  ]);
  const activeRental = rentals.find(
    (item) => Number(item.movie_id) === movieId && item.status === "active",
  );

  return {
    owned: purchases.some((item) => Number(item.movie_id) === movieId),
    rentalExpires: activeRental?.expires_at || null,
  };
};

export default function MovieDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [duration, setDuration] = useState<1 | 3 | 7>(3);
  const [busy, setBusy] = useState<"rent" | "buy" | null>(null);
  const [owned, setOwned] = useState(false);
  const [rentalExpires, setRentalExpires] = useState<string | null>(null);
  const [theaterOpen, setTheaterOpen] = useState(false);

  const loadAccess = async () => {
    if (!isAuthenticated || user?.role === "producer") return;

    try {
      const access = await getMovieAccess(Number(params.id));
      setOwned(access.owned);
      setRentalExpires(access.rentalExpires);
    } catch {
      setOwned(false);
    }
  };

  useEffect(() => {
    getMovie(params.id)
      .then(setMovie)
      .catch(() => setMovie(null));
  }, [params.id]);

  useEffect(() => {
    if (!isAuthenticated || user?.role === "producer") return;

    let isCurrent = true;
    getMovieAccess(Number(params.id))
      .then((access) => {
        if (!isCurrent) return;
        setOwned(access.owned);
        setRentalExpires(access.rentalExpires);
      })
      .catch(() => {
        if (isCurrent) setOwned(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [isAuthenticated, params.id, user?.role]);

  const requireCustomer = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return false;
    }
    if (user?.role === "producer") {
      toast.error(
        "Authors publish movies. Switch to a customer account to rent or buy.",
      );
      return false;
    }
    return true;
  };

  const handleRent = async () => {
    if (!movie || !requireCustomer()) return;
    try {
      setBusy("rent");
      const response = await rentMovie(movie.id, duration);
      toast.success(response.message || "Movie rented");
      await loadAccess();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Unable to rent this movie."));
    } finally {
      setBusy(null);
    }
  };

  const handleBuy = async () => {
    if (!movie || !requireCustomer()) return;
    try {
      setBusy("buy");
      const response = await purchaseMovie(movie.id);
      toast.success(response.message || "Movie purchased");
      await loadAccess();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Unable to purchase this movie."));
    } finally {
      setBusy(null);
    }
  };

  if (!movie) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-4xl px-6 py-20 text-[#cbbba4]">
          Loading title...
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[280px_1fr]">
        <div className="space-y-4">
          <div className="aspect-3/4 overflow-hidden rounded-2xl border border-[#2a241c]">
            <PosterArt title={movie.title} image={movie.image} />
          </div>

          <div className="space-y-2">
            <WatchlistButton
              movieId={movie.id}
              variant="button"
              className="w-full"
            />
            {movie.trailer_url && (
              <Button
                type="button"
                onClick={() => setTheaterOpen(true)}
                className="h-11 w-full cursor-pointer bg-[#d4a24c] text-xs font-bold text-[#08070b] hover:bg-amber-300"
              >
                <Play className="mr-1.5 h-4 w-4 fill-current" />
                Theater Screening
              </Button>
            )}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-[0.28em] text-[#d4a24c]">
              {movie.genre || "Feature"} · {movie.year || "New"} ·{" "}
              {movie.duration}
            </span>
            {Number(movie.avg_rating || 0) > 0 && (
              <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-xs font-bold text-amber-400">
                ⭐ {Number(movie.avg_rating).toFixed(1)} / 5 ({movie.reviews_count || 0})
              </span>
            )}
          </div>

          <h1 className="mt-2 text-4xl font-bold">{movie.title}</h1>
          <p className="mt-2 text-sm text-[#d4a24c]">
            By {movie.producer || "an author"}
          </p>
          <p className="mt-4 max-w-2xl text-[#cbbba4]">
            {movie.description ||
              "No synopsis yet. Rent it for a limited window, or purchase it for keeps."}
          </p>

          <section id="trailer" className="mt-8 max-w-3xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Official trailer</h2>
                <p className="mt-0.5 text-xs text-[#b8ab98]">
                  Preview this title. Full-length movie streaming is not available.
                </p>
              </div>
              {movie.trailer_url && (
                <button
                  type="button"
                  onClick={() => setTheaterOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#d4a24c] hover:underline cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Fullscreen Theater Mode
                </button>
              )}
            </div>
            <TrailerPlayer title={movie.title} trailerUrl={movie.trailer_url} />
          </section>

          <div className="mt-8 grid max-w-xl gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#2a241c] bg-[#141118] p-5">
              <p className="text-sm text-[#b8ab98]">Rent</p>
              <p className="mt-2 text-xs text-[#cbbba4]">
                Trailer access for a limited period.
              </p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {formatMoney(movie.rental_price)}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {durations.map((option) => (
                  <button
                    key={option.days}
                    type="button"
                    onClick={() => setDuration(option.days)}
                    className={`rounded-full px-3 py-1 text-xs ${duration === option.days ? "bg-[#d4a24c] cursor-pointer text-[#08070b]" : "border border-[#2a241c] text-[#cbbba4]"}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <Button
                onClick={handleRent}
                disabled={busy !== null || owned}
                className="mt-4 h-11 w-full bg-[#d4a24c] text-[#08070b] hover:bg-[#d4a24c]"
              >
                {busy === "rent" ? "Renting..." : "Rent with wallet"}
              </Button>
            </div>

            <div className="rounded-2xl border border-[#2a241c] bg-[#141118] p-5">
              <p className="text-sm text-[#b8ab98]">Purchase</p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {formatMoney(movie.purchase_price)}
              </p>
              <p className="mt-2 text-xs text-[#cbbba4]">
                Keep this catalog title and its trailer on your account.
              </p>
              <Button
                onClick={handleBuy}
                disabled={busy !== null || owned}
                className="mt-7 h-11 w-full border cursor-pointer border-[#d4a24c] bg-transparent text-[#d4a24c] hover:bg-[#d4a24c] hover:text-[#08070b]"
              >
                {owned
                  ? "Already owned"
                  : busy === "buy"
                    ? "Buying..."
                    : "Buy forever"}
              </Button>
            </div>
          </div>

          {(owned || rentalExpires) && (
            <div className="mt-6 rounded-xl border border-[#d4a24c]/30 bg-[#d4a24c]/10 p-4 text-sm">
              {owned ? (
                <p>
                  You own this title. Open it from your library whenever you
                  like.
                </p>
              ) : (
                <p>
                  Active rental until{" "}
                  {new Date(rentalExpires as string).toLocaleString()}.
                </p>
              )}
              <Link
                href="/library"
                className="mt-2 inline-block text-[#d4a24c]"
              >
                Go to library
              </Link>
            </div>
          )}

          {/* REVIEWS & RATINGS SECTION */}
          <MovieReviewsSection movieId={movie.id} />
        </div>
      </section>

      {/* THEATER CINEMA MODAL */}
      <CinemaPlayerModal
        movie={theaterOpen ? movie : null}
        onClose={() => setTheaterOpen(false)}
      />
    </SiteShell>
  );
}
