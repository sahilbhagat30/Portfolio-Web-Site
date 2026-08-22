"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

import { PhotoData } from "@/utils/getPhotos";

export default function Photography({
  initialPhotos = [],
}: {
  initialPhotos?: PhotoData[];
}) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState("");

  // Split photos into two rows for the double marquee effect
  const mid = Math.ceil(initialPhotos.length / 2);
  const row1 = initialPhotos.slice(0, mid);
  const row2 = initialPhotos.slice(mid);

  return (
    <section id="photography" className="relative py-32 overflow-hidden bg-[#080808]">
      {/* Injecting marquee animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 0.5rem)); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(calc(-50% - 0.5rem)); }
          100% { transform: translateX(0); }
        }
        .marquee-left {
          animation: scroll-left 40s linear infinite;
        }
        .marquee-right {
          animation: scroll-right 40s linear infinite;
        }
        .marquee-left:hover, .marquee-right:hover {
          animation-play-state: paused;
        }
        `
      }} />

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
              className="text-4xl md:text-5xl font-bold tracking-tight"
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
        {/* Row 1: Scrolls Left */}
        {row1.length > 0 && (
          <div className="flex w-max gap-4 marquee-left">
            {[...row1, ...row1].map((photo, i) => (
              <div
                key={i}
                className="w-[280px] h-[190px] md:w-[380px] md:h-[260px] relative overflow-hidden rounded-2xl shrink-0 group cursor-pointer"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                onClick={() => {
                  setLightboxSrc(photo.src);
                  setLightboxAlt(photo.alt);
                }}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover transition-all duration-700 ease-out grayscale group-hover:grayscale-0 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500" />
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                  <ZoomIn size={32} className="text-white drop-shadow-lg" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Row 2: Scrolls Right */}
        {row2.length > 0 && (
          <div className="flex w-max gap-4 marquee-right">
            {[...row2, ...row2].map((photo, i) => (
              <div
                key={i}
                className="w-[280px] h-[190px] md:w-[380px] md:h-[260px] relative overflow-hidden rounded-2xl shrink-0 group cursor-pointer"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                onClick={() => {
                  setLightboxSrc(photo.src);
                  setLightboxAlt(photo.alt);
                }}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover transition-all duration-700 ease-out grayscale group-hover:grayscale-0 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500" />
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
