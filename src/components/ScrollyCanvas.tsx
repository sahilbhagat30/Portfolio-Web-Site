"use client";

import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 120; // 000 to 119
const base = process.env.NODE_ENV === "production" ? "/Portfolio-Web-Site" : "";

export default function ScrollyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Pre-load all frames
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = new Array(FRAME_COUNT);
    let loadedCount = 0;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      const frameNum = i.toString().padStart(3, "0");
      img.src = `${base}/sequence/frame_${frameNum}_delay-0.067s.png`;
      img.onload = () => {
        loadedImages[i] = img;
        loadedCount++;
        // Draw first frame as soon as it's ready
        if (i === 0) drawFrame(0, loadedImages);
      };
      loadedImages[i] = img;
    }
    imagesRef.current = loadedImages;
  }, []);

  // Draw a specific frame index to the canvas
  const drawFrame = (frameIndex: number, imgs?: HTMLImageElement[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const images = imgs ?? imagesRef.current;
    const idx = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(frameIndex)));
    const img = images[idx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    // Keep canvas sized to its parent
    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    }

    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.naturalWidth / img.naturalHeight;

    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawHeight = canvas.width / imgRatio;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawWidth = canvas.height * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // Scroll handler — directly tied to window.scrollY
  useEffect(() => {
    const handleScroll = () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(() => {
        const heroEl = document.getElementById("hero");
        const heroHeight = heroEl ? heroEl.offsetHeight : window.innerHeight * 5;
        const progress = Math.min(Math.max(window.scrollY / heroHeight, 0), 1);
        drawFrame(progress * (FRAME_COUNT - 1));
      });
    };

    // Also trigger on resize to refit the canvas
    const handleResize = () => {
      const heroEl = document.getElementById("hero");
      const heroHeight = heroEl ? heroEl.offsetHeight : window.innerHeight * 5;
      const progress = Math.min(Math.max(window.scrollY / heroHeight, 0), 1);
      drawFrame(progress * (FRAME_COUNT - 1));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    // Draw initial frame
    handleResize();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div className="h-full w-full relative">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Frame: Full bleed on mobile, portrait frame on desktop */}
        <div className="w-full h-full md:w-auto md:max-w-md lg:max-w-lg md:aspect-[9/16] md:h-[85vh] relative md:rounded-[32px] overflow-hidden md:shadow-2xl md:border border-white/10 bg-[#121212]">
          <canvas
            ref={canvasRef}
            className="w-full h-full block object-cover"
          />
        </div>
      </div>
    </div>
  );
}
