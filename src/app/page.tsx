import ScrollyCanvas from "@/components/ScrollyCanvas";
import Overlay from "@/components/Overlay";
import Projects from "@/components/Projects";
import PersonalProjects from "@/components/PersonalProjects";
import Navbar from "@/components/Navbar";
import About from "@/components/About";
import Photography from "@/components/Photography";
import Contact from "@/components/Contact";
import TheEnd from "@/components/TheEnd";
import VinylPlayer from "@/components/VinylPlayer";
import { getPhotos, getCategories } from "@/utils/getPhotos";

export default function Home() {
  const photos = getPhotos();
  const categories = getCategories(photos);

  return (
    <main className="relative bg-[#080808]">
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
      <Photography initialPhotos={photos} categories={categories} />

      {/* Contact & Footer (New Michelangelo Hands layout) */}
      <TheEnd />

      {/* Vinyl Music Player */}
      <VinylPlayer />
    </main>
  );
}
