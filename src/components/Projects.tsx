"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const PROJECT_DATA = [
  {
    number: "01",
    title: "Anywhere Real Estate",
    description:
      "Built scalable operations analytics and performance reporting solutions to monitor vendor productivity, staffing utilization, and operational health, identifying ~$400K in cost-saving opportunities.",
    image: "logos/anywhere.png",
    logoFilter: "brightness(0) invert(1)",
    tags: ["Snowflake", "dbt", "Power BI"],
    tagColor: "violet",
    featured: true,
  },
  {
    number: "02",
    title: "iConsult Collaborative",
    description:
      "Developed semantic models and KPI dashboards for workforce planning and provider performance. Standardized multi-source workforce data into reporting-ready datasets.",
    image: "logos/micron.png",
    logoFilter: "brightness(0) invert(1)",
    tags: ["Power BI", "SQL", "Workforce Analytics"],
    tagColor: "cyan",
    featured: false,
  },
  {
    number: "03",
    title: "United Nations",
    description:
      "Architected GCP-based healthcare analytics pipeline integrating clinical, finance, and operational data across 183 global facilities. Built Looker dashboards for compliance monitoring.",
    image: "logos/UN_emblem.svg",
    logoFilter: "brightness(0) invert(1)",
    tags: ["BigQuery", "Looker", "GCP"],
    tagColor: "amber",
    featured: false,
  },
  {
    number: "04",
    title: "Capgemini",
    description:
      "Engineered ETL/ELT pipelines across NetSuite, Salesforce, and Workday into Snowflake. Delivered Tableau dashboards replacing manual workflows and saving ~40 hours/month.",
    image: "logos/capgemini.png",
    logoFilter: "brightness(0) invert(1)",
    tags: ["Tableau", "AWS S3", "ETL"],
    tagColor: "violet",
    featured: false,
  },
  {
    number: "05",
    title: "Tata Consultancy Services",
    description:
      "Data Analyst role driving business insights, standardizing enterprise data pipelines, and developing executive dashboards to support strategic decision-making.",
    image: "logos/Tata_Consultancy_Services_old_logo.svg",
    logoFilter: "brightness(0) invert(1)",
    tags: ["Data Analysis", "SQL", "Dashboards"],
    tagColor: "cyan",
    featured: false,
  },
];

const TAG_COLORS: Record<string, { border: string; bg: string; text: string }> = {
  violet: { border: "rgba(168,85,247,0.35)", bg: "rgba(168,85,247,0.1)", text: "#c084fc" },
  cyan:   { border: "rgba(34,211,238,0.35)", bg: "rgba(34,211,238,0.1)", text: "#67e8f9" },
  amber:  { border: "rgba(245,158,11,0.35)", bg: "rgba(245,158,11,0.1)", text: "#fcd34d" },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.65, ease: "easeOut" },
  }),
};

function ProjectCard({ project, index }: { project: typeof PROJECT_DATA[0]; index: number }) {
  const colors = TAG_COLORS[project.tagColor] ?? TAG_COLORS.violet;

  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      custom={index}
      variants={fadeUp}
      className="group relative glass-card overflow-hidden cursor-pointer"
      id={`project-${project.number}`}
    >
      {/* Image Area */}
      <div className="relative aspect-[16/9] overflow-hidden bg-white/5 flex items-center justify-center p-8">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent z-10 opacity-70 group-hover:opacity-40 transition-opacity duration-500" />
        
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
          <span className="shrink-0 mt-1 text-white/30 group-hover:text-violet-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300">
            <ArrowUpRight size={20} />
          </span>
        </div>

        <p className="text-white/50 text-sm leading-relaxed mb-5">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                color: colors.text,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const [featured, ...rest] = PROJECT_DATA;

  return (
    <section id="work" className="relative py-32 px-6 md:px-16 overflow-hidden">
      {/* Glow blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-8"
        style={{ background: "radial-gradient(circle, #7c3aed, transparent 70%)" }}
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
          Experience
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold mb-16 tracking-tight"
          style={{ letterSpacing: "-0.02em" }}
        >
          Where I&apos;ve{" "}
          <span className="gradient-text">worked</span>
        </motion.h2>

        {/* Featured Project */}
        <motion.article
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="group relative glass-card overflow-hidden mb-8 cursor-pointer"
          id={`project-${featured.number}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 bg-white/5">
            {/* Image Area */}
            <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden flex items-center justify-center p-12">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#080808] z-10 opacity-0 md:opacity-60 group-hover:opacity-30 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] to-transparent z-10 opacity-60 group-hover:opacity-30 transition-opacity duration-500 md:hidden" />
              
              <img
                src={featured.image}
                alt={featured.title}
                className="relative z-20 w-full h-full object-contain scale-100 group-hover:scale-105 transition-transform duration-700 ease-out opacity-70 group-hover:opacity-100"
                style={{ filter: featured.logoFilter }}
              />
            </div>

            {/* Content */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <span className="section-label mb-4">Most Recent</span>
              <h3
                className="text-3xl md:text-4xl font-bold text-white mb-5 leading-tight"
                style={{ letterSpacing: "-0.02em" }}
              >
                {featured.title}
              </h3>
              <p className="text-white/55 leading-relaxed mb-8 text-[1.05rem]">
                {featured.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {featured.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      background: TAG_COLORS.violet.bg,
                      border: `1px solid ${TAG_COLORS.violet.border}`,
                      color: TAG_COLORS.violet.text,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.article>

        {/* Rest of Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((project, i) => (
            <ProjectCard key={project.number} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
