import Navbar from "@/components/landing/NavBar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { UseCases } from "@/components/landing/UseCases";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Benefits } from "@/components/landing/Benefits";
import { CallToAction } from "@/components/landing/CallToAction";
import { Footer } from "@/components/landing/Footer";

// The hero is full-bleed and the navbar sits on top of it, so the page itself
// carries no padding or background of its own.
export default function Home() {
  return (
    <main className="relative min-h-screen bg-black text-white">
      <Navbar />
      <Hero />
      <Features />
      <UseCases />
      <HowItWorks />
      <Benefits />
      <CallToAction />
      <Footer />
    </main>
  );
}
