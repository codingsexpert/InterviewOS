import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProductOverview } from "@/components/ProductOverview";
import { HowItWorks } from "@/components/HowItWorks";
import { CoreFeatures } from "@/components/CoreFeatures";
import { ArchitectureSection } from "@/components/ArchitectureSection";
import { CallToAction } from "@/components/CallToAction";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50 selection:bg-blue-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ProductOverview />
        <HowItWorks />
        <CoreFeatures />
        <ArchitectureSection />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
