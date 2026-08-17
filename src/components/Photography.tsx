"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, Camera } from "lucide-react";

import { PhotoData } from "@/utils/getPhotos";

const spanClass: Record<string, string> = {
  tall: "row-span-2",
  wide: "col-span-2",
  normal: "",
};

export default function Photography({
  initialPhotos = [],
  categories = ["All"],
}: {
  initialPhotos?: PhotoData[];
  categories?: string[];
}) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState("");

  const filtered = initialPhotos.filter(
    (p) => activeCategory === "All" || p.category === activeCategory
  );

  return (
    <section id="photography" className="relative py-32 px-6 md:px-16 overflow-hidden">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #22d3ee, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #a855f7, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-label mb-4"
        >
          Through the lens
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight"
              style={{ letterSpacing: "-0.02em" }}
            >
              Photography{" "}
              <span className="gradient-text">/ Hobby</span>
            </h2>
            <p className="mt-3 text-white/40 max-w-md text-sm leading-relaxed">
              Official photographer for{" "}
              <span className="text-cyan-400 font-medium">Tuck &amp; Dive</span>
              {" "}- India&apos;s aquatics sports organization -
              and an avid personal photographer ever since.
            </p>
          </div>

          {/* Category filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300"
                style={
                  activeCategory === cat
                    ? {
                        background: "linear-gradient(135deg, #a855f7, #22d3ee)",
                        color: "#fff",
                        border: "1px solid transparent",
                      }
                    : {
                        background: "rgba(255,255,255,0.04)",
                        color: "rgba(255,255,255,0.45)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tuck & Dive credit badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-3 mb-10 p-4 rounded-2xl"
          style={{
            background: "rgba(34,211,238,0.06)",
            border: "1px solid rgba(34,211,238,0.15)",
          }}
        >
          <Camera size={18} className="text-cyan-400 shrink-0" />
          <p className="text-xs text-white/50 leading-relaxed">
            <span className="text-cyan-400 font-semibold">Official Photographer</span>
            {" · "}Tuck &amp; Dive Aquatics, India - photographed competitive diving events,
            athlete portraits, and poolside action during my undergraduate years.
          </p>
        </motion.div>

        {/* Masonry-style grid */}
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-3"
        >
          <AnimatePresence>
            {filtered.map((photo, i) => (
              <motion.div
                key={photo.src}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className={`group relative overflow-hidden rounded-2xl cursor-pointer ${spanClass[photo.span] ?? ""}`}
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                onClick={() => {
                  setLightboxSrc(photo.src);
                  setLightboxAlt(photo.alt);
                }}
              >
                {/* Photo */}
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  onError={(e) => {
                    // Placeholder gradient if photo not found
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />

                {/* Placeholder shown when no image yet */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-100 group-hover:opacity-0 transition-opacity duration-300"
                     style={{ zIndex: 0 }}>
                  <Camera size={24} className="text-white/10" />
                  <p className="text-[0.6rem] text-white/10 text-center px-4">{photo.alt}</p>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-10" />

                {/* Zoom icon + category */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ZoomIn size={22} className="text-white" />
                </div>
                <div className="absolute bottom-3 left-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span
                    className="text-[0.6rem] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(168,85,247,0.3)",
                      border: "1px solid rgba(168,85,247,0.4)",
                      color: "#c084fc",
                    }}
                  >
                    {photo.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>


      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6"
            onClick={() => setLightboxSrc(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
              onClick={() => setLightboxSrc(null)}
              aria-label="Close lightbox"
            >
              <X size={28} />
            </motion.button>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxSrc}
                alt={lightboxAlt}
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              />
              <p className="mt-4 text-white/40 text-sm text-center">{lightboxAlt}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
