"use client";

import { motion, useSpring, useMotionValue } from "framer-motion";
import { useState, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import ProjectModal from "./ProjectModal";
import LiquidGlass from "./LiquidGlass";

const BASE = process.env.NODE_ENV === "production" ? "/Portfolio-Web-Site" : "";

const PROJECT_DATA = [
  {
    number: "01",
    title: "Anywhere Real Estate",
    description:
      "Built data pipelines that actually showed what vendors were doing. By connecting the dots between siloed systems, I helped leadership spot $400K in wasted spend that was hiding in plain sight.",
    image: `${BASE}/logos/anywhere.png`,
    logoFilter: "brightness(0) invert(1)",
    tags: ["Data Architecture", "Cost Optimization", "Pipeline Design"],
    tagColor: "violet",
    featured: true,
    link: "https://anywhere.re/",
    caseStudy: {
      problem: "Leadership couldn't see what was happening. Vendor data was scattered across completely different systems, so nobody knew where the money or time was going.",
      solution: "I stopped the manual spreadsheets. I wrote automated pipelines to pull everything into a single, clean model that actually made sense.",
      outcome: "Suddenly, the bottlenecks were obvious. We found $400K in immediate cost savings and gave the team back hours of their week."
    }
  },
  {
    number: "02",
    title: "iConsult Collaborative",
    description:
      "Cleaned up messy healthcare data so planners could figure out where staff were actually needed. I took completely mismatched formats and turned them into clear, reliable dashboards.",
    image: `${BASE}/logos/micron.png`,
    logoFilter: "brightness(0) invert(1)",
    tags: ["Data Pipelines", "Semantic Layer", "KPI Strategy"],
    tagColor: "cyan",
    featured: false,
    link: "https://ischool.syr.edu/iconsult/",
    caseStudy: {
      problem: "Planners were flying blind. They couldn't figure out provider efficiency because the data was trapped in completely incompatible formats.",
      solution: "I built a pipeline to ingest it all, standardize it, and create a single 'semantic layer'—basically, making sure everyone was finally speaking the same language.",
      outcome: "Leadership finally had the clear numbers they needed to make real decisions about where to put their staff."
    }
  },
  {
    number: "03",
    title: "United Nations",
    description:
      "Brought 183 global healthcare facilities onto the same page. I took completely inconsistent local data and built a unified system so the UN could actually track what was happening worldwide.",
    image: `${BASE}/logos/UN_emblem.svg`,
    logoFilter: "brightness(0) invert(1)",
    tags: ["Global Data Infrastructure", "Analytics Engineering", "Strategy"],
    tagColor: "amber",
    featured: false,
    link: "https://www.un.org/",
    caseStudy: {
      problem: "Every single facility was reporting data differently. Trying to track international compliance was a manual nightmare.",
      solution: "I drew a line in the sand and built a standardized framework that forced consistency across clinical, financial, and operational data.",
      outcome: "Now, leadership can actually trust the numbers and track compliance across the globe without the guesswork."
    }
  },
  {
    number: "04",
    title: "Capgemini",
    description:
      "Killed the manual Excel grind. I integrated messy data across 8 different enterprise systems so the analytics team didn't have to spend 40 hours a month copying and pasting.",
    image: `${BASE}/logos/capgemini.png`,
    logoFilter: "brightness(0) invert(1)",
    tags: ["Workflow Automation", "Data Integration", "Enterprise Analytics"],
    tagColor: "violet",
    featured: false,
    link: "https://www.capgemini.com/",
    caseStudy: {
      problem: "The team was spending all their time just trying to get the data into one place. 8 different systems meant endless manual work.",
      solution: "I ripped out the manual workflows and built automated pipelines to pull sales, HR, and financial data together automatically.",
      outcome: "We got 40 hours a month back. No more manual copying, no more human error."
    }
  },
  {
    number: "05",
    title: "Tata Consultancy Services",
    description:
      "Got different departments to agree on what their numbers actually meant. I sat down with stakeholders to standardize their data models so everyone was looking at the same truth.",
    image: `${BASE}/logos/Tata_Consultancy_Services_old_logo.svg`,
    logoFilter: "brightness(0) invert(1)",
    tags: ["Data Modeling", "Decision Support", "Business Analysis"],
    tagColor: "cyan",
    featured: false,
    link: "https://www.tcs.com/",
    caseStudy: {
      problem: "Marketing and Finance had completely different numbers for the exact same metrics because nobody was calculating things the same way.",
      solution: "I sat down with the stakeholders, redesigned the architecture from the ground up, and enforced strict modeling standards.",
      outcome: "The arguments stopped. Everyone finally based their strategic decisions on the exact same numbers."
    }
  },
];

const TAG_COLORS: Record<string, { border: string; bg: string; text: string }> = {
  violet: { border: "rgba(234,230,225,0.4)", bg: "rgba(234,230,225,0.08)", text: "#EAE6E1" },
  cyan:   { border: "rgba(234,230,225,0.4)", bg: "rgba(234,230,225,0.08)", text: "#EAE6E1" },
  amber:  { border: "rgba(234,230,225,0.4)", bg: "rgba(234,230,225,0.08)", text: "#EAE6E1" },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      delay: i * 0.1, 
      type: "spring", 
      bounce: 0, 
      duration: 0.6 
    },
  }),
};

function ProjectCard({ 
  project, 
  index, 
  onClick 
}: { 
  project: typeof PROJECT_DATA[0]; 
  index: number;
  onClick: () => void;
}) {
  const colors = TAG_COLORS[project.tagColor] ?? TAG_COLORS.violet;
  const ref    = useRef<HTMLElement>(null);
  const glowX  = useMotionValue(50);
  const glowY  = useMotionValue(50);

  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top)  / rect.height;
    glowX.set(x * 100);
    glowY.set(y * 100);
    el.style.setProperty("--mouse-x", `${x * 100}%`);
    el.style.setProperty("--mouse-y", `${y * 100}%`);
  };

  return (
    <motion.article
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      custom={index}
      variants={fadeUp}
      onMouseMove={handleMove}
      onMouseLeave={() => {}}
      onClick={onClick}
      whileTap={{ scale: 0.97, transition: { type: "spring", bounce: 0, duration: 0.3 } }}
      className="group relative cursor-pointer"
      id={`project-${project.number}`}
      data-cursor="hover"
    >
      <LiquidGlass borderRadius={20} intensity="high" className="apple-active w-full h-full overflow-hidden block">
      {/* Cursor glow */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[20px]"
        style={{
          background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(234,230,225,0.12) 0%, transparent 60%)`,
        }}
      />

      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden flex items-center justify-center p-8 border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent z-10 opacity-70 group-hover:opacity-40 transition-opacity duration-500" />
        <img
          src={project.image}
          alt={project.title}
          className="relative z-20 w-full h-full object-contain scale-100 group-hover:scale-105 transition-transform duration-700 ease-out opacity-70 group-hover:opacity-100"
          style={{ filter: project.logoFilter }}
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3
            className="text-xl font-bold text-white group-hover:text-white/90 leading-snug"
            style={{ letterSpacing: "-0.015em" }}
          >
            {project.title}
          </h3>
          <motion.span
            className="shrink-0 mt-1 text-white/30 group-hover:text-[var(--accent-primary)]"
            whileHover={{ x: 2, y: -2 }}
          >
            <ArrowUpRight size={20} />
          </motion.span>
        </div>

        <p className="text-white/50 text-sm leading-relaxed mb-5">{project.description}</p>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag, ti) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: ti * 0.06 }}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text }}
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>
      </LiquidGlass>
    </motion.article>
  );
}

export default function Projects() {
  const [featured, ...rest] = PROJECT_DATA;
  const featuredColors = TAG_COLORS.violet;
  const [selectedProject, setSelectedProject] = useState<typeof PROJECT_DATA[0] | null>(null);

  /* Featured card glow */
  const featRef  = useRef<HTMLElement>(null);
  const fGlowX   = useMotionValue(50);
  const fGlowY   = useMotionValue(50);

  const featMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = featRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top)  / rect.height;
    fGlowX.set(x * 100);
    fGlowY.set(y * 100);
    el.style.setProperty("--mouse-x", `${x * 100}%`);
    el.style.setProperty("--mouse-y", `${y * 100}%`);
  };

  return (
    <section id="work" className="glass-section relative py-20 md:py-32 px-6 md:px-16 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, #1a1a1a, transparent 70%)", opacity: 0.3 }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", bounce: 0, duration: 0.5 }}
          className="section-label mb-4"
        >
          Experience
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", bounce: 0, duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold mb-10 md:mb-16 tracking-tight"
          style={{ letterSpacing: "-0.02em" }}
        >
          Where I&apos;ve{" "}
          <span className="gradient-text">worked</span>
        </motion.h2>

        {/* Featured */}
        <motion.article
          ref={featRef}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ type: "spring", bounce: 0, duration: 0.6 }}
          onMouseMove={featMove}
          onMouseLeave={() => {}}
          onClick={() => setSelectedProject(featured)}
          whileTap={{ scale: 0.97, transition: { type: "spring", bounce: 0, duration: 0.3 } }}
          className="group relative mb-8 cursor-pointer"
          id={`project-${featured.number}`}
          data-cursor="hover"
        >
          <LiquidGlass borderRadius={20} intensity="high" className="apple-active w-full h-full overflow-hidden block">
          {/* Cursor glow inside featured card */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${fGlowX}% ${fGlowY}%, rgba(234,230,225,0.1) 0%, transparent 60%)`,
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden flex items-center justify-center p-12">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--background)] z-10 opacity-0 md:opacity-60 group-hover:opacity-30 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] to-transparent z-10 opacity-60 group-hover:opacity-30 transition-opacity duration-500 md:hidden" />
              <img
                src={featured.image}
                alt={featured.title}
                className="relative z-20 w-full h-full object-contain scale-100 group-hover:scale-105 transition-transform duration-700 ease-out opacity-70 group-hover:opacity-100"
                style={{ filter: featured.logoFilter }}
              />
            </div>

            <div className="p-8 md:p-12 flex flex-col justify-center">
              <span className="section-label mb-4">Most Recent</span>
              <h3
                className="text-3xl md:text-4xl font-bold text-white mb-5 leading-tight"
                style={{ letterSpacing: "-0.02em" }}
              >
                {featured.title}
              </h3>
              <p className="text-white/55 leading-relaxed mb-8 text-[1.05rem]">{featured.description}</p>

              <div className="flex flex-wrap gap-2 mb-8">
                {featured.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium"
                    style={{ background: featuredColors.bg, border: `1px solid ${featuredColors.border}`, color: featuredColors.text }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            </div>
          </LiquidGlass>
        </motion.article>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((project, i) => (
            <ProjectCard 
              key={project.number} 
              project={project} 
              index={i} 
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </div>

      <ProjectModal 
        project={selectedProject} 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </section>
  );
}
