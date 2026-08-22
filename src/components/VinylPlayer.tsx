"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";

interface Track {
  title: string;
  artist: string;
  file: string;
}

// ─── Add your tracks here ──────────────────────────────────────────────────
// Drop audio files into /public/music/ and update this list.
const basePath = process.env.NODE_ENV === "production" ? "/Portfolio-Web-Site" : "";

const TRACKS: Track[] = [
  { title: "Track 1", artist: "Artist", file: `${basePath}/music/track1.wav` },
  { title: "Track 2", artist: "Artist", file: `${basePath}/music/track2.wav` },
  { title: "Track 3", artist: "Artist", file: `${basePath}/music/track3.wav` },
];
// ──────────────────────────────────────────────────────────────────────────

export default function VinylPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Show after About section
  useEffect(() => {
    const handleScroll = () => {
      const aboutEl = document.getElementById("about");
      if (aboutEl) {
        setIsVisible(window.scrollY >= aboutEl.offsetTop - window.innerHeight * 0.8);
      } else {
        setIsVisible(window.scrollY > window.innerHeight * 0.8);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const vinylRotation = useMotionValue(0);
  const animFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Spin the vinyl while playing
  useEffect(() => {
    const spin = (timestamp: number) => {
      if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;
      const delta = timestamp - lastTimestampRef.current;
      lastTimestampRef.current = timestamp;
      vinylRotation.set(vinylRotation.get() + delta * 0.06);
      animFrameRef.current = requestAnimationFrame(spin);
    };
    if (isPlaying) {
      lastTimestampRef.current = null;
      animFrameRef.current = requestAnimationFrame(spin);
    } else {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimestampRef.current = null;
    }
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, [isPlaying, vinylRotation]);

  // Load next track on end
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => setCurrentTrack((t) => (t + 1) % TRACKS.length);
    audio.src = TRACKS[currentTrack].file;
    audio.load();
    audio.addEventListener("ended", onEnded);
    if (isPlaying) audio.play().catch(() => {});
    return () => audio.removeEventListener("ended", onEnded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [isPlaying]);

  // The tiny pill shown when minimized
  const MinimizedPill = () => (
    <motion.div
      key="minimized"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer select-none"
      style={{
        background: "rgba(28,20,48,0.88)",
        border: "1px solid rgba(168,85,247,0.45)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 0 0 1px rgba(168,85,247,0.08) inset, 0 8px 32px rgba(99,57,200,0.25), 0 2px 8px rgba(0,0,0,0.5)",
      }}
      onClick={() => setIsMinimized(false)}
      title="Expand player"
    >
      {/* Tiny spinning vinyl */}
      <motion.div style={{ rotate: vinylRotation }} className="w-6 h-6 shrink-0">
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <circle cx="32" cy="32" r="31" fill="#111" />
          {[26, 18].map((r) => (
            <circle key={r} cx="32" cy="32" r={r} fill="none" stroke="#1a1a1a" strokeWidth="1" />
          ))}
          <circle cx="32" cy="32" r="10" fill="url(#miniLabel)" />
          <defs>
            <radialGradient id="miniLabel" cx="40%" cy="35%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="2.5" fill="#080808" />
        </svg>
      </motion.div>

      {/* Playing pulse dot or static dot */}
      <div className="flex items-center gap-1">
        {isPlaying ? (
          <>
            {[0, 0.15, 0.3].map((delay) => (
              <motion.div
                key={delay}
                className="w-0.5 rounded-full bg-violet-400"
                animate={{ height: ["4px", "12px", "4px"] }}
                transition={{ duration: 0.8, repeat: Infinity, delay, ease: "easeInOut" }}
              />
            ))}
          </>
        ) : (
          <div className="w-0.5 h-3 rounded-full bg-white/20" />
        )}
      </div>

      {/* Expand chevron */}
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="text-white/40">
        <path d="M2 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.div>
  );

  // The full player shown when maximized
  const FullPlayer = () => (
    <motion.div
      key="full"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className="fixed bottom-6 left-6 z-50 flex items-center justify-center p-4 rounded-[2rem] select-none"
      style={{
        background: "rgba(28,20,48,0.88)",
        border: "1px solid rgba(168,85,247,0.45)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 0 0 1px rgba(168,85,247,0.08) inset, 0 8px 32px rgba(99,57,200,0.25), 0 2px 8px rgba(0,0,0,0.5)",
      }}
    >
      {/* Click anywhere on the card (except needle) to minimize */}

      <div
        className="relative flex items-center justify-center pr-10 cursor-pointer"
        onClick={() => setIsMinimized(true)}
        title="Click to minimise"
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0"
          style={{
            background: isPlaying
              ? "radial-gradient(circle at center, rgba(168,85,247,0.15) 0%, transparent 70%)"
              : "transparent",
            transition: "background 0.8s ease",
          }}
        />

        {/* Vinyl disc */}
        <motion.div style={{ rotate: vinylRotation }} className="relative w-20 h-20">
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_4px_16px_rgba(168,85,247,0.2)]">
            <circle cx="32" cy="32" r="31" fill="#111" />
            {[30, 26, 22, 18, 14].map((r) => (
              <circle key={r} cx="32" cy="32" r={r} fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
            ))}
            <circle cx="32" cy="32" r="10" fill="url(#labelGrad2)" />
            <defs>
              <radialGradient id="labelGrad2" cx="40%" cy="35%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="60%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#1e1b4b" />
              </radialGradient>
            </defs>
            <circle cx="32" cy="32" r="2.5" fill="#080808" />
            <text x="32" y="35" textAnchor="middle" fill="white" fontSize="5" fontWeight="900" fontFamily="system-ui" letterSpacing="-0.5">SB</text>
          </svg>
        </motion.div>

        {/* Needle */}
        <motion.div
          className="absolute top-0 -right-2 cursor-pointer z-10"
          onClick={(e) => { e.stopPropagation(); togglePlay(); }}
          title={isPlaying ? "Lift needle to pause" : "Place needle to play"}
          style={{ transformOrigin: "top center" }}
          animate={{ rotate: isPlaying ? 26 : 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          whileHover={{ scale: 1.05 }}
        >
          <svg width="28" height="50" viewBox="0 0 40 72" fill="none" className="drop-shadow-lg">
            <circle cx="20" cy="6" r="6" fill="#2a2a2a" stroke="rgba(168,85,247,0.6)" strokeWidth="1.5" />
            <circle cx="20" cy="6" r="3" fill="#a855f7" />
            <rect x="18.5" y="10" width="3" height="40" rx="1.5" fill="#333" />
            <rect x="19" y="10" width="2" height="40" rx="1" fill="#444" />
            <rect x="15" y="50" width="10" height="10" rx="2" fill="#222" stroke="#444" strokeWidth="0.8" />
            <rect x="19.2" y="60" width="1.6" height="10" rx="0.8" fill="#a0a0a0" />
            <circle cx="20" cy="70.5" r="1.5" fill="#e0e0e0" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <>
      <audio ref={audioRef} preload="metadata" />

      <AnimatePresence mode="wait">
        {isVisible && (
          isMinimized ? <MinimizedPill key="pill" /> : <FullPlayer key="full" />
        )}
      </AnimatePresence>
    </>
  );
}
