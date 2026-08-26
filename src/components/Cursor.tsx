"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function Cursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const ringConfig   = { damping: 20, stiffness: 150, mass: 0.8 };

  const dotX  = useSpring(cursorX, springConfig);
  const dotY  = useSpring(cursorY, springConfig);
  const ringX = useSpring(cursorX, ringConfig);
  const ringY = useSpring(cursorY, ringConfig);

  const [variant, setVariant] = useState<"default" | "hover" | "text" | "click" | "custom">("default");
  const [customText, setCustomText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Hide on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const move = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
        setIsVisible(true);
      });
    };

    const enter = () => setIsVisible(true);
    const leave = () => setIsVisible(false);

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check for custom text attribute first
      const customCursorEl = target.closest("[data-cursor]");
      if (customCursorEl) {
        const text = customCursorEl.getAttribute("data-cursor");
        if (text && text !== "hover") {
          setCustomText(text);
          setVariant("custom");
          return;
        }
      }

      const isLink   = target.closest("a, button, [role='button'], [data-cursor='hover']");
      const isText   = target.closest("p, h1, h2, h3, h4, span");
      const isCanvas = target.closest("canvas");

      if (isCanvas) { setVariant("default"); return; }
      if (isLink)   { setVariant("hover");   return; }
      if (isText)   { setVariant("text");    return; }
      setVariant("default");
    };

    const down = () => setVariant("click");
    const up   = () => setVariant("default");

    window.addEventListener("mousemove", move,       { passive: true });
    window.addEventListener("mousemove", handleHover, { passive: true });
    window.addEventListener("mouseenter", enter);
    window.addEventListener("mouseleave", leave);
    window.addEventListener("mousedown",  down);
    window.addEventListener("mouseup",    up);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousemove", handleHover);
      window.removeEventListener("mouseenter", enter);
      window.removeEventListener("mouseleave", leave);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup",   up);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [cursorX, cursorY]);

  const dotVariants: Record<string, any> = {
    default: { width: 8,  height: 8,  backgroundColor: "#e5e7eb", opacity: 1 },
    hover:   { width: 12, height: 12, backgroundColor: "#ffffff", opacity: 1 },
    text:    { width: 4,  height: 24, backgroundColor: "#e5e7eb", borderRadius: "2px", opacity: 0.8 },
    click:   { width: 6,  height: 6,  backgroundColor: "#a3a3a3", opacity: 1 },
    custom:  { width: 0,  height: 0,  backgroundColor: "transparent", opacity: 0 },
  };

  const ringVariants: Record<string, any> = {
    default: { width: 36, height: 36, borderColor: "rgba(229,231,235,0.4)", backgroundColor: "transparent", opacity: isVisible ? 1 : 0, scale: 1 },
    hover:   { width: 56, height: 56, borderColor: "rgba(255,255,255,0.5)", backgroundColor: "transparent", opacity: isVisible ? 1 : 0, scale: 1 },
    text:    { width: 40, height: 40, borderColor: "rgba(234,230,225,0.4)", backgroundColor: "transparent", opacity: isVisible ? 0.6 : 0, scale: 1 },
    click:   { width: 28, height: 28, borderColor: "rgba(163,163,163,0.8)", backgroundColor: "transparent", opacity: isVisible ? 1 : 0, scale: 0.9 },
    custom:  { width: 72, height: 72, borderColor: "transparent", backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)", opacity: isVisible ? 1 : 0, scale: 1 },
  };

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Dot */}
      <motion.div
        style={{
          x: dotX,
          y: dotY,
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 9999,
          mixBlendMode: "normal",
        }}
      >
        <motion.div
          animate={dotVariants[variant]}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{
            borderRadius: variant === "text" ? "2px" : "50%",
            x: "-50%",
            y: "-50%",
          }}
        />
      </motion.div>

      {/* Ring / Custom Label */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 9998,
        }}
      >
        <motion.div
          animate={ringVariants[variant]}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{
            borderRadius: "50%",
            border: variant === "custom" ? "none" : "1.5px solid rgba(234,230,225,0.5)",
            x: "-50%",
            y: "-50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {variant === "custom" && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="text-[10px] font-bold text-white uppercase tracking-wider"
            >
              {customText}
            </motion.span>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
