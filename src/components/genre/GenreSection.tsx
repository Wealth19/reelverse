// import GenreCard from "./GenreCard";
// import genres from "./genres";

// export default function GenreSection() {
//   return (
//     <section className="bg-slate-950 py-24">
//       <div className="mx-auto max-w-7xl px-6">
//         <span className="text-sm font-semibold uppercase tracking-[0.3em] text-red-500">
//           Genres
//         </span>

//         <h2 className="mt-3 text-4xl font-bold">Explore by Genre</h2>

//         <p className="mt-4 max-w-2xl text-slate-400">
//           Browse our growing collection of movies across every genre. From
//           action-packed adventures to heartwarming romances, there is something
//           for everyone.
//         </p>

//         <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
//           {genres.map((genre) => (
//             <GenreCard key={genre.id} name={genre.name} icon={genre.iconName} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

import GenreCard from "./GenreCard";
import genres from "./genres";

export default function GenreSection() {
  return (
    <section className="bg-slate-950 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <span className="text-sm font-semibold uppercase tracking-[0.3em] text-red-500">
          Genres
        </span>

        <h2 className="mt-3 text-4xl font-bold text-white">Explore by Genre</h2>

        <p className="mt-4 max-w-2xl text-slate-400">
          Browse our growing collection of movies across every genre. From
          action-packed adventures to heartwarming romances, there is something
          for everyone.
        </p>

        <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          {genres.map((genre) => (
            <GenreCard
              key={genre.id}
              name={genre.name}
              iconName={genre.iconName} // Clean reference to the string property
            />
          ))}
        </div>
      </div>
    </section>
  );
}

