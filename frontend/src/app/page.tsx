import Navbar from "@/components/landing/NavBar";
import { Hero } from "@/components/landing/Hero";

// The hero is full-bleed and the navbar sits on top of it, so the page itself
// carries no padding or background of its own.
export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#05070A] text-white">
      <Navbar />
      <Hero />
    </main>
  );
}
