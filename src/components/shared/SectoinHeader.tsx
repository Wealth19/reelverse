interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="mb-16">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-500">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-5xl font-bold tracking-tight">{title}</h2>

      {description && (
        <p className="mt-4 max-w-2xl text-lg text-slate-400">{description}</p>
      )}
    </div>
  );
}
