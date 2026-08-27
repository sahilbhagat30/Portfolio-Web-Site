"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { X } from "lucide-react";

const NAV_LINKS = [
  { label: "About",       href: "#about" },
  { label: "Experience",  href: "#work" },
  { label: "Projects",    href: "#projects" },
  { label: "Life out of Office", href: "#photography" },
  { label: "Contact",     href: "#contact" },
];

const menuVariants: Variants = {
  closed: {
    opacity: 0,
    scale: 0.9,
    transformOrigin: "top right",
    transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] }
  },
  open: {
    opacity: 1,
    scale: 1,
    transformOrigin: "top right",
    transition: { type: "spring", bounce: 0, duration: 0.5 }
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
    <nav className="fixed inset-0 z-[100] pointer-events-none">
      {/* Hamburger Button Container */}
      <div className="absolute top-0 right-0 p-6 md:p-8 lg:p-10">
        <button
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(!menuOpen)}
          className={`pointer-events-auto flex flex-col items-center justify-center gap-1.5 w-14 h-14 z-[110] relative group transition-all duration-500 ease-out rounded-full ${
            scrolled && !menuOpen ? "apple-material-thick liquid-glass shadow-lg border border-white/10" : "hover:bg-white/10"
          }`}
          data-cursor="hover"
        >
          <span className={`block w-6 h-0.5 bg-white transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${menuOpen ? "rotate-45 translate-y-2 absolute" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-opacity duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${menuOpen ? "-rotate-45 absolute" : ""}`} />
        </button>
      </div>

      {/* Popover Menu Container */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="absolute top-24 right-6 md:right-8 lg:right-10 w-64 p-6 z-[90] pointer-events-auto apple-material-thick liquid-glass rounded-3xl border border-white/10 shadow-2xl origin-top-right flex flex-col"
          >
            <motion.ul 
              variants={linkContainerVariants}
              className="flex flex-col gap-4"
            >
              {NAV_LINKS.map((link) => (
                <li key={link.href} className="overflow-hidden">
                  <motion.a
                    variants={linkVariants}
                    href={link.href}
                    onClick={(e) => handleNav(e, link.href)}
                    className={`inline-block text-xl font-bold tracking-tight uppercase transition-all duration-300 hover:translate-x-2 ${
                      activeLink === link.href ? "text-white" : "text-white/50 hover:text-white/90"
                    }`}
                    style={{
                      backgroundImage: activeLink === link.href ? "var(--gradient-hero)" : "none",
                      WebkitBackgroundClip: activeLink === link.href ? "text" : "border-box",
                      WebkitTextFillColor: activeLink === link.href ? "transparent" : "inherit",
                    }}
                    data-cursor="hover"
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
