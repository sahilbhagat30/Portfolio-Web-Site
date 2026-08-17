"use client";
// eslint-disable-next-line @typescript-eslint/no-explicit-any

import { motion } from "framer-motion";

const SKILLS = {
  "Data & Cloud": ["Snowflake", "BigQuery", "AWS", "dbt", "Airflow", "Databricks"],
  "BI & Analytics": ["Power BI", "DAX", "Tableau", "Looker", "SQL"],
  "Programming & Tools": ["Python", "Pandas", "Git", "CI/CD", "Informatica"],
};

const SKILL_COLORS: Record<string, { border: string; bg: string; text: string }> = {
  "Data & Cloud":        { border: "rgba(168,85,247,0.4)", bg: "rgba(168,85,247,0.08)", text: "#c084fc" },
  "BI & Analytics":      { border: "rgba(34,211,238,0.4)", bg: "rgba(34,211,238,0.08)", text: "#67e8f9" },
  "Programming & Tools": { border: "rgba(245,158,11,0.4)", bg: "rgba(245,158,11,0.08)", text: "#fcd34d" },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: "easeOut" },
  }),
};

export default function About() {
  return (
    <section id="about" className="relative py-32 px-6 md:px-16 overflow-hidden">
      {/* Background glow blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #7c3aed, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-8"
        style={{ background: "radial-gradient(circle, #22d3ee, transparent 70%)" }}
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
              At Anywhere Real Estate, I surfaced $400K in cost avoidance by connecting data points that had always existed but never been tied together. At the United Nations, I standardized reporting across 150+ global healthcare facilities so leadership could pinpoint where resources were slipping. At Capgemini, I integrated data across 8 enterprise systems and built the foundation that everything else depended on.
            </motion.p>
            
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              custom={5}
              variants={fadeUp}
              className="text-white/50 leading-relaxed mb-10"
              style={{ fontSize: "1.05rem" }}
            >
              My stack spans SQL, Python, Snowflake, dbt, Power BI, Tableau, and Informatica. The tools change. The goal does not: give the right people the right information at the right time.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              custom={4}
              variants={fadeUp}
              className="flex gap-10"
            >
              {[
                { num: "5+", label: "Years Experience" },
                { num: "4+", label: "Global Orgs" },
                { num: "$400K+",  label: "Savings Identified" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p
                    className="gradient-text font-black text-4xl leading-none mb-1"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {stat.num}
                  </p>
                  <p className="text-white/40 text-xs tracking-widest uppercase">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Skills */}
          <div className="space-y-10">
            {Object.entries(SKILLS).map(([category, skills], ci) => (
              <motion.div
                key={category}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                custom={ci + 2}
                variants={fadeUp}
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
                      whileHover={{ scale: 1.07, y: -2 }}
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
