import api from "./axios";
import type { Purchase, Rental } from "@/types/movie";

export interface WatchHistoryItem {
  id: number;
  movie_id: number;
  title: string;
  watched_at: string;
  poster_url?: string | null;
  genre?: string | null;
  duration?: string | null;
  release_year?: number | null;
}

export async function rentMovie(movie_id: number, duration_days: 1 | 3 | 7) {
  const response = await api.post("/rentals", { movie_id, duration_days });
  return response.data;
}

export async function getMyRentals(): Promise<Rental[]> {
  const response = await api.get<{
    data: Array<Rental & { poster_url?: string }>;
  }>("/rentals");
  return response.data.data.map((item) => ({
    ...item,
    image: item.poster_url || item.image,
  }));
}

export async function purchaseMovie(movie_id: number) {
  const response = await api.post("/purchases", {
    movie_id,
    payment_method: "Others",
  });
  return response.data;
}

export async function getMyPurchases(): Promise<Purchase[]> {
  const response = await api.get<{
    data: Array<Purchase & { poster_url?: string }>;
  }>("/purchases");
  return response.data.data.map((item) => ({
    ...item,
    image: item.poster_url || item.image,
  }));
}

export async function saveWatchHistory(movieId: number) {
  const response = await api.post(`/watch/${movieId}`);
  return response.data;
}

export async function getWatchHistory(): Promise<WatchHistoryItem[]> {
  const response = await api.get<{ data: WatchHistoryItem[] }>("/watch");
  return response.data.data || [];
}
