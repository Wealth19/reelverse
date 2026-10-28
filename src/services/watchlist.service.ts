import api from "./axios";
import type { Movie } from "@/types/movie";
import { mapMovie } from "./movie.service";

export async function getWatchlist(): Promise<Movie[]> {
  const response = await api.get<{ data: any[] }>("/watchlist");
  return response.data.data.map(mapMovie);
}

export async function toggleWatchlist(
  movieId: number,
): Promise<{ inWatchlist: boolean; message: string }> {
  const response = await api.post(`/watchlist/${movieId}`);
  return response.data.data;
}

export async function checkWatchlistStatus(
  movieId: number,
): Promise<{ inWatchlist: boolean }> {
  const response = await api.get(`/watchlist/check/${movieId}`);
  return response.data.data;
}

