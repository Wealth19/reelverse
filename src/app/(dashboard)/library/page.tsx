"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Film,
  Play,
  Ticket,
  ShoppingBag,
  Clock,
  Sparkles,
  Wallet,
  History,
  Bookmark,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import PosterArt from "@/components/movie/PosterArt";
import CinemaPlayerModal from "@/components/movie/CinemaPlayerModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { formatMoney } from "@/lib/format";
import {
  getMyPurchases,
  getMyRentals,
  getWatchHistory,
  saveWatchHistory,
  type WatchHistoryItem,
} from "@/services/library.service";
import { getWatchlist, toggleWatchlist } from "@/services/watchlist.service";
import type { Movie, Purchase, Rental } from "@/types/movie";

export default function LibraryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cinemaMovie, setCinemaMovie] = useState<Movie | null>(null);

  const loadData = async () => {
    try {
      const [nextRentals, nextPurchases, nextWatchlist, nextHistory] =
        await Promise.all([
          getMyRentals(),
          getMyPurchases(),
          getWatchlist().catch(() => []),
          getWatchHistory().catch(() => []),
        ]);
      setRentals(nextRentals);
      setPurchases(nextPurchases);
      setWatchlist(nextWatchlist);
      setWatchHistory(nextHistory);
    } catch {
      toast.error("Could not load your library.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const activeRentalsCount = useMemo(
    () => rentals.filter((r) => r.status === "active").length,
    [rentals],
  );

  const uniqueHistory = useMemo(() => {
    const seen = new Set<number>();
    return watchHistory.filter((item) => {
      if (seen.has(item.movie_id)) return false;
      seen.add(item.movie_id);
      return true;
    });
  }, [watchHistory]);

  const handleRemoveFromWatchlist = async (movieId: number) => {
    try {
      await toggleWatchlist(movieId);
      setWatchlist((prev) => prev.filter((m) => m.id !== movieId));
      toast.info("Removed from watchlist");
    } catch {
      toast.error("Could not update watchlist");
    }
  };

  const watch = async (movieId: number, movieDetails?: Movie) => {
    try {
      await saveWatchHistory(movieId);
      if (movieDetails && movieDetails.trailer_url) {
        setCinemaMovie(movieDetails);
      } else {
        router.push(`/movies/${movieId}`);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "You cannot watch this yet.",
      );
    }
  };

  if (user?.role === "producer") {
    return (
      <div className="mx-auto max-w-3xl px-6 py-14">
        <div className="rounded-3xl border border-[#2a241c] bg-[#141118] p-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            Library is for customers
          </h1>
          <p className="mt-3 text-sm text-[#cbbba4]">
            Author accounts publish movies. Use Studio to manage your catalog.
          </p>
          <Link
            href="/studio"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#d4a24c] px-5 py-2.5 text-xs font-semibold text-[#08070b] transition hover:bg-amber-300"
          >
            Open Studio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d4a24c]">
            Your Screening Room
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">
            My Library
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[#cbbba4]">
            Stream active rentals, access permanently purchased films, and review
            saved titles on your personal watchlist.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/wallet"
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#2a241c] bg-[#141118] px-3.5 text-xs font-medium text-[#cbbba4] transition hover:border-[#d4a24c]/50 hover:text-white"
          >
            <Wallet className="h-3.5 w-3.5 text-[#d4a24c]" />
            My Wallet
          </Link>
          <Link
            href="/movies"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#d4a24c] px-4 text-xs font-semibold text-[#08070b] transition hover:bg-amber-300"
          >
            <Film className="h-3.5 w-3.5" />
            Explore Catalog
          </Link>
        </div>
      </div>

      {/* SUMMARY STATS */}
      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        <div className="flex items-center gap-4 rounded-2xl border border-[#2a241c] bg-[#141118] p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#2a241c] bg-[#1b1522] text-[#d4a24c]">
            <Ticket className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-[#b8ab98]">Active Rentals</p>
            <p className="mt-0.5 text-xl font-bold text-white">
              {loading ? "—" : activeRentalsCount}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-[#2a241c] bg-[#141118] p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#2a241c] bg-[#1b1522] text-[#d4a24c]">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-[#b8ab98]">Owned Titles</p>
            <p className="mt-0.5 text-xl font-bold text-white">
              {loading ? "—" : purchases.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-[#2a241c] bg-[#141118] p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#2a241c] bg-[#1b1522] text-[#d4a24c]">
            <Bookmark className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-[#b8ab98]">Watchlist</p>
            <p className="mt-0.5 text-xl font-bold text-white">
              {loading ? "—" : watchlist.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-[#2a241c] bg-[#141118] p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#2a241c] bg-[#1b1522] text-[#d4a24c]">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-[#b8ab98]">Watched</p>
            <p className="mt-0.5 text-xl font-bold text-white">
              {loading ? "—" : uniqueHistory.length}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-36 animate-pulse rounded-2xl border border-[#2a241c] bg-[#141118]"
            />
          ))}
        </div>
      ) : (
        <>
          {/* RENTALS SECTION */}
          <section className="mt-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Ticket className="h-5 w-5 text-[#d4a24c]" />
                <h2 className="text-xl font-semibold text-white">Rentals</h2>
              </div>
              <span className="text-xs text-[#b8ab98]">
                {rentals.length} {rentals.length === 1 ? "title" : "titles"}
              </span>
            </div>

            {rentals.length === 0 ? (
              <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-[#2a241c] bg-[#141118]/60 px-6 py-10 text-center">
                <p className="text-sm font-medium text-white">No rentals yet</p>
                <p className="mt-1 text-xs text-[#b8ab98]">
                  Rent any movie from the catalog for temporary screening
                  access.
                </p>
                <Link
                  href="/movies"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#d4a24c] hover:underline"
                >
                  Browse movies to rent
                </Link>
              </div>
            ) : (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {rentals.map((rental) => {
                  const isActive = rental.status === "active";
                  return (
                    <article
                      key={rental.id}
                      className="group flex gap-4 rounded-2xl border border-[#2a241c] bg-[#141118] p-4 transition hover:border-[#d4a24c]/40"
                    >
                      <div className="h-32 w-22 shrink-0 overflow-hidden rounded-xl border border-[#2a241c]">
                        <PosterArt title={rental.title} image={rental.image} />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="truncate font-semibold text-white">
                              {rental.title}
                            </h3>
                            <span
                              className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                                isActive
                                  ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                  : "border border-[#2a241c] bg-white/5 text-[#b8ab98]"
                              }`}
                            >
                              {isActive ? "Active" : "Expired"}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-[#cbbba4]">
                            {rental.duration_days} day rental ·{" "}
                            {formatMoney(rental.amount)}
                          </p>
                          <p className="mt-1 text-xs text-[#b8ab98]">
                            {isActive ? (
                              <>
                                Expires{" "}
                                <span className="text-[#d4a24c]">
                                  {new Date(rental.expires_at).toLocaleString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      hour: "numeric",
                                      minute: "2-digit",
                                    },
                                  )}
                                </span>
                              </>
                            ) : (
                              <span>Rental period has ended</span>
                            )}
                          </p>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          {isActive ? (
                            <Button
                              onClick={() => watch(rental.movie_id)}
                              className="h-8 cursor-pointer rounded-lg bg-[#d4a24c] px-3.5 text-xs font-semibold text-[#08070b] hover:bg-amber-300"
                            >
                              <Play className="mr-1.5 h-3.5 w-3.5 fill-current" />
                              Watch Trailer
                            </Button>
                          ) : (
                            <Link
                              href={`/movies/${rental.movie_id}`}
                              className="inline-flex h-8 items-center rounded-lg border border-[#2a241c] bg-[#08070b]/60 px-3 text-xs font-medium text-[#cbbba4] transition hover:border-[#d4a24c]/50 hover:text-white"
                            >
                              Rent Again
                            </Link>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* PURCHASES SECTION */}
          <section className="mt-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="h-5 w-5 text-[#d4a24c]" />
                <h2 className="text-xl font-semibold text-white">Purchases</h2>
              </div>
              <span className="text-xs text-[#b8ab98]">
                {purchases.length} {purchases.length === 1 ? "title" : "titles"}
              </span>
            </div>

            {purchases.length === 0 ? (
              <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-[#2a241c] bg-[#141118]/60 px-6 py-10 text-center">
                <p className="text-sm font-medium text-white">
                  No permanent purchases yet
                </p>
                <p className="mt-1 text-xs text-[#b8ab98]">
                  Buy your favorite films to keep lifetime access on your
                  account.
                </p>
                <Link
                  href="/movies"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#d4a24c] hover:underline"
                >
                  Explore catalog
                </Link>
              </div>
            ) : (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {purchases.map((purchase) => (
                  <article
                    key={purchase.id}
                    className="group flex gap-4 rounded-2xl border border-[#2a241c] bg-[#141118] p-4 transition hover:border-[#d4a24c]/40"
                  >
                    <div className="h-32 w-22 shrink-0 overflow-hidden rounded-xl border border-[#2a241c]">
                      <PosterArt
                        title={purchase.title}
                        image={purchase.image}
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="truncate font-semibold text-white">
                            {purchase.title}
                          </h3>
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#d4a24c]/30 bg-[#d4a24c]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#d4a24c]">
                            <Sparkles className="h-2.5 w-2.5" />
                            Owned
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-[#cbbba4]">
                          Lifetime access · {formatMoney(purchase.amount)}
                        </p>
                      </div>

                      <div className="mt-3">
                        <Button
                          onClick={() => watch(purchase.movie_id)}
                          className="h-8 cursor-pointer rounded-lg bg-[#d4a24c] px-3.5 text-xs font-semibold text-[#08070b] hover:bg-amber-300"
                        >
                          <Play className="mr-1.5 h-3.5 w-3.5 fill-current" />
                          Watch Trailer
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* WATCHLIST SECTION */}
          <section className="mt-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Bookmark className="h-5 w-5 text-[#d4a24c]" />
                <h2 className="text-xl font-semibold text-white">My Watchlist</h2>
              </div>
              <span className="text-xs text-[#b8ab98]">
                {watchlist.length} {watchlist.length === 1 ? "saved" : "saved"}
              </span>
            </div>

            {watchlist.length === 0 ? (
              <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-[#2a241c] bg-[#141118]/60 px-6 py-10 text-center">
                <p className="text-sm font-medium text-white">
                  Your watchlist is empty
                </p>
                <p className="mt-1 text-xs text-[#b8ab98]">
                  Click the bookmark icon on any movie to save it for later.
                </p>
                <Link
                  href="/movies"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#d4a24c] hover:underline"
                >
                  Browse catalog
                </Link>
              </div>
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {watchlist.map((m) => (
                  <article
                    key={m.id}
                    className="group relative flex gap-3.5 rounded-2xl border border-[#2a241c] bg-[#141118] p-3.5 transition hover:border-[#d4a24c]/40"
                  >
                    <div className="h-24 w-16 shrink-0 overflow-hidden rounded-xl border border-[#2a241c]">
                      <PosterArt title={m.title} image={m.image} />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <Link
                            href={`/movies/${m.id}`}
                            className="truncate text-sm font-bold text-white transition hover:text-[#d4a24c]"
                          >
                            {m.title}
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleRemoveFromWatchlist(m.id)}
                            className="text-[#6b6070] transition hover:text-rose-400 p-1"
                            title="Remove from watchlist"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="mt-0.5 text-xs text-[#b8ab98]">
                          {[m.year, m.genre].filter(Boolean).join(" · ")}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-[#d4a24c]">
                          Rent {formatMoney(m.rental_price)} · Own {formatMoney(m.purchase_price)}
                        </p>
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        <Link
                          href={`/movies/${m.id}`}
                          className="inline-flex h-7 items-center rounded-lg bg-[#d4a24c] px-3 text-[11px] font-semibold text-[#08070b] transition hover:bg-amber-300"
                        >
                          View &amp; Rent
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* RECENTLY WATCHED SECTION */}
          {uniqueHistory.length > 0 && (
            <section className="mt-12">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <History className="h-5 w-5 text-[#d4a24c]" />
                  <h2 className="text-xl font-semibold text-white">
                    Recently Watched
                  </h2>
                </div>
                <span className="text-xs text-[#b8ab98]">
                  {uniqueHistory.length}{" "}
                  {uniqueHistory.length === 1 ? "session" : "sessions"}
                </span>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {uniqueHistory.slice(0, 6).map((item) => (
                  <Link
                    key={item.id}
                    href={`/movies/${item.movie_id}`}
                    className="group flex items-center gap-3.5 rounded-2xl border border-[#2a241c] bg-[#141118] p-3.5 transition hover:border-[#d4a24c]/40"
                  >
                    <div className="h-20 w-14 shrink-0 overflow-hidden rounded-lg border border-[#2a241c]">
                      <PosterArt
                        title={item.title}
                        image={item.poster_url || undefined}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-white group-hover:text-[#d4a24c]">
                        {item.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-[#cbbba4]">
                        {item.genre || "Feature"}{" "}
                        {item.duration ? `· ${item.duration}` : ""}
                      </p>
                      <p className="mt-1 text-[11px] text-[#b8ab98]">
                        Watched{" "}
                        {new Date(item.watched_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* CINEMA THEATER MODAL */}
      <CinemaPlayerModal
        movie={cinemaMovie}
        onClose={() => setCinemaMovie(null)}
      />
    </div>
  );
}
