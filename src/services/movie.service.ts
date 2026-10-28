import api from "./axios";
import type { Movie } from "@/types/movie";

interface ApiMovie {
  id: number;
  title: string;
  description?: string | null;
  rental_price: number | string;
  purchase_price: number | string;
  producer?: string;
  created_at?: string;
  poster_url?: string | null;
  trailer_url?: string | null;
  genre?: string | null;
  release_year?: number | null;
  duration?: string | null;
  rental_count?: number | string;
  active_rentals?: number | string;
  purchase_count?: number | string;
  views_count?: number | string;
  rental_revenue?: number | string;
  purchase_revenue?: number | string;
  total_revenue?: number | string;
  avg_rating?: number | string;
  reviews_count?: number | string;
}

export function mapMovie(movie: ApiMovie): Movie {
  return {
    id: movie.id,
    title: movie.title,
    description: movie.description,
    rental_price: Number(movie.rental_price),
    purchase_price: Number(movie.purchase_price),
    producer: movie.producer,
    created_at: movie.created_at,
    year:
      movie.release_year ||
      (movie.created_at ? new Date(movie.created_at).getFullYear() : undefined),
    genre: movie.genre || "Feature",
    duration: movie.duration || "Film",
    image: movie.poster_url || undefined,
    trailer_url: movie.trailer_url,
    rental_count: Number(movie.rental_count || 0),
    active_rentals: Number(movie.active_rentals || 0),
    purchase_count: Number(movie.purchase_count || 0),
    views_count: Number(movie.views_count || 0),
    rental_revenue: Number(movie.rental_revenue || 0),
    purchase_revenue: Number(movie.purchase_revenue || 0),
    total_revenue: Number(movie.total_revenue || 0),
    avg_rating: Number(movie.avg_rating || 0),
    reviews_count: Number(movie.reviews_count || 0),
  };
}

export async function getMovies(): Promise<Movie[]> {
  const response = await api.get<{ data: ApiMovie[] }>("/movies");
  return response.data.data.map(mapMovie);
}

export async function getMovie(id: string | number): Promise<Movie> {
  const response = await api.get<{ data: ApiMovie }>(`/movies/${id}`);
  return mapMovie(response.data.data);
}

export async function getMyMovies(): Promise<Movie[]> {
  const response = await api.get<{ data: ApiMovie[] }>("/movies/mine");
  return response.data.data.map(mapMovie);
}

export interface MoviePayload {
  title: string;
  description?: string;
  rental_price: number;
  purchase_price: number;
  poster_url?: string;
  trailer_url?: string;
  genre?: string;
  release_year?: number;
  duration?: string;
}

export async function createMovie(payload: MoviePayload) {
  const response = await api.post("/movies", payload);
  return response.data;
}

export async function updateMovie(id: number, payload: Partial<MoviePayload>) {
  const response = await api.put(`/movies/${id}`, payload);
  return response.data;
}

export async function deleteMovie(id: number) {
  const response = await api.delete(`/movies/${id}`);
  return response.data;
}
