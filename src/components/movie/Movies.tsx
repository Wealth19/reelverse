import type { Movie } from "@/types/movie";

const movies: Movie[] = [
  {
    id: 1,
    title: "John Wick 4",
    year: 2023,
    rating: 8.6,
    genre: "Action",
    duration: "2h 49m",
    image: "/images/movies/johnwick.jpg",
  },
  {
    id: 2,
    title: "Oppenheimer",
    year: 2023,
    rating: 9.1,
    genre: "Drama",
    duration: "3h",
    image: "/images/movies/oppenheimer.jpg",
  },
  {
    id: 3,
    title: "Dune Part Two",
    year: 2024,
    rating: 8.9,
    genre: "Sci-Fi",
    duration: "2h 46m",
    image: "/images/movies/dune2.jpg",
  },
  {
    id: 4,
    title: "The Batman",
    year: 2022,
    rating: 8.2,
    genre: "Action",
    duration: "2h 56m",
    image: "/images/movies/batman.jpg",
  },
];

export default movies;
