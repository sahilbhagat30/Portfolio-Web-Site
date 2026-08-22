"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import Image from "next/image";

import { PhotoData } from "@/utils/getPhotos";

export default function Photography({
  initialPhotos = [],
}: {
  initialPhotos?: PhotoData[];
}) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState("");

  // Use all photos in a single row
  const row = initialPhotos;

  return (
    <section id="photography" className="relative py-32 overflow-hidden bg-[var(--background)]">
      {/* Injecting marquee animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 0.5rem)); }
        }
        .marquee-left {
          /* Slowed down from 40s to 120s for 28 photos */
          animation: scroll-left 120s linear infinite;
        }
        .marquee-left:hover {
          animation-play-state: paused;
        }
        `
      }} />

      {/* Background organic shape */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.2] blur-[120px]"
        style={{ background: "radial-gradient(circle, #1a1a1a, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.1] blur-[100px]"
        style={{ background: "radial-gradient(circle, #333333, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto relative z-10 px-6 md:px-16">
        {/* Header */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-label mb-4"
        >
          Beyond the screen
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
              className="text-4xl md:text-5xl font-bold tracking-tight font-serif"
              style={{ letterSpacing: "-0.02em" }}
            >
              Life out of office
            </h2>
            <p className="mt-3 text-white/40 max-w-md text-sm leading-relaxed">
              When I&apos;m not pushing pixels or writing code, you can find me exploring the world, chasing experiences, and capturing moments through my lens.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Marquee Slideshows */}
      <div className="relative w-full flex flex-col gap-4 mt-8 pb-12 z-20 overflow-hidden">
        {/* Single Row: Scrolls Left */}
        {row.length > 0 && (
          <div className="flex w-max gap-4 marquee-left">
            {[...row, ...row].map((photo, i) => (
              <div
                key={i}
                className="w-[225px] h-[400px] md:w-[270px] md:h-[480px] relative overflow-hidden rounded-sm shrink-0 group cursor-pointer"
                style={{ background: "rgba(255,255,255,0.04)", border: "4px solid rgba(234,230,225,0.15)", outline: "1px solid rgba(234,230,225,0.4)", outlineOffset: "-4px" }}
                onClick={() => {
                  setLightboxSrc(photo.src);
                  setLightboxAlt(photo.alt);
                }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 225px, 270px"
                  priority={i < 3}
                  className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
                  quality={85}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                  <ZoomIn size={32} className="text-white drop-shadow-lg" />
                </div>
              </div>
            ))}
          </div>
        )}
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
              <div className="relative w-full h-[80vh]">
                <Image
                  src={lightboxSrc}
                  alt={lightboxAlt}
                  fill
                  className="object-contain rounded-2xl shadow-2xl"
                  sizes="100vw"
                  quality={100}
                />
              </div>
              <p className="mt-4 text-white/40 text-sm text-center">{lightboxAlt}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
