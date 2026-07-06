import ContinueCard from "./ContinueCard";
import watchHistory from "./watchHistory";

export default function ContinueWatching() {
  return (
    <section className="bg-slate-950 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12">
          <p className="font-semibold uppercase tracking-[0.3em] text-red-500">
            Welcome Back
          </p>

          <h2 className="mt-3 text-5xl font-bold">Continue Watching</h2>

          <p className="mt-4 text-slate-400">
            Pick up right where you left off.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {watchHistory.map((movie) => (
            <ContinueCard key={movie.id} {...movie} />
          ))}
        </div>
      </div>
    </section>
  );
}
