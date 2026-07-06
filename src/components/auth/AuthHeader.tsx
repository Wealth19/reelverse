export default function AuthHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-4xl font-bold text-white">{title}</h1>

      <p className="mt-3 text-slate-400">{subtitle}</p>
    </div>
  );
}
