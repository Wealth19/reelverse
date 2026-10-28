import type { Movie } from "@/types/movie";

const movies: Movie[] = [
  {
    id: 1,
    title: "John Wick 4",
    year: 2023,
    rating: 8.6,
    genre: "Action",
    duration: "2h 49m",
    rental_price: 500,
    purchase_price: 2500,
  },
  {
    id: 2,
    title: "Oppenheimer",
    year: 2023,
    rating: 9.1,
    genre: "Drama",
    duration: "3h",
    rental_price: 700,
    purchase_price: 3000,
  },
  {
    id: 3,
    title: "Dune Part Two",
    year: 2024,
    rating: 8.9,
    genre: "Sci-Fi",
    duration: "2h 46m",
    rental_price: 650,
    purchase_price: 2800,
  },
  {
    id: 4,
    title: "The Batman",
    year: 2022,
    rating: 8.2,
    genre: "Action",
    duration: "2h 56m",
    rental_price: 450,
    purchase_price: 2200,
  },
];

export default movies;
