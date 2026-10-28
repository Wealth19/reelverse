"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import {
  Activity,
  Film,
  RefreshCw,
  ShoppingBag,
  Ticket,
  Users,
  Wallet,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Search,
  Video,
  X,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import PosterArt from "@/components/movie/PosterArt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { formatMoney, roleLabel } from "@/lib/format";
import {
  adjustAdminUserWallet,
  createAdminMovie,
  deleteAdminMovie,
  getAdminMovies,
  getAdminOverview,
  getAdminPayments,
  getAdminPurchases,
  getAdminRentals,
  getAdminUserActivity,
  getAdminUsers,
  updateAdminMovie,
  updateAdminUserRole,
  type AdminMovie,
  type AdminOverview,
  type AdminPayment,
  type AdminPurchase,
  type AdminRental,
  type AdminUser,
  type MoviePayload,
  type UserActivity,
} from "@/services/admin.service";



type AdminView =
  | "overview"
  | "users"
  | "movies"
  | "payments"
  | "rentals"
  | "purchases";

const views: { id: AdminView; label: string; icon: typeof Activity }[] = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "users", label: "Users", icon: Users },
  { id: "movies", label: "Catalog", icon: Film },
  { id: "payments", label: "Payments", icon: Wallet },
  { id: "rentals", label: "Rentals", icon: Ticket },
  { id: "purchases", label: "Purchases", icon: ShoppingBag },
];

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleString() : "—";

const errorMessage = (error: unknown) =>
  isAxiosError<{ message?: string }>(error)
    ? error.response?.data?.message || "Could not load admin data."
    : "Could not load admin data.";

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border-l-2 border-[#d4a24c] py-1 pl-4">
      <p className="text-sm text-[#b8ab98]">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function EmptyTable({ label }: { label: string }) {
  return (
    <p className="px-4 py-8 text-center text-sm text-[#b8ab98]">
      No {label} to display.
    </p>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [view, setView] = useState<AdminView>("overview");
  const [loadedView, setLoadedView] = useState<AdminView | null>(null);
  const [errorForView, setErrorForView] = useState<AdminView | null>(null);
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [movies, setMovies] = useState<AdminMovie[]>([]);
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [rentals, setRentals] = useState<AdminRental[]>([]);
  const [purchases, setPurchases] = useState<AdminPurchase[]>([]);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    if (user.role !== "admin") {
      router.replace("/movies");
      return;
    }

    let current = true;
    const load = async () => {
      try {
        switch (view) {
          case "overview":
            setOverview(await getAdminOverview());
            break;
          case "users":
            setUsers(await getAdminUsers());
            break;
          case "movies":
            setMovies(await getAdminMovies());
            break;
          case "payments":
            setPayments(await getAdminPayments());
            break;
          case "rentals":
            setRentals(await getAdminRentals());
            break;
          case "purchases":
            setPurchases(await getAdminPurchases());
            break;
        }
        if (current) {
          setErrorForView(null);
          setLoadedView(view);
        }
      } catch (error: unknown) {
        if (current) {
          setErrorForView(view);
          setLoadedView(view);
          toast.error(errorMessage(error));
        }
      }
    };

    void load();
    return () => {
      current = false;
    };
  }, [router, user, view]);

  const changeUserRole = async (
    target: AdminUser,
    role: "customer" | "producer",
  ) => {
    try {
      setUpdatingUserId(target.id);
      await updateAdminUserRole(target.id, role);
      setUsers((current) =>
        current.map((entry) =>
          entry.id === target.id ? { ...entry, role } : entry,
        ),
      );
      toast.success("User role updated.");
    } catch (error: unknown) {
      toast.error(errorMessage(error));
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Catalog search & filter
  const [movieSearch, setMovieSearch] = useState("");
  const [movieGenreFilter, setMovieGenreFilter] = useState("all");

  // Movie create / edit modal
  const [movieModalOpen, setMovieModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<AdminMovie | null>(null);
  const [submittingMovie, setSubmittingMovie] = useState(false);

  // Movie delete modal
  const [deletingMovie, setDeletingMovie] = useState<AdminMovie | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);

  // Form fields
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formGenre, setFormGenre] = useState("");
  const [formDuration, setFormDuration] = useState("");
  const [formReleaseYear, setFormReleaseYear] = useState("");
  const [formPosterUrl, setFormPosterUrl] = useState("");
  const [formTrailerUrl, setFormTrailerUrl] = useState("");
  const [formRentalPrice, setFormRentalPrice] = useState("");
  const [formPurchasePrice, setFormPurchasePrice] = useState("");

  const openCreateMovieModal = () => {
    setEditingMovie(null);
    setFormTitle("");
    setFormDescription("");
    setFormGenre("");
    setFormDuration("");
    setFormReleaseYear("");
    setFormPosterUrl("");
    setFormTrailerUrl("");
    setFormRentalPrice("");
    setFormPurchasePrice("");
    setMovieModalOpen(true);
  };

  const openEditMovieModal = (movie: AdminMovie) => {
    setEditingMovie(movie);
    setFormTitle(movie.title || "");
    setFormDescription(movie.description || "");
    setFormGenre(movie.genre || "");
    setFormDuration(movie.duration || "");
    setFormReleaseYear(movie.release_year ? String(movie.release_year) : "");
    setFormPosterUrl(movie.poster_url || "");
    setFormTrailerUrl(movie.trailer_url || "");
    setFormRentalPrice(String(movie.rental_price ?? ""));
    setFormPurchasePrice(String(movie.purchase_price ?? ""));
    setMovieModalOpen(true);
  };

  const handleMovieSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      toast.error("Movie title is required.");
      return;
    }
    const rentalPriceNum = Number(formRentalPrice);
    const purchasePriceNum = Number(formPurchasePrice);
    if (isNaN(rentalPriceNum) || rentalPriceNum < 0) {
      toast.error("Please enter a valid rental price (0 or more).");
      return;
    }
    if (isNaN(purchasePriceNum) || purchasePriceNum < 0) {
      toast.error("Please enter a valid purchase price (0 or more).");
      return;
    }

    const payload: MoviePayload = {
      title: formTitle.trim(),
      description: formDescription.trim() || undefined,
      genre: formGenre.trim() || undefined,
      duration: formDuration.trim() || undefined,
      release_year: formReleaseYear ? Number(formReleaseYear) : undefined,
      poster_url: formPosterUrl.trim() || undefined,
      trailer_url: formTrailerUrl.trim() || undefined,
      rental_price: rentalPriceNum,
      purchase_price: purchasePriceNum,
    };

    try {
      setSubmittingMovie(true);
      if (editingMovie) {
        const updated = await updateAdminMovie(editingMovie.id, payload);
        setMovies((current) =>
          current.map((m) =>
            m.id === editingMovie.id ? { ...m, ...updated } : m,
          ),
        );
        toast.success(`"${updated.title}" updated successfully.`);
      } else {
        const created = await createAdminMovie(payload);
        setMovies((current) => [created, ...current]);
        toast.success(`"${created.title}" added to catalog.`);
      }
      setMovieModalOpen(false);
    } catch (error: unknown) {
      toast.error(errorMessage(error));
    } finally {
      setSubmittingMovie(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingMovie) return;
    try {
      setDeletingBusy(true);
      await deleteAdminMovie(deletingMovie.id);
      setMovies((current) => current.filter((m) => m.id !== deletingMovie.id));
      toast.success(`"${deletingMovie.title}" was removed from the catalog.`);
      setDeletingMovie(null);
    } catch (error: unknown) {
      toast.error(errorMessage(error));
    } finally {
      setDeletingBusy(false);
    }
  };

  const movieGenres = useMemo(() => {
    const set = new Set<string>();
    movies.forEach((m) => {
      if (m.genre) set.add(m.genre.trim());
    });
    return Array.from(set).sort();
  }, [movies]);

  const filteredMovies = useMemo(() => {
    return movies.filter((m) => {
      const term = movieSearch.toLowerCase().trim();
      const matchesSearch =
        !term ||
        m.title.toLowerCase().includes(term) ||
        (m.producer && m.producer.toLowerCase().includes(term));
      const matchesGenre =
        movieGenreFilter === "all" ||
        (m.genre && m.genre.toLowerCase() === movieGenreFilter.toLowerCase());
      return matchesSearch && matchesGenre;
    });
  }, [movies, movieSearch, movieGenreFilter]);

  const [userSearch, setUserSearch] = useState("");

  const [userRoleFilter, setUserRoleFilter] = useState("all");

  // User wallet adjust modal
  const [walletModalUser, setWalletModalUser] = useState<AdminUser | null>(null);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustType, setAdjustType] = useState<"credit" | "debit">("credit");
  const [adjustReason, setAdjustReason] = useState("");
  const [adjustBusy, setAdjustBusy] = useState(false);

  // User activity inspection modal
  const [inspectingUser, setInspectingUser] = useState<AdminUser | null>(null);
  const [userActivity, setUserActivity] = useState<UserActivity | null>(null);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityTab, setActivityTab] = useState<"history" | "rentals" | "purchases">("history");

  const openWalletModal = (target: AdminUser) => {
    setWalletModalUser(target);
    setAdjustAmount("");
    setAdjustType("credit");
    setAdjustReason("");
  };

  const handleWalletAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletModalUser) return;
    const amountNum = Number(adjustAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid amount greater than zero.");
      return;
    }
    if (!adjustReason.trim()) {
      toast.error("Please provide a reason / audit description.");
      return;
    }

    try {
      setAdjustBusy(true);
      const res = await adjustAdminUserWallet(walletModalUser.id, {
        amount: amountNum,
        type: adjustType,
        description: adjustReason.trim(),
      });

      // Update user in local state
      setUsers((current) =>
        current.map((u) =>
          u.id === walletModalUser.id
            ? { ...u, wallet_balance: res.data.balanceAfter }
            : u,
        ),
      );

      toast.success(
        `Wallet ${adjustType === "credit" ? "credited" : "debited"} successfully. New balance: ${formatMoney(res.data.balanceAfter)}`,
      );
      setWalletModalUser(null);
    } catch (error: unknown) {
      toast.error(errorMessage(error));
    } finally {
      setAdjustBusy(false);
    }
  };

  const openUserActivityModal = async (target: AdminUser) => {
    setInspectingUser(target);
    setUserActivity(null);
    setActivityLoading(true);
    setActivityTab("history");

    try {
      const data = await getAdminUserActivity(target.id);
      setUserActivity(data);
    } catch (error: unknown) {
      toast.error(errorMessage(error));
    } finally {
      setActivityLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const term = userSearch.toLowerCase().trim();
      const matchesSearch =
        !term ||
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term);
      const matchesRole =
        userRoleFilter === "all" || u.role === userRoleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, userSearch, userRoleFilter]);

  // Payments search & filter
  const [paymentSearch, setPaymentSearch] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const term = paymentSearch.toLowerCase().trim();
      const matchesSearch =
        !term ||
        p.customer.toLowerCase().includes(term) ||
        p.payment_reference.toLowerCase().includes(term);
      const matchesStatus =
        paymentStatusFilter === "all" ||
        p.status.toUpperCase() === paymentStatusFilter.toUpperCase();
      return matchesSearch && matchesStatus;
    });
  }, [payments, paymentSearch, paymentStatusFilter]);

  // Rentals search & filter
  const [rentalSearch, setRentalSearch] = useState("");
  const [rentalStatusFilter, setRentalStatusFilter] = useState("all");

  const filteredRentals = useMemo(() => {
    return rentals.filter((r) => {
      const term = rentalSearch.toLowerCase().trim();
      const matchesSearch =
        !term ||
        r.customer.toLowerCase().includes(term) ||
        r.title.toLowerCase().includes(term);
      const matchesStatus =
        rentalStatusFilter === "all" ||
        r.status.toLowerCase() === rentalStatusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [rentals, rentalSearch, rentalStatusFilter]);

  // Purchases search & filter
  const [purchaseSearch, setPurchaseSearch] = useState("");

  const filteredPurchases = useMemo(() => {
    return purchases.filter((p) => {
      const term = purchaseSearch.toLowerCase().trim();
      return (
        !term ||
        p.customer.toLowerCase().includes(term) ||
        p.title.toLowerCase().includes(term)
      );
    });
  }, [purchases, purchaseSearch]);

  const loading = loadedView !== view;




  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[#d4a24c]">
            ReelVerse control room
          </p>
          <h1 className="mt-2 text-3xl font-bold">Administration</h1>
          <p className="mt-2 text-sm text-[#cbbba4]">
            Users, catalog, wallet funding, and customer activity.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setLoadedView(null)}
          className="border-[#2a241c]"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div
        className="mt-8 flex gap-1 overflow-x-auto border-b border-[#2a241c]"
        role="tablist"
      >
        {views.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={view === id}
            onClick={() => setView(id)}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm ${view === id ? "border-[#d4a24c] text-[#d4a24c]" : "border-transparent text-[#cbbba4] hover:text-white"}`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      <section className="mt-8" aria-live="polite">
        {loading ? (
          <p className="py-10 text-sm text-[#b8ab98]">Loading {view}...</p>
        ) : errorForView === view ? (
          <p className="py-10 text-sm text-amber-400">
            Admin data could not be loaded. Use Refresh to try again.
          </p>
        ) : (
          <>
            {view === "overview" && overview && (
              <div className="grid gap-8 border-y border-[#2a241c] py-6 sm:grid-cols-2 lg:grid-cols-4">
                <Metric label="Total users" value={overview.total_users} />
                <Metric label="Customers" value={overview.customers} />
                <Metric label="Authors" value={overview.authors} />
                <Metric label="Catalog titles" value={overview.total_movies} />
                <Metric
                  label="Active rentals"
                  value={overview.active_rentals}
                />
                <Metric label="Purchases" value={overview.total_purchases} />
                <Metric
                  label="Pending payments"
                  value={overview.pending_payments}
                />
                <Metric
                  label="Successful payments"
                  value={overview.successful_payments}
                />
                <Metric
                  label="Wallet funding received"
                  value={formatMoney(overview.total_wallet_funding)}
                />
                <Metric
                  label="Current wallet balances"
                  value={formatMoney(overview.total_wallet_balance)}
                />
              </div>
            )}

            {view === "users" && (
              <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-1 flex-wrap items-center gap-2">
                    <div className="relative min-w-56 max-w-xs flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b8ab98]" />
                      <Input
                        placeholder="Search name or email..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="h-9 border-[#2a241c] bg-[#141118] pl-9 text-xs"
                      />
                    </div>
                    <select
                      aria-label="Filter users by role"
                      value={userRoleFilter}
                      onChange={(e) => setUserRoleFilter(e.target.value)}
                      className="h-9 rounded-md border border-[#2a241c] bg-[#141118] px-3 text-xs text-[#cbbba4] outline-none"
                    >
                      <option value="all">All Roles</option>
                      <option value="customer">Customers</option>
                      <option value="producer">Authors</option>
                      <option value="admin">Admins</option>
                    </select>
                    <span className="text-xs text-[#b8ab98]">
                      Showing {filteredUsers.length} of {users.length}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-[#2a241c] bg-[#100d14]">
                  <table className="w-full min-w-200 text-left text-sm">
                    <thead className="bg-[#141118] text-xs uppercase text-[#b8ab98]">
                      <tr>
                        <th className="px-4 py-3 font-medium">User</th>
                        <th className="px-3 py-3 font-medium">Role</th>
                        <th className="px-3 py-3 font-medium">Wallet Balance</th>
                        <th className="px-3 py-3 font-medium">Joined</th>
                        <th className="px-3 py-3 font-medium">Role Access</th>
                        <th className="px-4 py-3 text-right font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2a241c]">
                      {filteredUsers.map((entry) => (
                        <tr
                          key={entry.id}
                          className="transition hover:bg-white/2"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#2a241c] bg-[#1b1522] text-xs font-bold text-[#d4a24c]">
                                {entry.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-white">
                                  {entry.name}
                                </p>
                                <p className="truncate text-xs text-[#b8ab98]">
                                  {entry.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <span
                              className={`rounded-md border px-2 py-0.5 text-xs font-medium capitalize ${entry.role === "admin"
                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                : entry.role === "producer"
                                  ? "border-[#d4a24c]/30 bg-[#d4a24c]/10 text-[#d4a24c]"
                                  : "border-[#2a241c] bg-[#141118] text-[#cbbba4]"
                                }`}
                            >
                              {roleLabel(entry.role)}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold tabular-nums text-white">
                                {entry.wallet_balance == null
                                  ? "—"
                                  : formatMoney(entry.wallet_balance)}
                              </span>
                              {entry.role !== "admin" && (
                                <button
                                  type="button"
                                  onClick={() => openWalletModal(entry)}
                                  className="rounded border border-[#2a241c] bg-[#1b1522] px-1.5 py-0.5 text-[11px] font-medium text-[#d4a24c] transition hover:border-[#d4a24c]/50 hover:bg-[#d4a24c]/10"
                                  title="Adjust user wallet"
                                >
                                  Adjust
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-3 text-xs text-[#b8ab98]">
                            {formatDate(entry.created_at)}
                          </td>
                          <td className="px-3 py-3">
                            {entry.role === "admin" ? (
                              <span className="text-xs text-[#b8ab98]">
                                Protected admin
                              </span>
                            ) : (
                              <select
                                aria-label={`Change ${entry.name}'s role`}
                                value={entry.role}
                                disabled={updatingUserId === entry.id}
                                onChange={(event) =>
                                  void changeUserRole(
                                    entry,
                                    event.target.value as
                                    | "customer"
                                    | "producer",
                                  )
                                }
                                className="rounded-md border border-[#2a241c] bg-[#141118] px-2 py-1 text-xs text-[#cbbba4] outline-none"
                              >
                                <option value="customer">Customer</option>
                                <option value="producer">Author</option>
                              </select>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => void openUserActivityModal(entry)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#2a241c] text-[#cbbba4] transition hover:border-amber-400/40 hover:bg-white/5 hover:text-white"
                                title="Inspect user activity (Rentals, Purchases, Wallet)"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </button>
                              {entry.role !== "admin" && (
                                <button
                                  type="button"
                                  onClick={() => openWalletModal(entry)}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#2a241c] text-[#d4a24c] transition hover:bg-[#d4a24c]/10"
                                  title="Credit or debit wallet"
                                >
                                  <Wallet className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredUsers.length === 0 && (
                    <EmptyTable label="matching users" />
                  )}
                </div>
              </div>
            )}


            {view === "movies" && (
              <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-1 flex-wrap items-center gap-2">
                    <div className="relative min-w-56 max-w-xs flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b8ab98]" />
                      <Input
                        placeholder="Search title or author..."
                        value={movieSearch}
                        onChange={(e) => setMovieSearch(e.target.value)}
                        className="h-9 border-[#2a241c] bg-[#141118] pl-9 text-xs"
                      />
                    </div>
                    <select
                      aria-label="Filter catalog by genre"
                      value={movieGenreFilter}
                      onChange={(e) => setMovieGenreFilter(e.target.value)}
                      className="h-9 rounded-md border border-[#2a241c] bg-[#141118] px-3 text-xs text-[#cbbba4] outline-none"
                    >
                      <option value="all">All Genres</option>
                      {movieGenres.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                    <span className="text-xs text-[#b8ab98]">
                      Showing {filteredMovies.length} of {movies.length}
                    </span>
                  </div>

                  <Button
                    onClick={openCreateMovieModal}
                    className="h-9 bg-[#d4a24c] px-3 text-xs font-semibold text-[#08070b] hover:bg-amber-400"
                  >
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    Add Movie
                  </Button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-[#2a241c] bg-[#100d14]">
                  <table className="w-full min-w-190 text-left text-sm">
                    <thead className="bg-[#141118] text-xs uppercase text-[#b8ab98]">
                      <tr>
                        <th className="px-4 py-3 font-medium">Movie</th>
                        <th className="px-3 py-3 font-medium">Author</th>
                        <th className="px-3 py-3 font-medium">Genre & Specs</th>
                        <th className="px-3 py-3 font-medium">Pricing</th>
                        <th className="px-3 py-3 font-medium">Trailer</th>
                        <th className="px-4 py-3 text-right font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2a241c]">
                      {filteredMovies.map((movie: AdminMovie) => (
                        <tr
                          key={movie.id}
                          className="transition hover:bg-white/2"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-14 w-10 shrink-0 overflow-hidden rounded-md border border-[#2a241c]">
                                <PosterArt
                                  title={movie.title}
                                  image={movie.poster_url}
                                />
                              </div>
                              <div className="min-w-0 max-w-xs">
                                <p className="truncate font-medium text-white">
                                  {movie.title}
                                </p>
                                <p className="line-clamp-1 text-xs text-[#b8ab98]">
                                  {movie.description || "No description."}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-[#cbbba4]">
                            {movie.producer}
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex flex-wrap items-center gap-1.5 text-xs">
                              <span className="rounded-md border border-[#2a241c] bg-[#1b1522] px-2 py-0.5 text-[#d4a24c]">
                                {movie.genre || "Feature"}
                              </span>
                              {movie.release_year && (
                                <span className="rounded-md border border-[#2a241c] px-1.5 py-0.5 text-[#b8ab98]">
                                  {movie.release_year}
                                </span>
                              )}
                              {movie.duration && (
                                <span className="text-xs text-[#b8ab98]">
                                  {movie.duration}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <p className="text-xs text-white">
                              Rent:{" "}
                              <span className="font-semibold text-[#d4a24c]">
                                {formatMoney(movie.rental_price)}
                              </span>
                            </p>
                            <p className="text-xs text-white">
                              Own:{" "}
                              <span className="font-semibold text-white">
                                {formatMoney(movie.purchase_price)}
                              </span>
                            </p>
                          </td>
                          <td className="px-3 py-3">
                            {movie.trailer_url ? (
                              <a
                                href={movie.trailer_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 rounded-md border border-[#2a241c] bg-[#18131d] px-2 py-1 text-xs text-amber-400 hover:border-amber-400/50"
                              >
                                <Video className="h-3 w-3" />
                                Trailer
                              </a>
                            ) : (
                              <span className="text-xs text-[#6f6558]">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link
                                href={`/movies/${movie.id}`}
                                target="_blank"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#2a241c] text-[#cbbba4] transition hover:bg-white/5 hover:text-white"
                                title="View public page"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Link>
                              <button
                                type="button"
                                onClick={() => openEditMovieModal(movie)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#2a241c] text-[#d4a24c] transition hover:bg-[#d4a24c]/10"
                                title="Edit movie"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingMovie(movie)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#2a241c] text-red-400 transition hover:bg-red-400/10"
                                title="Delete movie"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredMovies.length === 0 && (
                    <EmptyTable label="matching movies" />
                  )}
                </div>
              </div>
            )}


            {view === "payments" && (
              <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-1 flex-wrap items-center gap-2">
                    <div className="relative min-w-56 max-w-xs flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b8ab98]" />
                      <Input
                        placeholder="Search customer or reference..."
                        value={paymentSearch}
                        onChange={(e) => setPaymentSearch(e.target.value)}
                        className="h-9 border-[#2a241c] bg-[#141118] pl-9 text-xs"
                      />
                    </div>
                    <select
                      aria-label="Filter payments by status"
                      value={paymentStatusFilter}
                      onChange={(e) => setPaymentStatusFilter(e.target.value)}
                      className="h-9 rounded-md border border-[#2a241c] bg-[#141118] px-3 text-xs text-[#cbbba4] outline-none"
                    >
                      <option value="all">All Statuses</option>
                      <option value="SUCCESS">Success</option>
                      <option value="PENDING">Pending</option>
                    </select>
                    <span className="text-xs text-[#b8ab98]">
                      Showing {filteredPayments.length} of {payments.length}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-[#2a241c] bg-[#100d14]">
                  <table className="w-full min-w-190 text-left text-sm">
                    <thead className="bg-[#141118] text-xs uppercase text-[#b8ab98]">
                      <tr>
                        <th className="px-4 py-3 font-medium">Customer</th>
                        <th className="px-3 py-3 font-medium">Reference</th>
                        <th className="px-3 py-3 font-medium">Amount</th>
                        <th className="px-3 py-3 font-medium">Method</th>
                        <th className="px-3 py-3 font-medium">Status</th>
                        <th className="px-3 py-3 font-medium">Wallet Credited</th>
                        <th className="px-4 py-3 font-medium">Created</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2a241c]">
                      {filteredPayments.map((payment: AdminPayment) => (
                        <tr
                          key={payment.id}
                          className="transition hover:bg-white/2"
                        >
                          <td className="px-4 py-3 font-medium text-white">
                            {payment.customer}
                          </td>
                          <td className="px-3 py-3 font-mono text-xs text-[#b8ab98]">
                            {payment.payment_reference}
                          </td>
                          <td className="px-3 py-3 font-semibold text-white">
                            {formatMoney(payment.amount)}
                          </td>
                          <td className="px-3 py-3 text-xs text-[#cbbba4]">
                            {payment.payment_method || "—"}
                          </td>
                          <td className="px-3 py-3">
                            <span
                              className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${payment.status === "SUCCESS"
                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                                }`}
                            >
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-xs">
                            {payment.wallet_credited ? (
                              <span className="text-emerald-400">Yes</span>
                            ) : (
                              <span className="text-[#8e8273]">No</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs text-[#b8ab98]">
                            {formatDate(payment.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredPayments.length === 0 && (
                    <EmptyTable label="payments" />
                  )}
                </div>
              </div>
            )}

            {view === "rentals" && (
              <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-1 flex-wrap items-center gap-2">
                    <div className="relative min-w-56 max-w-xs flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b8ab98]" />
                      <Input
                        placeholder="Search customer or title..."
                        value={rentalSearch}
                        onChange={(e) => setRentalSearch(e.target.value)}
                        className="h-9 border-[#2a241c] bg-[#141118] pl-9 text-xs"
                      />
                    </div>
                    <select
                      aria-label="Filter rentals by status"
                      value={rentalStatusFilter}
                      onChange={(e) => setRentalStatusFilter(e.target.value)}
                      className="h-9 rounded-md border border-[#2a241c] bg-[#141118] px-3 text-xs text-[#cbbba4] outline-none"
                    >
                      <option value="all">All Rentals</option>
                      <option value="active">Active</option>
                      <option value="expired">Expired</option>
                    </select>
                    <span className="text-xs text-[#b8ab98]">
                      Showing {filteredRentals.length} of {rentals.length}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-[#2a241c] bg-[#100d14]">
                  <table className="w-full min-w-180 text-left text-sm">
                    <thead className="bg-[#141118] text-xs uppercase text-[#b8ab98]">
                      <tr>
                        <th className="px-4 py-3 font-medium">Customer</th>
                        <th className="px-3 py-3 font-medium">Movie Title</th>
                        <th className="px-3 py-3 font-medium">Term</th>
                        <th className="px-3 py-3 font-medium">Expires</th>
                        <th className="px-3 py-3 font-medium">Paid</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2a241c]">
                      {filteredRentals.map((rental: AdminRental) => (
                        <tr
                          key={rental.id}
                          className="transition hover:bg-white/2"
                        >
                          <td className="px-4 py-3 font-medium text-white">
                            {rental.customer}
                          </td>
                          <td className="px-3 py-3 font-medium text-[#d4a24c]">
                            {rental.title}
                          </td>
                          <td className="px-3 py-3 text-xs text-[#cbbba4]">
                            {rental.duration_days} days
                          </td>
                          <td className="px-3 py-3 text-xs text-[#b8ab98]">
                            {formatDate(rental.expires_at)}
                          </td>
                          <td className="px-3 py-3 font-semibold text-white">
                            {formatMoney(rental.amount)}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-md border px-2 py-0.5 text-xs font-semibold capitalize ${rental.status === "active"
                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                : "border-[#2a241c] bg-[#141118] text-[#8e8273]"
                                }`}
                            >
                              {rental.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredRentals.length === 0 && (
                    <EmptyTable label="rentals" />
                  )}
                </div>
              </div>
            )}

            {view === "purchases" && (
              <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-1 flex-wrap items-center gap-2">
                    <div className="relative min-w-56 max-w-xs flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b8ab98]" />
                      <Input
                        placeholder="Search customer or title..."
                        value={purchaseSearch}
                        onChange={(e) => setPurchaseSearch(e.target.value)}
                        className="h-9 border-[#2a241c] bg-[#141118] pl-9 text-xs"
                      />
                    </div>
                    <span className="text-xs text-[#b8ab98]">
                      Showing {filteredPurchases.length} of {purchases.length}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-[#2a241c] bg-[#100d14]">
                  <table className="w-full min-w-170 text-left text-sm">
                    <thead className="bg-[#141118] text-xs uppercase text-[#b8ab98]">
                      <tr>
                        <th className="px-4 py-3 font-medium">Customer</th>
                        <th className="px-3 py-3 font-medium">Movie Title</th>
                        <th className="px-3 py-3 font-medium">Paid</th>
                        <th className="px-3 py-3 font-medium">Method</th>
                        <th className="px-4 py-3 font-medium">Purchased</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2a241c]">
                      {filteredPurchases.map((purchase: AdminPurchase) => (
                        <tr
                          key={purchase.id}
                          className="transition hover:bg-white/2"
                        >
                          <td className="px-4 py-3 font-medium text-white">
                            {purchase.customer}
                          </td>
                          <td className="px-3 py-3 font-medium text-[#d4a24c]">
                            {purchase.title}
                          </td>
                          <td className="px-3 py-3 font-semibold text-white">
                            {formatMoney(purchase.amount)}
                          </td>
                          <td className="px-3 py-3 text-xs text-[#cbbba4]">
                            <span className="rounded-md border border-[#2a241c] bg-[#1b1522] px-2 py-0.5">
                              {purchase.payment_method}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-[#b8ab98]">
                            {formatDate(purchase.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredPurchases.length === 0 && (
                    <EmptyTable label="purchases" />
                  )}
                </div>
              </div>
            )}

          </>
        )}
      </section>

      {/* Add / Edit Movie Modal */}
      {movieModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-xl rounded-2xl border border-[#2a241c] bg-[#141118] p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setMovieModalOpen(false)}
              className="absolute right-4 top-4 text-[#b8ab98] transition hover:text-white"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-bold text-white">
              {editingMovie ? `Edit Movie: ${editingMovie.title}` : "Add Movie to Catalog"}
            </h2>
            <p className="mt-1 text-xs text-[#b8ab98]">
              {editingMovie
                ? "Update pricing, synopsis, genre, or media links."
                : "Create a new catalog title available for customer purchase or rental."}
            </p>

            <form onSubmit={handleMovieSubmit} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-[#cbbba4]">
                  Movie Title <span className="text-amber-400">*</span>
                </label>
                <Input
                  required
                  placeholder="e.g. Inception"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="mt-1 h-9 border-[#2a241c] bg-[#0c0a0e] text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#cbbba4]">
                  Synopsis / Description
                </label>
                <Textarea
                  placeholder="Short movie plot summary..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="mt-1 min-h-20 border-[#2a241c] bg-[#0c0a0e] text-sm"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-medium text-[#cbbba4]">
                    Genre
                  </label>
                  <Input
                    placeholder="Sci-Fi / Action"
                    value={formGenre}
                    onChange={(e) => setFormGenre(e.target.value)}
                    className="mt-1 h-9 border-[#2a241c] bg-[#0c0a0e] text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#cbbba4]">
                    Duration
                  </label>
                  <Input
                    placeholder="2h 28m"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="mt-1 h-9 border-[#2a241c] bg-[#0c0a0e] text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#cbbba4]">
                    Release Year
                  </label>
                  <Input
                    type="number"
                    min={1900}
                    max={2100}
                    placeholder="2024"
                    value={formReleaseYear}
                    onChange={(e) => setFormReleaseYear(e.target.value)}
                    className="mt-1 h-9 border-[#2a241c] bg-[#0c0a0e] text-sm"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-[#cbbba4]">
                    Poster Image URL
                  </label>
                  <Input
                    type="url"
                    placeholder="https://..."
                    value={formPosterUrl}
                    onChange={(e) => setFormPosterUrl(e.target.value)}
                    className="mt-1 h-9 border-[#2a241c] bg-[#0c0a0e] text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#cbbba4]">
                    YouTube Trailer URL
                  </label>
                  <Input
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={formTrailerUrl}
                    onChange={(e) => setFormTrailerUrl(e.target.value)}
                    className="mt-1 h-9 border-[#2a241c] bg-[#0c0a0e] text-sm"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-[#cbbba4]">
                    Rental Price (₦ / $) <span className="text-amber-400">*</span>
                  </label>
                  <Input
                    type="number"
                    min={0}
                    step="any"
                    required
                    placeholder="e.g. 500"
                    value={formRentalPrice}
                    onChange={(e) => setFormRentalPrice(e.target.value)}
                    className="mt-1 h-9 border-[#2a241c] bg-[#0c0a0e] text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#cbbba4]">
                    Purchase Price (₦ / $) <span className="text-amber-400">*</span>
                  </label>
                  <Input
                    type="number"
                    min={0}
                    step="any"
                    required
                    placeholder="e.g. 2500"
                    value={formPurchasePrice}
                    onChange={(e) => setFormPurchasePrice(e.target.value)}
                    className="mt-1 h-9 border-[#2a241c] bg-[#0c0a0e] text-sm"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMovieModalOpen(false)}
                  className="border-[#2a241c] text-[#cbbba4]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submittingMovie}
                  className="bg-[#d4a24c] font-semibold text-[#08070b] hover:bg-amber-400"
                >
                  {submittingMovie
                    ? "Saving..."
                    : editingMovie
                      ? "Save Changes"
                      : "Create Movie"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingMovie && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md rounded-2xl border border-[#2a241c] bg-[#141118] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white">
              Delete &quot;{deletingMovie.title}&quot;?
            </h3>
            <p className="mt-2 text-sm text-[#cbbba4]">
              This action will remove the movie from the catalog. If any customer
              already has an active purchase or active rental on record, the server
              will prevent deletion to preserve customer access.
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={deletingBusy}
                onClick={() => setDeletingMovie(null)}
                className="border-[#2a241c] text-[#cbbba4]"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={deletingBusy}
                onClick={handleConfirmDelete}
                className="bg-red-500 font-semibold text-white hover:bg-red-600"
              >
                {deletingBusy ? "Deleting..." : "Delete from Catalog"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Adjustment Modal */}

      {walletModalUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md rounded-2xl border border-[#2a241c] bg-[#141118] p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setWalletModalUser(null)}
              className="absolute right-4 top-4 text-[#b8ab98] transition hover:text-white"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-bold text-white">
              Adjust Wallet Balance
            </h3>
            <p className="mt-1 text-xs text-[#b8ab98]">
              {walletModalUser.name} · {walletModalUser.email}
            </p>

            <div className="mt-4 rounded-xl border border-[#2a241c] bg-[#0c0a0e] p-3 text-center">
              <p className="text-xs text-[#b8ab98]">Current Balance</p>
              <p className="mt-0.5 text-2xl font-bold text-[#d4a24c]">
                {formatMoney(walletModalUser.wallet_balance ?? 0)}
              </p>
            </div>

            <form onSubmit={handleWalletAdjustment} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-[#cbbba4]">
                  Adjustment Type
                </label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType("credit")}
                    className={`rounded-lg border py-2 text-xs font-semibold transition ${adjustType === "credit"
                      ? "border-emerald-500 bg-emerald-500/15 text-emerald-400"
                      : "border-[#2a241c] bg-[#0c0a0e] text-[#b8ab98] hover:text-white"
                      }`}
                  >
                    + Credit (Add)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType("debit")}
                    className={`rounded-lg border py-2 text-xs font-semibold transition ${adjustType === "debit"
                      ? "border-red-500 bg-red-500/15 text-red-400"
                      : "border-[#2a241c] bg-[#0c0a0e] text-[#b8ab98] hover:text-white"
                      }`}
                  >
                    - Debit (Deduct)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#cbbba4]">
                  Amount (₦ / $) <span className="text-amber-400">*</span>
                </label>
                <Input
                  type="number"
                  min={1}
                  step="any"
                  required
                  placeholder="e.g. 5000"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="mt-1 h-9 border-[#2a241c] bg-[#0c0a0e] text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#cbbba4]">
                  Reason / Audit Trail Note <span className="text-amber-400">*</span>
                </label>
                <Input
                  required
                  placeholder="e.g. Manual bank deposit, refund for issue #123"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="mt-1 h-9 border-[#2a241c] bg-[#0c0a0e] text-sm"
                />
              </div>

              {adjustAmount && !isNaN(Number(adjustAmount)) && Number(adjustAmount) > 0 && (
                <div className="rounded-lg border border-[#2a241c] bg-[#1a1422] p-2.5 text-xs text-[#cbbba4]">
                  <span>Resulting balance: </span>
                  <span className="font-bold text-white">
                    {formatMoney(
                      adjustType === "credit"
                        ? Number(walletModalUser.wallet_balance ?? 0) + Number(adjustAmount)
                        : Math.max(0, Number(walletModalUser.wallet_balance ?? 0) - Number(adjustAmount)),
                    )}
                  </span>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setWalletModalUser(null)}
                  className="border-[#2a241c] text-[#cbbba4]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={adjustBusy}
                  className={`font-semibold text-white ${adjustType === "credit"
                    ? "bg-emerald-600 hover:bg-emerald-500"
                    : "bg-red-600 hover:bg-red-500"
                    }`}
                >
                  {adjustBusy
                    ? "Applying..."
                    : adjustType === "credit"
                      ? "Credit Wallet"
                      : "Debit Wallet"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Activity Inspection Modal */}
      {inspectingUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-[#2a241c] bg-[#141118] p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setInspectingUser(null)}
              className="absolute right-4 top-4 text-[#b8ab98] transition hover:text-white"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#2a241c] bg-[#1b1522] text-sm font-bold text-[#d4a24c]">
                  {inspectingUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {inspectingUser.name}
                  </h3>
                  <p className="text-xs text-[#b8ab98]">
                    {inspectingUser.email} · {roleLabel(inspectingUser.role)} · Joined{" "}
                    {formatDate(inspectingUser.created_at)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl border border-[#2a241c] bg-[#0c0a0e] px-4 py-2.5">
                <span className="text-xs text-[#b8ab98]">Wallet Balance:</span>
                <span className="text-base font-bold text-[#d4a24c]">
                  {formatMoney(inspectingUser.wallet_balance ?? 0)}
                </span>
              </div>
            </div>

            {/* Modal Tabs */}
            <div className="mt-5 flex border-b border-[#2a241c]">
              <button
                type="button"
                onClick={() => setActivityTab("history")}
                className={`border-b-2 px-4 py-2 text-xs font-semibold transition ${activityTab === "history"
                  ? "border-[#d4a24c] text-[#d4a24c]"
                  : "border-transparent text-[#b8ab98] hover:text-white"
                  }`}
              >
                Wallet Ledger ({userActivity?.walletHistory.length ?? 0})
              </button>
              <button
                type="button"
                onClick={() => setActivityTab("rentals")}
                className={`border-b-2 px-4 py-2 text-xs font-semibold transition ${activityTab === "rentals"
                  ? "border-[#d4a24c] text-[#d4a24c]"
                  : "border-transparent text-[#b8ab98] hover:text-white"
                  }`}
              >
                Rentals ({userActivity?.rentals.length ?? 0})
              </button>
              <button
                type="button"
                onClick={() => setActivityTab("purchases")}
                className={`border-b-2 px-4 py-2 text-xs font-semibold transition ${activityTab === "purchases"
                  ? "border-[#d4a24c] text-[#d4a24c]"
                  : "border-transparent text-[#b8ab98] hover:text-white"
                  }`}
              >
                Purchases ({userActivity?.purchases.length ?? 0})
              </button>
            </div>

            {/* Tab Contents */}
            <div className="mt-4 min-h-60 flex-1 overflow-y-auto pr-1">
              {activityLoading ? (
                <p className="py-12 text-center text-xs text-[#b8ab98]">
                  Loading user records...
                </p>
              ) : (
                <>
                  {activityTab === "history" && (
                    <div className="space-y-2">
                      {userActivity?.walletHistory.length === 0 ? (
                        <p className="py-10 text-center text-xs text-[#b8ab98]">
                          No wallet transactions on record.
                        </p>
                      ) : (
                        userActivity?.walletHistory.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between rounded-lg border border-[#2a241c] bg-[#0c0a0e] p-3 text-xs"
                          >
                            <div>
                              <p className="font-medium text-white">
                                {item.description || "Wallet movement"}
                              </p>
                              <p className="mt-0.5 text-[11px] text-[#b8ab98]">
                                Ref: {item.reference_id} ·{" "}
                                {formatDate(item.created_at)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p
                                className={`font-bold ${item.transaction_type === "credit"
                                  ? "text-emerald-400"
                                  : "text-amber-400"
                                  }`}
                              >
                                {item.transaction_type === "credit" ? "+" : "-"}
                                {formatMoney(item.amount)}
                              </p>
                              <p className="mt-0.5 text-[10px] text-[#b8ab98]">
                                Balance: {formatMoney(item.balance_after)}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activityTab === "rentals" && (
                    <div className="space-y-2">
                      {userActivity?.rentals.length === 0 ? (
                        <p className="py-10 text-center text-xs text-[#b8ab98]">
                          No movie rentals found for this user.
                        </p>
                      ) : (
                        userActivity?.rentals.map((r) => (
                          <div
                            key={r.id}
                            className="flex items-center justify-between rounded-lg border border-[#2a241c] bg-[#0c0a0e] p-3 text-xs"
                          >
                            <div>
                              <p className="font-medium text-white">{r.title}</p>
                              <p className="mt-0.5 text-[11px] text-[#b8ab98]">
                                {r.duration_days} day term · Expires:{" "}
                                {formatDate(r.expires_at)}
                              </p>
                            </div>
                            <div className="text-right">
                              <span
                                className={`rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase ${r.status === "active"
                                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                  : "border-[#2a241c] bg-[#141118] text-[#8e8273]"
                                  }`}
                              >
                                {r.status}
                              </span>
                              <p className="mt-1 font-semibold text-white">
                                {formatMoney(r.amount)}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activityTab === "purchases" && (
                    <div className="space-y-2">
                      {userActivity?.purchases.length === 0 ? (
                        <p className="py-10 text-center text-xs text-[#b8ab98]">
                          No movie purchases found for this user.
                        </p>
                      ) : (
                        userActivity?.purchases.map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center justify-between rounded-lg border border-[#2a241c] bg-[#0c0a0e] p-3 text-xs"
                          >
                            <div>
                              <p className="font-medium text-white">{p.title}</p>
                              <p className="mt-0.5 text-[11px] text-[#b8ab98]">
                                Purchased via {p.payment_method} on{" "}
                                {formatDate(p.created_at)}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="rounded-md border border-[#d4a24c]/30 bg-[#d4a24c]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#d4a24c]">
                                Owned Permanently
                              </span>
                              <p className="mt-1 font-semibold text-white">
                                {formatMoney(p.amount)}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="mt-4 flex justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setInspectingUser(null)}
                className="border-[#2a241c] text-[#cbbba4]"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}


