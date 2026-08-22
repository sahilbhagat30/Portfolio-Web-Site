"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";

interface Track {
  title: string;
  artist: string;
  file: string;
  art?: string; // Optional album art image path
}

// basePath is set via next.config.ts at build time
const basePath = typeof window !== "undefined" && window.location.hostname === "localhost" ? "" : "/Portfolio-Web-Site";

const TRACKS: Track[] = [
  { title: "Track 1", artist: "Artist", file: `${basePath}/music/track1.mp3`, art: `${basePath}/music/art1.png` },
  { title: "Track 2", artist: "Artist", file: `${basePath}/music/track2.mp3`, art: `${basePath}/music/art2.png` },
  { title: "Track 3", artist: "Artist", file: `${basePath}/music/track3.mp3`, art: `${basePath}/music/art3.png` },
];

// ─── Reusable Vinyl Disc SVG ─────────────────────────────────────────────
function VinylDisc({ artSrc, id, size = 64 }: { artSrc?: string; id: string; size?: number }) {
  const cx = size / 2;
  const labelR = (size / 64) * 16; // slightly larger label to match image
  const clipId = `clip-${id}`;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]">
      {/* Outer record */}
      <circle cx={cx} cy={cx} r={cx - 2} fill="#0a0a0a" stroke="#1a1a1a" strokeWidth="1" />
      
      {/* Grooves */}
      {[0.88, 0.78, 0.68, 0.58, 0.48].map((ratio, i) => (
        <circle key={i} cx={cx} cy={cx} r={(cx - 2) * ratio} fill="none" stroke="#161616" strokeWidth="1.5" />
      ))}

      {/* Crescent highlight on the left edge */}
      <path 
        d={`M ${cx - cx*0.8} ${cx - cx*0.3} A ${cx*0.85} ${cx*0.85} 0 0 0 ${cx - cx*0.8} ${cx + cx*0.3}`} 
        fill="none" 
        stroke="rgba(255,255,255,0.06)" 
        strokeWidth={size*0.02} 
        strokeLinecap="round" 
      />

      <defs>
        <clipPath id={clipId}>
          <circle cx={cx} cy={cx} r={labelR} />
        </clipPath>
        <radialGradient id={`grad-${id}`} cx="40%" cy="35%">
          <stop offset="0%" stopColor="#222" />
          <stop offset="100%" stopColor="#111" />
        </radialGradient>
      </defs>

      {/* Label: album art if provided, else gradient */}
      {artSrc ? (
        <image
          href={artSrc}
          x={cx - labelR}
          y={cx - labelR}
          width={labelR * 2}
          height={labelR * 2}
          clipPath={`url(#${clipId})`}
          preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        <circle cx={cx} cy={cx} r={labelR} fill={`url(#grad-${id})`} />
      )}

      {/* Center hole */}
      <circle cx={cx} cy={cx} r={(size / 64) * 3} fill="#050505" stroke="#111" strokeWidth="1" />
    </svg>
  );
}
// ─────────────────────────────────────────────────────────────────────────


export default function VinylPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(true);

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
      className="fixed bottom-6 left-6 z-50 flex items-center gap-3 px-3 py-2 rounded-full cursor-pointer select-none"
      style={{
        background: "#181818",
        border: "1px solid #2a2a2a",
        boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
      }}
      onClick={() => setIsMinimized(false)}
      title="Expand player"
    >
      <motion.div style={{ rotate: vinylRotation }} className="w-8 h-8 shrink-0">
        <VinylDisc artSrc={TRACKS[currentTrack].art} id="mini" size={64} />
      </motion.div>

      <div className="flex items-center gap-1 pr-2">
        {isPlaying ? (
          <>
            {[0, 0.15, 0.3].map((delay) => (
              <motion.div
                key={delay}
                className="w-1 rounded-sm bg-white/60"
                animate={{ height: ["4px", "14px", "4px"] }}
                transition={{ duration: 0.8, repeat: Infinity, delay, ease: "easeInOut" }}
              />
            ))}
          </>
        ) : (
          <div className="w-1 h-3 rounded-sm bg-white/20" />
        )}
      </div>
    </motion.div>
  );

  // The full player shown when maximized (matte dark UI as requested)
  const FullPlayer = () => (
    <motion.div
      key="full"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className="fixed bottom-6 left-6 z-50 overflow-hidden cursor-pointer select-none"
      style={{
        width: "280px",
        height: "170px",
        borderRadius: "28px",
        background: "#151515",
        border: "1px solid #262626",
        boxShadow: "0 24px 48px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
      onClick={() => setIsMinimized(true)}
      title="Click anywhere to minimise"
    >
      {/* Vinyl Disc positioned on the left, bleeding off slightly */}
      <motion.div 
        className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ left: "-30px", width: "190px", height: "190px", rotate: vinylRotation }}
      >
        <VinylDisc artSrc={TRACKS[currentTrack].art} id="main" size={190} />
      </motion.div>

      {/* Play/Pause Button Overlay (Static, dead center of the vinyl) */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/80 transition-colors border border-white/5 backdrop-blur-sm shadow-xl z-20"
        style={{ left: "35px", width: "60px", height: "60px" }}
        onClick={(e) => { e.stopPropagation(); togglePlay(); }}
        title={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white" className="opacity-90">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="opacity-90 ml-1">
            <path d="M7 5.5l12 6.5-12 6.5z" />
          </svg>
        )}
      </div>

      {/* Horizontal Tonearm at top right */}
      <motion.div
        className="absolute top-5 right-5 z-10"
        onClick={(e) => { e.stopPropagation(); togglePlay(); }}
        title={isPlaying ? "Lift needle to pause" : "Drop needle to play"}
        style={{ transformOrigin: "90px 20px" }}
        animate={{ rotate: isPlaying ? 0 : 16 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        whileHover={{ scale: 1.02 }}
      >
        <svg width="110" height="70" viewBox="0 0 110 70" className="drop-shadow-xl">
          {/* Pivot Base */}
          <circle cx="90" cy="20" r="16" fill="#181818" stroke="#2a2a2a" strokeWidth="2"/>
          <circle cx="90" cy="20" r="12" fill="#111"/>
          <circle cx="90" cy="20" r="4" fill="#333"/>
          <circle cx="90" cy="20" r="1.5" fill="#000"/>
          
          {/* Arm Rod */}
          <rect x="25" y="17" width="65" height="6" rx="3" fill="#222" stroke="#111" strokeWidth="1" />
          
          {/* Headshell/Cartridge */}
          <g transform="translate(18, 20) rotate(15)">
            <rect x="-14" y="-10" width="22" height="16" rx="4" fill="#1a1a1a" stroke="#333" strokeWidth="1"/>
            {/* Stylus groove detail */}
            <rect x="-8" y="-5" width="4" height="8" rx="1" fill="#050505"/>
          </g>
        </svg>
      </motion.div>
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
