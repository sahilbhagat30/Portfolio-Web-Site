"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";

interface Track {
  title: string;
  artist: string;
  file: string;
}

// ─── Add your tracks here ──────────────────────────────────────────────────
// Drop MP3s into /public/music/ and update this list.
const TRACKS: Track[] = [
  { title: "Track 1", artist: "Artist", file: "/Portfolio-Web-Site/music/track1.mp3" },
  { title: "Track 2", artist: "Artist", file: "/Portfolio-Web-Site/music/track2.mp3" },
  { title: "Track 3", artist: "Artist", file: "/Portfolio-Web-Site/music/track3.mp3" },
];
// ──────────────────────────────────────────────────────────────────────────

export default function VinylPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

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
      vinylRotation.set(vinylRotation.get() + delta * 0.06); // 60deg/sec
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

  // Load + update progress
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setProgress((audio.currentTime / audio.duration) * 100 || 0);
    const onEnded = () => {
      setCurrentTrack((t) => (t + 1) % TRACKS.length);
    };
    const onCanPlay = () => setIsLoaded(true);

    setIsLoaded(false);
    audio.src = TRACKS[currentTrack].file;
    audio.load();
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("canplay", onCanPlay);

    if (isPlaying) audio.play().catch(() => {});

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("canplay", onCanPlay);
    };
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

  const nextTrack = () => setCurrentTrack((t) => (t + 1) % TRACKS.length);
  const prevTrack = () => setCurrentTrack((t) => (t - 1 + TRACKS.length) % TRACKS.length);

  const track = TRACKS[currentTrack];

  return (
    <>
      <audio ref={audioRef} preload="metadata" />

      {/* ── Floating vinyl disc (always visible) ── */}
      <motion.div
        className="fixed bottom-6 left-6 z-50 cursor-pointer select-none"
        onClick={() => setIsExpanded((e) => !e)}
        title={isExpanded ? "Close player" : "Open music player"}
      >
        {/* Vinyl disc */}
        <motion.div
          style={{ rotate: vinylRotation }}
          className="relative w-16 h-16"
        >
          {/* Outer record */}
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_0_12px_rgba(168,85,247,0.5)]">
            {/* Grooves */}
            <circle cx="32" cy="32" r="31" fill="#111" />
            <circle cx="32" cy="32" r="30" fill="none" stroke="#1f1f1f" strokeWidth="0.5" />
            <circle cx="32" cy="32" r="26" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
            <circle cx="32" cy="32" r="22" fill="none" stroke="#1f1f1f" strokeWidth="0.5" />
            <circle cx="32" cy="32" r="18" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
            <circle cx="32" cy="32" r="14" fill="none" stroke="#222" strokeWidth="0.5" />

            {/* Label */}
            <circle cx="32" cy="32" r="10" fill="url(#labelGrad)" />
            <defs>
              <radialGradient id="labelGrad" cx="40%" cy="35%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="60%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#1e1b4b" />
              </radialGradient>
            </defs>
            {/* Center hole */}
            <circle cx="32" cy="32" r="2.5" fill="#080808" />
            {/* SB text on label */}
            <text
              x="32" y="35" textAnchor="middle"
              fill="white" fontSize="5" fontWeight="900"
              fontFamily="system-ui"
              letterSpacing="-0.5"
            >
              SB
            </text>
          </svg>

          {/* Playing indicator pulse */}
          {isPlaying && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-violet-500/40"
              animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.div>
      </motion.div>

      {/* ── Expanded Player Panel ── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed bottom-24 left-6 z-50 w-72 rounded-2xl overflow-hidden"
            style={{
              background: "rgba(10,10,12,0.92)",
              border: "1px solid rgba(168,85,247,0.25)",
              backdropFilter: "blur(24px)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset",
            }}
          >
            {/* Header: Vinyl + needle interaction */}
            <div className="relative h-44 flex items-center justify-center overflow-hidden bg-[#0a0a0f]">

              {/* Ambient glow */}
              <div
                className="absolute inset-0"
                style={{
                  background: isPlaying
                    ? "radial-gradient(ellipse at 50% 60%, rgba(99,102,241,0.18) 0%, transparent 70%)"
                    : "radial-gradient(ellipse at 50% 60%, rgba(99,102,241,0.05) 0%, transparent 70%)",
                  transition: "background 0.8s ease"
                }}
              />

              {/* Large vinyl */}
              <motion.div
                style={{ rotate: vinylRotation }}
                className="relative w-28 h-28"
              >
                <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_8px_32px_rgba(99,102,241,0.4)]">
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

              {/* ── Needle ── */}
              <motion.div
                className="absolute top-3 right-10 cursor-pointer z-10"
                onClick={togglePlay}
                title={isPlaying ? "Lift needle to pause" : "Place needle to play"}
                style={{ transformOrigin: "top center" }}
                animate={{ rotate: isPlaying ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                whileHover={{ rotate: isPlaying ? 20 : 6 }}
              >
                {/* Needle arm */}
                <svg width="40" height="72" viewBox="0 0 40 72" fill="none">
                  {/* Pivot cap */}
                  <circle cx="20" cy="6" r="6" fill="#2a2a2a" stroke="rgba(168,85,247,0.6)" strokeWidth="1.5" />
                  <circle cx="20" cy="6" r="3" fill="#a855f7" />
                  {/* Arm body */}
                  <rect x="18.5" y="10" width="3" height="40" rx="1.5" fill="#333" />
                  <rect x="19" y="10" width="2" height="40" rx="1" fill="#444" />
                  {/* Cartridge */}
                  <rect x="15" y="50" width="10" height="10" rx="2" fill="#222" stroke="#444" strokeWidth="0.8" />
                  {/* Stylus tip */}
                  <rect x="19.2" y="60" width="1.6" height="10" rx="0.8" fill="#a0a0a0" />
                  <circle cx="20" cy="70.5" r="1.5" fill="#e0e0e0" />
                </svg>
                {/* Tooltip hint */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[0.5rem] text-white/30 whitespace-nowrap">
                  {isPlaying ? "lift" : "play"}
                </div>
              </motion.div>
            </div>

            {/* Progress bar */}
            <div className="h-0.5 bg-white/5">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-600 to-cyan-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Track info + controls */}
            <div className="p-4">
              {/* Track name */}
              <div className="mb-3">
                <p className="text-white font-semibold text-sm truncate">{track.title}</p>
                <p className="text-white/40 text-xs truncate">{track.artist}</p>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <button onClick={prevTrack} className="text-white/40 hover:text-white transition-colors p-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
                  </svg>
                </button>

                {/* Play/Pause = same as needle toggle */}
                <motion.button
                  onClick={togglePlay}
                  whileTap={{ scale: 0.9 }}
                  className="w-11 h-11 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                    boxShadow: isPlaying ? "0 0 20px rgba(124,58,237,0.5)" : "none",
                  }}
                >
                  {isPlaying ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </motion.button>

                <button onClick={nextTrack} className="text-white/40 hover:text-white transition-colors p-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 18l8.5-6L6 6v12zm2.5-6 8.5-6v12z" />
                    <path d="M16 6h2v12h-2z" />
                  </svg>
                </button>
              </div>

              {/* Track dots */}
              <div className="flex justify-center gap-1.5 mt-3">
                {TRACKS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentTrack(i)}
                    className="w-1.5 h-1.5 rounded-full transition-all"
                    style={{
                      background: i === currentTrack ? "#a855f7" : "rgba(255,255,255,0.15)",
                      transform: i === currentTrack ? "scale(1.4)" : "scale(1)",
                    }}
                  />
                ))}
              </div>

              {/* Add tracks hint */}
              {!isLoaded && (
                <p className="text-white/20 text-[0.6rem] text-center mt-3">
                  Add your MP3s to /public/music/
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
