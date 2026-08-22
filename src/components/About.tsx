"use client";

import { motion, useSpring, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const SKILLS = {
  "Data & Cloud":        ["Snowflake", "BigQuery", "AWS", "dbt", "Airflow", "Databricks"],
  "BI & Analytics":      ["Power BI", "DAX", "Tableau", "Looker", "SQL"],
  "Programming & Tools": ["Python", "Pandas", "Git", "CI/CD", "Informatica"],
};

const SKILL_COLORS: Record<string, { border: string; bg: string; text: string }> = {
  "Data & Cloud":        { border: "rgba(168,85,247,0.4)", bg: "rgba(168,85,247,0.08)", text: "#c084fc" },
  "BI & Analytics":      { border: "rgba(34,211,238,0.4)", bg: "rgba(34,211,238,0.08)", text: "#67e8f9" },
  "Programming & Tools": { border: "rgba(245,158,11,0.4)", bg: "rgba(245,158,11,0.08)", text: "#fcd34d" },
};

const INTERESTS = [
  { emoji: "📷", label: "Photography" },
  { emoji: "🎵", label: "Music" },
  { emoji: "🏔️", label: "Hiking" },
  { emoji: "🌏", label: "Travel" },
  { emoji: "📊", label: "Data Art" },
  { emoji: "🎮", label: "Gaming" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: "easeOut" },
  }),
};

/* ── Count-up stat ── */
function CountStat({ num, label }: { num: string; label: string }) {
  const [displayed, setDisplayed] = useState("0");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      const prefix = num.match(/^[^0-9]*/)?.[0] ?? "";
      const suffix = num.match(/[^0-9]*$/)?.[0] ?? "";
      const target = parseFloat(num.replace(/[^0-9.]/g, ""));
      if (isNaN(target)) { setDisplayed(num); return; }
      const duration = 1600;
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        setDisplayed(`${prefix}${Math.floor(eased * target)}${suffix}`);
        if (progress < 1) requestAnimationFrame(step);
        else setDisplayed(num);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [num]);

  return (
    <div ref={ref}>
      <p className="gradient-text font-black text-4xl leading-none mb-1" style={{ fontVariantNumeric: "tabular-nums" }}>
        {displayed}
      </p>
      <p className="text-white/40 text-xs tracking-widest uppercase">{label}</p>
    </div>
  );
}

/* ── Live clock + location block ── */
function CurrentlyBlock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "America/New_York" }));
    };
    fmt();
    const id = setInterval(fmt, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-10 p-5 rounded-2xl flex flex-col gap-3"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-white/30">Currently</p>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">📍</span>
          <div>
            <p className="text-white/80 text-sm font-medium">New York City</p>
            <p className="text-white/30 text-xs">EST · {time}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Tilt card wrapper for skill groups ── */
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rotX = useSpring(0, { stiffness: 200, damping: 20 });
  const rotY = useSpring(0, { stiffness: 200, damping: 20 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    rotX.set(-y * 6);
    rotY.set( x * 6);
  };

  const handleLeave = () => { rotX.set(0); rotY.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function About() {
  return (
    <section id="about" className="relative py-32 px-6 md:px-16 overflow-hidden">
      {/* Background glow blobs — now breathing */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, #7c3aed, transparent 70%)",
          opacity: 0.1,
          animation: "breathe 8s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, #22d3ee, transparent 70%)",
          opacity: 0.07,
          animation: "breathe 10s ease-in-out infinite reverse",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          custom={0}
          variants={fadeUp}
          className="section-label mb-4"
        >
          About Me
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Bio */}
          <div>
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              custom={1}
              variants={fadeUp}
              className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-8"
              style={{ letterSpacing: "-0.02em" }}
            >
              I turn complex data into clear decisions.{" "}
              <span className="gradient-text">Faster.</span>
            </motion.h2>

            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              custom={2}
              variants={fadeUp}
              className="text-white/70 leading-relaxed mb-5 font-medium"
              style={{ fontSize: "1.1rem" }}
            >
              5+ years across consulting, enterprise, and global organizations have taught me one thing: the best analysis means nothing if the right people cannot act on it.
            </motion.p>

            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              custom={3}
              variants={fadeUp}
              className="text-white/60 leading-relaxed mb-5"
              style={{ fontSize: "1.05rem" }}
            >
              I specialize in both sides of the problem. I build the pipelines that make data reliable, and I shape the dashboards and reporting frameworks that make it digestible for decision-makers at every level.
            </motion.p>

            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              custom={4}
              variants={fadeUp}
              className="text-white/50 leading-relaxed mb-5"
              style={{ fontSize: "1.05rem" }}
            >
              At Anywhere Real Estate, I surfaced $400K in cost avoidance by connecting data points that had always existed but never been tied together. At the United Nations, I standardized reporting across 150+ global healthcare facilities. At Capgemini, I integrated data across 8 enterprise systems.
            </motion.p>

            {/* Stats — count-up */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              custom={4}
              variants={fadeUp}
              className="flex gap-10 mb-2"
            >
              <CountStat num="5+" label="Years Experience" />
              <CountStat num="4+"  label="Global Orgs" />
              <CountStat num="$400K+" label="Savings Identified" />
            </motion.div>

            {/* Currently block */}
            <CurrentlyBlock />

            {/* Interests strip */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8"
            >
              <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-white/30 mb-3">Outside work</p>
              <div className="flex gap-3 flex-wrap">
                {INTERESTS.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.3 }}
                    whileHover={{ scale: 1.1, y: -3 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-white/60 cursor-default select-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <span>{item.emoji}</span>
                    <span>{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Skills — with tilt */}
          <div className="space-y-8">
            {Object.entries(SKILLS).map(([category, skills], ci) => (
              <TiltCard key={category}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  custom={ci + 2}
                  variants={fadeUp}
                  className="p-6 rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: `1px solid ${SKILL_COLORS[category].border}`,
                  }}
                >
                  <p
                    className="text-xs font-semibold tracking-[0.18em] uppercase mb-4"
                    style={{ color: SKILL_COLORS[category].text }}
                  >
                    {category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, si) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.85 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: si * 0.05 + ci * 0.1, duration: 0.4 }}
                        whileHover={{ scale: 1.1, y: -3 }}
                        className="px-3.5 py-1.5 rounded-full text-sm font-medium cursor-default transition-colors"
                        style={{
                          background: SKILL_COLORS[category].bg,
                          border: `1px solid ${SKILL_COLORS[category].border}`,
                          color: SKILL_COLORS[category].text,
                        }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
