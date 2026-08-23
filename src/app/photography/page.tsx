import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getPhotos } from "@/utils/getPhotos";
import PhotographyClient from "./PhotographyClient";

export default function PhotographyPage() {
  const photos = getPhotos();

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-white/20 selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex items-center justify-between pointer-events-none">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between pointer-events-auto">
          <Link href="/#photography" className="group flex items-center gap-2 text-white/50 hover:text-white transition-colors">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold tracking-wide uppercase">Back</span>
          </Link>
          <div className="font-bold tracking-tighter text-xl">
            Weiss <span className="text-white/30 font-normal">Gallery</span>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
        <h1 
          className="text-4xl md:text-6xl font-bold tracking-tight mb-4"
          style={{ letterSpacing: "-0.03em" }}
        >
          Photography
        </h1>
        <p className="text-white/40 max-w-lg text-lg leading-relaxed">
          A collection of quiet moments, urban spaces, and visual stories captured through my lens.
        </p>
      </section>

      {/* Interactive Gallery Component */}
      <PhotographyClient photos={photos} />
    </main>
  );
}
