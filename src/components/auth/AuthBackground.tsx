interface AuthBackgroundProps {
  children: React.ReactNode;
}
export default function AuthBackground({ children }: AuthBackgroundProps) {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/background_banner.jpg')",
      }}
    />
  );
}
