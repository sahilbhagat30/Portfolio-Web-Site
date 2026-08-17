"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ExternalLink, GitBranch, Mail } from "lucide-react";

export default function Overlay() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Section 1: Hero (0% → 20%)
  const opacity1 = useTransform(scrollYProgress, [0, 0.12, 0.22, 1], [1, 1, 0, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.22, 1], [0, -30, -30]);

  // Section 2: Role (25% → 55%)
  const opacity2 = useTransform(scrollYProgress, [0, 0.25, 0.35, 0.47, 0.57, 1], [0, 0, 1, 1, 0, 0]);
  const y2 = useTransform(scrollYProgress, [0, 0.25, 0.57, 1], [20, 20, -20, -20]);

  // Section 3: Ethos (60% → 90%)
  const opacity3 = useTransform(scrollYProgress, [0, 0.6, 0.7, 0.82, 0.92, 1], [0, 0, 1, 1, 0, 0]);
  const y3 = useTransform(scrollYProgress, [0, 0.6, 0.92, 1], [20, 20, -20, -20]);

  return (
    <div ref={containerRef} className="h-full w-full pointer-events-none z-10">
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden">

        {/* ── Section 1: Name + Badge ── */}
        <motion.div
          style={{ opacity: opacity1, y: y1 }}
          className="absolute inset-0 flex flex-col justify-center px-10 md:px-14 pointer-events-auto"
        >
          {/* Decorative left accent line */}
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-10 md:left-14 top-[28%] h-[44%] w-[2px] origin-top"
            style={{ background: "linear-gradient(to bottom, transparent, #a855f7 30%, #22d3ee 70%, transparent)" }}
          />

          <div className="pl-8 md:pl-10">
            {/* Social links */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mb-8 flex items-center gap-4"
            >
              <a
                href="https://www.linkedin.com/in/sahil-sanjay-bhagat/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors duration-200 text-xs tracking-widest uppercase"
              >
                <ExternalLink size={14} />
                LinkedIn
              </a>
              <span className="text-white/15">·</span>
              <a
                href="https://github.com/sahilbhagat30"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors duration-200 text-xs tracking-widest uppercase"
              >
                <GitBranch size={14} />
                GitHub
              </a>
              <span className="text-white/15">·</span>
              <a
                href="mailto:sahilbhagat1497@gmail.com"
                aria-label="Email"
                className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors duration-200 text-xs tracking-widest uppercase"
              >
                <Mail size={14} />
                Email
              </a>
            </motion.div>

            {/* Eyebrow label */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-xs font-semibold tracking-[0.3em] uppercase text-white/35 mb-4"
            >
              Data Analyst · BI Engineer
            </motion.p>

            {/* Name - editorial style */}
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="font-black uppercase leading-none tracking-tight text-white m-0"
                style={{
                  fontSize: "clamp(3.2rem, 6vw, 6rem)",
                  letterSpacing: "-0.03em",
                }}
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
                style={{
                  fontSize: "clamp(3.2rem, 6vw, 6rem)",
                  letterSpacing: "-0.03em",
                }}
              >
                Bhagat
              </motion.h1>
            </div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="mt-10 flex gap-8"
            >
              {[
                { value: "5+", label: "Years exp." },
                { value: "$400K", label: "Cost saved" },
                { value: "150+", label: "Global facilities" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-xl font-bold text-white leading-none">{s.value}</p>
                  <p className="text-[0.65rem] text-white/35 uppercase tracking-widest mt-1">{s.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Scroll cue */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mt-12 flex items-center gap-3"
            >
              <div className="w-8 h-[1px] bg-white/20" />
              <p className="text-white/25 text-[0.65rem] tracking-[0.25em] uppercase">Scroll to explore</p>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Section 2: Role ── */}
        <motion.div
          style={{ opacity: opacity2, y: y2 }}
          className="absolute inset-0 flex flex-col justify-center px-10 md:px-14 pointer-events-auto"
        >
          <div className="pl-8 md:pl-10 border-l-2 border-violet-500/40">
            <p className="section-label mb-5">What I do</p>
            <h2
              className="text-white font-bold m-0 leading-[1.1]"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3.8rem)", letterSpacing: "-0.025em" }}
            >
              I close the gap between{" "}
              <span className="gradient-text">data</span>
              <br />
              and decision-making.
            </h2>
            <p className="mt-6 text-white/45 max-w-xs leading-relaxed" style={{ fontSize: "clamp(0.85rem, 1.1vw, 1rem)" }}>
              Building the pipelines that make data reliable - and shaping the dashboards that make it digestible.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {["Snowflake", "dbt", "Power BI", "Looker", "BigQuery", "Tableau"].map((tool) => (
                <span
                  key={tool}
                  className="px-3 py-1 rounded-full text-[0.7rem] font-medium text-white/50"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Section 3: Ethos ── */}
        <motion.div
          style={{ opacity: opacity3, y: y3 }}
          className="absolute inset-0 flex flex-col justify-center px-10 md:px-14 pointer-events-auto"
        >
          <div className="pl-8 md:pl-10">
            <p className="section-label mb-5">Philosophy</p>
            <h2
              className="text-white font-bold m-0 leading-[1.1]"
              style={{ fontSize: "clamp(1.8rem, 3vw, 3.2rem)", letterSpacing: "-0.025em" }}
            >
              The best analysis means{" "}
              <br />
              nothing if it doesn&apos;t{" "}
              <span className="gradient-text">land.</span>
            </h2>
            <div className="mt-8 space-y-4">
              {[
                { icon: "◈", text: "Every metric deliberate." },
                { icon: "◈", text: "Every pipeline resilient." },
                { icon: "◈", text: "Every dashboard built to be understood." },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <span className="text-violet-400 text-xs">{item.icon}</span>
                  <p className="text-white/50 text-sm tracking-wide">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
