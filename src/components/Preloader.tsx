"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Preloader() {
  const pathname = usePathname();
  const isPhotography = pathname === "/photography";
  
  const [isLoading, setIsLoading] = useState(!isPhotography);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isPhotography) return;

    // Lock scrolling while loading
    document.body.style.overflow = "hidden";
    
    // Simulate loading progress
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
        }, 400); // slight pause at 100
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
          transition={{ type: "spring", bounce: 0, duration: 0.8 }}
        >
          {/* Subtle noise overlay */}
          <div className="absolute inset-0 noise-overlay opacity-30" />
          
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
            {/* Odometer style massive number */}
            <div className="overflow-hidden text-[15vw] h-[1.2em] flex items-center justify-center">
              <motion.div 
                className="leading-none font-black text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(180deg, #FFFFFF 0%, #6B7280 100%)",
                }}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ type: "spring", bounce: 0, duration: 0.8 }}
              >
                {progress}
              </motion.div>
            </div>
            
            <motion.div 
              className="text-white/40 text-sm tracking-[0.3em] uppercase mt-4 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Loading Experience
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
