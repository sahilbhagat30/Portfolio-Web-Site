"use client";

import { motion, useSpring, useMotionValue } from "framer-motion";
import { useRef, useState } from "react";
import { SocialCardGrid } from "./SocialLinks";

/* ── Ripple button ── */
function RippleButton({ href, children }: { href: string; children: React.ReactNode }) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((r) => [...r, { x, y, id }]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 700);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-semibold text-white overflow-hidden group"
      style={{
        background: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(34,211,238,0.1))",
        border: "1px solid rgba(168,85,247,0.4)",
      }}
    >
      {/* Shimmer border effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.15), rgba(34,211,238,0.1), transparent)",
          backgroundSize: "200% auto",
        }}
        animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />

      {/* Ripples */}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          className="absolute rounded-full bg-violet-400/20 pointer-events-none"
          style={{ left: r.x, top: r.y, translateX: "-50%", translateY: "-50%" }}
          initial={{ width: 0, height: 0, opacity: 0.6 }}
          animate={{ width: 200, height: 200, opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      ))}

      <span className="relative z-10">{children}</span>
      <motion.svg
        className="relative z-10"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        whileHover={{ x: 2, y: -2 }}
      >
        <path d="M7 17L17 7M17 7H7M17 7v10" />
      </motion.svg>
    </a>
  );
}

/* ── Animated email letters ── */
function AnimatedEmail() {
  const email = "sahilbhagat1497@gmail.com";
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href="mailto:sahilbhagat1497@gmail.com"
      className="inline-block font-bold leading-none tracking-tight cursor-pointer select-none"
      style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", letterSpacing: "-0.03em" }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {email.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          animate={
            hovered
              ? {
                  y: [0, -4, 0],
                  color: ["#ffffff", "#c084fc", "#67e8f9", "#ffffff"],
                }
              : { y: 0, color: "rgba(255,255,255,0.75)" }
          }
          transition={{
            delay: hovered ? i * 0.025 : 0,
            duration: 0.4,
            ease: "easeOut",
          }}
        >
          {char === "@" ? (
            <span className="gradient-text">{char}</span>
          ) : (
            char
          )}
        </motion.span>
      ))}
    </motion.a>
  );
}

/* ── Scroll to top rocket ── */
function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [launched, setLaunched] = useState(false);

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => setVisible(window.scrollY > 400), { passive: true });
  }

  const handleClick = () => {
    setLaunched(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setLaunched(false), 800);
    }, 200);
  };

  return (
    <motion.button
      onClick={handleClick}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full flex items-center justify-center text-xl cursor-pointer"
      style={{
        background: "rgba(168,85,247,0.15)",
        border: "1px solid rgba(168,85,247,0.4)",
        backdropFilter: "blur(12px)",
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      title="Back to top"
    >
      <motion.span
        animate={launched ? { y: [-0, -40], opacity: [1, 0] } : { y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeIn" }}
      >
        🚀
      </motion.span>
    </motion.button>
  );
}

/* ── Tilt social card wrapper ── */
function TiltSocialWrapper({ children }: { children: React.ReactNode }) {
  const ref  = useRef<HTMLDivElement>(null);
  const rotX = useSpring(0, { stiffness: 200, damping: 20 });
  const rotY = useSpring(0, { stiffness: 200, damping: 20 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    rotX.set(-y * 4);
    rotY.set( x * 4);
  };
  const handleLeave = () => { rotX.set(0); rotY.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}

export default function Contact() {
  return (
    <>
      <section id="contact" className="relative py-32 px-6 md:px-16 overflow-hidden">
        {/* Background orb — breathing */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div
            className="w-[700px] h-[700px] rounded-full blur-3xl"
            style={{
              background: "radial-gradient(circle, #7c3aed 0%, #22d3ee 50%, transparent 70%)",
              opacity: 0.08,
              animation: "breathe 12s ease-in-out infinite",
            }}
          />
        </div>

        {/* Divider */}
        <div className="max-w-7xl mx-auto mb-20">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
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
            style={{ fontSize: "clamp(3rem, 7vw, 7rem)", letterSpacing: "-0.04em" }}
          >
            Let&apos;s{" "}
            <span className="gradient-text">talk</span>.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/40 max-w-md mx-auto mb-10 text-base leading-relaxed"
          >
            Whether it&apos;s a data challenge, a collaboration, or just a conversation. My inbox is always open.
          </motion.p>

          {/* Animated email */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <AnimatedEmail />
          </motion.div>

          {/* CTA button */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-16 flex justify-center"
          >
            <RippleButton href="mailto:sahilbhagat1497@gmail.com">
              Send me a message
            </RippleButton>
          </motion.div>

          {/* Social Cards — with tilt */}
          <TiltSocialWrapper>
            <SocialCardGrid className="mb-24" />
          </TiltSocialWrapper>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5"
          >
            <p className="text-white/25 text-sm">
              © {new Date().getFullYear()} Sahil Bhagat. All rights reserved.
            </p>
            <motion.p
              className="text-white/20 text-xs tracking-widest uppercase"
              animate={{
                backgroundImage: [
                  "linear-gradient(90deg, rgba(255,255,255,0.2), rgba(168,85,247,0.4), rgba(255,255,255,0.2))",
                  "linear-gradient(90deg, rgba(168,85,247,0.4), rgba(34,211,238,0.4), rgba(168,85,247,0.4))",
                  "linear-gradient(90deg, rgba(255,255,255,0.2), rgba(168,85,247,0.4), rgba(255,255,255,0.2))",
                ],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
            >
              Designed &amp; Built by Sahil Bhagat
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Scroll to top */}
      <ScrollToTop />
    </>
  );
}
