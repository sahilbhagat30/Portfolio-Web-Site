"use client";

import { motion, useSpring, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import LiquidGlass from "./LiquidGlass";

const SKILLS = {
  "Data & Cloud":        ["Snowflake", "BigQuery", "AWS", "dbt", "Airflow", "Databricks"],
  "BI & Analytics":      ["Power BI", "DAX", "Tableau", "Looker", "SQL"],
  "Programming & Tools": ["Python", "Pandas", "Git", "CI/CD", "Informatica"],
};

const SKILL_COLORS: Record<string, { border: string; bg: string; text: string }> = {
  "Data & Cloud":        { border: "rgba(234,230,225,0.4)", bg: "rgba(234,230,225,0.08)", text: "#EAE6E1" },
  "BI & Analytics":      { border: "rgba(234,230,225,0.4)", bg: "rgba(234,230,225,0.08)", text: "#EAE6E1" },
  "Programming & Tools": { border: "rgba(234,230,225,0.4)", bg: "rgba(234,230,225,0.08)", text: "#EAE6E1" },
};



// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      delay: i * 0.08, 
      type: "spring", 
      bounce: 0, 
      duration: 0.6 
    },
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
      transition={{ type: "spring", bounce: 0, duration: 0.5, delay: 0.3 }}
      className="mt-10 relative overflow-hidden"
    >
      <LiquidGlass borderRadius={16} className="apple-active p-5 flex flex-col gap-3 w-full h-full block">
      <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-white/30">Currently</p>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-white/40 mt-1.5" />
          <div>
            <p className="text-white/80 text-sm font-medium">📍 New York City</p>
            <p className="text-white/30 text-xs">EST · {time}</p>
          </div>
        </div>
      </div>
      </LiquidGlass>
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
    <section id="about" className="glass-section relative py-20 md:py-32 px-6 md:px-16 overflow-hidden">
      {/* Background organic shape */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-0 w-[600px] h-[600px] rounded-full blur-[120px]"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.05), transparent 70%)",
          opacity: 0.3,
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
          {/* Left: Bio — wrapped in glass card */}
          <div>
            <LiquidGlass borderRadius={24} intensity="medium" className="p-8 md:p-10 w-full h-full block">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              custom={1}
              variants={fadeUp}
              className="apple-heading-large text-3xl md:text-5xl font-bold mb-6 md:mb-8 text-white"
            >
              The real problem is never the data. It&apos;s that nobody can see it{" "}
              <span className="gradient-text">clearly.</span>
            </motion.h2>

            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              custom={2}
              variants={fadeUp}
              className="text-white/70 leading-relaxed mb-4 md:mb-5 font-medium text-base md:text-lg"
            >
              That&apos;s the gap I close. I&apos;ve sat in enough stakeholder meetings to know that the best analysis means nothing if it doesn&apos;t land with the people who need to act on it.
            </motion.p>

            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              custom={3}
              variants={fadeUp}
              className="text-white/60 leading-relaxed mb-4 md:mb-5 text-sm md:text-base"
            >
              Over the past 5+ years across consulting, enterprise, and global organizations, I&apos;ve gotten good at both sides: building the pipelines that make data reliable, and shaping the dashboards and frameworks that make it digestible.
            </motion.p>

            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              custom={4}
              variants={fadeUp}
              className="text-white/50 leading-relaxed mb-4 md:mb-5 text-sm md:text-base"
            >
              At Anywhere Real Estate, I built a vendor performance model that surfaced $400K in cost avoidance—just by connecting data points that were already there. At the United Nations, I helped standardize data across 150+ global healthcare facilities. At Capgemini, I integrated messy data across 8 enterprise systems, learning that clean, reliable data isn&apos;t a nice-to-have... it&apos;s everything.
            </motion.p>

            {/* Stats — count-up */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              custom={4}
              variants={fadeUp}
              className="flex gap-6 md:gap-10 mb-2"
            >
              <CountStat num="5+" label="Years Experience" />
              <CountStat num="4+"  label="Global Orgs" />
              <CountStat num="$400K+" label="Savings Identified" />
            </motion.div>
            </LiquidGlass>

            {/* Currently block */}
            <CurrentlyBlock />


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
                  className="relative overflow-hidden"
                >
                  <LiquidGlass borderRadius={16} intensity="high" className="apple-active p-6 w-full h-full block">
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
                        transition={{ type: "spring", bounce: 0, duration: 0.5, delay: si * 0.05 + ci * 0.1 }}
                        whileHover={{ scale: 1.1, y: -3 }}
                        whileTap={{ scale: 0.97, transition: { type: "spring", bounce: 0, duration: 0.3 } }}
                        className="apple-active px-3.5 py-1.5 rounded-full text-sm font-medium cursor-default transition-colors"
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
                  </LiquidGlass>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
