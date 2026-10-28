import SiteShell from "@/components/layout/SiteShell";
import Hero from "@/components/hero/Hero";
import MovieSection from "@/components/movie/MovieSection";
import FeaturesSection from "@/components/features/FeaturesSection";

export default function Home() {
  return (
    <SiteShell>
      <Hero />
      <MovieSection />
      <FeaturesSection />
    </SiteShell>
  );
}
