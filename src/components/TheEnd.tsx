"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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

export default function TheEnd() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const basePath = useBasePath();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end center"],
  });

  // Left hand: slides from fully off-screen left → centre
  const leftX = useTransform(scrollYProgress, [0, 1], ["-100%", "0%"]);
  // Right hand: slides from fully off-screen right → centre
  const rightX = useTransform(scrollYProgress, [0, 1], ["100%", "0%"]);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full bg-[#080808] pt-12 pb-20"
    >
      {/* ── Three-column layout ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-6">

        {/* LEFT: THE END */}
        <div className="shrink-0 lg:w-[180px]">
          <h2
            className="font-black leading-none tracking-tighter text-white"
            style={{ fontSize: "clamp(3rem, 5vw, 5rem)" }}
          >
            THE<br />END
          </h2>
          <p className="text-violet-400 font-mono text-[10px] uppercase tracking-widest mt-3 max-w-[160px]">
            [ Or the beginning of us working together? ]
          </p>
        </div>

        {/* CENTER: Hands canvas */}
        <div
          className="relative flex-1 rounded-3xl overflow-hidden border border-white/[0.06]"
          style={{
            height: "clamp(220px, 30vw, 380px)",
            background:
              "radial-gradient(ellipse at 50% 60%, rgba(80,20,160,0.18) 0%, rgba(0,0,0,1) 60%)",
          }}
        >
          {/* Ticker */}
          <div className="absolute top-0 left-0 w-full h-7 z-10 flex items-center overflow-hidden border-b border-white/5">
            <motion.span
              className="flex whitespace-nowrap gap-10 text-[9px] uppercase font-mono text-white/25"
              animate={{ x: [0, -600] }}
              transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
            >
              {[...Array(10)].map((_, i) => (
                <span key={i} className="flex items-center gap-10">
                  And... that was my portfolio
                  <span className="w-1 h-1 rounded-full bg-cyan-400/50 inline-block" />
                </span>
              ))}
            </motion.span>
          </div>

          {/*
            TECHNIQUE: each hand is a full-size img inside a colored wrapper.
            - wrapper uses mix-blend-screen → black canvas bg becomes transparent
            - img uses mix-blend-multiply → white pixels absorb the wrapper color, black stays black
            Result: colored hand silhouette, no solid rectangular background.
          */}

          {/* Left hand — purple, anchored left, reaches right */}
          <motion.div
            className="absolute inset-0 mix-blend-screen"
            style={{ x: leftX, background: "#7c3aed" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${basePath}/assets/left_hand.jpg`}
              alt=""
              aria-hidden
              className="w-full h-full object-contain mix-blend-multiply"
              style={{ objectPosition: "left center" }}
            />
          </motion.div>

          {/* Right hand — cyan, anchored right, reaches left */}
          <motion.div
            className="absolute inset-0 mix-blend-screen"
            style={{ x: rightX, background: "#0e7490" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${basePath}/assets/right_hand.jpg`}
              alt=""
              aria-hidden
              className="w-full h-full object-contain mix-blend-multiply"
              style={{ objectPosition: "right center" }}
            />
          </motion.div>

          {/* Copyright */}
          <p className="absolute bottom-4 right-5 font-mono text-white/20 text-[10px] uppercase tracking-widest z-10 pointer-events-none">
            © Sahil Bhagat
          </p>
        </div>

        {/* RIGHT: SAY HEY + social */}
        <div className="shrink-0 lg:w-[260px]">
          <h2
            className="font-black leading-none tracking-tighter text-white"
            style={{ fontSize: "clamp(3rem, 5vw, 5rem)" }}
          >
            SAY<br />HEY
          </h2>
          <p className="text-cyan-400 font-mono text-[10px] uppercase tracking-widest mt-3 mb-6 max-w-[220px]">
            [ Available for projects, chats or data engineering debates ]
          </p>

          <div className="flex flex-col gap-2">
            {SOCIAL_LINKS.map(({ id, label, handle, href, Icon }) => (
              <a
                key={id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.border = "1px solid rgba(124,58,237,0.5)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.07)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                }}
              >
                <span className="text-white/40 group-hover:text-violet-400 transition-colors shrink-0">
                  <Icon size={15} />
                </span>
                <div className="min-w-0">
                  <p className="text-white/30 font-mono text-[8px] uppercase tracking-widest leading-none mb-0.5">
                    {label}
                  </p>
                  <p className="text-white/65 text-xs font-medium truncate group-hover:text-white transition-colors">
                    {handle}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-14 pt-5 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-white/20 text-xs">
          © {new Date().getFullYear()} Sahil Bhagat. All rights reserved.
        </p>
        <p className="text-white/15 text-[10px] font-mono uppercase tracking-widest">
          Designed &amp; Built by Sahil Bhagat
        </p>
      </div>
    </section>
  );
}
