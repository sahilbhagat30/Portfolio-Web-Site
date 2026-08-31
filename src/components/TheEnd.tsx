"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, AnimatePresence, useMotionValue } from "framer-motion";
import { SOCIAL_LINKS } from "./SocialLinks";
import LiquidGlass from "./LiquidGlass";

function useBasePath() {
  const [bp, setBp] = useState("");
  return bp;
}


/* ── Electric spark burst on connection ── */
function SparkBurst() {
  const [sparks] = useState(() => Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    return {
      id: i,
      endX: Math.cos(angle) * (30 + Math.random() * 20),
      endY: Math.sin(angle) * (20 + Math.random() * 15),
      duration: 0.6 + Math.random() * 0.3
    };
  }));

  return (
    <motion.div
      className="absolute pointer-events-none z-20"
      style={{ top: "50%", left: "50%", x: "-50%", y: "-50%" }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ type: "spring", bounce: 0, duration: 0.8 }}
    >
      {sparks.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            width: 3,
            height: 3,
            background: "white",
            boxShadow: "0 0 8px rgba(234,230,225,0.9), 0 0 16px rgba(163,163,163,0.5)",
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
          transition={{ type: "spring", bounce: 0, duration: 0.8 }}
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
          boxShadow: "0 0 30px rgba(234,230,225,0.8), 0 0 60px rgba(163,163,163,0.4)",
        }}
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale: 4, opacity: 0 }}
        transition={{ type: "spring", bounce: 0, duration: 0.6 }}
      />
    </motion.div>
  );
}

/* ── Scroll hint labels ── */
const SCROLL_STATES = [
  { threshold: 0,    text: "scroll to connect ↓", color: "rgba(255,255,255,0.15)" },
  { threshold: 0.4,  text: "almost there...",      color: "rgba(234,230,225,0.4)" },
  { threshold: 0.8,  text: "so close...",          color: "rgba(234,230,225,0.5)" },
  { threshold: 0.95, text: "✦ connected",          color: "rgba(163,163,163,0.7)" },
];

export default function TheEnd() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const basePath = useBasePath();
  const [scrollState, setScrollState] = useState(0);
  const [hasConnected, setHasConnected] = useState(false);
  const [showSparks, setShowSparks] = useState(false);

  const { scrollYProgress: desktopProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"],
  });

  const { scrollYProgress: mobileProgress } = useScroll({
    target: canvasRef,
    offset: ["start 90%", "end 50%"],
  });

  const rawProgress = useMotionValue(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useMotionValueEvent(desktopProgress, "change", (v) => { if (!isMobile) rawProgress.set(v); });
  useMotionValueEvent(mobileProgress, "change", (v) => { if (isMobile) rawProgress.set(v); });

  const progress = useSpring(rawProgress, { stiffness: 50, damping: 25 });

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
      className="glass-section relative w-full bg-[var(--background)] pt-16 pb-20"
    >
      {/* Top divider */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-14">
        <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(234,230,225,0.35) 30%, rgba(163,163,163,0.25) 70%, transparent)" }} />
      </div>

      {/* Three-column layout */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-8 lg:gap-10">

        {/* LEFT: THE END — glass card */}
        <motion.div
          className="shrink-0 lg:w-[260px] text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", bounce: 0, duration: 0.6 }}
        >
          <LiquidGlass borderRadius={20} intensity="medium" className="p-7 block w-full h-full">
          <h2
            className="font-extrabold leading-[0.9] text-white"
            style={{ fontSize: "clamp(3rem, 4.5vw, 5rem)", letterSpacing: "-0.03em" }}
          >
            THE<br />END
          </h2>
          <p className="mt-4 font-light text-sm leading-relaxed" style={{ color: "rgba(234,230,225,0.6)" }}>
            Or the beginning of us<br />working together?
          </p>
          </LiquidGlass>
        </motion.div>

        {/* CENTER: Hands canvas */}
        <motion.div
          ref={canvasRef}
          className="relative flex-1 w-full"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", bounce: 0, duration: 0.6 }}
          style={{
            aspectRatio: "16 / 9",
            maxHeight: "420px",
            borderRadius: "20px",
            overflow: "hidden",
            isolation: "isolate",
            border: `1px solid ${hasConnected ? "rgba(234,230,225,0.3)" : "rgba(255,255,255,0.1)"}`,
            background: "#000000",
            boxShadow: hasConnected
              ? "0 32px 80px rgba(0,0,0,0.65), 0 0 40px rgba(234,230,225,0.12), inset 0 1px 0 rgba(255,255,255,0.1)"
              : "0 32px 80px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.06)",
            transition: "border-color 0.6s, box-shadow 0.6s",
          }}
        >


          {/* LEFT HALF — slides in from left */}
          <motion.div
            className="absolute top-0 left-0 w-1/2 h-full overflow-hidden"
            style={{ x: leftX }}
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
                filter: "grayscale(1)",
              }}
            />
          </motion.div>

          {/* RIGHT HALF — slides in from right */}
          <motion.div
            className="absolute top-0 right-0 w-1/2 h-full overflow-hidden"
            style={{ x: rightX }}
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
                filter: "grayscale(1)",
              }}
            />
          </motion.div>


          {/* Glow at touch point */}
          <motion.div
            className="absolute pointer-events-none z-10"
            style={{
              top: "50%", left: "50%", x: "-50%", y: "-50%",
              opacity: glowOpacity,
              scale: glowScale,
              width: "160px", height: "160px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(234,230,225,0.45) 0%, transparent 75%)",
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

        {/* RIGHT: SAY HEY + Contact Form — glass card */}
        <motion.div
          className="shrink-0 lg:w-[280px] text-left flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", bounce: 0, duration: 0.6, delay: 0.1 }}
        >
          <LiquidGlass borderRadius={20} intensity="medium" contentClassName="flex flex-col h-full" className="p-7 block w-full h-full">
          <h2
            className="font-extrabold leading-[0.9] text-white"
            style={{ fontSize: "clamp(2.5rem, 3.5vw, 4rem)", letterSpacing: "-0.03em" }}
          >
            SAY HEY
          </h2>
          <p className="mt-3 mb-6 font-light text-sm leading-relaxed" style={{ color: "rgba(234,230,225,0.55)" }}>
            Let&apos;s build something together.
          </p>

          <form 
            className="flex flex-col gap-3 mb-6"
            onSubmit={(e) => {
              e.preventDefault();
              const btn = e.currentTarget.querySelector('button');
              if (btn) {
                const original = btn.innerText;
                btn.innerText = "Sent!";
                btn.style.background = "rgba(255,255,255,0.1)";
                setTimeout(() => {
                  btn.innerText = original;
                  btn.style.background = "";
                  (e.target as HTMLFormElement).reset();
                }, 2000);
              }
            }}
          >
            <input 
              type="text" 
              placeholder="Name" 
              required
              className="glass-input rounded-xl px-4 py-2.5 text-sm w-full"
            />
            <input 
              type="email" 
              placeholder="Email" 
              required
              className="glass-input rounded-xl px-4 py-2.5 text-sm w-full"
            />
            <textarea 
              placeholder="Message" 
              required
              rows={3}
              className="glass-input rounded-xl px-4 py-2.5 text-sm w-full resize-none"
            />
            <motion.button 
              type="submit"
              whileTap={{ scale: 0.97, transition: { type: "spring", bounce: 0, duration: 0.3 } }}
              className="glass-btn w-full font-semibold text-sm rounded-xl py-2.5 mt-1 text-white"
            >
              Send Message
            </motion.button>
          </form>

          {/* Social Links Row */}
          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map(({ id, href, Icon }) => (
              <motion.a
                key={id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.97, transition: { type: "spring", bounce: 0, duration: 0.3 } }}
                className="glass-btn w-10 h-10 rounded-full flex items-center justify-center transition-all group"
                style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              >
                <span className="text-white/50 group-hover:text-white transition-colors">
                  <Icon size={16} />
                </span>
              </motion.a>
            ))}
          </div>
          </LiquidGlass>
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
