"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

const NAV_LINKS = [
  { label: "About",       href: "#about" },
  { label: "Experience",  href: "#work" },
  { label: "Projects",    href: "#projects" },
  { label: "Life out of Office", href: "#photography" },
  { label: "Contact",     href: "#contact" },
];

const menuVariants: Variants = {
  closed: {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
  },
  open: {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
  }
};

const linkContainerVariants: Variants = {
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 }
  },
  open: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const linkVariants: Variants = {
  closed: { y: "100%", opacity: 0, rotate: 5, transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] } },
  open: { y: "0%", opacity: 1, rotate: 0, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => l.href.replace("#", ""));
    const observers: IntersectionObserver[] = [];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveLink(`#${id}`); },
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
    setTimeout(() => {
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }, 800); // Wait for menu to close before scrolling
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[100] transition-colors duration-500 ease-out ${
          scrolled && !menuOpen ? "bg-[var(--background)]/80 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-end">
          {/* Hamburger Button */}
          <button
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col gap-1.5 p-4 z-[110] relative group hover:opacity-80 transition-opacity"
            data-cursor="hover"
          >
            <span className={`block w-8 h-0.5 bg-white transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-opacity duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-8 h-0.5 bg-white transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Full Screen Menu */}
      <motion.div
        initial="closed"
        animate={menuOpen ? "open" : "closed"}
        variants={menuVariants}
        className="fixed inset-0 z-[90] apple-material-thick liquid-glass flex flex-col justify-center border-none rounded-none"
      >
        <div className="absolute inset-0 noise-overlay opacity-30 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-20 w-full">
          <motion.ul 
            variants={linkContainerVariants}
            className="flex flex-col gap-4 md:gap-6"
          >
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="overflow-hidden">
                <motion.a
                  variants={linkVariants}
                  href={link.href}
                  onClick={(e) => handleNav(e, link.href)}
                  className={`inline-block text-5xl md:text-8xl font-black tracking-tighter uppercase transition-colors duration-300 hover:text-white ${
                    activeLink === link.href ? "text-white" : "text-white/40"
                  }`}
                  style={{
                    backgroundImage: activeLink === link.href ? "var(--gradient-hero)" : "none",
                    WebkitBackgroundClip: activeLink === link.href ? "text" : "border-box",
                    WebkitTextFillColor: activeLink === link.href ? "transparent" : "inherit",
                  }}
                  data-cursor="View"
                >
                  {link.label}
                </motion.a>
              </li>
            ))}
          </motion.ul>
        </div>
      </motion.div>
    </>
  );
}
