"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";

const SOCIALS = [
  {
    icon: Linkedin,
    label: "LinkedIn",
    handle: "/in/sahil-sanjay-bhagat",
    href: "https://www.linkedin.com/in/sahil-sanjay-bhagat/",
  },
  {
    icon: Github,
    label: "GitHub",
    handle: "sahilbhagat30",
    href: "https://github.com/sahilbhagat30",
  },
  {
    icon: Mail,
    label: "Email",
    handle: "sahilbhagat1497@gmail.com",
    href: "mailto:sahilbhagat1497@gmail.com",
  },
];

export default function Contact() {
  return (
    <section id="contact" className="relative py-32 px-6 md:px-16 overflow-hidden">
      {/* Background orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          className="w-[700px] h-[700px] rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #7c3aed 0%, #22d3ee 50%, transparent 70%)" }}
        />
      </div>

      {/* Divider line */}
      <div className="max-w-7xl mx-auto mb-20">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 text-center">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-label mb-6"
        >
          Connect
        </motion.p>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-black leading-none mb-6"
          style={{
            fontSize: "clamp(3rem, 7vw, 7rem)",
            letterSpacing: "-0.04em",
          }}
        >
          Let&apos;s{" "}
          <span className="gradient-text">talk</span>.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/40 max-w-md mx-auto mb-16 text-base leading-relaxed"
        >
          Whether it&apos;s a data problem, a collaboration, or just a good conversation — my inbox is always open.
        </motion.p>

        {/* Social Cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mb-24"
        >
          {SOCIALS.map(({ icon: Icon, label, handle, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
              aria-label={label}
              className="group flex items-center gap-4 px-6 py-4 rounded-2xl glass-card hover:border-white/20 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)" }}>
                <Icon size={18} className="text-white/60 group-hover:text-white transition-colors" />
              </div>
              <div className="text-left">
                <p className="text-white/40 text-xs uppercase tracking-widest mb-0.5">{label}</p>
                <p className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">{handle}</p>
              </div>
              <ArrowUpRight size={14} className="ml-auto text-white/20 group-hover:text-white/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>
          ))}
        </motion.div>

        {/* Footer line */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <p className="text-white/25 text-sm">
            © {new Date().getFullYear()} Sahil Bhagat. All rights reserved.
          </p>
          <p className="text-white/20 text-xs tracking-widest uppercase">
            Designed &amp; Built by Sahil Bhagat
          </p>
        </div>
      </div>
    </section>
  );
}
