import Navbar from "@/components/landing/NavBar";
import { Hero } from "@/components/landing/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0F14] text-white">
      <Navbar />
      <Hero />
    </main>
  );
}
