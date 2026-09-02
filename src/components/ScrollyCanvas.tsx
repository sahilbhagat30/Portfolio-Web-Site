"use client";

import { useCallback, useEffect, useRef } from "react";

const FRAME_COUNT = 60;
const FRAME_BATCH_SIZE = 4;

export default function ScrollyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const rafRef = useRef<number | null>(null);
  const preloadTimerRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number>(-1);
  const targetFrameRef = useRef(0);
  const containerSizeRef = useRef({ width: 0, height: 0, heroHeight: 0 });

  // Draw a specific frame index to the canvas
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return false;
    const ctx = canvas.getContext("2d");
    if (!ctx) return false;

    // Use cached dimensions to avoid layout thrashing
    const { width, height } = containerSizeRef.current;
    if (width > 0 && canvas.width !== width) canvas.width = width;
    if (height > 0 && canvas.height !== height) canvas.height = height;

    const images = imagesRef.current;
    const idx = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(frameIndex)));
    const img = images[idx];
    if (!img || !img.complete || img.naturalWidth === 0) return false;

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
    return true;
  }, []);

  const loadFrame = useCallback((index: number) => {
    if (index < 0 || index >= FRAME_COUNT || imagesRef.current[index]) return;

    const img = new Image();
    img.decoding = "async";
    img.src = `/sequence-optimized/frame_${index.toString().padStart(3, "0")}.webp`;
    img.onload = () => {
      if (targetFrameRef.current === index) drawFrame(index);
    };
    imagesRef.current[index] = img;
  }, [drawFrame]);

  // Load the opening frame immediately, then fill the cache in small idle batches.
  useEffect(() => {
    loadFrame(0);

    let nextFrame = 1;
    const loadBatch = () => {
      const batchEnd = Math.min(nextFrame + FRAME_BATCH_SIZE, FRAME_COUNT);
      while (nextFrame < batchEnd) {
        loadFrame(nextFrame);
        nextFrame += 1;
      }

      if (nextFrame < FRAME_COUNT) {
        preloadTimerRef.current = window.setTimeout(loadBatch, 90);
      }
    };

    preloadTimerRef.current = window.setTimeout(loadBatch, 160);

    return () => {
      if (preloadTimerRef.current !== null) {
        window.clearTimeout(preloadTimerRef.current);
      }
      imagesRef.current.forEach((image) => {
        if (image) image.onload = null;
      });
      imagesRef.current = [];
    };
  }, [loadFrame]);

  // Cache dimensions so drawing never forces layout during a scroll frame.
  useEffect(() => {
    const parent = canvasRef.current?.parentElement;
    const heroEl = document.getElementById("hero");

    const updateSizes = () => {
      containerSizeRef.current = {
        width: parent ? parent.clientWidth : 0,
        height: parent ? parent.clientHeight : 0,
        heroHeight: heroEl ? heroEl.offsetHeight : window.innerHeight * 5,
      };
      lastFrameRef.current = -1;
      drawFrame(targetFrameRef.current);
    };

    updateSizes();
    window.addEventListener("resize", updateSizes);
    return () => window.removeEventListener("resize", updateSizes);
  }, [drawFrame]);

  // Draw only when scrolling changes the requested frame. This replaces a
  // permanent rAF loop and leaves the main thread idle between interactions.
  useEffect(() => {
    const updateFromScroll = () => {
      rafRef.current = null;
      const { heroHeight } = containerSizeRef.current;
      if (heroHeight === 0) return;

      const scrollDistance = Math.max(heroHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(window.scrollY / scrollDistance, 0), 1);
      const roundedFrame = Math.round(progress * (FRAME_COUNT - 1));
      targetFrameRef.current = roundedFrame;

      if (roundedFrame !== lastFrameRef.current) {
        lastFrameRef.current = roundedFrame;
        if (!drawFrame(roundedFrame)) {
          loadFrame(roundedFrame);

          // Keep the canvas responsive while a requested frame decodes.
          for (let distance = 1; distance < FRAME_COUNT; distance += 1) {
            if (
              drawFrame(roundedFrame - distance) ||
              drawFrame(roundedFrame + distance)
            ) break;
          }
        }
      }
    };

    const scheduleUpdate = () => {
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(updateFromScroll);
      }
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [drawFrame, loadFrame]);

  return (
    <div className="h-full w-full relative">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Frame: Full bleed on mobile, portrait frame on desktop */}
        <div className="w-full h-full md:w-auto md:max-w-md lg:max-w-lg md:aspect-[9/16] md:h-[85vh] relative md:rounded-[32px] overflow-hidden md:border md:border-white/[0.08] md:bg-[#03050F] shadow-2xl group">
          <canvas
            ref={canvasRef}
            className="w-full h-full block object-cover"
          />
          
          {/* Glossy Glass Screen Reflection */}
          <div 
            className="absolute inset-0 pointer-events-none z-20 md:rounded-[32px]"
            style={{ 
              background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 35%)",
              boxShadow: "inset 0 1px 1px rgba(255,255,255,0.2), inset 0 0 20px rgba(255,255,255,0.02)"
            }}
          />
        </div>
      </div>
    </div>
  );
}
