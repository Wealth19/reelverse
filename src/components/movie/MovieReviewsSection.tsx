"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, MessageSquare, Loader2, Trash2, Send } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import {
  deleteReview,
  getMovieReviews,
  submitReview,
} from "@/services/review.service";
import type { Review } from "@/types/movie";

interface MovieReviewsSectionProps {
  movieId: number;
}

export default function MovieReviewsSection({
  movieId,
}: MovieReviewsSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);

  // Form state
  const [selectedRating, setSelectedRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadReviews = async () => {
    try {
      const data = await getMovieReviews(movieId);
      setReviews(data.reviews || []);
      setAvgRating(data.avg_rating || 0);
      setTotalReviews(data.total_reviews || 0);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadReviews();
  }, [movieId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info("Please sign in to leave a review.");
      return;
    }

    try {
      setSubmitting(true);
      const data = await submitReview(movieId, {
        rating: selectedRating,
        comment: comment.trim() || undefined,
      });
      setReviews(data.reviews || []);
      setAvgRating(data.avg_rating || 0);
      setTotalReviews(data.total_reviews || 0);
      setComment("");
      toast.success("Thank you! Your review has been published.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Could not submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: number) => {
    try {
      setDeletingId(reviewId);
      await deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setTotalReviews((prev) => Math.max(0, prev - 1));
      toast.success("Review deleted.");
    } catch {
      toast.error("Could not delete review.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="mt-14 border-t border-[#2a241c] pt-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#d4a24c]">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Audience Feedback</span>
          </div>
          <h2 className="mt-1 text-2xl font-bold text-white">
            Reviews &amp; Ratings
          </h2>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-[#2a241c] bg-[#141118] px-4 py-2.5">
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="h-5 w-5 fill-current" />
            <span className="text-xl font-extrabold">
              {avgRating > 0 ? avgRating.toFixed(1) : "—"}
            </span>
          </div>
          <div className="text-left text-xs text-[#b8ab98]">
            <p className="font-semibold text-white">Community Score</p>
            <p>
              {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>
      </div>

      {/* REVIEW SUBMISSION FORM */}
      <div className="mt-8 rounded-2xl border border-[#2a241c] bg-[#141118] p-5 sm:p-6">
        {isAuthenticated ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-sm font-semibold text-white">
              Rate &amp; review this title
            </h3>

            {/* Star Selector */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating || selectedRating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setSelectedRating(star)}
                    className="cursor-pointer p-1 transition transform hover:scale-110"
                    aria-label={`Rate ${star} star`}
                  >
                    <Star
                      className={`h-6 w-6 transition ${
                        active
                          ? "fill-amber-400 text-amber-400"
                          : "text-[#3a3228]"
                      }`}
                    />
                  </button>
                );
              })}
              <span className="ml-2 text-xs font-semibold text-[#d4a24c]">
                {selectedRating} / 5 Stars
              </span>
            </div>

            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you think of the cinematography, story, and acting? (optional)"
              className="w-full rounded-xl border border-[#2a241c] bg-[#0c0a10] p-3 text-xs text-white placeholder-[#6b6070] outline-none focus:border-[#d4a24c]"
            />

            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-xl bg-[#d4a24c] px-4 text-xs font-bold text-[#08070b] transition hover:bg-amber-300 disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                Post Review
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <div>
              <p className="text-sm font-semibold text-white">
                Have you watched this film?
              </p>
              <p className="text-xs text-[#b8ab98]">
                Sign in to share your thoughts and score with the community.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex h-9 items-center rounded-xl bg-[#d4a24c] px-4 text-xs font-semibold text-[#08070b] transition hover:bg-amber-300"
            >
              Sign In to Review
            </Link>
          </div>
        )}
      </div>

      {/* REVIEWS LIST */}
      <div className="mt-8 space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="h-20 animate-pulse rounded-2xl border border-[#2a241c] bg-[#141118]"
              />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-2xl border border-[#2a241c] bg-[#141118]/50 p-8 text-center text-xs text-[#b8ab98]">
            No reviews yet. Be the first to review this movie!
          </div>
        ) : (
          reviews.map((rev) => {
            const isOwner = user?.id === rev.user_id || user?.role === "admin";
            return (
              <div
                key={rev.id}
                className="rounded-2xl border border-[#2a241c] bg-[#141118] p-4 transition hover:border-[#d4a24c]/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d4a24c]/15 text-xs font-bold text-[#d4a24c]">
                      {rev.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">
                        {rev.user_name}
                      </p>
                      <p className="text-[10px] text-[#6b6070]">
                        {new Date(rev.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3.5 w-3.5 ${
                            star <= rev.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-[#3a3228]"
                          }`}
                        />
                      ))}
                    </div>

                    {isOwner && (
                      <button
                        type="button"
                        onClick={() => handleDelete(rev.id)}
                        disabled={deletingId === rev.id}
                        className="text-[#6b6070] transition hover:text-rose-400"
                        title="Delete review"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {rev.comment && (
                  <p className="mt-3 text-xs leading-relaxed text-[#cbbba4]">
                    {rev.comment}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

