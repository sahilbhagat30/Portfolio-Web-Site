"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SocialCardGrid } from "./SocialLinks";

export default function TheEnd() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [basePath, setBasePath] = useState(
    process.env.NODE_ENV === "production" ? "/Portfolio-Web-Site" : ""
  );

  useEffect(() => {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      setBasePath("");
    }
  }, []);

  // Track scroll progress relative to this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  // Left hand moves from left (-100%) to center (0%)
  const leftHandX = useTransform(scrollYProgress, [0, 1], ["-60%", "5%"]);
  
  // Right hand moves from right (100%) to center (0%)
  const rightHandX = useTransform(scrollYProgress, [0, 1], ["60%", "-5%"]);

  return (
    <section className="relative py-24 px-6 md:px-12 w-full max-w-[1400px] mx-auto overflow-hidden">
      <div className="flex flex-col lg:flex-row items-stretch justify-between gap-8 h-[60vh] min-h-[500px]">
        
        {/* Left Text Block */}
        <div className="flex flex-col justify-center shrink-0 lg:w-48 z-10 text-center lg:text-left">
          <h2 className="font-black text-6xl md:text-7xl leading-none tracking-tighter mb-4 text-white">
            THE
            <br />
            END
          </h2>
          <p className="text-violet-400 font-mono text-sm uppercase tracking-widest max-w-[200px] mx-auto lg:mx-0">
            [ Or the beginning of us working together? ]
          </p>
        </div>

        {/* Center Canvas (The Hands) */}
        <div 
          ref={containerRef}
          className="relative flex-1 rounded-[2rem] overflow-hidden border border-white/5"
          style={{
            background: "linear-gradient(135deg, rgba(168,85,247,0.1), rgba(34,211,238,0.05), rgba(0,0,0,1))",
            boxShadow: "inset 0 0 100px rgba(0,0,0,0.8)",
          }}
        >
          {/* Top subtle text ticker bar (optional, based on reference) */}
          <div className="absolute top-0 left-0 w-full h-8 bg-black/40 border-b border-white/5 flex items-center overflow-hidden z-20">
            <motion.div 
              className="flex whitespace-nowrap text-[10px] uppercase font-mono text-white/40 gap-8"
              animate={{ x: [0, -1000] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
              {[...Array(10)].map((_, i) => (
                <span key={i} className="flex items-center gap-8">
                  And... that was my portfolio
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/50" />
                </span>
              ))}
            </motion.div>
          </div>

          {/* Left Hand Image (Colorized via multiply/screen blend modes) */}
          <motion.div 
            className="absolute top-1/2 -translate-y-1/2 left-0 w-[45%] h-[70%] origin-left mix-blend-screen"
            style={{ x: leftHandX }}
          >
            <div className="relative w-full h-full rounded-r-full overflow-hidden bg-violet-400" style={{ backgroundImage: "linear-gradient(to right, #c084fc, #e879f9)" }}>
              {/* Multiply: White becomes Violet, Black stays Black */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={`${basePath}/assets/left_hand.jpg`} 
                alt="Left Hand" 
                className="absolute inset-0 w-full h-full object-contain object-left mix-blend-multiply" 
              />
            </div>
          </motion.div>

          {/* Right Hand Image */}
          <motion.div 
            className="absolute top-1/2 -translate-y-1/2 right-0 w-[45%] h-[70%] origin-right mix-blend-screen"
            style={{ x: rightHandX }}
          >
            <div className="relative w-full h-full rounded-l-full overflow-hidden bg-cyan-400" style={{ backgroundImage: "linear-gradient(to left, #22d3ee, #818cf8)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={`${basePath}/assets/right_hand.jpg`} 
                alt="Right Hand" 
                className="absolute inset-0 w-full h-full object-contain object-right mix-blend-multiply" 
              />
            </div>
          </motion.div>
          
          <div className="absolute bottom-6 right-6 z-20">
            <p className="font-mono text-white/30 text-xs uppercase tracking-widest">
              © Sahil Bhagat
            </p>
          </div>
        </div>

        {/* Right Text Block */}
        <div className="flex flex-col justify-center shrink-0 lg:w-48 z-10 text-center lg:text-left">
          <h2 className="font-black text-6xl md:text-7xl leading-none tracking-tighter mb-4 text-white">
            SAY
            <br />
            HEY
          </h2>
          <p className="text-cyan-400 font-mono text-sm uppercase tracking-widest max-w-[200px] mx-auto lg:mx-0 mb-8">
            [ Available for projects, chats, or data engineering debates ]
          </p>
          
          <div className="flex justify-center lg:justify-start">
            <SocialCardGrid />
          </div>
        </div>
      </div>
    </section>
  );
}
