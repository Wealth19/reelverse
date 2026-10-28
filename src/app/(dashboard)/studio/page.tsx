"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import {
  Clapperboard,
  Film,
  Plus,
  Ticket,
  ShoppingBag,
  TrendingUp,
  Trash2,
  ExternalLink,
  Search,
  RefreshCw,
  Video,
  Pencil,
  X,
  Loader2,
  Banknote,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";
import PosterArt from "@/components/movie/PosterArt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { formatMoney } from "@/lib/format";
import {
  deleteMovie,
  getMyMovies,
  updateMovie,
} from "@/services/movie.service";
import {
  getMyPayouts,
  requestPayout,
} from "@/services/payout.service";
import type { Movie, PayoutRequest, ProducerFinancials } from "@/types/movie";

const POPULAR_BANKS = [
  "Access Bank",
  "Guaranty Trust Bank (GTBank)",
  "Zenith Bank",
  "United Bank for Africa (UBA)",
  "First Bank of Nigeria",
  "Kuda Bank",
  "OPay",
  "Moniepoint",
  "Stanbic IBTC",
  "Fidelity Bank",
  "PalmPay",
];

export default function StudioPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [financials, setFinancials] = useState<ProducerFinancials | null>(null);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");

  // Edit movie modal state
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    rental_price: "",
    purchase_price: "",
    poster_url: "",
    trailer_url: "",
    genre: "",
    release_year: "",
    duration: "",
  });

  // Payout request modal state
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutBusy, setPayoutBusy] = useState(false);
  const [payoutForm, setPayoutForm] = useState({
    amount: "",
    bank_name: POPULAR_BANKS[0],
    account_number: "",
    account_name: "",
    notes: "",
  });

  const loadData = async (silent = false) => {
    try {
      if (silent) setRefreshing(true);
      const [moviesData, payoutData] = await Promise.all([
        getMyMovies(),
        getMyPayouts().catch(() => null),
      ]);
      setMovies(moviesData);
      if (payoutData) {
        setFinancials(payoutData.financials);
        setPayouts(payoutData.requests || []);
      }
    } catch {
      toast.error("Could not load your studio dashboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user && user.role !== "producer") {
      router.replace("/movies");
      return;
    }

    void loadData();
  }, [user, router]);

  const openEditModal = (movie: Movie) => {
    setEditingMovie(movie);
    setEditForm({
      title: movie.title || "",
      description: movie.description || "",
      rental_price: String(movie.rental_price ?? ""),
      purchase_price: String(movie.purchase_price ?? ""),
      poster_url: movie.image || "",
      trailer_url: movie.trailer_url || "",
      genre: movie.genre || "Drama",
      release_year: movie.year ? String(movie.year) : "2026",
      duration: movie.duration || "2h 10m",
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMovie) return;

    const rentalPrice = Number(editForm.rental_price);
    const purchasePrice = Number(editForm.purchase_price);

    if (!editForm.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (rentalPrice <= 0 || purchasePrice <= 0) {
      toast.error("Rental and purchase prices must be greater than 0.");
      return;
    }

    try {
      setSavingEdit(true);
      await updateMovie(editingMovie.id, {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        rental_price: rentalPrice,
        purchase_price: purchasePrice,
        poster_url: editForm.poster_url.trim() || undefined,
        trailer_url: editForm.trailer_url.trim() || undefined,
        genre: editForm.genre.trim() || "Feature",
        release_year: Number(editForm.release_year) || 2026,
        duration: editForm.duration.trim() || "2h 00m",
      });

      toast.success(`"${editForm.title.trim()}" updated!`);
      setEditingMovie(null);
      await loadData(true);
    } catch (error: unknown) {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(message || "Could not update movie.");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(payoutForm.amount);
    if (!amountNum || amountNum < 1000) {
      toast.error("Minimum withdrawal request is ₦1,000.");
      return;
    }

    const available = financials?.availableBalance ?? summary.totalRevenue;
    if (amountNum > available) {
      toast.error(
        `Requested amount exceeds your available balance (${formatMoney(available)}).`,
      );
      return;
    }

    if (!payoutForm.account_number || payoutForm.account_number.length < 10) {
      toast.error("Please enter a valid 10-digit account number.");
      return;
    }

    if (!payoutForm.account_name.trim()) {
      toast.error("Please enter the beneficiary account name.");
      return;
    }

    try {
      setPayoutBusy(true);
      const res = await requestPayout({
        amount: amountNum,
        bank_name: payoutForm.bank_name,
        account_number: payoutForm.account_number.trim(),
        account_name: payoutForm.account_name.trim(),
        notes: payoutForm.notes.trim() || undefined,
      });

      setFinancials(res.financials);
      setPayouts((prev) => [res.request, ...prev]);
      setPayoutModalOpen(false);
      setPayoutForm({
        amount: "",
        bank_name: POPULAR_BANKS[0],
        account_number: "",
        account_name: "",
        notes: "",
      });
      toast.success("Withdrawal request submitted for settlement!");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Could not process payout request.",
      );
    } finally {
      setPayoutBusy(false);
    }
  };

  const remove = async (movie: Movie) => {
    try {
      setDeletingId(movie.id);
      await deleteMovie(movie.id);
      setMovies((current) => current.filter((item) => item.id !== movie.id));
      toast.success(`"${movie.title}" removed from catalog.`);
    } catch (error: unknown) {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(message || "Could not delete this movie.");
    } finally {
      setDeletingId(null);
    }
  };

  const summary = useMemo(() => {
    let totalRentals = 0;
    let activeRentals = 0;
    let totalPurchases = 0;
    let totalViews = 0;
    let totalRevenue = 0;

    for (const m of movies) {
      totalRentals += Number(m.rental_count || 0);
      activeRentals += Number(m.active_rentals || 0);
      totalPurchases += Number(m.purchase_count || 0);
      totalViews += Number(m.views_count || 0);
      totalRevenue += Number(m.total_revenue || 0);
    }

    return {
      uploadedCount: movies.length,
      totalRentals,
      activeRentals,
      totalPurchases,
      totalViews,
      totalRevenue,
    };
  }, [movies]);

  const genres = useMemo(() => {
    const unique = new Set<string>();
    movies.forEach((m) => {
      if (m.genre) unique.add(m.genre);
    });
    return Array.from(unique).sort();
  }, [movies]);

  const filteredMovies = useMemo(() => {
    const term = search.trim().toLowerCase();
    return movies.filter((m) => {
      const matchesSearch =
        !term ||
        m.title.toLowerCase().includes(term) ||
        (m.description && m.description.toLowerCase().includes(term));
      const matchesGenre =
        genreFilter === "all" ||
        (m.genre && m.genre.toLowerCase() === genreFilter.toLowerCase());
      return matchesSearch && matchesGenre;
    });
  }, [movies, search, genreFilter]);

  const availableBalance = financials
    ? financials.availableBalance
    : summary.totalRevenue;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d4a24c]">
            Author Control &amp; Analytics
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">
            Author Studio
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[#cbbba4]">
            Track performance metrics across your uploaded titles, request direct
            payouts to your bank account, and manage your film listings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={() => void loadData(true)}
            disabled={refreshing}
            className="h-10 cursor-pointer rounded-xl border-[#2a241c] bg-[#141118] px-3.5 text-xs text-[#cbbba4] hover:border-[#d4a24c]/50 hover:text-white"
          >
            <RefreshCw
              className={`mr-2 h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh Stats
          </Button>

          <Button
            type="button"
            onClick={() => setPayoutModalOpen(true)}
            className="h-10 cursor-pointer rounded-xl border border-[#d4a24c]/40 bg-[#1b1522] px-4 text-xs font-semibold text-[#d4a24c] transition hover:bg-[#d4a24c]/10"
          >
            <Banknote className="mr-1.5 h-4 w-4" />
            Request Payout
          </Button>

          <Link
            href="/studio/new"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#d4a24c] px-4 text-xs font-semibold text-[#08070b] transition hover:bg-amber-300"
          >
            <Plus className="h-4 w-4" />
            Upload Movie
          </Link>
        </div>
      </div>

      {/* TRACKING KPI CARDS */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative overflow-hidden rounded-2xl border border-[#2a241c] bg-linear-to-br from-[#1b1420] to-[#141118] p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-[#b8ab98]">
              Videos Uploaded
            </p>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2a241c] bg-[#08070b]/60 text-[#d4a24c]">
              <Clapperboard className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold tabular-nums text-white">
            {loading ? "—" : summary.uploadedCount}
          </p>
          <p className="mt-1 text-xs text-[#cbbba4]">
            Published in ReelVerse catalog
          </p>
        </div>

        <div className="rounded-2xl border border-[#2a241c] bg-[#141118] p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-[#b8ab98]">
              Customer Rentals
            </p>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2a241c] bg-[#1b1522] text-[#d4a24c]">
              <Ticket className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold tabular-nums text-white">
            {loading ? "—" : summary.totalRentals}
          </p>
          <p className="mt-1 text-xs text-emerald-400">
            {loading ? "—" : `${summary.activeRentals} active right now`}
          </p>
        </div>

        <div className="rounded-2xl border border-[#2a241c] bg-[#141118] p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-[#b8ab98]">
              Lifetime Purchases
            </p>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2a241c] bg-[#1b1522] text-[#d4a24c]">
              <ShoppingBag className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold tabular-nums text-white">
            {loading ? "—" : summary.totalPurchases}
          </p>
          <p className="mt-1 text-xs text-[#cbbba4]">
            {loading ? "—" : `${summary.totalViews} total trailer views`}
          </p>
        </div>

        <div className="rounded-2xl border border-[#2a241c] bg-[#141118] p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-[#b8ab98]">
              Available for Payout
            </p>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2a241c] bg-[#1b1522] text-[#d4a24c]">
              <TrendingUp className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold tabular-nums text-[#d4a24c]">
            {loading ? "—" : formatMoney(availableBalance)}
          </p>
          <p className="mt-1 text-xs text-[#cbbba4]">
            Total earned: {loading ? "—" : formatMoney(financials?.totalEarned ?? summary.totalRevenue)}
          </p>
        </div>
      </div>

      {/* WITHDRAWAL & PAYOUT REQUESTS SECTION */}
      {payouts.length > 0 && (
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Payout &amp; Settlement Requests
              </h2>
              <p className="mt-0.5 text-xs text-[#b8ab98]">
                Direct bank transfers initiated from your catalog earnings.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPayoutModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#d4a24c] hover:underline cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              New Withdrawal
            </button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {payouts.map((req) => (
              <div
                key={req.id}
                className="rounded-2xl border border-[#2a241c] bg-[#141118] p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">
                    {formatMoney(req.amount)}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      req.status === "approved"
                        ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : req.status === "rejected"
                          ? "border border-rose-500/30 bg-rose-500/10 text-rose-400"
                          : "border border-amber-500/30 bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {req.status === "approved" && <CheckCircle2 className="h-3 w-3" />}
                    {req.status === "pending" && <Clock className="h-3 w-3" />}
                    {req.status === "rejected" && <AlertCircle className="h-3 w-3" />}
                    {req.status}
                  </span>
                </div>

                <div className="text-xs text-[#b8ab98]">
                  <p className="text-white font-medium">{req.bank_name}</p>
                  <p>{req.account_number} · {req.account_name}</p>
                </div>

                <p className="text-[10px] text-[#6f6558] pt-1 border-t border-[#2a241c]/60">
                  Requested on {new Date(req.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FILTER BAR */}
      <div className="mt-12 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Uploaded Videos ({movies.length})
          </h2>
          <p className="mt-0.5 text-xs text-[#b8ab98]">
            Performance breakdown for each title you have published.
          </p>
        </div>

        {movies.length > 0 && (
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative min-w-56">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b8ab98]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your uploaded videos..."
                className="h-9 rounded-xl border-[#2a241c] bg-[#141118] pl-9 text-xs text-white"
              />
            </div>

            <select
              aria-label="Filter uploaded videos by genre"
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="h-9 rounded-xl border border-[#2a241c] bg-[#141118] px-3 text-xs text-[#cbbba4] outline-none"
            >
              <option value="all">All Genres</option>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* UPLOADED MOVIES LIST */}
      {loading ? (
        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-32 animate-pulse rounded-2xl border border-[#2a241c] bg-[#141118]"
            />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-3xl border border-[#2a241c] bg-[#141118]/70 px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#2a241c] bg-[#1b1522] text-[#d4a24c]">
            <Film className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-white">
            No videos uploaded yet
          </h3>
          <p className="mt-1 max-w-md text-xs text-[#b8ab98]">
            Publish your first movie listing with a poster, trailer link, and
            rental/purchase pricing to start tracking audience activity.
          </p>
          <Link
            href="/studio/new"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#d4a24c] px-5 py-2.5 text-xs font-semibold text-[#08070b] transition hover:bg-amber-300"
          >
            <Plus className="h-4 w-4" />
            Upload Your First Movie
          </Link>
        </div>
      ) : filteredMovies.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-[#2a241c] bg-[#141118]/60 p-10 text-center text-sm text-[#b8ab98]">
          No uploaded videos match your search filter.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {filteredMovies.map((movie) => (
            <article
              key={movie.id}
              className="flex flex-col justify-between gap-5 rounded-2xl border border-[#2a241c] bg-[#141118] p-5 transition hover:border-[#d4a24c]/40 lg:flex-row lg:items-center"
            >
              {/* LEFT: POSTER + INFO */}
              <div className="flex items-start gap-4">
                <div className="h-28 w-20 shrink-0 overflow-hidden rounded-xl border border-[#2a241c]">
                  <PosterArt title={movie.title} image={movie.image} />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-white">
                      {movie.title}
                    </h3>
                    <span className="rounded-full border border-[#d4a24c]/30 bg-[#d4a24c]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#d4a24c]">
                      {movie.genre || "Feature"}
                    </span>
                    {movie.year && (
                      <span className="rounded-md border border-[#2a241c] bg-[#08070b]/60 px-2 py-0.5 text-xs text-[#b8ab98]">
                        {movie.year}
                      </span>
                    )}
                    {movie.trailer_url && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                        <Video className="h-3 w-3" />
                        Trailer Linked
                      </span>
                    )}
                  </div>

                  <p className="mt-1.5 line-clamp-2 max-w-xl text-xs text-[#b8ab98]">
                    {movie.description || "No synopsis provided."}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#cbbba4]">
                    <span>
                      Rent:{" "}
                      <strong className="text-white">
                        {formatMoney(movie.rental_price)}
                      </strong>
                    </span>
                    <span>
                      Buy:{" "}
                      <strong className="text-white">
                        {formatMoney(movie.purchase_price)}
                      </strong>
                    </span>
                    {movie.created_at && (
                      <span className="text-[#6f6558]">
                        Uploaded{" "}
                        {new Date(movie.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT: TRACKING METRICS + ACTIONS */}
              <div className="flex flex-col justify-between gap-4 border-t border-[#2a241c] pt-4 sm:flex-row sm:items-center lg:border-t-0 lg:pt-0">
                <div className="grid grid-cols-4 gap-3 rounded-xl border border-[#2a241c] bg-[#08070b]/60 px-4 py-2.5 text-center">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#b8ab98]">
                      Views
                    </p>
                    <p className="mt-0.5 text-sm font-bold tabular-nums text-white">
                      {movie.views_count ?? 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#b8ab98]">
                      Rentals
                    </p>
                    <p className="mt-0.5 text-sm font-bold tabular-nums text-white">
                      {movie.rental_count ?? 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#b8ab98]">
                      Sales
                    </p>
                    <p className="mt-0.5 text-sm font-bold tabular-nums text-white">
                      {movie.purchase_count ?? 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#b8ab98]">
                      Earned
                    </p>
                    <p className="mt-0.5 text-sm font-bold tabular-nums text-[#d4a24c]">
                      {formatMoney(movie.total_revenue ?? 0)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/movies/${movie.id}`}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#2a241c] bg-[#08070b]/60 px-3 text-xs font-medium text-[#cbbba4] transition hover:border-[#d4a24c]/50 hover:text-white"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-[#d4a24c]" />
                    View
                  </Link>
                  <Button
                    type="button"
                    onClick={() => openEditModal(movie)}
                    className="h-9 cursor-pointer rounded-xl border border-[#2a241c] bg-[#1b1522] px-3 text-xs font-medium text-[#e6dccb] hover:border-[#d4a24c]/50 hover:text-white"
                  >
                    <Pencil className="mr-1.5 h-3.5 w-3.5 text-[#d4a24c]" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    onClick={() => void remove(movie)}
                    disabled={deletingId === movie.id}
                    className="h-9 cursor-pointer rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 text-xs font-medium text-amber-400 hover:bg-amber-500/20"
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    {deletingId === movie.id ? "..." : "Delete"}
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* WITHDRAWAL / PAYOUT REQUEST MODAL */}
      {payoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#2a241c] bg-[#141118] p-6 text-white shadow-2xl">
            <button
              type="button"
              onClick={() => setPayoutModalOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#2a241c] bg-[#08070b]/60 text-[#b8ab98] hover:text-white"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d4a24c]/30 bg-[#d4a24c]/10 text-[#d4a24c]">
                <Banknote className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-white">
                  Request Direct Payout
                </h3>
                <p className="text-xs text-[#b8ab98]">
                  Available Balance:{" "}
                  <strong className="text-[#d4a24c]">
                    {formatMoney(availableBalance)}
                  </strong>
                </p>
              </div>
            </div>

            <form onSubmit={handleRequestPayout} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-[#cbbba4]">
                  Withdrawal Amount (₦)
                </label>
                <Input
                  type="number"
                  min="1000"
                  max={availableBalance}
                  required
                  placeholder="e.g. 25000"
                  value={payoutForm.amount}
                  onChange={(e) =>
                    setPayoutForm((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                  className="h-10 rounded-xl border-[#2a241c] bg-[#08070b] text-sm text-white"
                />
                <p className="mt-1 text-[11px] text-[#6b6070]">
                  Minimum withdrawal: ₦1,000
                </p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-[#cbbba4]">
                  Select Destination Bank
                </label>
                <select
                  value={payoutForm.bank_name}
                  onChange={(e) =>
                    setPayoutForm((prev) => ({
                      ...prev,
                      bank_name: e.target.value,
                    }))
                  }
                  className="h-10 w-full rounded-xl border border-[#2a241c] bg-[#08070b] px-3 text-xs text-white outline-none focus:border-[#d4a24c]"
                >
                  {POPULAR_BANKS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-[#cbbba4]">
                  Account Number (NUBAN)
                </label>
                <Input
                  type="text"
                  maxLength={10}
                  required
                  placeholder="0123456789"
                  value={payoutForm.account_number}
                  onChange={(e) =>
                    setPayoutForm((prev) => ({
                      ...prev,
                      account_number: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                  className="h-10 rounded-xl border-[#2a241c] bg-[#08070b] text-sm text-white tracking-widest font-mono"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-[#cbbba4]">
                  Account Holder Name
                </label>
                <Input
                  type="text"
                  required
                  placeholder="As registered with your bank"
                  value={payoutForm.account_name}
                  onChange={(e) =>
                    setPayoutForm((prev) => ({
                      ...prev,
                      account_name: e.target.value,
                    }))
                  }
                  className="h-10 rounded-xl border-[#2a241c] bg-[#08070b] text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPayoutModalOpen(false)}
                  className="h-10 cursor-pointer rounded-xl border-[#2a241c] bg-[#08070b] px-4 text-xs text-[#cbbba4]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={payoutBusy || availableBalance < 1000}
                  className="h-10 cursor-pointer rounded-xl bg-[#d4a24c] px-5 text-xs font-bold text-[#08070b] hover:bg-amber-300 disabled:opacity-50"
                >
                  {payoutBusy ? (
                    <>
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MOVIE MODAL */}
      {editingMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-[#2a241c] bg-[#141118] p-6 text-white shadow-2xl">
            <button
              type="button"
              onClick={() => setEditingMovie(null)}
              className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#2a241c] bg-[#08070b]/60 text-[#b8ab98] hover:text-white"
              aria-label="Close edit modal"
            >
              <X className="h-4 w-4" />
            </button>

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d4a24c]">
              Update Catalog Listing
            </p>
            <h3 className="mt-1 text-xl font-bold text-white">
              Edit &ldquo;{editingMovie.title}&rdquo;
            </h3>

            <form onSubmit={handleSaveEdit} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-[#cbbba4]">
                  Movie Title
                </label>
                <Input
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                  className="h-10 rounded-xl border-[#2a241c] bg-[#08070b] text-sm text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-[#cbbba4]">
                  Synopsis / Description
                </label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-[#2a241c] bg-[#08070b] p-3 text-xs text-white outline-none focus:border-[#d4a24c]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-[#cbbba4]">
                    Rental Price (₦)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={editForm.rental_price}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        rental_price: e.target.value,
                      }))
                    }
                    required
                    className="h-10 rounded-xl border-[#2a241c] bg-[#08070b] text-sm text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-[#cbbba4]">
                    Purchase Price (₦)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={editForm.purchase_price}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        purchase_price: e.target.value,
                      }))
                    }
                    required
                    className="h-10 rounded-xl border-[#2a241c] bg-[#08070b] text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-[#cbbba4]">
                    Genre
                  </label>
                  <Input
                    value={editForm.genre}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        genre: e.target.value,
                      }))
                    }
                    className="h-10 rounded-xl border-[#2a241c] bg-[#08070b] text-xs text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-[#cbbba4]">
                    Release Year
                  </label>
                  <Input
                    type="number"
                    value={editForm.release_year}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        release_year: e.target.value,
                      }))
                    }
                    className="h-10 rounded-xl border-[#2a241c] bg-[#08070b] text-xs text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-[#cbbba4]">
                    Duration
                  </label>
                  <Input
                    value={editForm.duration}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        duration: e.target.value,
                      }))
                    }
                    placeholder="2h 15m"
                    className="h-10 rounded-xl border-[#2a241c] bg-[#08070b] text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-[#cbbba4]">
                  Poster Image URL
                </label>
                <Input
                  value={editForm.poster_url}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      poster_url: e.target.value,
                    }))
                  }
                  placeholder="https://..."
                  className="h-10 rounded-xl border-[#2a241c] bg-[#08070b] text-xs text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-[#cbbba4]">
                  Trailer Video URL (YouTube or MP4)
                </label>
                <Input
                  value={editForm.trailer_url}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      trailer_url: e.target.value,
                    }))
                  }
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="h-10 rounded-xl border-[#2a241c] bg-[#08070b] text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingMovie(null)}
                  className="h-10 cursor-pointer rounded-xl border-[#2a241c] bg-[#08070b] px-4 text-xs text-[#cbbba4]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={savingEdit}
                  className="h-10 cursor-pointer rounded-xl bg-[#d4a24c] px-5 text-xs font-bold text-[#08070b] hover:bg-amber-300"
                >
                  {savingEdit ? (
                    <>
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
