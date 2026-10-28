import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/layout/Footer";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="cinema-grain flex min-h-screen flex-col bg-[#08070b] text-[#f6f0e6]">
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
}
