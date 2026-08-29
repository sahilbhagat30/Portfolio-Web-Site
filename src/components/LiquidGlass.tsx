"use client";

import { useRef, useCallback, useId, ReactNode } from "react";

interface LiquidGlassProps {
  children: ReactNode;
  borderRadius?: number;
  className?: string;
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

// Embedded normal map for the distortion displacement (from react-glass-ui)
const DISTORTION_MAP =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAAAK3RFWHRDcmVhdGlvbiBUaW1lAE1vbiAxIEp1biAyMDA5IDAwOjUwOjA4ICswMTAwlMZeaQAAAAd0SU1FB9kGAQsgET14njMAAAAJcEhZcwAACxEAAAsRAX9kX5EAAAAEZ0FNQQAAsY8L/GEFAAACvUlEQVR42u3TgQkAMAzDsBb2/81ld1gi5APvzKxZde8fVAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkHGmUF/FFYhBoAAAAASUVORK5CYII=";

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
      blur: 16,
      saturation: 140,
      bgOpacity: 0.03,
      specularOpacity: 0.08,
      borderOpacity: 0.15,
      refractionOpacity: 0.08,
      ambientOpacity: 0.03,
    },
    medium: {
      blur: 30,
      saturation: 180,
      bgOpacity: 0.05,
      specularOpacity: 0.14,
      borderOpacity: 0.25,
      refractionOpacity: 0.12,
      ambientOpacity: 0.05,
    },
    high: {
      blur: 50,
      saturation: 200,
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
      {/* SVG distortion filter definition */}
      {distortion > 0 && (
        <svg
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
          aria-hidden
        >
          <clipPath id={clipId}>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              rx={borderRadius}
              ry={borderRadius}
            />
          </clipPath>
          <defs>
            <filter
              id={filterId}
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
              colorInterpolationFilters="sRGB"
            >
              <feImage
                x="0"
                y="0"
                width={fixedTextureSize ? `${fixedTextureSize}` : "100%"}
                height={fixedTextureSize ? `${fixedTextureSize}` : "100%"}
                href={DISTORTION_MAP}
                result="normalMap"
                preserveAspectRatio={fixedTextureSize ? "xMinYMin slice" : "xMidYMid slice"}
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="normalMap"
                scale={distortion}
                xChannelSelector="R"
                yChannelSelector="G"
                result="distorted"
              />
              <feComposite
                in="distorted"
                in2="SourceGraphic"
                operator="in"
              />
            </filter>
          </defs>
        </svg>
      )}

      {/* Distortion layer — blurs & warps the backdrop */}
      {distortion > 0 && (
        <div
          className="liquid-glass-distortion"
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: `${borderRadius}px`,
            clipPath: `url(#${clipId})`,
            WebkitClipPath: `url(#${clipId})`,
            filter: `url(#${filterId})`,
            backdropFilter: `blur(${effectiveBlur}px) saturate(${config.saturation}%)`,
            WebkitBackdropFilter: `blur(${effectiveBlur}px) saturate(${config.saturation}%)`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      )}

      {/* Ambient gradient — makes the glass visible even on dark backgrounds */}
      <div className="liquid-glass-ambient" aria-hidden />

      {/* Edge refraction shimmer */}
      <div className="liquid-glass-refraction" aria-hidden />

      {/* Content sits above all layers */}
      <div style={{ position: "relative", zIndex: 5 }}>
        {children}
      </div>
    </div>
  );
}
