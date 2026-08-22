"use client";

import { motion, useSpring, useMotionValue } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight, Brain, Database, LineChart } from "lucide-react";

const GithubIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.24c3-.34 6-1.53 6-6.76a5.5 5.5 0 0 0-1.5-3.89 5.06 5.06 0 0 0 .1-3.82s-1.18-.35-3.9 1.48a13.38 13.38 0 0 0-7 0c-2.72-1.83-3.9-1.48-3.9-1.48a5.06 5.06 0 0 0 .1 3.82A5.5 5.5 0 0 0 4 12c0 5.22 3 6.42 6 6.76-.7.6-1.1 1.5-1.2 2.6V22" />
    <path d="M8 22v-4" />
  </svg>
);

const PERSONAL_PROJECTS = [
  {
    id: "gestational-diabetes",
    title: "Gestational Diabetes Early Prediction",
    tagline: "ML + Deep Learning · Healthcare AI",
    description:
      "Early prediction of gestational diabetes using machine learning and deep learning models. Developed in collaboration with Fetal Life to enable timely clinical interventions and improve maternal health outcomes.",
    githubUrl: "https://github.com/sahilbhagat30/Gestational-Diabetes-Early-Prediction",
    tags: ["Python", "Scikit-learn", "TensorFlow", "Pandas", "Healthcare AI"],
    tagColor: "violet",
    icon: "brain",
    accentColor: "#a855f7",
    accentColorMuted: "rgba(168,85,247,0.12)",
    featured: true,
  },
  {
    id: "medication-reminder-ui",
    title: "Medication Reminder Platform",
    tagline: "Full-Stack React + Node.js · Healthcare",
    description:
      "A production-grade, full-stack application designed for the Aetna Medication Reminder System. Empowers administrators with an intuitive dashboard to manage prescriptions, eligibility, and real-time communication telemetry.",
    githubUrl: "https://github.com/sahilbhagat30/medication-reminder-ui",
    tags: ["React 19", "Node.js", "Express", "PostgreSQL", "Docker", "BFF Architecture"],
    tagColor: "cyan",
    icon: "database",
    accentColor: "#22d3ee",
    accentColorMuted: "rgba(34,211,238,0.12)",
    featured: true,
  },
];

const TAG_COLORS: Record<string, { border: string; bg: string; text: string }> = {
  violet:  { border: "rgba(212,175,55,0.35)", bg: "rgba(212,175,55,0.1)",  text: "#F2E3C6" },
  cyan:    { border: "rgba(124,152,133,0.35)",  bg: "rgba(124,152,133,0.1)", text: "#b2d8d8" },
  amber:   { border: "rgba(176,141,87,0.35)",  bg: "rgba(176,141,87,0.1)", text: "#d4af37" },
  emerald: { border: "rgba(52,211,153,0.35)",  bg: "rgba(52,211,153,0.1)", text: "#6ee7b7" },
};

const PROJECT_ICONS: Record<string, React.ReactNode> = {
  brain:    <Brain    size={28} className="text-violet-400" />,
  database: <Database size={28} className="text-cyan-400"   />,
  chart:    <LineChart size={28} className="text-amber-400"  />,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  }),
};

function TiltProjectCard({ project, index }: { project: typeof PERSONAL_PROJECTS[0]; index: number }) {
  const colors  = TAG_COLORS[project.tagColor] ?? TAG_COLORS.violet;
  const ref     = useRef<HTMLAnchorElement>(null);
  const rotX    = useSpring(0, { stiffness: 200, damping: 22 });
  const rotY    = useSpring(0, { stiffness: 200, damping: 22 });
  const glowX   = useMotionValue(50);
  const glowY   = useMotionValue(50);

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top)  / rect.height;
    rotX.set((0.5 - y) * 8);
    rotY.set((x - 0.5) * 8);
    glowX.set(x * 100);
    glowY.set(y * 100);
  };

  const handleLeave = () => { rotX.set(0); rotY.set(0); };

  return (
    <motion.a
      ref={ref}
      href={project.githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      custom={index}
      variants={fadeUp}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d", textDecoration: "none" }}
      className="group relative glass-card overflow-hidden cursor-pointer flex flex-col"
      id={`personal-project-${project.id}`}
    >
      {/* Top accent bar */}
      <div
        className="h-[3px] w-full transition-all duration-500 group-hover:opacity-100 opacity-60"
        style={{ background: `linear-gradient(90deg, ${project.accentColor}, transparent)` }}
      />

      {/* Cursor glow */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[20px]"
        style={{
          background: `radial-gradient(circle at ${glowX}% ${glowY}%, ${project.accentColorMuted} 0%, transparent 65%)`,
        }}
      />

      {/* Card body */}
      <div className="p-7 flex flex-col gap-5 flex-1">
        {/* Icon + links */}
        <div className="flex items-start justify-between gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: project.accentColorMuted, border: `1px solid ${project.accentColor}30` }}
          >
            {PROJECT_ICONS[project.icon]}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <GithubIcon size={16} className="text-white/25 group-hover:text-white/60 transition-colors duration-300" />
            <ArrowUpRight
              size={16}
              className="text-white/25 group-hover:text-[#D4AF37] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
            />
          </div>
        </div>

        {/* Text */}
        <div>
          <p
            className="text-[0.65rem] font-semibold uppercase tracking-widest mb-2"
            style={{ color: project.accentColor }}
          >
            {project.tagline}
          </p>
          <h3
            className="text-lg font-bold text-white leading-snug mb-3 group-hover:text-white/90 transition-colors font-serif"
            style={{ letterSpacing: "-0.015em" }}
          >
            {project.title}
          </h3>
          <p className="text-white/45 text-sm leading-relaxed">{project.description}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          {project.tags.map((tag, ti) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, y: 4 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: ti * 0.05 }}
              className="px-2.5 py-1 rounded-full text-[0.65rem] font-medium"
              style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text }}
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Bottom hover glow line */}
      <div
        className="absolute bottom-0 left-0 w-full h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${project.accentColor}, transparent)` }}
      />
    </motion.a>
  );
}

export default function PersonalProjects() {
  return (
    <section id="projects" className="relative py-20 md:py-32 px-6 md:px-16 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, #153326, transparent 70%)", opacity: 0.3 }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, #153326, transparent 70%)", opacity: 0.2 }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-label mb-4"
        >
          Building in public
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6 mb-10 md:mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight font-serif"
            style={{ letterSpacing: "-0.02em" }}
          >
            Personal{" "}
            <span className="gradient-text italic font-serif">Projects</span>
          </h2>
          <a
            href="https://github.com/sahilbhagat30"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/40 hover:text-white/80 text-sm font-medium transition-colors duration-300 group"
          >
            <GithubIcon size={16} />
            <span>github.com/sahilbhagat30</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </a>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PERSONAL_PROJECTS.map((project, i) => (
            <TiltProjectCard key={project.id} project={project} index={i} />
          ))}

          {/* Coming soon */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            custom={PERSONAL_PROJECTS.length}
            variants={fadeUp}
            className="glass-card p-7 flex flex-col items-center justify-center gap-3 min-h-[260px]"
            style={{ border: "1px dashed rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <GithubIcon size={20} className="text-white/20" />
            </motion.div>
            <p className="text-white/20 text-sm text-center leading-relaxed">
              More projects<br />coming soon
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
