"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { SOCIAL_LINKS } from "./SocialLinks";

function useBasePath() {
  const [bp, setBp] = useState(
    process.env.NODE_ENV === "production" ? "/Portfolio-Web-Site" : ""
  );
  useEffect(() => {
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      setBp("");
    }
  }, []);
  return bp;
}

/* ── Floating particles between the hands ── */
function Particles({ active }: { active: boolean }) {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: 45 + Math.random() * 10,           // clustered near center
    y: 20 + Math.random() * 60,
    size: 1 + Math.random() * 2.5,
    duration: 2 + Math.random() * 3,
    delay: Math.random() * 2,
    purple: Math.random() > 0.5,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.purple
              ? "rgba(167,139,250,0.7)"
              : "rgba(34,211,238,0.7)",
            boxShadow: p.purple
              ? "0 0 6px rgba(167,139,250,0.5)"
              : "0 0 6px rgba(34,211,238,0.5)",
          }}
          animate={active ? {
            y: [0, -15, 5, -10, 0],
            x: [0, 8, -6, 4, 0],
            opacity: [0, 0.8, 0.5, 0.9, 0],
            scale: [0.5, 1.2, 0.8, 1, 0.5],
          } : { opacity: 0 }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ── Electric spark burst on connection ── */
function SparkBurst() {
  const sparks = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    return {
      id: i,
      endX: Math.cos(angle) * (30 + Math.random() * 20),
      endY: Math.sin(angle) * (20 + Math.random() * 15),
    };
  });

  return (
    <motion.div
      className="absolute pointer-events-none z-20"
      style={{ top: "50%", left: "50%", x: "-50%", y: "-50%" }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {sparks.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            width: 3,
            height: 3,
            background: "white",
            boxShadow: "0 0 8px rgba(200,180,255,0.9), 0 0 16px rgba(120,200,240,0.5)",
            left: "50%",
            top: "50%",
          }}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{
            x: s.endX,
            y: s.endY,
            scale: 0,
            opacity: 0,
          }}
          transition={{ duration: 0.6 + Math.random() * 0.3, ease: "easeOut" }}
        />
      ))}
      {/* Central flash */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 8,
          height: 8,
          left: "50%",
          top: "50%",
          x: "-50%",
          y: "-50%",
          background: "white",
          boxShadow: "0 0 30px rgba(200,180,255,0.8), 0 0 60px rgba(120,200,240,0.4)",
        }}
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale: 4, opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </motion.div>
  );
}

/* ── Scroll hint labels ── */
const SCROLL_STATES = [
  { threshold: 0,    text: "scroll to connect ↓", color: "rgba(255,255,255,0.15)" },
  { threshold: 0.4,  text: "almost there...",      color: "rgba(167,139,250,0.4)" },
  { threshold: 0.8,  text: "so close...",          color: "rgba(200,180,255,0.5)" },
  { threshold: 0.95, text: "✦ connected",          color: "rgba(34,211,238,0.7)" },
];

export default function TheEnd() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const basePath = useBasePath();
  const [scrollState, setScrollState] = useState(0);
  const [hasConnected, setHasConnected] = useState(false);
  const [showSparks, setShowSparks] = useState(false);

  const { scrollYProgress } = useScroll({
    target: canvasRef,
    offset: ["start 90%", "end 50%"],
  });

  const progress = useSpring(scrollYProgress, { stiffness: 50, damping: 25 });

  // Track scroll state for labels + connection event
  useMotionValueEvent(progress, "change", useCallback((v: number) => {
    let idx = 0;
    for (let i = SCROLL_STATES.length - 1; i >= 0; i--) {
      if (v >= SCROLL_STATES[i].threshold) { idx = i; break; }
    }
    setScrollState(idx);

    if (v >= 0.95 && !hasConnected) {
      setHasConnected(true);
      setShowSparks(true);
      setTimeout(() => setShowSparks(false), 1200);
    }
    if (v < 0.8) {
      setHasConnected(false);
    }
  }, [hasConnected]));

  const leftX = useTransform(progress, [0, 1], ["-100%", "0%"]);
  const rightX = useTransform(progress, [0, 1], ["100%", "0%"]);
  const glowOpacity = useTransform(progress, [0.7, 1], [0, 0.65]);
  const glowScale = useTransform(progress, [0.7, 1], [0.6, 1]);

  const imgUrl = `${basePath}/assets/hands_wide.jpg`;
  const currentLabel = SCROLL_STATES[scrollState];

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full bg-[#080808] pt-16 pb-20"
    >
      {/* Top divider */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-14">
        <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.35) 30%, rgba(34,211,238,0.25) 70%, transparent)" }} />
      </div>

      {/* Three-column layout */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-8 lg:gap-10">

        {/* LEFT: THE END */}
        <motion.div
          className="shrink-0 lg:w-[200px] text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="font-extrabold leading-[0.9] text-white"
            style={{ fontSize: "clamp(3rem, 4.5vw, 5rem)", letterSpacing: "-0.03em" }}
          >
            THE<br />END
          </h2>
          <p className="mt-4 font-light text-sm leading-relaxed" style={{ color: "rgba(167,139,250,0.6)" }}>
            Or the beginning of us<br />working together?
          </p>
        </motion.div>

        {/* CENTER: Hands canvas */}
        <motion.div
          ref={canvasRef}
          className="relative flex-1 w-full"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            aspectRatio: "16 / 9",
            maxHeight: "420px",
            borderRadius: "20px",
            overflow: "hidden",
            isolation: "isolate",
            border: `1px solid ${hasConnected ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.06)"}`,
            background: "#050505",
            boxShadow: hasConnected
              ? "0 32px 80px rgba(0,0,0,0.65), 0 0 40px rgba(167,139,250,0.08)"
              : "0 32px 80px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.03)",
            transition: "border-color 0.6s, box-shadow 0.6s",
          }}
        >


          {/* LEFT HALF — slides in from left */}
          <motion.div
            className="absolute top-0 left-0 w-1/2 h-full overflow-hidden"
            style={{ x: leftX, mixBlendMode: "screen" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgUrl}
              alt=""
              aria-hidden
              className="absolute top-0 left-0 h-full"
              style={{
                width: "200%",
                maxWidth: "none",
                objectFit: "cover",
                objectPosition: "left center",
                filter: "brightness(0.9) contrast(1.5)",
              }}
            />
            {/* Color tint */}
            <div className="absolute inset-0 bg-violet-400 mix-blend-color pointer-events-none" />
          </motion.div>

          {/* RIGHT HALF — slides in from right */}
          <motion.div
            className="absolute top-0 right-0 w-1/2 h-full overflow-hidden"
            style={{ x: rightX, mixBlendMode: "screen" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgUrl}
              alt=""
              aria-hidden
              className="absolute top-0 right-0 h-full"
              style={{
                width: "200%",
                maxWidth: "none",
                objectFit: "cover",
                objectPosition: "right center",
                filter: "brightness(0.9) contrast(1.5)",
              }}
            />
            {/* Color tint */}
            <div className="absolute inset-0 bg-cyan-400 mix-blend-color pointer-events-none" />
          </motion.div>

          {/* Floating particles between hands */}
          <Particles active={scrollState >= 1} />

          {/* Glow at touch point */}
          <motion.div
            className="absolute pointer-events-none z-10"
            style={{
              top: "50%", left: "50%", x: "-50%", y: "-50%",
              opacity: glowOpacity,
              scale: glowScale,
              width: "160px", height: "160px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(200,180,255,0.45) 0%, rgba(120,200,240,0.15) 50%, transparent 75%)",
              mixBlendMode: "screen",
            }}
          />

          {/* Spark burst on connection */}
          <AnimatePresence>
            {showSparks && <SparkBurst />}
          </AnimatePresence>



          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none z-[5]"
            style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)" }}
          />

          {/* Copyright */}
          <p className="absolute bottom-3 right-4 z-20 pointer-events-none select-none uppercase" style={{ fontSize: "8px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.12)" }}>
            © Sahil Bhagat
          </p>
        </motion.div>

        {/* RIGHT: SAY HEY + social */}
        <motion.div
          className="shrink-0 lg:w-[240px] text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2
            className="font-extrabold leading-[0.9] text-white"
            style={{ fontSize: "clamp(3rem, 4.5vw, 5rem)", letterSpacing: "-0.03em" }}
          >
            SAY<br />HEY
          </h2>
          <p className="mt-4 mb-6 font-light text-sm leading-relaxed" style={{ color: "rgba(34,211,238,0.55)" }}>
            Available for projects, chats<br />or data engineering debates.
          </p>

          <div className="flex flex-col gap-[6px]">
            {SOCIAL_LINKS.map(({ id, label, handle, href, Icon }, idx) => (
              <motion.a
                key={id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 0.2 + idx * 0.07 }}
                whileHover={{ x: 4 }}
                className="group flex items-center gap-3 px-3 py-[10px] rounded-xl cursor-pointer transition-all duration-200"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(167,139,250,0.07)";
                  el.style.borderColor = "rgba(167,139,250,0.3)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(255,255,255,0.02)";
                  el.style.borderColor = "rgba(255,255,255,0.06)";
                }}
              >
                <span className="text-white/25 group-hover:text-violet-400 transition-colors shrink-0">
                  <Icon size={14} />
                </span>
                <div className="min-w-0">
                  <p className="uppercase leading-none mb-[3px]" style={{ fontSize: "7px", letterSpacing: "0.12em", color: "rgba(255,255,255,0.2)" }}>
                    {label}
                  </p>
                  <p className="text-[11px] font-medium truncate text-white/50 group-hover:text-white transition-colors">
                    {handle}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-16 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.18)" }}>
          © {new Date().getFullYear()} Sahil Bhagat
        </p>
        <p className="uppercase" style={{ fontSize: "9px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.12)" }}>
          Designed &amp; Built by Sahil Bhagat
        </p>
      </div>
    </section>
  );
}
