"use client";

import { useRef, useCallback, useId, ReactNode } from "react";

interface LiquidGlassProps {
  children: ReactNode;
  borderRadius?: number;
  className?: string;
  /** Classes applied to the inner content wrapper (use for flex/grid layouts) */
  contentClassName?: string;
  /** Controls the intensity of the glass effect */
  intensity?: "low" | "medium" | "high";
  /** Distortion scale (0 = none, higher = more warping). Default: 50 */
  distortion?: number;
  /** Backdrop blur in px. Default: based on intensity */
  blur?: number;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Optional fixed size in px for the distortion map to prevent crushing on small components */
  fixedTextureSize?: number;
}


/**
 * Apple-style Liquid Glass component.
 *
 * Creates a frosted glass panel with:
 * - SVG displacement map distortion (the actual "liquid" warping)
 * - Mouse-tracking specular highlight
 * - Animated prismatic (rainbow) border
 * - Frosted backdrop blur
 * - Internal ambient gradient (visible even on dark backgrounds)
 * - Edge refraction shimmer at the top
 */
export default function LiquidGlass({
  children,
  borderRadius = 20,
  className = "",
  contentClassName = "",
  intensity = "medium",
  distortion = 50,
  blur: blurOverride,
  style,
  fixedTextureSize,
}: LiquidGlassProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniqueId = useId().replace(/:/g, "");

  const intensityConfig = {
    low: {
      blur: 4,
      saturation: 110,
      bgOpacity: 0.03,
      specularOpacity: 0.08,
      borderOpacity: 0.15,
      refractionOpacity: 0.08,
      ambientOpacity: 0.03,
    },
    medium: {
      blur: 8,
      saturation: 120,
      bgOpacity: 0.05,
      specularOpacity: 0.14,
      borderOpacity: 0.25,
      refractionOpacity: 0.12,
      ambientOpacity: 0.05,
    },
    high: {
      blur: 12,
      saturation: 140,
      bgOpacity: 0.07,
      specularOpacity: 0.2,
      borderOpacity: 0.35,
      refractionOpacity: 0.18,
      ambientOpacity: 0.08,
    },
  };

  const config = intensityConfig[intensity];
  const effectiveBlur = blurOverride ?? config.blur;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--glass-x", `${x}%`);
    el.style.setProperty("--glass-y", `${y}%`);
    el.style.setProperty("--glass-opacity", "1");
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    el.style.setProperty("--glass-opacity", "0");
  }, []);

  const filterId = `lg-filter-${uniqueId}`;
  const clipId = `lg-clip-${uniqueId}`;

  return (
    <div
      ref={containerRef}
      className={`liquid-glass-panel ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        "--glass-border-radius": `${borderRadius}px`,
        "--glass-blur": `${effectiveBlur}px`,
        "--glass-saturation": `${config.saturation}%`,
        "--glass-bg-opacity": config.bgOpacity,
        "--glass-specular-opacity": config.specularOpacity,
        "--glass-border-opacity": config.borderOpacity,
        "--glass-refraction-opacity": config.refractionOpacity,
        "--glass-ambient-opacity": config.ambientOpacity,
        "--glass-x": "50%",
        "--glass-y": "50%",
        "--glass-opacity": "0",
        borderRadius: `${borderRadius}px`,
        ...style,
      } as React.CSSProperties}
    >
      <div
        className="liquid-glass-backdrop"
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: `${borderRadius}px`,
          backgroundColor: "rgba(10, 10, 15, 0.7)", /* Solid fallback for minimalism & performance */
          pointerEvents: "none",
          zIndex: 0,
          transform: "translateZ(0)",
        }}
      />

      {/* Ambient gradient — makes the glass visible even on dark backgrounds */}
      <div className="liquid-glass-ambient" aria-hidden />

      {/* Edge refraction shimmer */}
      <div className="liquid-glass-refraction" aria-hidden />

      {/* Content sits above all layers */}
      <div style={{ position: "relative", zIndex: 5 }} className={contentClassName || "h-full"}>
        {children}
      </div>
    </div>
  );
}
