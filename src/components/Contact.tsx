"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Code2, Briefcase, MessageCircle, Mail } from "lucide-react";

const SOCIALS = [
  { icon: Briefcase,  label: "LinkedIn", href: "https://www.linkedin.com/in/sahil-sanjay-bhagat/" },
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
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-label mb-6"
        >
          Get in touch
        </motion.p>

        {/* Big CTA Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-black leading-none mb-8"
          style={{
            fontSize: "clamp(3rem, 7vw, 7rem)",
            letterSpacing: "-0.04em",
          }}
        >
          Let&apos;s{" "}
          <span className="gradient-text">build</span>
          <br />
          something.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/50 max-w-lg mx-auto mb-12 text-lg leading-relaxed"
        >
          Open to full-time roles, freelance projects, and exciting collaborations. Let&apos;s make something great together.
        </motion.p>

        {/* Email CTA */}
        <motion.a
          href="mailto:sahilbhagat1497@gmail.com"
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-lg shadow-[0_0_40px_rgba(124,58,237,0.4)] hover:shadow-[0_0_60px_rgba(124,58,237,0.6)] transition-all duration-300 mb-6"
          id="contact-email-btn"
        >
          <Mail size={20} />
          Say Hello
          <ArrowUpRight
            size={18}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </motion.a>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-white/40 mb-16"
        >
          or call me at <a href="tel:2019938953" className="hover:text-white transition-colors">(201) 993-8953</a>
        </motion.p>

        {/* Socials */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center gap-5 mb-24"
        >
          {SOCIALS.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-white/50 hover:text-white transition-colors duration-200"
            >
              <Icon size={18} />
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
