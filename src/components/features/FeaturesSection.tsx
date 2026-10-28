import FeatureCard from "./FeatureCard";
import features from "./features";

export default function FeaturesSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <p className="font-semibold uppercase tracking-[0.3em] text-[#d4a24c]">
            How it works
          </p>
          <h2 className="mt-4 text-4xl font-bold">A house for two kinds of people</h2>
          <p className="mx-auto mt-5 max-w-2xl text-[#cbbba4]">
            Customers spend from a wallet. Authors publish titles. Rentals expire.
            Purchases stay.
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
