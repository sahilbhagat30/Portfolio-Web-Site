"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";


const NAV_LINKS = [
  { label: "About",       href: "#about" },
  { label: "Experience",  href: "#work" },
  { label: "Projects",    href: "#projects" },
  { label: "Photography", href: "#photography" },
  { label: "Contact",     href: "#contact" },
];

/* ── Magnetic nav link ── */
function MagneticLink({
  label,
  href,
  active,
  onClick,
}: {
  label: string;
  href: string;
  active: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  const ref  = useRef<HTMLAnchorElement>(null);
  const posX = useRef(0);
  const posY = useRef(0);

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    posX.current = (e.clientX - rect.left - rect.width  / 2) * 0.25;
    posY.current = (e.clientY - rect.top  - rect.height / 2) * 0.25;
    el.style.transform = `translate(${posX.current}px, ${posY.current}px)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0px, 0px)";
    el.style.transition = "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)";
    setTimeout(() => { if (el) el.style.transition = ""; }, 400);
  };

  return (
    <a
      ref={ref}
      href={href}
      onClick={(e) => onClick(e, href)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative group text-sm font-medium text-white/60 hover:text-white transition-colors duration-200"
      style={{ display: "inline-block" }}
    >
      {label}
      {/* Underline */}
      <span
        className={`absolute -bottom-0.5 left-0 h-[1px] bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300 ${
          active ? "w-full" : "w-0 group-hover:w-full"
        }`}
      />
      {/* Glow dot */}
      {active && (
        <motion.span
          layoutId="nav-dot"
          className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-400"
        />
      )}
    </a>
  );
}

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [activeLink,  setActiveLink]  = useState("");

  /* Scroll listener */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Active section tracking via IntersectionObserver */
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => l.href.replace("#", ""));
    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveLink(`#${id}`);
        },
        { threshold: 0.35, rootMargin: "-64px 0px 0px 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    setActiveLink(href);
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[rgba(8,8,8,0.85)] backdrop-blur-xl border-b border-white/5 shadow-[0_4px_32px_rgba(0,0,0,0.5)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="group flex items-center gap-2 select-none"
          >
            <motion.span
              className="font-bold tracking-tight text-lg"
              style={{ letterSpacing: "-0.02em" }}
              animate={{ filter: ["drop-shadow(0 0 8px rgba(168,85,247,0.6))", "drop-shadow(0 0 2px rgba(168,85,247,0.2))", "drop-shadow(0 0 8px rgba(168,85,247,0.6))"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Logo text 'SB' removed by request */}
            </motion.span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <MagneticLink
                key={link.href}
                label={link.label}
                href={link.href}
                active={activeLink === link.href}
                onClick={handleNav}
              />
            ))}

          </div>

          {/* Mobile Hamburger */}
          <button
            id="navbar-menu-toggle"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 group"
          >
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-4 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-[rgba(8,8,8,0.97)] backdrop-blur-2xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNav(e, link.href)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                className="text-4xl font-bold text-white/80 hover:text-white transition-colors"
              >
                {link.label}
              </motion.a>
            ))}

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
