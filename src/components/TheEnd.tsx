"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
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
    offset: ["start end", "end end"],
  });

  const progress = useSpring(scrollYProgress, { stiffness: 60, damping: 22 });

  const leftX  = useTransform(progress, [0, 1], ["-100%", "0%"]);
  const rightX = useTransform(progress, [0, 1], ["100%",  "0%"]);

  const glowOpacity = useTransform(progress, [0.7, 1], [0, 1]);
  const glowScale   = useTransform(progress, [0.7, 1], [0.3, 1]);

  const imgUrl = `${basePath}/assets/hands_combined.jpg`;

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full bg-[#080808] pt-16 pb-24"
    >
      {/* Top ambient divider */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-12">
        <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.5), rgba(34,211,238,0.3), transparent)" }} />
      </div>

      {/* Three-column layout */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-8 lg:gap-10">

        {/* ── LEFT: THE END ── */}
        <motion.div
          className="shrink-0 lg:w-[200px]"
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2
            className="font-black leading-none tracking-tight text-white"
            style={{ fontSize: "clamp(2.8rem, 4.5vw, 5rem)", letterSpacing: "-0.04em" }}
          >
            THE
            <br />
            <span style={{ WebkitTextStroke: "2px rgba(167,139,250,0.9)", color: "transparent" }}>
              END
            </span>
          </h2>
          <p className="section-label mt-5">
            [ Or the beginning of us working together? ]
          </p>
        </motion.div>

        {/* ── CENTER: Hands canvas ── */}
        <motion.div
          className="relative flex-1"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: "clamp(240px, 30vw, 400px)",
            borderRadius: "24px",
            overflow: "hidden",
            isolation: "isolate",
            border: "1px solid rgba(255,255,255,0.07)",
            background: "linear-gradient(110deg, rgba(40,5,80,0.95) 0%, #030303 42%, #030303 58%, rgba(3,45,65,0.95) 100%)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
          }}
        >
          {/* Ticker */}
          <div
            className="absolute top-0 left-0 w-full h-[26px] z-20 flex items-center overflow-hidden"
            style={{ background: "rgba(0,0,0,0.65)", borderBottom: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(8px)" }}
          >
            <motion.span
              className="flex whitespace-nowrap gap-14 uppercase tracking-widest"
              style={{ fontSize: "8px", color: "rgba(255,255,255,0.2)", fontFamily: "monospace" }}
              animate={{ x: [0, -700] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
              {[...Array(14)].map((_, i) => (
                <span key={i} className="flex items-center gap-14">
                  And... that was my portfolio
                  <span className="w-[3px] h-[3px] rounded-full inline-block" style={{ background: "rgba(167,139,250,0.6)" }} />
                </span>
              ))}
            </motion.span>
          </div>

          {/*
            FIX: arms were short because the generated image has small black margins
            before the arm roots (~5-6% of image width).
            Solution: each half-panel uses an <img> scaled to 210% of its own width,
            with a -5% horizontal offset so the arm root is pushed flush to the
            outer canvas edge, and overflow:hidden clips the excess.
            Left panel: img left=-5%, width=210% → shows left half, arm bleeds to edge
            Right panel: img right=-5%, width=210% → shows right half, arm bleeds to edge
          */}

          {/* LEFT PANEL — purple */}
          <motion.div
            className="absolute top-0 left-0 w-[52%] h-full"
            style={{ x: leftX, overflow: "hidden" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgUrl}
              alt=""
              aria-hidden
              style={{
                position: "absolute",
                width: "205%",
                height: "auto",
                top: "50%",
                left: "-4%",
                transform: "translateY(-52%)",
                filter: "sepia(1) hue-rotate(248deg) saturate(4) brightness(0.75)",
                mixBlendMode: "screen",
                objectFit: "cover",
              }}
            />
          </motion.div>

          {/* RIGHT PANEL — cyan */}
          <motion.div
            className="absolute top-0 right-0 w-[52%] h-full"
            style={{ x: rightX, overflow: "hidden" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgUrl}
              alt=""
              aria-hidden
              style={{
                position: "absolute",
                width: "205%",
                height: "auto",
                top: "50%",
                right: "-4%",
                transform: "translateY(-52%)",
                filter: "sepia(1) hue-rotate(160deg) saturate(4) brightness(0.75)",
                mixBlendMode: "screen",
                objectFit: "cover",
              }}
            />
          </motion.div>

          {/* Fingertip glow — ignites when hands meet */}
          <motion.div
            className="absolute z-10 pointer-events-none"
            style={{
              top: "50%",
              left: "50%",
              x: "-50%",
              y: "-50%",
              opacity: glowOpacity,
              scale: glowScale,
              width: "320px",
              height: "320px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(210,170,255,0.6) 0%, rgba(80,220,255,0.25) 45%, transparent 70%)",
              mixBlendMode: "screen",
            }}
          />

          {/* Scanline overlay */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 4px)",
              opacity: 1,
            }}
          />

          {/* Copyright */}
          <p
            className="absolute bottom-3 right-5 z-20 pointer-events-none select-none uppercase tracking-widest"
            style={{ fontSize: "9px", color: "rgba(255,255,255,0.14)", fontFamily: "monospace" }}
          >
            © Sahil Bhagat
          </p>
        </motion.div>

        {/* ── RIGHT: SAY HEY + social ── */}
        <motion.div
          className="shrink-0 lg:w-[240px]"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2
            className="font-black leading-none tracking-tight"
            style={{ fontSize: "clamp(2.8rem, 4.5vw, 5rem)", letterSpacing: "-0.04em" }}
          >
            <span className="text-white">SAY</span>
            <br />
            <span style={{ WebkitTextStroke: "2px rgba(34,211,238,0.9)", color: "transparent" }}>
              HEY
            </span>
          </h2>
          <p className="section-label mt-5 mb-6">
            [ Available for projects, chats or data debates ]
          </p>

          {/* Social links */}
          <div className="flex flex-col gap-[5px]">
            {SOCIAL_LINKS.map(({ id, label, handle, href, Icon }, idx) => (
              <motion.a
                key={id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.15 + idx * 0.08 }}
                whileHover={{ x: 3 }}
                className="group flex items-center gap-3 px-3 py-[10px] rounded-xl transition-all duration-200"
                style={{
                  background: "var(--surface-1)",
                  border: "1px solid var(--border-subtle)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(124,58,237,0.1)";
                  el.style.borderColor = "var(--border-accent)";
                  el.style.boxShadow = "0 0 24px rgba(124,58,237,0.1)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "var(--surface-1)";
                  el.style.borderColor = "var(--border-subtle)";
                  el.style.boxShadow = "none";
                }}
              >
                <span className="text-white/30 group-hover:text-violet-400 transition-colors shrink-0">
                  <Icon size={14} />
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[7px] uppercase tracking-widest leading-none mb-[3px] text-white/25">
                    {label}
                  </p>
                  <p className="text-[11px] font-medium truncate text-white/55 group-hover:text-white transition-colors">
                    {handle}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div
        className="max-w-[1400px] mx-auto px-6 md:px-12 mt-14 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <p className="text-white/20 text-xs">
          © {new Date().getFullYear()} Sahil Bhagat. All rights reserved.
        </p>
        <motion.p
          className="font-mono text-[9px] uppercase tracking-widest"
          animate={{
            backgroundImage: [
              "linear-gradient(90deg, rgba(124,58,237,0.45), rgba(34,211,238,0.45))",
              "linear-gradient(90deg, rgba(34,211,238,0.45), rgba(124,58,237,0.45))",
              "linear-gradient(90deg, rgba(124,58,237,0.45), rgba(34,211,238,0.45))",
            ],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
        >
          Designed &amp; Built by Sahil Bhagat
        </motion.p>
      </div>
    </section>
  );
}
