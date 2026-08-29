"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import { useEffect } from "react";

interface ProjectData {
  number: string;
  title: string;
  description: string;
  image: string;
  logoFilter: string;
  tags: string[];
  tagColor: string;
  link: string;
  caseStudy?: {
    problem: string;
    solution: string;
    outcome: string;
  };
}

interface ProjectModalProps {
  project: ProjectData | null;
  isOpen: boolean;
  onClose: () => void;
}

const TAG_COLORS: Record<string, { border: string; bg: string; text: string }> = {
  violet: { border: "rgba(234,230,225,0.4)", bg: "rgba(234,230,225,0.08)", text: "#EAE6E1" },
  cyan:   { border: "rgba(234,230,225,0.4)", bg: "rgba(234,230,225,0.08)", text: "#EAE6E1" },
  amber:  { border: "rgba(234,230,225,0.4)", bg: "rgba(234,230,225,0.08)", text: "#EAE6E1" },
};

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const colors = TAG_COLORS[project.tagColor] ?? TAG_COLORS.violet;

  // Generate dynamic case study content if none exists
  const problem = project.caseStudy?.problem || "The organization faced significant bottlenecks due to siloed data systems, manual reporting workflows, and a lack of reliable, centralized visibility for executive leadership.";
  const solution = project.caseStudy?.solution || `I engineered a modern, automated data architecture from the ground up. By building resilient orchestration pipelines and standardizing the semantic layer, I connected disparate data sources into a single source of truth.`;
  const outcome = project.caseStudy?.outcome || project.description;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
          
          {/* Backdrop Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            onClick={onClose}
          />

            {/* Modal Sheet */}
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.4}
              onDragEnd={(e, info) => {
                if (info.offset.y > 100 || info.velocity.y > 400) onClose();
              }}
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="apple-material-thick liquid-glass relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Drag Handle */}
              <div className="w-full flex justify-center pt-4 pb-2 md:hidden absolute top-0 z-30 cursor-grab active:cursor-grabbing">
                <div className="w-12 h-1.5 rounded-full bg-white/20" />
              </div>

              {/* Close Button */}
              <motion.button
                onClick={onClose}
                whileTap={{ scale: 0.97 }}
                className="apple-active absolute top-6 right-6 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/5"
              >
                <X size={16} className="text-white/70" />
              </motion.button>

              {/* Left Side: Image / Hero */}
              <div className="w-full md:w-[45%] bg-white/5 flex flex-col items-center justify-center p-12 pt-16 md:pt-12 relative border-r border-white/5 min-h-[300px]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 opacity-60 pointer-events-none" />
                <img
                  src={project.image}
                  alt={project.title}
                  className="relative z-20 w-3/4 max-w-[200px] object-contain opacity-80 pointer-events-none"
                  style={{ filter: project.logoFilter }}
                />
              </div>

              {/* Right Side: Content */}
              <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col">
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                      style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight tracking-tight">
                  {project.title}
                </h2>
                
                <div className="w-12 h-1 bg-white/20 rounded-full mb-8" />

                <div className="space-y-8 flex-1">
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-2">The Problem</h4>
                    <p className="text-white/70 text-sm leading-relaxed">{problem}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-2">The Solution</h4>
                    <p className="text-white/70 text-sm leading-relaxed">{solution}</p>
                  </div>

                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-2">The Outcome</h4>
                    <p className="text-white/90 font-medium text-sm leading-relaxed">{outcome}</p>
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-white/10">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white group transition-colors"
                  >
                    Visit Company Site
                    <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
  );
}
