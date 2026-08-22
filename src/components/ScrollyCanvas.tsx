"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";

const FRAME_COUNT = 120; // 000 to 119

export default function ScrollyCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loaded = 0;
    
    // Define a helper to draw the current frame
    const drawCurrentFrame = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const currentFrame = Math.round(frameIndex.get());
      const img = loadedImages[currentFrame];
      
      // Only draw if image exists and is fully loaded
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;
      
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

    const base = process.env.NODE_ENV === "production" ? "/Portfolio-Web-Site" : "";

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      const frameNum = i.toString().padStart(3, '0');
      
      img.onload = () => {
        loaded++;
        // If this is the currently requested frame, draw it immediately!
        if (Math.round(frameIndex.get()) === i) {
          drawCurrentFrame();
        }
        // Also just update state occasionally to trigger react re-renders if needed
        if (loaded === FRAME_COUNT) {
          setImages(loadedImages);
        }
      };
      
      img.src = `${base}/sequence/frame_${frameNum}_delay-0.067s.png`;
      loadedImages.push(img);
    }
    
    // Set initially so we have the array
    setImages(loadedImages);

    // Setup resize handler here so it has access to drawCurrentFrame
    const handleResize = () => {
      if (canvasRef.current) {
        const parent = canvasRef.current.parentElement;
        if (parent) {
          canvasRef.current.width = parent.clientWidth;
          canvasRef.current.height = parent.clientHeight;
        } else {
          canvasRef.current.width = window.innerWidth;
          canvasRef.current.height = window.innerHeight;
        }
        drawCurrentFrame();
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    
    // Subscribe to scroll changes directly here to use drawCurrentFrame
    const unsubscribe = frameIndex.on("change", () => {
      drawCurrentFrame();
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      unsubscribe();
    };
  }, [frameIndex]);

  return (
    <div ref={containerRef} className="h-full w-full relative">
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
