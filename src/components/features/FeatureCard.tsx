"use client";

import { motion } from "framer-motion";
import { Film, Tv, Sparkles, Smartphone } from "lucide-react";

const icons = {
  film: Film,
  tv: Tv,
  sparkles: Sparkles,
  smartphone: Smartphone,
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: keyof typeof icons;
}

export default function FeatureCard({
  title,
  description,
  icon,
}: FeatureCardProps) {
  const Icon = icons[icon];

  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.03,
      }}
      className="rounded-3xl border border-slate-800 bg-slate-900 p-8 transition"
    >
      <div className="mb-6 inline-flex rounded-2xl bg-red-600 p-4">
        <Icon size={28} />
      </div>

      <h3 className="mb-3 text-2xl font-bold">
        {title}
      </h3>

      <p className="text-slate-400">
        {description}
      </p>
    </motion.div>
  );
}