"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import LiquidGlass from "./LiquidGlass";

export default function Cursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Apple 1:1 direct tracking for the dot (almost instant)
  const springConfig = { bounce: 0, duration: 0.05 };
  // The ring lags slightly for a fluid feel, but remains critically damped
  const ringConfig   = { bounce: 0, duration: 0.3 };

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
    custom:  { width: 0,  height: 0,  backgroundColor: "rgba(255,255,255,0)", opacity: 0 },
  };

  const ringVariants: Record<string, any> = {
    default: { width: 36, height: 36, borderColor: "rgba(229,231,235,0.4)", backgroundColor: "rgba(255,255,255,0.02)", backdropFilter: "blur(2px)", opacity: isVisible ? 1 : 0, scale: 1 },
    hover:   { width: 56, height: 56, borderColor: "rgba(255,255,255,0.5)", backgroundColor: "rgba(255,255,255,0.05)", backdropFilter: "blur(4px)", opacity: isVisible ? 1 : 0, scale: 1 },
    text:    { width: 40, height: 40, borderColor: "rgba(234,230,225,0.4)", backgroundColor: "rgba(255,255,255,0.02)", backdropFilter: "blur(2px)", opacity: isVisible ? 0.6 : 0, scale: 1 },
    click:   { width: 28, height: 28, borderColor: "rgba(163,163,163,0.8)", backgroundColor: "rgba(255,255,255,0.05)", backdropFilter: "blur(2px)", opacity: isVisible ? 1 : 0, scale: 0.9 },
    custom:  { width: 72, height: 72, borderColor: "rgba(255,255,255,0)", backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)", opacity: isVisible ? 1 : 0, scale: 1 },
  };

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Dot */}
      <motion.div
        style={{
          left: dotX,
          top: dotY,
          position: "fixed",
          pointerEvents: "none",
          zIndex: 9999,
          mixBlendMode: "normal",
          marginLeft: "-4px",
          marginTop: "-4px",
        }}
        animate={dotVariants[variant]}
        transition={{ type: "spring", bounce: 0, duration: 0.2 }}
        className="rounded-full shadow-sm"
      />

      {/* Ring / Custom Label */}
      <motion.div
        style={{
          left: ringX,
          top: ringY,
          position: "fixed",
          pointerEvents: "none",
          zIndex: 9998,
          marginLeft: variant === "custom" ? "-36px" : "-18px",
          marginTop: variant === "custom" ? "-36px" : "-18px",
        }}
        animate={ringVariants[variant]}
        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
        className="flex items-center justify-center rounded-full"
      >
        <LiquidGlass 
          className="absolute inset-0"
          style={{ overflow: 'visible' }} 
          borderRadius={999}
          intensity="medium" 
          distortion={100} 
          blur={2} 
          fixedTextureSize={256}
        >
          <div />
        </LiquidGlass>

        {variant === "custom" && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="text-[10px] font-semibold tracking-widest text-white uppercase relative z-10"
          >
            VIEW
          </motion.span>
        )}
      </motion.div>
    </>
  );
}
