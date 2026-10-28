"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, Star, Film, Sparkles, ArrowRight } from "lucide-react";
import PosterArt from "@/components/movie/PosterArt";
import { formatMoney } from "@/lib/format";
import { getMovies } from "@/services/movie.service";
import type { Movie } from "@/types/movie";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FILTER_PRESETS = [
  { id: "all", label: "All Titles" },
  { id: "action", label: "Action" },
  { id: "drama", label: "Drama" },
  { id: "scifi", label: "Sci-Fi" },
  { id: "comedy", label: "Comedy" },
  { id: "cheap_rent", label: "Rent < ₦2,000" },
  { id: "top_rated", label: "⭐ Top Rated (4+)" },
];

export default function GlobalSearchModal({
  isOpen,
  onClose,
}: GlobalSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    getMovies()
      .then((data) => setMovies(data))
      .catch(() => {})
      .finally(() => setLoading(false));

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();

    return movies.filter((m) => {
      const matchesSearch =
        !term ||
        m.title.toLowerCase().includes(term) ||
        (m.genre && m.genre.toLowerCase().includes(term)) ||
        (m.description && m.description.toLowerCase().includes(term)) ||
        (m.producer && m.producer.toLowerCase().includes(term));

      if (!matchesSearch) return false;

      if (filter === "all") return true;
      if (filter === "cheap_rent") return Number(m.rental_price) < 2000;
      if (filter === "top_rated") return Number(m.avg_rating || 0) >= 4;

      return m.genre?.toLowerCase().includes(filter);
    });
  }, [movies, query, filter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 p-4 pt-16 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#2a241c] bg-[#100d16] text-white shadow-2xl">
        {/* SEARCH INPUT BAR */}
        <div className="flex items-center gap-3 border-b border-[#2a241c] px-4 py-3.5">
          <Search className="h-5 w-5 text-[#d4a24c] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, genre, synopsis, or author..."
            className="h-10 w-full bg-transparent text-sm text-white placeholder-[#6b6070] outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-xs text-[#b8ab98] hover:text-white"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#2a241c] bg-[#141118] text-[#b8ab98] transition hover:border-[#d4a24c]/50 hover:text-white"
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* QUICK FILTER CHIPS */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-[#2a241c] bg-[#141118]/60 px-4 py-2.5">
          {FILTER_PRESETS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                filter === item.id
                  ? "bg-[#d4a24c] text-[#08070b]"
                  : "border border-[#2a241c] bg-[#0c0a10] text-[#cbbba4] hover:border-[#d4a24c]/40 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* RESULTS SCROLL VIEW */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {loading ? (
            <div className="space-y-3 py-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-20 animate-pulse rounded-xl border border-[#2a241c] bg-[#141118]"
                />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Film className="h-10 w-10 text-[#d4a24c]/40" />
              <p className="mt-3 text-sm font-semibold text-white">
                No matching movies found
              </p>
              <p className="mt-1 text-xs text-[#b8ab98]">
                Try adjusting your search terms or picking another category chip.
              </p>
            </div>
          ) : (
            results.map((m) => (
              <Link
                key={m.id}
                href={`/movies/${m.id}`}
                onClick={onClose}
                className="group flex items-center justify-between gap-4 rounded-xl border border-[#2a241c] bg-[#141118] p-3 transition hover:border-[#d4a24c]/50 hover:bg-[#1a1422]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg border border-[#2a241c]">
                    <PosterArt title={m.title} image={m.image} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="truncate text-sm font-bold text-white group-hover:text-[#d4a24c]">
                        {m.title}
                      </h4>
                      {m.year && (
                        <span className="text-[11px] text-[#b8ab98]">
                          ({m.year})
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-[#b8ab98]">
                      <span>{m.genre || "Feature"}</span>
                      {m.duration && <span>· {m.duration}</span>}
                      {Number(m.avg_rating || 0) > 0 && (
                        <span className="flex items-center gap-1 font-semibold text-amber-400">
                          <Star className="h-3 w-3 fill-current" />
                          {Number(m.avg_rating).toFixed(1)}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-1 text-[11px] text-[#6b6070]">
                      {m.description || "No synopsis available."}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-xs font-semibold text-white">
                    Rent {formatMoney(m.rental_price)}
                  </p>
                  <p className="text-[11px] text-[#d4a24c]">
                    Own {formatMoney(m.purchase_price)}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* BOTTOM SHORTCUT TIP */}
        <div className="flex items-center justify-between border-t border-[#2a241c] bg-[#0c0a10] px-4 py-2.5 text-[11px] text-[#6b6070]">
          <span>
            Showing <strong className="text-white">{results.length}</strong>{" "}
            titles
          </span>
          <span className="hidden sm:inline">
            Press <kbd className="rounded border border-[#2a241c] bg-[#141118] px-1.5 py-0.5 font-mono text-[#cbbba4]">ESC</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}

