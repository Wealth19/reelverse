"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, Play, Film, Sparkles } from "lucide-react";
import type { Movie } from "@/types/movie";

interface CinemaPlayerModalProps {
  movie: Movie | null;
  onClose: () => void;
  isStreaming?: boolean;
}

const getYouTubeEmbedUrl = (url?: string | null) => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, "");
    let videoId: string | null = null;

    if (hostname === "youtu.be") {
      videoId = parsed.pathname.slice(1).split("/")[0];
    } else if (
      hostname === "youtube.com" ||
      hostname === "m.youtube.com" ||
      hostname === "youtube-nocookie.com"
    ) {
      videoId =
        parsed.searchParams.get("v") ||
        parsed.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1] ||
        null;
    }

    if (videoId && /^[\w-]{11}$/.test(videoId)) {
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    }
    return null;
  } catch {
    return null;
  }
};

export default function CinemaPlayerModal({
  movie,
  onClose,
  isStreaming = false,
}: CinemaPlayerModalProps) {
  useEffect(() => {
    if (!movie) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [movie, onClose]);

  if (!movie) return null;

  const embedUrl = getYouTubeEmbedUrl(movie.trailer_url);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-[#2a241c] bg-[#0c0a10] shadow-2xl">
        {/* TOP BAR */}
        <div className="flex items-center justify-between border-b border-[#2a241c] px-5 py-3.5">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#d4a24c]/30 bg-[#d4a24c]/10 text-[#d4a24c]">
              <Play className="h-4 w-4 fill-current" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white line-clamp-1">
                  {movie.title}
                </h3>
                <span className="rounded-full border border-[#d4a24c]/30 bg-[#d4a24c]/10 px-2 py-0.5 text-[10px] font-semibold text-[#d4a24c]">
                  {isStreaming ? "Streaming Feature" : "Cinema Trailer"}
                </span>
              </div>
              <p className="text-[11px] text-[#b8ab98]">
                {[movie.year, movie.genre, movie.duration].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#2a241c] bg-[#141118] text-[#b8ab98] transition hover:border-[#d4a24c]/50 hover:text-white"
            aria-label="Close cinema player"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* SCREENING CANVAS */}
        <div className="relative aspect-video w-full bg-black">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={`${movie.title} video`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
              <Film className="h-12 w-12 text-[#d4a24c]/40" />
              <p className="mt-3 text-base font-semibold text-white">
                Screening Preview Not Available
              </p>
              <p className="mt-1 text-xs text-[#b8ab98] max-w-sm">
                The author has not linked a playable video or trailer stream for this title yet.
              </p>
            </div>
          )}
        </div>

        {/* BOTTOM METADATA BAR */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#141118] px-5 py-3">
          <p className="text-xs text-[#cbbba4] line-clamp-1 max-w-lg">
            {movie.description || "Stream high-definition cinema on ReelVerse."}
          </p>

          <Link
            href={`/movies/${movie.id}`}
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#2a241c] bg-[#08070b] px-3 py-1.5 text-xs font-semibold text-[#d4a24c] transition hover:border-[#d4a24c]/50"
          >
            <Sparkles className="h-3.5 w-3.5" />
            View Movie Details
          </Link>
        </div>
      </div>
    </div>
  );
}

