import MovieCard from "./MovieCard";

import { Button } from "@/components/ui/button";
import movies from "./Movies";
import FadeIn from "../shared/FadeIn";
// import { movies } from "./Movies";

export default function MovieSection() {
  return (
    <FadeIn>
      <section className="bg-slate-950 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <p className="text-red-500 font-semibold uppercase tracking-widest">
                Trending
              </p>

              <h2 className="mt-2 text-4xl font-bold">Trending Movies</h2>
            </div>

            <Button className="cursor-pointer rounded-xl border border-red-600 px-5 py-2 hover:bg-red-600 transition">
              View All
            </Button>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
