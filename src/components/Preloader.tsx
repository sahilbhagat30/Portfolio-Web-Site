"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Lock scrolling while loading
    document.body.style.overflow = "hidden";
    
    // Simulate loading progress
    const duration = 2000;
    const interval = 20; 
    let current = 0;

    const timer = setInterval(() => {
      // Easing out the progress so it slows down near the end
      current += (100 - current) * 0.08;
      
      if (current > 99) {
        current = 100;
        clearInterval(timer);
        setTimeout(() => {
          setIsLoading(false);
          document.body.style.overflow = "";
        }, 300);
      }
      setProgress(Math.floor(current));
    }, interval);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--background)] origin-top"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Background grid texture (subtle) */}
          <div className="absolute inset-0 noise-overlay opacity-50" />
          
          <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-12">
            <motion.div 
              className="text-6xl md:text-8xl font-black text-transparent bg-clip-text font-mono mb-6 tracking-tighter"
              style={{
                backgroundImage: "linear-gradient(135deg, #EAE6E1 0%, #A3A3A3 100%)",
                backgroundSize: "200% auto",
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              {progress}
            </motion.div>
            
            {/* Progress bar track */}
            <div className="w-full h-[1px] bg-white/10 overflow-hidden mb-6 relative">
              <motion.div 
                className="absolute top-0 left-0 h-full"
                style={{
                  background: "linear-gradient(90deg, #EAE6E1 0%, #A3A3A3 100%)",
                  filter: "blur(8px)",
                  width: `${progress}%`
                }}
              />
            </div>
            
            {/* Loading text details */}
            <div className="w-full flex justify-between text-[10px] uppercase tracking-[0.25em] font-semibold text-white/40">
              <span className="text-violet-400/80">System.Boot()</span>
              <span>{progress === 100 ? "Ready_>" : "Loading..."}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
