import api from "./axios";
import type { Review } from "@/types/movie";

export interface MovieReviewsResponse {
  reviews: Review[];
  avg_rating: number;
  total_reviews: number;
}

export async function getMovieReviews(
  movieId: number,
): Promise<MovieReviewsResponse> {
  const response = await api.get<{ data: MovieReviewsResponse }>(
    `/reviews/movie/${movieId}`,
  );
  return response.data.data;
}

export async function submitReview(
  movieId: number,
  payload: { rating: number; comment?: string },
): Promise<MovieReviewsResponse> {
  const response = await api.post<{ data: MovieReviewsResponse }>(
    `/reviews/movie/${movieId}`,
    payload,
  );
  return response.data.data;
}

export async function deleteReview(reviewId: number): Promise<{ message: string }> {
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data;
}

