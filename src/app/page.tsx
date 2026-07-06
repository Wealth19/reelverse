import Navbar from "@/components/navbar/Navbar";
import Hero from "@/components/hero/Hero";
import MovieSection from "@/components/movie/MovieSection";
import GenreSection from "@/components/genre/GenreSection";
import FeaturedBanner from "@/components/featured/FeaturedBanner";
import FeaturesSection from "@/components/features/FeaturesSection";
import ContinueWatching from "@/components/home/continue-watching/ContinueWatching";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />

        <MovieSection />

        <FeaturedBanner />

        <GenreSection />

        <FeaturesSection />

        <ContinueWatching />

        <Footer />
      </main>
    </>
  );
}
