"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

/* ── Typewriter cycling roles ── */
const ROLES = ["Analytics Engineer", "Data Engineer", "Pipeline Builder", "Data Architect", "Problem Solver"];

function useTypewriter(words: string[], speed = 80, pause = 1800) {
  const [displayed, setDisplayed] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIndex < current.length) {
      timeout = setTimeout(() => setCharIndex((c) => c + 1), speed);
    } else if (!deleting && charIndex === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex((c) => c - 1), speed / 2);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setWordIndex((i) => (i + 1) % words.length);
    }

    setDisplayed(current.slice(0, charIndex));
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, wordIndex, words, speed, pause]);

  return displayed;
}

/* ── Count-up hook ── */
function useCountUp(target: string, duration = 1800) {
  const [value, setValue] = useState("0");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    const prefix = target.match(/^[^0-9]*/)?.[0] ?? "";
    const suffix = target.match(/[^0-9]*$/)?.[0] ?? "";
    const num    = parseFloat(target.replace(/[^0-9.]/g, ""));
    if (isNaN(num)) { setValue(target); return; }

    const start  = performance.now();
    const step   = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = eased * num;
      setValue(`${prefix}${num % 1 === 0 ? Math.floor(current) : current.toFixed(0)}${suffix}`);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return { value, trigger: () => setStarted(true) };
}

/* ── Individual stat with count-up ── */
function StatItem({ value, label }: { value: string; label: string }) {
  const { value: displayed, trigger } = useCountUp(value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { trigger(); obs.disconnect(); } },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [trigger]);

  return (
    <div ref={ref}>
      <p className="text-2xl font-black text-white leading-none tracking-tight">{displayed}</p>
      <p className="text-[0.6rem] text-white/35 uppercase tracking-widest mt-1">{label}</p>
    </div>
  );
}

/* ── Bouncing scroll arrow ── */
function ScrollCue() {
  return (
    <motion.div
      className="mt-12 flex flex-col items-start gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 0.6 }}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-[1px] bg-white/20" />
        <p className="text-white/25 text-[0.65rem] tracking-[0.25em] uppercase">Scroll to explore</p>
      </div>
      <motion.div
        className="ml-0 mt-1"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
          <motion.path
            d="M8 1 L8 16 M2 10 L8 17 L14 10"
            stroke="rgba(168,85,247,0.6)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}

export default function Overlay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const role = useTypewriter(ROLES);

  const [scrollRange, setScrollRange] = useState(4000);

  useEffect(() => {
    // Hero is 300vh tall, viewport is 100vh. Scrollable distance is 200vh.
    const handleResize = () => setScrollRange(window.innerHeight * 2);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollY } = useScroll();
  const scrollYProgress = useTransform(scrollY, [0, scrollRange], [0, 1]);

  // Section 1: Hero (0% → 30%)
  const opacity1 = useTransform(scrollYProgress, [0, 0.15, 0.3, 1], [1, 1, 0, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.3, 1], [0, -30, -30]);

  return (
    <div ref={containerRef} className="h-full w-full pointer-events-none z-10">
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden">

        {/* ── Section 1: Name ── */}
        <motion.div
          style={{ opacity: opacity1, y: y1 }}
          className="absolute inset-0 flex flex-col px-5 md:px-14 pointer-events-auto justify-start md:justify-center pt-14 pb-12 md:py-0"
        >
          {/* Decorative left accent line — hidden on mobile */}
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="hidden md:block absolute left-10 md:left-14 top-[28%] h-[44%] w-[2px] origin-top"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(234,230,225,0.4) 30%, rgba(163,163,163,0.4) 70%, transparent)" }}
          />

          <div className="pl-0 md:pl-10 h-full md:h-auto flex flex-col justify-between md:block">
            
            {/* Top Portion (Name & Role) */}
            <div>
              {/* Name — editorial style */}
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.55, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="font-black uppercase leading-none tracking-tight text-white m-0"
                  style={{ fontSize: "clamp(2.3rem, 10vw, 6rem)", letterSpacing: "-0.03em" }}
                >
                  Sahil
                </motion.h1>
              </div>
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.68, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="font-black uppercase leading-none tracking-tight gradient-text m-0"
                  style={{ fontSize: "clamp(2.3rem, 10vw, 6rem)", letterSpacing: "-0.03em" }}
                >
                  Bhagat
                </motion.h1>
              </div>

              {/* Typewriter role */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.5 }}
                className="mt-4 h-6 flex items-center"
              >
                <span className="text-white/50 text-sm font-mono tracking-widest">
                  {role}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                    className="inline-block w-0.5 h-4 bg-violet-400 ml-0.5 align-middle"
                  />
                </span>
              </motion.div>
            </div>

            {/* Bottom Portion (Stats & Scroll Cue) */}
            <div className="mb-6 md:mb-0">
              {/* Stats row — count-up */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="mt-6 md:mt-10 flex gap-5 md:gap-8"
              >
                <StatItem value="5+" label="Years Experience" />
                <StatItem value="4+" label="Global Orgs" />
                <StatItem value="$400K+" label="Savings Identified" />
              </motion.div>

              <ScrollCue />
            </div>

          </div>
        </motion.div>



      </div>
    </div>
  );
}
