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

  // Smooth spring so the animation feels weighty
  const progress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  const leftX  = useTransform(progress, [0, 1], ["-100%", "0%"]);
  const rightX = useTransform(progress, [0, 1], ["100%",  "0%"]);

  // Glow at the fingertip meeting point — ignites as progress → 1
  const glowOpacity = useTransform(progress, [0.7, 1], [0, 1]);
  const glowScale   = useTransform(progress, [0.7, 1], [0.4, 1]);

  const imgUrl = `${basePath}/assets/hands_combined.jpg`;

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full bg-[#080808] pt-16 pb-24"
    >
      {/* ── Ambient top divider ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-12">
        <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.4), rgba(34,211,238,0.3), transparent)" }} />
      </div>

      {/* ── Three-column layout ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-8 lg:gap-10">

        {/* ── LEFT: THE END ── */}
        <div className="shrink-0 lg:w-[200px]">
          <motion.h2
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-black leading-none tracking-tighter text-white"
            style={{ fontSize: "clamp(3rem, 4.5vw, 5.5rem)" }}
          >
            THE
            <br />
            <span style={{ WebkitTextStroke: "2px rgba(124,58,237,0.8)", color: "transparent" }}>
              END
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-mono text-[9px] uppercase tracking-widest mt-4 leading-relaxed"
            style={{ color: "rgba(167,139,250,0.7)" }}
          >
            [ Or the beginning of us working together? ]
          </motion.p>
        </div>

        {/* ── CENTER: Hands canvas ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex-1 rounded-3xl border"
          style={{
            height: "clamp(220px, 28vw, 380px)",
            overflow: "hidden",
            isolation: "isolate",
            borderColor: "rgba(255,255,255,0.07)",
            background: "linear-gradient(105deg, rgba(45,5,90,0.9) 0%, #030303 40%, #030303 60%, rgba(5,50,70,0.9) 100%)",
            boxShadow: "0 0 60px rgba(124,58,237,0.06), 0 0 60px rgba(34,211,238,0.04), 0 32px 64px rgba(0,0,0,0.6)",
          }}
        >
          {/* Ticker bar */}
          <div className="absolute top-0 left-0 w-full h-7 z-20 flex items-center overflow-hidden border-b border-white/[0.05]" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
            <motion.span
              className="flex whitespace-nowrap gap-12 font-mono text-[8px] uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.18)" }}
              animate={{ x: [0, -640] }}
              transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
            >
              {[...Array(12)].map((_, i) => (
                <span key={i} className="flex items-center gap-12">
                  And... that was my portfolio
                  <span className="w-[3px] h-[3px] rounded-full inline-block" style={{ background: "rgba(124,58,237,0.7)" }} />
                </span>
              ))}
            </motion.span>
          </div>

          {/* LEFT hand panel — purple, slides in from left */}
          <motion.div
            className="absolute top-0 left-0 w-1/2 h-full"
            style={{ x: leftX }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${imgUrl})`,
                backgroundSize: "200% auto",
                backgroundPosition: "0% 55%",
                backgroundRepeat: "no-repeat",
                filter: "sepia(1) hue-rotate(248deg) saturate(4) brightness(0.75)",
                mixBlendMode: "screen",
              }}
            />
          </motion.div>

          {/* RIGHT hand panel — cyan, slides in from right */}
          <motion.div
            className="absolute top-0 right-0 w-1/2 h-full"
            style={{ x: rightX }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${imgUrl})`,
                backgroundSize: "200% auto",
                backgroundPosition: "100% 55%",
                backgroundRepeat: "no-repeat",
                filter: "sepia(1) hue-rotate(160deg) saturate(4) brightness(0.75)",
                mixBlendMode: "screen",
              }}
            />
          </motion.div>

          {/* ✨ Fingertip glow — ignites when hands touch ✨ */}
          <motion.div
            className="absolute z-10 pointer-events-none"
            style={{
              top: "50%",
              left: "50%",
              x: "-50%",
              y: "-50%",
              opacity: glowOpacity,
              scale: glowScale,
              width: "280px",
              height: "280px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(220,180,255,0.55) 0%, rgba(100,220,255,0.25) 40%, transparent 70%)",
              mixBlendMode: "screen",
            }}
          />

          {/* Subtle noise/scanline texture overlay */}
          <div
            className="absolute inset-0 z-10 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 1px, transparent 1px, transparent 3px)",
            }}
          />

          {/* Copyright */}
          <p
            className="absolute bottom-3 right-5 font-mono text-[9px] uppercase tracking-widest z-20 pointer-events-none select-none"
            style={{ color: "rgba(255,255,255,0.15)" }}
          >
            © Sahil Bhagat
          </p>
        </motion.div>

        {/* ── RIGHT: SAY HEY + social links ── */}
        <div className="shrink-0 lg:w-[240px]">
          <motion.h2
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-black leading-none tracking-tighter"
            style={{ fontSize: "clamp(3rem, 4.5vw, 5.5rem)" }}
          >
            <span className="text-white">SAY</span>
            <br />
            <span style={{ WebkitTextStroke: "2px rgba(34,211,238,0.8)", color: "transparent" }}>
              HEY
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-mono text-[9px] uppercase tracking-widest mt-4 mb-6 leading-relaxed"
            style={{ color: "rgba(34,211,238,0.65)" }}
          >
            [ Available for projects, chats or data engineering debates ]
          </motion.p>

          <div className="flex flex-col gap-[5px]">
            {SOCIAL_LINKS.map(({ id, label, handle, href, Icon }, idx) => (
              <motion.a
                key={id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 + idx * 0.08 }}
                whileHover={{ x: 3 }}
                className="group flex items-center gap-3 px-3 py-[10px] rounded-xl transition-colors duration-200 cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(124,58,237,0.1)";
                  el.style.borderColor = "rgba(124,58,237,0.4)";
                  el.style.boxShadow = "0 0 20px rgba(124,58,237,0.1)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(255,255,255,0.025)";
                  el.style.borderColor = "rgba(255,255,255,0.06)";
                  el.style.boxShadow = "none";
                }}
              >
                <span className="text-white/30 group-hover:text-violet-400 transition-colors shrink-0">
                  <Icon size={14} />
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[7px] uppercase tracking-widest leading-none mb-[3px]" style={{ color: "rgba(255,255,255,0.22)" }}>
                    {label}
                  </p>
                  <p className="text-[11px] font-medium truncate group-hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.55)" }}>
                    {handle}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div
        className="max-w-[1400px] mx-auto px-6 md:px-12 mt-14 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.18)" }}>
          © {new Date().getFullYear()} Sahil Bhagat. All rights reserved.
        </p>
        <motion.p
          className="font-mono text-[9px] uppercase tracking-widest"
          animate={{
            backgroundImage: [
              "linear-gradient(90deg, rgba(124,58,237,0.4), rgba(34,211,238,0.4))",
              "linear-gradient(90deg, rgba(34,211,238,0.4), rgba(124,58,237,0.4))",
              "linear-gradient(90deg, rgba(124,58,237,0.4), rgba(34,211,238,0.4))",
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
