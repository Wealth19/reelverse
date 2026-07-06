export interface WatchHistory {
  id: number;
  title: string;
  progress: number;
  duration: string;
  image: string;
}

const watchHistory: WatchHistory[] = [
  {
    id: 1,
    title: "Dune Part Two",
    progress: 68,
    duration: "2h 46m",
    image: "/images/movies/dune2.jpg",
  },
  {
    id: 2,
    title: "John Wick 4",
    progress: 92,
    duration: "2h 49m",
    image: "/images/movies/johnwick.jpg",
  },
  {
    id: 3,
    title: "The Batman",
    progress: 37,
    duration: "2h 56m",
    image: "/images/movies/batman.jpg",
  },
];

export default watchHistory;
