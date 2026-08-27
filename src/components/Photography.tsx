"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PhotoData } from "@/utils/getPhotos";
import gsap from "gsap";

export default function Photography({
  initialPhotos = [],
}: {
  initialPhotos?: PhotoData[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  // Interaction State
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    targetYaw: 0,
    targetPitch: 0,
    currentYaw: 0,
    currentPitch: 0,
  });

  useEffect(() => {
    if (!containerRef.current || !itemsRef.current || initialPhotos.length === 0) return;

    const N = initialPhotos.length;
    
    // Calculate radius to perfectly fit the screen height without overlapping text
    const imgHeight = typeof window !== 'undefined' && window.innerWidth < 768 ? 200 : 280;
    const maxR = typeof window !== 'undefined' ? (window.innerHeight * 0.5) - (imgHeight / 2) - 100 : 320;
    const R = Math.max(120, Math.min(window.innerWidth < 768 ? 160 : 300, maxR));
    
    // Generate initial Fibonacci sphere points
    const basePoints: {x: number, y: number, z: number}[] = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2; 
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      basePoints.push({ x: x * R, y: y * R, z: z * R });
    }

    // Set initial positions to absolute center
    itemsRef.current.forEach((el) => {
      if (el) {
        gsap.set(el, { xPercent: -50, yPercent: -50, position: "absolute", top: "50%", left: "50%" });
      }
    });

    const updateSphere = () => {
      const state = dragState.current;

      // Auto rotation if not dragging
      if (!state.isDragging) {
        state.targetYaw -= 0.003; 
      }

      state.currentYaw += (state.targetYaw - state.currentYaw) * 0.1;
      state.currentPitch += (state.targetPitch - state.currentPitch) * 0.1;

      const maxPitch = Math.PI / 3;
      state.currentPitch = Math.max(-maxPitch, Math.min(maxPitch, state.currentPitch));
      state.targetPitch = Math.max(-maxPitch, Math.min(maxPitch, state.targetPitch));

      const cy = Math.cos(state.currentYaw);
      const sy = Math.sin(state.currentYaw);
      const cp = Math.cos(state.currentPitch);
      const sp = Math.sin(state.currentPitch);

      basePoints.forEach((p, i) => {
        const x1 = p.x * cy - p.z * sy;
        const y1 = p.y;
        const z1 = p.x * sy + p.z * cy;

        const x2 = x1;
        const y2 = y1 * cp - z1 * sp;
        const z2 = y1 * sp + z1 * cp;

        const el = itemsRef.current[i];
        if (el) {
          const zProgress = (z2 + R) / (R * 2);
          const opacity = 0.2 + (zProgress * 0.8);
          const scale = 0.6 + (zProgress * 0.6);

          gsap.set(el, {
            x: x2,
            y: y2,
            z: z2,
            opacity: opacity,
            scale: scale,
            zIndex: Math.round(z2),
            pointerEvents: zProgress > 0.4 ? "auto" : "none"
          });
        }
      });
    };

    gsap.ticker.add(updateSphere);

    const container = containerRef.current;
    const onDown = (e: MouseEvent | TouchEvent) => {
      const state = dragState.current;
      state.isDragging = true;
      state.startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      state.startY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      const state = dragState.current;
      if (!state.isDragging) return;
      
      const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      state.targetYaw += (currentX - state.startX) * 0.005;
      state.targetPitch += (currentY - state.startY) * 0.005;

      state.startX = currentX;
      state.startY = currentY;
    };

    const onUp = () => { dragState.current.isDragging = false; };

    container.addEventListener("mousedown", onDown);
    container.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    container.addEventListener("touchstart", onDown, { passive: true });
    container.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);

    return () => {
      gsap.ticker.remove(updateSphere);
      container.removeEventListener("mousedown", onDown);
      container.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      container.removeEventListener("touchstart", onDown);
      container.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [initialPhotos]);

  return (
    <section id="photography" className="relative py-32 overflow-hidden bg-[var(--background)]">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.2] blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.05), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.1] blur-[100px]"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto relative z-10 px-6 md:px-16 pointer-events-none">
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
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-transparent bg-clip-text"
              style={{ backgroundImage: "var(--gradient-hero)" }}>
            Through <br /> My Lens
          </h2>
          <p className="text-[var(--foreground)]/70 max-w-sm text-sm md:text-base leading-relaxed pb-2">
            Capturing moments, light, and geometry. A collection of my favorite shots from around the world.
          </p>
        </motion.div>
      </div>

      <div 
        className="relative w-full md:w-[60%] md:ml-auto h-[60vh] md:h-[80vh] min-h-[600px] md:min-h-[850px] mt-12 z-20 overflow-visible cursor-grab active:cursor-grabbing"
        ref={containerRef}
        data-cursor="Drag"
        style={{ perspective: "1200px" }}
      >
        <div className="absolute inset-0 w-full h-full" style={{ transformStyle: "preserve-3d" }}>
          {initialPhotos.map((photo, i) => (
            <Link
              href="/photography"
              key={i}
              ref={(el) => { itemsRef.current[i] = el; }}
              className="w-[140px] h-[200px] md:w-[200px] md:h-[280px] rounded-sm group block shadow-2xl"
              style={{ 
                background: "rgba(255,255,255,0.04)", 
                border: "2px solid rgba(234,230,225,0.15)",
                transformStyle: "preserve-3d" 
              }}
              data-cursor="View"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 140px, 200px"
                priority={i < 5}
                className="object-cover transition-all duration-700 ease-out group-hover:brightness-125"
                quality={85}
              />
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-16 mt-20 flex justify-center pointer-events-none">
        <Link 
          href="/photography" 
          className="pointer-events-auto inline-flex items-center gap-3 text-sm font-medium text-[var(--foreground)] hover:text-white transition-colors group"
        >
          View Full Gallery
          <span className="w-8 h-8 rounded-full border border-[var(--border-accent)] flex items-center justify-center group-hover:bg-white group-hover:border-white group-hover:text-black transition-all">
            <ArrowRight size={14} />
          </span>
        </Link>
      </div>
    </section>
  );
}
