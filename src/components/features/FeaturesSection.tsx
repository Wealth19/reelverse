import FeatureCard from "./FeatureCard";
import features from "./features";

export default function FeaturesSection() {
  return (
    <section className="bg-slate-950 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <p className="font-semibold uppercase tracking-[0.3em] text-red-500">
            Why Choose Us
          </p>

          <h2 className="mt-4 text-5xl font-bold">Why ReelVerse?</h2>

          <p className="mx-auto mt-6 max-w-2xl text-slate-400">
            Everything you need for the ultimate movie streaming experience in
            one place.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
