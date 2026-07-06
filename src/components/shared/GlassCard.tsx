interface GlassCardProps {
  children: React.ReactNode;
}

export default function GlassCard({ children }: GlassCardProps) {
  return (
    <div
      className="
      rounded-3xl
      border
      border-white/10
      bg-white/5
      backdrop-blur-xl
      transition
      duration-300
      hover:border-red-500/50
      hover:bg-white/10
    "
    >
      {children}
    </div>
  );
}
