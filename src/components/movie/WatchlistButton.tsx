"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import {
  checkWatchlistStatus,
  toggleWatchlist,
} from "@/services/watchlist.service";

interface WatchlistButtonProps {
  movieId: number;
  initialInWatchlist?: boolean;
  variant?: "icon" | "button";
  className?: string;
  onToggled?: (inWatchlist: boolean) => void;
}

export default function WatchlistButton({
  movieId,
  initialInWatchlist,
  variant = "icon",
  className = "",
  onToggled,
}: WatchlistButtonProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [inWatchlist, setInWatchlist] = useState<boolean>(
    initialInWatchlist ?? false,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialInWatchlist !== undefined) {
      setInWatchlist(initialInWatchlist);
      return;
    }

    if (!isAuthenticated) return;

    let isMounted = true;
    checkWatchlistStatus(movieId)
      .then((res) => {
        if (isMounted) setInWatchlist(res.inWatchlist);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [movieId, initialInWatchlist, isAuthenticated]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info("Please sign in to save movies to your favorites", {
        action: {
          label: "Sign In",
          onClick: () => router.push("/login"),
        },
      });
      return;
    }

    try {
      setLoading(true);
      const res = await toggleWatchlist(movieId);
      setInWatchlist(res.inWatchlist);
      if (res.inWatchlist) {
        toast.success("Added to your favorites!", {
          description: "Click to open your favorites collection",
          action: {
            label: "View Favorites →",
            onClick: () => router.push("/favorites"),
          },
          duration: 6000,
        });
      } else {
        toast.info(res.message || "Removed from your favorites");
      }
      onToggled?.(res.inWatchlist);
    } catch {
      toast.error("Could not update your favorites");
    } finally {
      setLoading(false);
    }
  };

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={handleToggle}
        disabled={loading}
        className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-5 text-xs font-semibold transition cursor-pointer ${
          inWatchlist
            ? "border-[#d4a24c] bg-[#d4a24c]/15 text-[#d4a24c] hover:bg-[#d4a24c]/20"
            : "border-[#2a241c] bg-[#141118] text-[#cbbba4] hover:border-[#d4a24c]/50 hover:text-white"
        } ${className}`}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-[#d4a24c]" />
        ) : inWatchlist ? (
          <BookmarkCheck className="h-4 w-4 fill-current text-[#d4a24c]" />
        ) : (
          <Bookmark className="h-4 w-4 text-[#d4a24c]" />
        )}
        <span>{inWatchlist ? "In Favorites" : "Add to Favorites"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      aria-label={inWatchlist ? "Remove from favorites" : "Add to favorites"}
      className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border backdrop-blur-md transition ${
        inWatchlist
          ? "border-[#d4a24c] bg-[#08070b]/80 text-[#d4a24c]"
          : "border-[#2a241c] bg-[#08070b]/70 text-[#b8ab98] hover:border-[#d4a24c]/60 hover:text-white"
      } ${className}`}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : inWatchlist ? (
        <BookmarkCheck className="h-4 w-4 fill-current text-[#d4a24c]" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
    </button>
  );
}
