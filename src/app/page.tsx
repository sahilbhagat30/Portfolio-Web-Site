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

export default async function Home() {
  const photos = await getPhotos();

  return (
    <main className="relative bg-[var(--background)]">
      {/* Fixed Navigation */}
      <Navbar />

      {/* Scrollytelling Hero */}
      <div className="relative h-[500vh] flex md:flex-row" id="hero">
        {/* Left: Overlay (Full width on mobile, half on desktop) */}
        <div className="absolute md:relative w-full md:w-1/2 h-full z-20 pointer-events-none md:pointer-events-auto">
          <Overlay />
        </div>

        {/* Right: Canvas (Full width on mobile, half on desktop) */}
        <div className="absolute md:relative top-0 right-0 w-full md:w-1/2 h-full z-10">
          <ScrollyCanvas />
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

    </main>
  );
}
