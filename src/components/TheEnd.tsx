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

  // Animate while section scrolls INTO view.
  // "start end" = section top hits viewport bottom (hands start sliding)
  // "end end"   = section bottom hits viewport bottom (hands finish touching)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"],
  });

  // Each half-panel slides in from its respective side.
  // At progress=1 both are at 0%, sitting flush against the center seam.
  const leftX  = useTransform(scrollYProgress, [0, 1], ["-100%", "0%"]);
  const rightX = useTransform(scrollYProgress, [0, 1], ["100%",  "0%"]);

  // Build the image URL reactively (basePath may update after hydration)
  const imgUrl = `${basePath}/assets/hands_combined.jpg`;

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full bg-[#080808] pt-12 pb-20"
    >
      {/* ── Three-column layout ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-8">

        {/* ── LEFT: THE END ── */}
        <div className="shrink-0 lg:w-[190px]">
          <h2
            className="font-black leading-none tracking-tighter text-white"
            style={{ fontSize: "clamp(3rem, 4.5vw, 5rem)" }}
          >
            THE<br />END
          </h2>
          <p className="text-violet-400 font-mono text-[9px] uppercase tracking-widest mt-3 leading-relaxed max-w-[160px]">
            [ Or the beginning of us working together? ]
          </p>
        </div>

        {/* ── CENTER: Hands canvas ── */}
        {/*
          TECHNIQUE:
          Each half of the canvas is a <motion.div> that slides from off-screen.
          Inside it is a div whose background-image shows exactly one half of the
          combined hands image (using backgroundSize 200% and backgroundPosition 0%/100%).
          Colorization is done with CSS filter (sepia → hue-rotate → saturate).
          mix-blend-screen then makes the black areas of the JPG merge into the dark page.
          Crucially, mix-blend-screen is on the INNER background div, not the outer
          motion.div, so it does NOT escape the canvas's overflow:hidden clip.
        */}
        <div
          className="relative flex-1 rounded-3xl border border-white/[0.06]"
          style={{
            height: "clamp(220px, 28vw, 370px)",
            overflow: "hidden",              /* clips both sliding panels */
            background: "#050505",
            isolation: "isolate",            /* keeps blend modes inside this box */
          }}
        >
          {/* Ticker bar */}
          <div className="absolute top-0 left-0 w-full h-7 z-10 flex items-center overflow-hidden border-b border-white/[0.05]" style={{ background: "rgba(0,0,0,0.5)" }}>
            <motion.span
              className="flex whitespace-nowrap gap-12 text-[8px] uppercase font-mono text-white/20"
              animate={{ x: [0, -640] }}
              transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
            >
              {[...Array(12)].map((_, i) => (
                <span key={i} className="flex items-center gap-12">
                  And... that was my portfolio
                  <span className="w-[3px] h-[3px] rounded-full bg-violet-400/50 inline-block" />
                </span>
              ))}
            </motion.span>
          </div>

          {/* LEFT PANEL — slides in from left, shows left half of combined image */}
          <motion.div
            className="absolute top-0 left-0 w-1/2 h-full"
            style={{ x: leftX }}
          >
            {/* Inner div: bg-image cropped to left half, filtered purple, screen-blended */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${imgUrl})`,
                backgroundSize: "200% auto",      /* image scaled to 2× panel width */
                backgroundPosition: "0% 55%",     /* show left half, slightly below center for hands */
                backgroundRepeat: "no-repeat",
                filter: "sepia(1) hue-rotate(240deg) saturate(3.5) brightness(1.15)",
                mixBlendMode: "screen",
              }}
            />
          </motion.div>

          {/* RIGHT PANEL — slides in from right, shows right half of combined image */}
          <motion.div
            className="absolute top-0 right-0 w-1/2 h-full"
            style={{ x: rightX }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${imgUrl})`,
                backgroundSize: "200% auto",      /* image scaled to 2× panel width */
                backgroundPosition: "100% 55%",   /* show right half */
                backgroundRepeat: "no-repeat",
                filter: "sepia(1) hue-rotate(155deg) saturate(3.5) brightness(1.15)",
                mixBlendMode: "screen",
              }}
            />
          </motion.div>

          {/* Copyright */}
          <p className="absolute bottom-3 right-5 font-mono text-white/20 text-[9px] uppercase tracking-widest z-10 pointer-events-none select-none">
            © Sahil Bhagat
          </p>
        </div>

        {/* ── RIGHT: SAY HEY + social links ── */}
        <div className="shrink-0 lg:w-[240px]">
          <h2
            className="font-black leading-none tracking-tighter text-white"
            style={{ fontSize: "clamp(3rem, 4.5vw, 5rem)" }}
          >
            SAY<br />HEY
          </h2>
          <p className="text-cyan-400 font-mono text-[9px] uppercase tracking-widest mt-3 mb-5 leading-relaxed max-w-[200px]">
            [ Available for projects, chats or data engineering debates ]
          </p>

          {/* Social links — vertical stack, full width, never clipped */}
          <div className="flex flex-col gap-[6px]">
            {SOCIAL_LINKS.map(({ id, label, handle, href, Icon }) => (
              <a
                key={id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-3 py-[10px] rounded-xl transition-colors duration-200"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(124,58,237,0.09)";
                  el.style.borderColor = "rgba(124,58,237,0.45)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(255,255,255,0.025)";
                  el.style.borderColor = "rgba(255,255,255,0.06)";
                }}
              >
                <span className="text-white/35 group-hover:text-violet-400 transition-colors shrink-0">
                  <Icon size={14} />
                </span>
                <div className="min-w-0">
                  <p className="text-white/25 font-mono text-[7px] uppercase tracking-widest leading-none mb-[3px]">
                    {label}
                  </p>
                  <p className="text-white/60 text-[11px] font-medium truncate group-hover:text-white transition-colors">
                    {handle}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer bar ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-12 pt-5 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-white/20 text-[11px]">
          © {new Date().getFullYear()} Sahil Bhagat. All rights reserved.
        </p>
        <p className="text-white/15 text-[9px] font-mono uppercase tracking-widest">
          Designed &amp; Built by Sahil Bhagat
        </p>
      </div>
    </section>
  );
}
