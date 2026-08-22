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

  const progress = useSpring(scrollYProgress, { stiffness: 50, damping: 25 });

  // Clip-path approach: reveal each half from its outer edge toward center
  // At progress=0 → clip shows nothing (fully clipped)
  // At progress=1 → clip shows full half (polygon covers entire half)
  const leftClip = useTransform(progress, [0, 1], [
    "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
    "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  ]);
  const rightClip = useTransform(progress, [0, 1], [
    "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
    "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  ]);

  // Subtle glow that fades in when hands nearly touch
  const glowOpacity = useTransform(progress, [0.75, 1], [0, 0.7]);

  const imgUrl = `${basePath}/assets/hands_wide.jpg`;

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full bg-[#080808] pt-16 pb-20"
    >
      {/* Ambient top divider */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-14">
        <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.35) 30%, rgba(34,211,238,0.25) 70%, transparent)" }} />
      </div>

      {/* Three-column layout */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-8 lg:gap-10">

        {/* ── LEFT: THE END ── */}
        <motion.div
          className="shrink-0 lg:w-[200px] text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2
            className="font-extrabold leading-[0.9] tracking-tight text-white"
            style={{ fontSize: "clamp(3rem, 4.5vw, 5rem)", letterSpacing: "-0.03em" }}
          >
            THE<br />END
          </h2>
          <p
            className="mt-4 font-light text-sm leading-relaxed"
            style={{ color: "rgba(167,139,250,0.6)" }}
          >
            Or the beginning of us<br />working together?
          </p>
        </motion.div>

        {/* ── CENTER: Hands canvas ── */}
        <motion.div
          className="relative flex-1 w-full"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            aspectRatio: "16 / 9",
            maxHeight: "420px",
            borderRadius: "20px",
            overflow: "hidden",
            isolation: "isolate",
            border: "1px solid rgba(255,255,255,0.06)",
            background: "#050505",
            boxShadow: "0 32px 80px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.03)",
          }}
        >
          {/* Ticker bar */}
          <div
            className="absolute top-0 left-0 w-full z-20 flex items-center overflow-hidden"
            style={{
              height: "26px",
              background: "rgba(0,0,0,0.55)",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              backdropFilter: "blur(8px)",
            }}
          >
            <motion.span
              className="flex whitespace-nowrap gap-12 uppercase tracking-[0.15em]"
              style={{ fontSize: "7px", color: "rgba(255,255,255,0.18)", fontFamily: "var(--font-lexend), monospace" }}
              animate={{ x: [0, -700] }}
              transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
            >
              {[...Array(14)].map((_, i) => (
                <span key={i} className="flex items-center gap-12">
                  And... that was my portfolio
                  <span className="w-[3px] h-[3px] rounded-full inline-block" style={{ background: "rgba(167,139,250,0.5)" }} />
                </span>
              ))}
            </motion.span>
          </div>

          {/*
            TECHNIQUE: One single wide image, duplicated into left/right halves.
            Each half is clipped with clip-path (polygon) that reveals from the
            outer edge inward on scroll. No blend-mode stacking, no offset hacks.
            Each half uses CSS filter for colorization.
          */}

          {/* LEFT HALF — purple tint, reveals from left edge */}
          <motion.div
            className="absolute inset-0"
            style={{ clipPath: leftClip }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgUrl}
              alt=""
              aria-hidden
              className="w-full h-full object-cover"
              style={{
                filter: "sepia(1) hue-rotate(248deg) saturate(2.5) brightness(0.55) contrast(1.2)",
                mixBlendMode: "screen",
              }}
            />
          </motion.div>

          {/* RIGHT HALF — cyan tint, reveals from right edge */}
          <motion.div
            className="absolute inset-0"
            style={{ clipPath: rightClip }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgUrl}
              alt=""
              aria-hidden
              className="w-full h-full object-cover"
              style={{
                filter: "sepia(1) hue-rotate(160deg) saturate(2.5) brightness(0.55) contrast(1.2)",
                mixBlendMode: "screen",
              }}
            />
          </motion.div>

          {/* Subtle center glow — appears gently when hands nearly meet */}
          <motion.div
            className="absolute pointer-events-none z-10"
            style={{
              top: "42%",
              left: "50%",
              x: "-50%",
              y: "-50%",
              opacity: glowOpacity,
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(200,170,255,0.35) 0%, rgba(100,200,240,0.12) 50%, transparent 75%)",
              mixBlendMode: "screen",
            }}
          />

          {/* Faint vignette */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)" }}
          />

          {/* Copyright */}
          <p
            className="absolute bottom-3 right-4 z-20 pointer-events-none select-none uppercase tracking-[0.15em]"
            style={{ fontSize: "8px", color: "rgba(255,255,255,0.12)", fontFamily: "var(--font-lexend), monospace" }}
          >
            © Sahil Bhagat
          </p>
        </motion.div>

        {/* ── RIGHT: SAY HEY + social links ── */}
        <motion.div
          className="shrink-0 lg:w-[240px] text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2
            className="font-extrabold leading-[0.9] tracking-tight text-white"
            style={{ fontSize: "clamp(3rem, 4.5vw, 5rem)", letterSpacing: "-0.03em" }}
          >
            SAY<br />HEY
          </h2>
          <p
            className="mt-4 mb-6 font-light text-sm leading-relaxed"
            style={{ color: "rgba(34,211,238,0.55)" }}
          >
            Available for projects, chats<br />or data engineering debates.
          </p>

          {/* Social links */}
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
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
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
                  <p
                    className="uppercase tracking-[0.12em] leading-none mb-[3px]"
                    style={{ fontSize: "7px", color: "rgba(255,255,255,0.2)" }}
                  >
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
      <div
        className="max-w-[1400px] mx-auto px-6 md:px-12 mt-16 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.18)" }}>
          © {new Date().getFullYear()} Sahil Bhagat
        </p>
        <p
          className="uppercase tracking-[0.15em]"
          style={{ fontSize: "9px", color: "rgba(255,255,255,0.12)" }}
        >
          Designed &amp; Built by Sahil Bhagat
        </p>
      </div>
    </section>
  );
}
