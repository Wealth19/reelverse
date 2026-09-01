"use client";

import { ChevronLeft, ChevronRight, Play, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const slides = [
  {
    title: "Joker: Folie a Deux",
    image: "/images/hero/hero-bg.jpg",
    rating: "8.5",
    year: "2024",
    duration: "2h 18m",
    genre: "Drama, Thriller",
    description:
      "Struggling with his dual identity, Arthur Fleck not only stumbles upon true love, but also finds the music that has always been inside him.",
  },
  {
    title: "Oppenheimer",
    image: "/images/movies/oppenheimer.jpg",
    rating: "9.1",
    year: "2023",
    duration: "3h",
    genre: "Drama, History",
    description:
      "A brilliant mind faces the weight of history while building a discovery that changes the world forever.",
  },
  {
    title: "Dune: Part Two",
    image: "/images/movies/dune2.jpg",
    rating: "8.9",
    year: "2024",
    duration: "2h 46m",
    genre: "Sci-Fi, Adventure",
    description:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
  },
];

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const slide = slides[activeSlide];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative flex min-h-130 items-center overflow-hidden pt-16 sm:min-h-140">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={slide.image}
          alt={slide.title}
          className="h-full w-full object-cover transition-opacity duration-500"
        />

        <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/75 to-slate-950/10" />

        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <button
        type="button"
        aria-label="Previous featured movie"
        onClick={() =>
          setActiveSlide((activeSlide - 1 + slides.length) % slides.length)
        }
        className="absolute left-5 top-1/2 z-20 hidden -translate-y-1/2 cursor-pointer rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition hover:bg-red-600 md:block"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        type="button"
        aria-label="Next featured movie"
        onClick={() => setActiveSlide((activeSlide + 1) % slides.length)}
        className="absolute right-5 top-1/2 z-20 hidden -translate-y-1/2 cursor-pointer rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition hover:bg-red-600 md:block"
      >
        <ChevronRight size={20} />
      </button>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl px-6 pb-10">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-red-500">
            Trending now
          </p>

          <h1 className="mb-4 max-w-3xl text-3xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {slide.title}
          </h1>

          <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-300">
            <span className="flex items-center gap-1 text-yellow-400">
              <Star size={15} fill="currentColor" /> {slide.rating}
            </span>
            <span>{slide.year}</span>
            <span>•</span>
            <span>{slide.duration}</span>
            <span>•</span>
            <span>{slide.genre}</span>
          </div>

          <p className="mb-6 max-w-lg text-sm leading-6 text-slate-300">
            {slide.description}
          </p>

          {/* Buttons */}

          <div className="flex flex-wrap gap-4">
            <button className="flex cursor-pointer items-center gap-2 rounded-md bg-red-600 px-5 py-3 text-sm font-semibold transition hover:bg-red-700">
              <Play size={15} fill="currentColor" /> Watch Now
            </button>

            <button className="cursor-pointer rounded-md border border-white/20 bg-white/5 px-5 py-3 text-sm backdrop-blur-md transition hover:bg-white/20">
              More Info
            </button>
          </div>

          <div
            className="mt-8 flex items-center gap-2"
            aria-label="Featured movie slides"
          >
            {slides.map((item, index) => (
              <button
                key={item.title}
                type="button"
                aria-label={`Show ${item.title}`}
                aria-current={index === activeSlide}
                onClick={() => setActiveSlide(index)}
                className={`h-1.5 cursor-pointer rounded-full transition-all ${index === activeSlide ? "w-8 bg-red-500" : "w-2 bg-slate-500"}`}
              />
            ))}
          </div>

          {/* Stats */}
        </motion.div>
      </div>
    </section>
  );
}
