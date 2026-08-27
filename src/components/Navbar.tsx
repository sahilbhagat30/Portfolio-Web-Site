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
    clipPath: "circle(0% at 100% 0%)",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
  },
  open: {
    clipPath: "circle(150% at 100% 0%)",
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
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ease-out ${
          scrolled && !menuOpen
            ? "apple-material-thick liquid-glass border-b border-white/5 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
          
          {/* Logo / Brand (Optional, but keeps flex-between balanced) */}
          <div className="flex-1">
            <a href="#" className="text-xl font-bold tracking-tight text-white/80 hover:text-white transition-colors">
              SB.
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center justify-center gap-8 flex-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNav(e, link.href)}
                className={`text-sm font-semibold tracking-wide uppercase transition-colors duration-300 ${
                  activeLink === link.href ? "text-white" : "text-white/40 hover:text-white/80"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex-1 flex justify-end">
            {/* Mobile Hamburger Button */}
            <button
              aria-label="Toggle menu"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col items-center justify-center gap-1.5 w-12 h-12 relative group rounded-full bg-white/5 border border-white/10"
            >
              <span className={`block w-5 h-0.5 bg-white transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${menuOpen ? "rotate-45 translate-y-2 absolute" : ""}`} />
              <span className={`block w-5 h-0.5 bg-white transition-opacity duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-white transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${menuOpen ? "-rotate-45 absolute" : ""}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Full Screen Menu (Mobile Only) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 z-[90] apple-material-thick liquid-glass flex flex-col justify-center border-none rounded-none md:hidden"
          >
            <div className="absolute inset-0 noise-overlay opacity-30 pointer-events-none" />
            
            <div className="max-w-7xl mx-auto px-6 w-full">
              <motion.ul 
                variants={linkContainerVariants}
                className="flex flex-col gap-6"
              >
                {NAV_LINKS.map((link) => (
                  <li key={link.href} className="overflow-hidden">
                    <motion.a
                      variants={linkVariants}
                      href={link.href}
                      onClick={(e) => handleNav(e, link.href)}
                      className={`inline-block text-5xl font-black tracking-tighter uppercase transition-colors duration-300 hover:text-white ${
                        activeLink === link.href ? "text-white" : "text-white/40"
                      }`}
                      style={{
                        backgroundImage: activeLink === link.href ? "var(--gradient-hero)" : "none",
                        WebkitBackgroundClip: activeLink === link.href ? "text" : "border-box",
                        WebkitTextFillColor: activeLink === link.href ? "transparent" : "inherit",
                      }}
                    >
                      {link.label}
                    </motion.a>
                  </li>
                ))}
              </motion.ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
