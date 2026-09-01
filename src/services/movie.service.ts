import api from "./axios";
import type { Movie } from "@/types/movie";

interface ApiMovie {
  id: number;
  title: string;
}

const posterFallbacks = [
  "/images/movies/johnwick.jpg",
  "/images/movies/oppenheimer.jpg",
  "/images/movies/dune2.jpg",
  "/images/movies/batman.jpg",
];

export async function getMovies(): Promise<Movie[]> {
  const response = await api.get<{ data: ApiMovie[] }>("/movies");

  return response.data.data.map((movie, index) => ({
    id: movie.id,
    title: movie.title,
    year: new Date().getFullYear(),
    rating: 0,
    genre: "Featured",
    duration: "Movie",
    image: posterFallbacks[index % posterFallbacks.length],
  }));
}
