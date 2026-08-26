"use client";

import { useEffect, useRef } from "react";

const FRAME_COUNT = 120; // 000 to 119
const base = process.env.NODE_ENV === "production" ? "/Portfolio-Web-Site" : "";

export default function ScrollyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number>(-1);

  // Pre-load all frames
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = new Array(FRAME_COUNT);

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      const frameNum = i.toString().padStart(3, "0");
      img.src = `${base}/sequence/frame_${frameNum}_delay-0.067s.webp`;
      img.onload = () => {
        loadedImages[i] = img;
        // Draw the first frame as soon as it loads
        if (i === 0) drawFrame(0);
      };
      loadedImages[i] = img;
    }
    imagesRef.current = loadedImages;
  }, []);

  // Draw a specific frame index to the canvas
  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Keep canvas sized to its parent
    const parent = canvas.parentElement;
    if (parent) {
      if (canvas.width !== parent.clientWidth) canvas.width = parent.clientWidth;
      if (canvas.height !== parent.clientHeight) canvas.height = parent.clientHeight;
    }

    const images = imagesRef.current;
    const idx = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(frameIndex)));
    const img = images[idx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

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

    // --- Programmatic Background Removal (Chroma Keying) ---
    // Extract the pixel data from the drawn image area
    try {
      const imgData = ctx.getImageData(offsetX, offsetY, drawWidth, drawHeight);
      const data = imgData.data;

      // The background in the images is a mix of Dark Navy and Fiery Orange.
      // We will loop through every pixel and make these specific color ranges transparent.
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Background Color 1: Dark Navy / Black (Top and Bottom of image)
        const isDark = r < 45 && g < 55 && b < 75; 
        
        // Background Color 2: Fiery Orange Glow (Middle of image)
        // High red, moderate green, very low blue
        const isOrange = r > 120 && g > 40 && g < 150 && b < 60 && r > g * 1.3;

        // Soften the edges (Anti-aliasing / Feathering)
        if (isDark || isOrange) {
          // If it perfectly matches the background, make it fully transparent
          data[i + 3] = 0; 
        } else if (
          // Create a slight transition zone for pixels near the orange threshold
          (r > 90 && g > 30 && b < 80 && r > g * 1.2)
        ) {
          data[i + 3] = 100; // Semi-transparent for softer edges
        }
      }
      
      ctx.putImageData(imgData, offsetX, offsetY);
    } catch (e) {
      // Ignore cross-origin canvas errors during local dev
    }
  };

  // rAF loop — polls scrollY every frame so iOS momentum scroll works perfectly
  useEffect(() => {
    const tick = () => {
      const heroEl = document.getElementById("hero");
      const heroHeight = heroEl ? heroEl.offsetHeight : window.innerHeight * 5;
      
      // Use scrollY with fallbacks for all browsers
      const scrollY =
        window.scrollY ??
        window.pageYOffset ??
        document.documentElement.scrollTop ??
        0;

      const progress = Math.min(Math.max(scrollY / heroHeight, 0), 1);
      const targetFrame = progress * (FRAME_COUNT - 1);
      const roundedFrame = Math.round(targetFrame);

      // Only redraw if the frame actually changed
      if (roundedFrame !== lastFrameRef.current) {
        lastFrameRef.current = roundedFrame;
        drawFrame(targetFrame);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="h-full w-full relative">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="w-full h-full md:w-auto md:max-w-md lg:max-w-lg md:aspect-[9/16] md:h-[85vh] relative flex items-center justify-center">
          <canvas 
            ref={canvasRef}
            className="w-full h-full block object-contain"
            style={{ 
              maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 50%, transparent 100%)'
            }}
          />
        </div>
      </div>
    </div>
  );
}
