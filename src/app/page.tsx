import dynamic from "next/dynamic";
import ScrollyCanvas from "@/components/ScrollyCanvas";
import Overlay from "@/components/Overlay";
import Navbar from "@/components/Navbar";
import { getPhotos } from "@/utils/getPhotos";

// Dynamically load below-the-fold components to reduce initial bundle size
const About = dynamic(() => import("@/components/About"));
const Projects = dynamic(() => import("@/components/Projects"));
const PersonalProjects = dynamic(() => import("@/components/PersonalProjects"));
const Photography = dynamic(() => import("@/components/Photography"));
const TheEnd = dynamic(() => import("@/components/TheEnd"));
const VinylPlayer = dynamic(() => import("@/components/VinylPlayer"));

export default function Home() {
  const photos = getPhotos();

  return (
    <main className="relative bg-[var(--background)]">
      {/* Fixed Navigation */}
      <Navbar />

      {/* Scrollytelling Hero */}
      <div className="relative h-[500vh] w-full" id="hero">
        {/* Canvas (Full width, centered) */}
        <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
          <ScrollyCanvas />
        </div>

        {/* Overlay Text (On top) */}
        <div className="absolute inset-0 w-full h-full z-20 pointer-events-none md:pointer-events-auto">
          <Overlay />
        </div>
      </div>

      {/* About & Skills */}
      <About />

      {/* Experience */}
      <Projects />

      {/* Personal Projects */}
      <PersonalProjects />

      {/* Photography */}
      <Photography initialPhotos={photos} />

      {/* Contact & Footer (New Michelangelo Hands layout) */}
      <TheEnd />

      {/* Vinyl Music Player */}
      <VinylPlayer />
    </main>
  );
}
