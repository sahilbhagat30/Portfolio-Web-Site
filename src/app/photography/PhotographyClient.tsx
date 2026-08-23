"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import Image from "next/image";
import { PhotoData } from "@/utils/getPhotos";

export default function PhotographyClient({ photos }: { photos: PhotoData[] }) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState("");

  return (
    <>
      <section className="px-6 pb-32 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6"
        >
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -50px 0px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.1 }}
              className="relative overflow-hidden group cursor-pointer rounded-sm"
              style={{ background: "rgba(255,255,255,0.02)", outline: "1px solid rgba(255,255,255,0.05)" }}
              onClick={() => {
                setLightboxSrc(photo.src);
                setLightboxAlt(photo.alt);
              }}
            >
              <div 
                className="relative w-full overflow-hidden" 
                style={{ aspectRatio: photo.span === 'tall' ? '3/4' : photo.span === 'wide' ? '16/9' : '1/1' }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-110"
                  quality={85}
                />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none bg-black/20">
                <ZoomIn size={32} className="text-white drop-shadow-lg" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-[#060000]/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
            onClick={() => setLightboxSrc(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-6 right-6 z-50 text-white/50 hover:text-white transition-colors bg-white/10 p-2 rounded-full backdrop-blur-md"
              onClick={() => setLightboxSrc(null)}
              aria-label="Close lightbox"
            >
              <X size={24} />
            </motion.button>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-6xl max-h-[90vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[85vh]">
                <Image
                  src={lightboxSrc}
                  alt={lightboxAlt}
                  fill
                  className="object-contain drop-shadow-2xl"
                  sizes="100vw"
                  quality={100}
                />
              </div>
              {lightboxAlt && (
                <p className="mt-4 text-white/40 text-sm tracking-wide">{lightboxAlt}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
