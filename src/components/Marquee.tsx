"use client";

import { motion } from "framer-motion";

const KEYWORDS = [
  "Data Engineer",
  "Snowflake",
  "BigQuery",
  "dbt",
  "Airflow",
  "Python",
  "SQL",
  "Power BI",
  "Databricks",
  "AWS",
  "Analytics Engineer",
  "Problem Solver",
];

export default function Marquee() {
  return (
    <div className="relative w-full overflow-hidden bg-[var(--background)] border-y border-white/5 py-4 z-20">
      <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, var(--background), transparent 10%, transparent 90%, var(--background))" }} />
      <motion.div
        className="flex whitespace-nowrap items-center w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 35,
        }}
      >
        {[...KEYWORDS, ...KEYWORDS].map((word, i) => (
          <div key={i} className="flex items-center">
            <span className="text-white/40 text-sm tracking-widest uppercase mx-6 font-medium">
              {word}
            </span>
            <span className="text-[var(--accent-primary)]/50 text-[10px]">✦</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
