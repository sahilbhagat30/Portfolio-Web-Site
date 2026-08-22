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

  // Left half slides from -100% (fully off left) to 0% (in place)
  const leftX = useTransform(progress, [0, 1], ["-100%", "0%"]);
  // Right half slides from +100% (fully off right) to 0% (in place)
  const rightX = useTransform(progress, [0, 1], ["100%", "0%"]);

  // Subtle glow at meeting point
  const glowOpacity = useTransform(progress, [0.8, 1], [0, 0.6]);

  const imgUrl = `${basePath}/assets/hands_wide.jpg`;

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
            border: "1px solid rgba(255,255,255,0.06)",
            background: "#050505",
            boxShadow: "0 32px 80px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.03)",
          }}
        >
          {/* Ticker bar */}
          <div
            className="absolute top-0 left-0 w-full z-20 flex items-center overflow-hidden"
            style={{ height: "26px", background: "rgba(0,0,0,0.55)", borderBottom: "1px solid rgba(255,255,255,0.04)", backdropFilter: "blur(8px)" }}
          >
            <motion.span
              className="flex whitespace-nowrap gap-12 uppercase"
              style={{ fontSize: "7px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.18)" }}
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
            Each half-panel is 50% wide and contains a full-width image.
            The image is 200% the panel width → shows exactly one half.
            Left panel: image aligned left → shows left half of the image.
            Right panel: image aligned right → shows right half.
            Both panels slide in from their respective sides on scroll.
            mix-blend-mode: screen on the img makes black areas transparent.
          */}

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
                filter: "sepia(1) hue-rotate(248deg) saturate(2) brightness(0.6) contrast(1.15)",
                mixBlendMode: "screen",
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
                filter: "sepia(1) hue-rotate(160deg) saturate(2) brightness(0.6) contrast(1.15)",
                mixBlendMode: "screen",
              }}
            />
          </motion.div>

          {/* Subtle glow at touch point */}
          <motion.div
            className="absolute pointer-events-none z-10"
            style={{
              top: "42%", left: "50%", x: "-50%", y: "-50%",
              opacity: glowOpacity,
              width: "140px", height: "140px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(200,180,255,0.4) 0%, rgba(120,200,240,0.15) 50%, transparent 75%)",
              mixBlendMode: "screen",
            }}
          />

          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
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
