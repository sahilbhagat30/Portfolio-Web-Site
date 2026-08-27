"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-[var(--background)]">
      
      {/* Subtle animated background element */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(234,230,225,0.03), transparent 70%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        <p className="text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase text-white/30 mb-6">
          Error 404
        </p>
        
        <h1 
          className="font-black text-6xl md:text-9xl tracking-tighter text-transparent bg-clip-text mb-6"
          style={{ backgroundImage: "var(--gradient-hero)" }}
        >
          Lost in <br className="hidden md:block" /> the noise.
        </h1>
        
        <p className="text-white/50 text-sm md:text-base max-w-md mb-12 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Let's get you back to the signal.
        </p>
        
        <Link 
          href="/"
          className="group relative inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold text-black bg-[#EAE6E1] rounded-full overflow-hidden transition-transform hover:scale-105"
        >
          <span className="relative z-10">Return to Home</span>
          <div className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
        </Link>
      </motion.div>
    </div>
  );
}
