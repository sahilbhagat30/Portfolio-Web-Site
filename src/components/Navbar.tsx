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
    transition: { duration: 0.4, ease: "easeOut" }
  },
  open: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
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
            scrolled && !menuOpen ? "apple-material-thick shadow-lg border border-white/10" : "hover:bg-white/10"
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
            className="absolute inset-0 z-[90] pointer-events-auto flex flex-col justify-between border-none rounded-none"
            style={{ 
              background: "rgba(3, 5, 15, 0.75)",
              backdropFilter: "blur(32px) saturate(150%)",
              WebkitBackdropFilter: "blur(32px) saturate(150%)"
            }}
          >
            <div className="absolute inset-0 noise-overlay opacity-40 pointer-events-none -z-10" />
            
            <div className="flex-1 flex flex-col justify-center max-w-7xl mx-auto px-6 md:px-20 w-full relative z-10 pt-20">
              <motion.ul 
                variants={linkContainerVariants}
                className="flex flex-col gap-2 md:gap-4 group"
              >
                {NAV_LINKS.map((link, index) => (
                  <li key={link.href} className="overflow-hidden py-2">
                    <motion.a
                      variants={linkVariants}
                      href={link.href}
                      onClick={(e) => handleNav(e, link.href)}
                      className="flex items-baseline gap-6 md:gap-10 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] opacity-100 group-hover:opacity-30 hover:!opacity-100 hover:translate-x-4 md:hover:translate-x-8 group-hover:blur-[2px] hover:!blur-none"
                      data-cursor="hover"
                    >
                      <span className="text-sm md:text-base font-medium tracking-widest text-neutral-500 font-mono">
                        {(index + 1).toString().padStart(2, '0')}
                      </span>
                      <span 
                        className="block text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.9] transition-colors duration-500 hover:text-transparent"
                        style={{
                          backgroundImage: "var(--gradient-hero)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "inherit", // Override until hover
                        }}
                      >
                        {link.label}
                      </span>
                    </motion.a>
                  </li>
                ))}
              </motion.ul>
            </div>

            {/* Menu Footer */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
              className="max-w-7xl mx-auto px-6 md:px-20 w-full pb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-xs font-mono tracking-widest text-neutral-500 uppercase"
            >
              <div className="flex gap-6">
                <a href="https://linkedin.com/in/sahil-bhagat" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" data-cursor="hover">LinkedIn</a>
                <a href="https://github.com/sahilbhagat30" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" data-cursor="hover">GitHub</a>
                <a href="mailto:sahil.bhagat@nyu.edu" className="hover:text-white transition-colors" data-cursor="hover">Email</a>
              </div>
              <p>&copy; {new Date().getFullYear()} Sahil Bhagat. All rights reserved.</p>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
