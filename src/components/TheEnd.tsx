"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SOCIAL_LINKS } from "./SocialLinks";

// Determine asset base path safely (avoids hydration mismatch)
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

export default function TheEnd() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const basePath = useBasePath();

  // Scroll progress: starts when section enters viewport bottom, ends when it's fully visible
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end center"],
  });

  // Left hand slides in from -50% to 0 (from off-screen left toward center)
  const leftX = useTransform(scrollYProgress, [0, 1], ["-55%", "0%"]);
  // Right hand slides in from +50% to 0 (from off-screen right toward center)
  const rightX = useTransform(scrollYProgress, [0, 1], ["55%", "0%"]);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full overflow-x-hidden bg-[#080808] pt-12 pb-20"
    >
      {/* ── Three-column layout ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-8 lg:gap-6">

        {/* ── LEFT: THE END text ── */}
        <div className="shrink-0 lg:w-[180px] text-left">
          <h2
            className="font-black leading-none tracking-tighter text-white"
            style={{ fontSize: "clamp(3.5rem, 6vw, 5.5rem)" }}
          >
            THE
            <br />
            END
          </h2>
          <p className="text-violet-400 font-mono text-xs uppercase tracking-widest mt-3 max-w-[160px]">
            [ Or the beginning of us working together? ]
          </p>
        </div>

        {/* ── CENTER: Hands canvas ── */}
        <div
          className="relative flex-1 rounded-3xl overflow-hidden border border-white/[0.06]"
          style={{
            height: "clamp(240px, 35vw, 420px)",
            background:
              "linear-gradient(160deg, rgba(120,58,220,0.08) 0%, rgba(0,0,0,1) 55%, rgba(15,180,200,0.06) 100%)",
          }}
        >
          {/* Ticker bar */}
          <div className="absolute top-0 left-0 w-full h-7 bg-black/50 border-b border-white/5 flex items-center overflow-hidden z-10">
            <motion.div
              className="flex whitespace-nowrap gap-10 text-[9px] uppercase font-mono text-white/30"
              animate={{ x: [0, -800] }}
              transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
            >
              {[...Array(12)].map((_, i) => (
                <span key={i} className="flex items-center gap-10">
                  And...&nbsp;that was my portfolio
                  <span className="w-1 h-1 rounded-full bg-violet-400/60 inline-block" />
                </span>
              ))}
            </motion.div>
          </div>

          {/* Left hand — slides in from left */}
          <motion.div
            className="absolute top-0 left-0 w-[55%] h-full pointer-events-none"
            style={{ x: leftX }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${basePath}/assets/left_hand.jpg`}
              alt=""
              aria-hidden
              className="w-full h-full object-cover object-right mix-blend-screen"
              style={{ filter: "hue-rotate(260deg) saturate(3) brightness(1.1)" }}
            />
          </motion.div>

          {/* Right hand — slides in from right */}
          <motion.div
            className="absolute top-0 right-0 w-[55%] h-full pointer-events-none"
            style={{ x: rightX }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${basePath}/assets/right_hand.jpg`}
              alt=""
              aria-hidden
              className="w-full h-full object-cover object-left mix-blend-screen"
              style={{ filter: "hue-rotate(180deg) saturate(3) brightness(1.1)" }}
            />
          </motion.div>

          {/* Copyright watermark */}
          <p className="absolute bottom-4 right-5 font-mono text-white/20 text-[10px] uppercase tracking-widest z-10">
            © Sahil Bhagat
          </p>
        </div>

        {/* ── RIGHT: SAY HEY + social links ── */}
        <div className="shrink-0 lg:w-[260px] text-left">
          <h2
            className="font-black leading-none tracking-tighter text-white"
            style={{ fontSize: "clamp(3.5rem, 6vw, 5.5rem)" }}
          >
            SAY
            <br />
            HEY
          </h2>
          <p className="text-cyan-400 font-mono text-xs uppercase tracking-widest mt-3 mb-7 max-w-[220px]">
            [ Available for projects, chats, or data engineering debates ]
          </p>

          {/* Social links — vertical stack, always fully visible */}
          <div className="flex flex-col gap-3">
            {SOCIAL_LINKS.map(({ id, label, handle, href, Icon }) => (
              <a
                key={id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-white/8 hover:border-violet-500/40 transition-all duration-200"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <span className="text-white/50 group-hover:text-violet-400 transition-colors">
                  <Icon size={16} />
                </span>
                <div className="min-w-0">
                  <p className="text-white/30 font-mono text-[9px] uppercase tracking-widest leading-none mb-0.5">
                    {label}
                  </p>
                  <p className="text-white/70 text-xs font-medium truncate group-hover:text-white transition-colors">
                    {handle}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer bar ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-14 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-white/20 text-xs">
          © {new Date().getFullYear()} Sahil Bhagat. All rights reserved.
        </p>
        <p className="text-white/15 text-xs font-mono uppercase tracking-widest">
          Designed &amp; Built by Sahil Bhagat
        </p>
      </div>
    </section>
  );
}
