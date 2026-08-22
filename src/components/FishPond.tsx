"use client";
import React, { useEffect, useRef } from "react";

const KOI_POND_CSS = `
/* ══════════ KOI POND FOOTER (standalone component) ══════════ */

.koi-footer {
  position: relative;
  width: auto;
  height: 400px;
  margin: 0;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  background: linear-gradient(
    180deg,
    #5c9c80 0%,
    #327a5f 28%,
    #164f3d 62%,
    #0a2e23 100%
  );
  /* soft 4px blur right at the pond's real (rectangular) edge — separate
     from the crisp hand-drawn border, which now sits further inward */
  -webkit-mask-image:
    linear-gradient(
      to right,
      transparent 0,
      #000 4px,
      #000 calc(100% - 4px),
      transparent 100%
    ),
    linear-gradient(
      to bottom,
      transparent 0,
      #000 4px,
      #000 calc(100% - 4px),
      transparent 100%
    );
  -webkit-mask-composite: source-in;
  mask-image:
    linear-gradient(
      to right,
      transparent 0,
      #000 4px,
      #000 calc(100% - 4px),
      transparent 100%
    ),
    linear-gradient(
      to bottom,
      transparent 0,
      #000 4px,
      #000 calc(100% - 4px),
      transparent 100%
    );
  mask-composite: intersect;
}

.koi-scene {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}

/* water texture layers */
.koi-streaks {
  opacity: 0.07;
}
.koi-grain {
  opacity: 0.024;
  mix-blend-mode: overlay;
}
.koi-glow {
  opacity: 0.9;
  filter: blur(2px);
}

/* drifting light patches — blur + a shimmering noise texture (matching the
   ripples) both live in the koiCausticNoise SVG filter now, not here */
.koi-caustic {
  opacity: 0.14;
  transform-box: fill-box;
  transform-origin: center;
  animation: koi-drift 16s ease-in-out infinite alternate;
}
.kc-2 {
  animation-delay: -5s;
  animation-duration: 20s;
}
.kc-3 {
  animation-delay: -11s;
  animation-duration: 13s;
}

@keyframes koi-drift {
  from {
    transform: translate(-35px, 6px) scale(1);
  }
  to {
    transform: translate(35px, -8px) scale(1.15);
  }
}

/* thin colour film drawn directly over the fish layer, low opacity, so the
   koi read as sitting under the water's surface instead of on top of it */
.koi-water-film {
  fill: #0f3f30;
  opacity: 0.16;
  mix-blend-mode: soft-light;
  pointer-events: none;
}

/* fish transforms are updated every frame from JS — hint the browser to
   promote them to their own compositor layer instead of repainting */
.koi {
  will-change: transform;
}

/* ── the fish ── */
.koi-shadow {
  fill: #0b2e23;
  opacity: 0.4;
  filter: blur(2px);
}

/* sped-up tail/fin flutter while a fish is at the food, so the "eating"
   moment reads as a bit of excited nibbling */
.koi-nibble .koi-tail {
  animation-duration: 0.32s !important;
}
.koi-nibble .koi-fin {
  animation-duration: 0.28s !important;
}

/* per-fish color palettes — all shades of red/orange */
.koi-1 { --koi-body: #ff4433; --koi-dark: #c22f22; }
.koi-2 { --koi-body: #e2341f; --koi-dark: #a92616; }
.koi-3 { --koi-body: #ff7a3d; --koi-dark: #c85a26; }
.koi-4 { --koi-body: #ff4d3d; --koi-dark: #c73326; }
.koi-5 { --koi-body: #f2481f; --koi-dark: #b53318; }
.koi-6 { --koi-body: #ff5a3d; --koi-dark: #c43e22; }
.koi-7 { --koi-body: #ff6b4d; --koi-dark: #d1502f; }
.koi-8 { --koi-body: #e8451c; --koi-dark: #ad3012; }
.koi-9 { --koi-body: #ff8a5c; --koi-dark: #cc6438; }
.koi-10 { --koi-body: #f0391c; --koi-dark: #b02510; }

.koi-body-fill {
  fill: var(--koi-body);
}

/* white scalloped scale outlines (half-circle arcs), clipped to the body
   outline in koi-pond.js — strokes only, no fill, so the base koi colour
   still shows through each scale */
.koi-scale-outline {
  fill: none;
  stroke: #ffffff;
  stroke-width: 0.35;
  opacity: 0.55;
  pointer-events: none;
}

/* rear (pelvic) fin pair flaps a touch quicker/tighter than the front
   pectoral pair so the two sets don't read as perfectly in sync */
.koi-fin-rear .koi-fin { animation-duration: 0.9s; }
.koi-2 .koi-fin-rear .koi-fin { animation-duration: 0.75s; }
.koi-3 .koi-fin-rear .koi-fin { animation-duration: 0.68s; }
.koi-4 .koi-fin-rear .koi-fin { animation-duration: 0.55s; }
.koi-5 .koi-fin-rear .koi-fin { animation-duration: 0.82s; }
.koi-6 .koi-fin-rear .koi-fin { animation-duration: 0.6s; }
.koi-7 .koi-fin-rear .koi-fin { animation-duration: 0.7s; }
.koi-8 .koi-fin-rear .koi-fin { animation-duration: 0.62s; }
.koi-9 .koi-fin-rear .koi-fin { animation-duration: 0.78s; }
.koi-10 .koi-fin-rear .koi-fin { animation-duration: 0.58s; }

/* tail: single sharp blade, whip-like flick (top-down fish only show
   one edge of the tail at a time, not a split fork) */
.koi-tail-fill {
  fill: var(--koi-dark);
  opacity: 0.95;
}

/* pectoral fins: a flowing 3-ray fan (see finFan() in koi-pond.js) instead
   of a single solid paddle — the whole fan flutters together as one unit */
.koi-fin-fill {
  fill: var(--koi-dark);
  opacity: 0.9;
}
.koi-fin {
  transform-box: fill-box;
  transform-origin: 100% 50%;
  animation: koi-fin-flap 1.3s ease-in-out infinite alternate;
}
.koi-2 .koi-fin { animation-duration: 1.05s; }
.koi-3 .koi-fin { animation-duration: 0.95s; }
.koi-4 .koi-fin { animation-duration: 0.8s; }
.koi-5 .koi-fin { animation-duration: 1.15s; }
.koi-6 .koi-fin { animation-duration: 0.85s; }
.koi-7 .koi-fin { animation-duration: 1s; }
.koi-8 .koi-fin { animation-duration: 0.88s; }
.koi-9 .koi-fin { animation-duration: 1.08s; }
.koi-10 .koi-fin { animation-duration: 0.92s; }

@keyframes koi-fin-flap {
  from { transform: rotate(-2deg); }
  to { transform: rotate(15deg); }
}

.koi-tail {
  transform-box: fill-box;
  transform-origin: 100% 50%;
  animation: koi-tail-wag 1.3s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
}
.koi-2 .koi-tail { animation-duration: 1.05s; }
.koi-3 .koi-tail { animation-duration: 0.95s; }
.koi-4 .koi-tail { animation-duration: 0.8s; }
.koi-5 .koi-tail { animation-duration: 1.15s; }
.koi-6 .koi-tail { animation-duration: 0.85s; }
.koi-7 .koi-tail { animation-duration: 1s; }
.koi-8 .koi-tail { animation-duration: 0.88s; }
.koi-9 .koi-tail { animation-duration: 1.08s; }
.koi-10 .koi-tail { animation-duration: 0.92s; }

@keyframes koi-tail-wag {
  0% { transform: rotate(-14deg) scaleX(0.97); }
  45% { transform: rotate(8deg) scaleX(1.03); }
  100% { transform: rotate(-14deg) scaleX(0.97); }
}

/* lily pads bobbing — moves together with the halo ripple above */
.koi-lily {
  transform-box: fill-box;
  transform-origin: center;
  animation: koi-bob 6s ease-in-out infinite alternate;
}
.lily-2 { animation-delay: -2s; }
.lily-3 { animation-delay: -4s; animation-duration: 7.5s; }
.lily-4 { animation-delay: -1s; animation-duration: 8s; }
.lotus-1 { animation-delay: -3s; animation-duration: 9s; }
.lotus-2 { animation-delay: -6s; animation-duration: 8s; }
.lotus-3 { animation-delay: -1.5s; animation-duration: 7s; }

@keyframes koi-bob {
  from { transform: translate(0, 0) rotate(0deg); }
  to { transform: translate(4px, 6px) rotate(3deg); }
}

/* ── food dropped on click ── */
.koi-food {
  opacity: 1;
  transition: opacity 0.35s ease;
}
.koi-food.koi-food-eaten {
  opacity: 0;
}
.koi-food-ripple {
  fill: none;
  stroke: #eafff2;
  stroke-width: 1;
  opacity: 0.8;
  transform-box: fill-box;
  transform-origin: center;
  animation: koi-food-ripple-anim 1.1s ease-out infinite;
}
.koi-pellet {
  fill: #d9a441;
  stroke: #8a5a1f;
  stroke-width: 0.4;
  transform-box: fill-box;
  transform-origin: center;
  animation: koi-pellet-drop 0.35s ease-out;
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.koi-pellet.koi-pellet-eaten {
  opacity: 0;
  transform: scale(0.3);
}

@keyframes koi-food-ripple-anim {
  from { transform: scale(0.3); opacity: 0.7; }
  to { transform: scale(2.4); opacity: 0; }
}

@keyframes koi-pellet-drop {
  from { opacity: 0; transform: scale(0.2) translateY(-14px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

@media (max-width: 800px) {
  .koi-footer {
    height: 320px;
    margin: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .koi-caustic, .koi-tail, .koi-fin, .koi-lily { animation: none; }
}
`;

export default function FishPond() {
  const mountRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    var SVG_NS = "http://www.w3.org/2000/svg";
    var TWO_PI = Math.PI * 2;

    var FISH_CONFIGS = [
      { cls: "koi-1", scale: 1.5, cx: 420, cy: 150, rx: 190, ry: 75, rot: 6, dur: 52000 },
      { cls: "koi-2", scale: 1.15, cx: 1080, cy: 140, rx: 170, ry: 70, rot: -5, dur: 38000 },
      { cls: "koi-3", scale: 0.9, cx: 740, cy: 290, rx: 130, ry: 55, rot: -8, dur: 30000 },
      { cls: "koi-4", scale: 0.62, cx: 200, cy: 300, rx: 100, ry: 45, rot: 4, dur: 24000 },
      { cls: "koi-5", scale: 0.72, cx: 1250, cy: 300, rx: 110, ry: 50, rot: 7, dur: 28000 },
      { cls: "koi-6", scale: 0.48, cx: 710, cy: 70, rx: 75, ry: 32, rot: -6, dur: 20000 },
      { cls: "koi-7", scale: 0.58, cx: 110, cy: 90, rx: 85, ry: 38, rot: 5, dur: 22000, desktopOnly: true },
      { cls: "koi-8", scale: 0.66, cx: 1345, cy: 55, rx: 75, ry: 32, rot: -6, dur: 23000, desktopOnly: true },
      { cls: "koi-9", scale: 0.55, cx: 480, cy: 345, rx: 95, ry: 30, rot: -4, dur: 21000, desktopOnly: true },
      { cls: "koi-10", scale: 0.6, cx: 1370, cy: 340, rx: 55, ry: 30, rot: 8, dur: 19000, desktopOnly: true },
    ];

    var isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 800px)").matches;
    if (isMobile) {
      FISH_CONFIGS = FISH_CONFIGS.filter(function (cfg) {
        return !cfg.desktopOnly;
      });
    }

    function finFan() {
      return [
        '<g class="koi-fin">',
        '<g transform="rotate(-104) scale(0.55)"><use href="#koiFinLobe" class="koi-fin-fill"/></g>',
        '<g transform="rotate(-126) scale(0.85)"><use href="#koiFinLobe" class="koi-fin-fill"/></g>',
        '<g transform="rotate(-148) scale(0.95)"><use href="#koiFinLobe" class="koi-fin-fill"/></g>',
        "</g>",
      ].join("\\n");
    }

    function koiFish(opts: any) {
      return [
        '<g class="koi ' + opts.cls + '" data-fish="' + opts.cls + '">',
        '<g transform="scale(' + opts.scale + ')">',
        '<ellipse class="koi-shadow" cx="18" cy="5" rx="26" ry="4.5"/>',
        '<g class="koi-tail"><use href="#koiTailShape" class="koi-tail-fill"/></g>',
        '<g transform="translate(35,-4.5) scale(1,-1)">',
        finFan(),
        "</g>",
        '<g transform="translate(35,4.5)">',
        finFan(),
        "</g>",
        '<g class="koi-fin-rear" transform="translate(13,-3.3) scale(0.55,-0.55)">',
        finFan(),
        "</g>",
        '<g class="koi-fin-rear" transform="translate(13,3.3) scale(0.55,0.55)">',
        finFan(),
        "</g>",
        '<use href="#koiBodyShape" class="koi-body-fill"/>',
        '<use href="#koiScales" class="koi-scale-outline" clip-path="url(#koiBodyClip)"/>',
        "</g>",
        "</g>",
      ].join("\\n");
    }

    var KOI_POND_HTML = [
      '<div class="koi-footer">',
      '<svg class="koi-scene" viewBox="0 0 1440 380" preserveAspectRatio="xMidYMid slice" aria-hidden="true">',
      "<defs>",
      '<filter id="koiNoise" x="0" y="0" width="100%" height="100%">',
      '<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="7"/>',
      '<feColorMatrix type="matrix" values="0 0 0 0 0.85  0 0 0 0 0.95  0 0 0 0 0.88  0 0 0 0.5 0"/>',
      "</filter>",
      '<filter id="koiStreaks" x="0" y="0" width="100%" height="100%">',
      '<feTurbulence type="turbulence" baseFrequency="0.004 0.045" numOctaves="2" seed="3"/>',
      '<feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0"/>',
      "</filter>",
      '<filter id="koiRough" x="-20%" y="-40%" width="140%" height="180%">',
      '<feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" seed="5" result="n"/>',
      '<feDisplacementMap in="SourceGraphic" in2="n" scale="20" xChannelSelector="R" yChannelSelector="G"/>',
      "</filter>",
      '<filter id="koiCausticNoise" x="-60%" y="-60%" width="220%" height="220%">',
      '<feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="4" result="n">',
      '<animate attributeName="baseFrequency" values="0.01;0.02;0.01" dur="11s" repeatCount="indefinite"/>',
      "</feTurbulence>",
      '<feDisplacementMap in="SourceGraphic" in2="n" scale="16" xChannelSelector="R" yChannelSelector="G"/>',
      '<feGaussianBlur stdDeviation="14"/>',
      "</filter>",
      '<path id="koiBodyShape" d="M0 -1.0 C6 -2.6 16 -4.6 26 -5.4 C34.5 -6.1 43 -4.2 45.2 -1.6 C46.3 -0.5 46.3 0.5 45.2 1.6 C43 4.2 34.5 6.1 26 5.4 C16 4.6 6 2.6 0 1.0 Z"/>',
      '<path id="koiFinLobe" d="M0 0 Q-3.5 -6 -2.8 -11.5 A2.8 2.3 0 0 1 2.8 -11.5 Q3.5 -6 0 0 Z"/>',
      '<path id="koiTailShape" d="M1.5 0 Q-5.5 -5 -11 -0.6 Q-12.5 0 -11 0.6 Q-5.5 5 1.5 0 Z"/>',
      '<clipPath id="koiBodyClip"><use href="#koiBodyShape"/></clipPath>',
      '<path id="koiScaleArc" d="M0 -2.1 A2.1 2.1 0 0 0 0 2.1"/>',
      '<g id="koiScales">',
      '<use href="#koiScaleArc" x="9" y="-3.1"/>',
      '<use href="#koiScaleArc" x="16.5" y="-3.6"/>',
      '<use href="#koiScaleArc" x="24" y="-3.9"/>',
      '<use href="#koiScaleArc" x="31.5" y="-3.6"/>',
      '<use href="#koiScaleArc" x="38.5" y="-2.8"/>',
      '<use href="#koiScaleArc" x="5" y="0"/>',
      '<use href="#koiScaleArc" x="12.5" y="0"/>',
      '<use href="#koiScaleArc" x="20" y="0"/>',
      '<use href="#koiScaleArc" x="27.5" y="0"/>',
      '<use href="#koiScaleArc" x="35" y="0"/>',
      '<use href="#koiScaleArc" x="41.5" y="0"/>',
      '<use href="#koiScaleArc" x="9" y="3.1"/>',
      '<use href="#koiScaleArc" x="16.5" y="3.6"/>',
      '<use href="#koiScaleArc" x="24" y="3.9"/>',
      '<use href="#koiScaleArc" x="31.5" y="3.6"/>',
      '<use href="#koiScaleArc" x="38.5" y="2.8"/>',
      "</g>",
      '<radialGradient id="padGrad" cx="38%" cy="35%" r="85%">',
      '<stop offset="0%" stop-color="#66b34c"/>',
      '<stop offset="100%" stop-color="#2f7a2a"/>',
      "</radialGradient>",
      '<radialGradient id="lotusGrad" cx="40%" cy="38%" r="85%">',
      '<stop offset="0%" stop-color="#4f9a3d"/>',
      '<stop offset="100%" stop-color="#1f5c1d"/>',
      "</radialGradient>",
      '<radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">',
      '<stop offset="0%" stop-color="#eafff2" stop-opacity="0.7"/>',
      '<stop offset="100%" stop-color="#eafff2" stop-opacity="0"/>',
      "</radialGradient>",
      "</defs>",
      '<g filter="url(#koiRough)">',
      '<g fill="#bfe8d2" opacity="0.3">',
      '<ellipse cx="200" cy="115" rx="90" ry="17"/>',
      '<ellipse cx="500" cy="85" rx="70" ry="14"/>',
      '<ellipse cx="850" cy="125" rx="100" ry="19"/>',
      '<ellipse cx="1150" cy="85" rx="80" ry="15"/>',
      '<ellipse cx="650" cy="165" rx="60" ry="12"/>',
      '<ellipse cx="1310" cy="160" rx="70" ry="13"/>',
      '<ellipse cx="80" cy="180" rx="65" ry="13"/>',
      '<ellipse cx="380" cy="140" rx="55" ry="11"/>',
      '<ellipse cx="730" cy="60" rx="75" ry="15"/>',
      '<ellipse cx="1000" cy="175" rx="60" ry="12"/>',
      '<ellipse cx="1250" cy="45" rx="85" ry="16"/>',
      '<ellipse cx="560" cy="45" rx="50" ry="10"/>',
      "</g>",
      '<g fill="#124a37" opacity="0.5">',
      '<ellipse cx="150" cy="315" rx="70" ry="15"/>',
      '<ellipse cx="330" cy="285" rx="55" ry="12"/>',
      '<ellipse cx="520" cy="335" rx="80" ry="17"/>',
      '<ellipse cx="700" cy="295" rx="60" ry="13"/>',
      '<ellipse cx="880" cy="330" rx="90" ry="19"/>',
      '<ellipse cx="1060" cy="285" rx="65" ry="14"/>',
      '<ellipse cx="1240" cy="325" rx="75" ry="16"/>',
      '<ellipse cx="420" cy="248" rx="45" ry="10"/>',
      '<ellipse cx="960" cy="245" rx="50" ry="10"/>',
      '<ellipse cx="1355" cy="278" rx="55" ry="11"/>',
      '<ellipse cx="240" cy="358" rx="60" ry="13"/>',
      '<ellipse cx="620" cy="262" rx="40" ry="9"/>',
      "</g>",
      '<g fill="#0a3324" opacity="0.5">',
      '<ellipse cx="450" cy="308" rx="50" ry="11"/>',
      '<ellipse cx="800" cy="350" rx="70" ry="14"/>',
      '<ellipse cx="1150" cy="358" rx="80" ry="15"/>',
      '<ellipse cx="90" cy="268" rx="40" ry="9"/>',
      "</g>",
      "</g>",
      '<ellipse class="koi-glow" cx="720" cy="170" rx="260" ry="150" fill="url(#sunGlow)"/>',
      '<ellipse cx="1340" cy="30" rx="300" ry="150" fill="url(#sunGlow)"/>',
      '<g class="koi-caustics" filter="url(#koiCausticNoise)">',
      '<ellipse class="koi-caustic kc-1" cx="300" cy="120" rx="170" ry="60" fill="#eafff2"/>',
      '<ellipse class="koi-caustic kc-2" cx="920" cy="270" rx="210" ry="70" fill="#eafff2"/>',
      '<ellipse class="koi-caustic kc-3" cx="1250" cy="110" rx="150" ry="55" fill="#eafff2"/>',
      "</g>",
      '<rect class="koi-streaks" x="0" y="0" width="1440" height="380" filter="url(#koiStreaks)"/>',
      '<rect class="koi-grain" x="0" y="0" width="1440" height="380" filter="url(#koiNoise)"/>',
      '<g class="koi-fish-layer">',
      FISH_CONFIGS.map(function (cfg) {
        return koiFish({ cls: cfg.cls, scale: cfg.scale });
      }).join("\\n"),
      "</g>",
      '<rect class="koi-water-film" x="0" y="0" width="1440" height="380"/>',
      '<g class="koi-food-layer"></g>',
      '<g transform="translate(1090,125)"><g class="koi-lily lily-1">',
      '<path d="M0 0 L38 -14 A40 40 0 1 0 38 14 Z" fill="url(#padGrad)"/>',
      '<path d="M0 0 L-33 -8 M0 0 L-28 -20 M0 0 L-15 -30 M0 0 L5 -33 M0 0 L-34 6 M0 0 L-24 24 M0 0 L-8 32 M0 0 L12 30" stroke="#245c1d" stroke-width="1.2" stroke-opacity="0.65" fill="none"/>',
      '<circle cx="-14" cy="-12" r="2.6" fill="#ffffff" opacity="0.85"/>',
      "</g></g>",
      '<g transform="translate(1160,170)"><g class="koi-lily lily-2">',
      '<path d="M0 0 L24 -9 A26 26 0 1 0 24 9 Z" fill="url(#padGrad)"/>',
      '<path d="M0 0 L-21 -6 M0 0 L-14 -16 M0 0 L-2 -21 M0 0 L-20 10 M0 0 L-7 20" stroke="#245c1d" stroke-width="1" stroke-opacity="0.65" fill="none"/>',
      "</g></g>",
      '<g transform="translate(255,150)"><g class="koi-lily lily-3">',
      '<path d="M0 0 L30 -11 A32 32 0 1 0 30 11 Z" fill="url(#padGrad)"/>',
      '<path d="M0 0 L-26 -8 M0 0 L-18 -20 M0 0 L-4 -26 M0 0 L-27 8 M0 0 L-16 22 M0 0 L0 26" stroke="#245c1d" stroke-width="1.2" stroke-opacity="0.65" fill="none"/>',
      '<circle cx="10" cy="14" r="2.2" fill="#ffffff" opacity="0.85"/>',
      "</g></g>",
      '<g transform="translate(300,115)"><g class="koi-lily lily-4">',
      '<g fill="#fffced">',
      '<ellipse rx="4.5" ry="12" transform="rotate(0)"/>',
      '<ellipse rx="4.5" ry="12" transform="rotate(45)"/>',
      '<ellipse rx="4.5" ry="12" transform="rotate(90)"/>',
      '<ellipse rx="4.5" ry="12" transform="rotate(135)"/>',
      "</g>",
      '<circle r="3.5" fill="#ff4545" opacity="0.85"/>',
      "</g></g>",
      '<g transform="translate(660,100) rotate(80)"><g class="koi-lily lotus-3">',
      '<path d="M0 0 L42 -16 A46 46 0 1 0 42 16 Z" fill="url(#lotusGrad)" stroke="#1c4a16" stroke-width="1.8" stroke-opacity="0.45"/>',
      '<path d="M0 0 L-38 -9 M0 0 L-30 -24 M0 0 L-16 -35 M0 0 L-38 8 M0 0 L-26 27 M0 0 L-10 36 M0 0 L30 -28" stroke="#1c4a16" stroke-width="1.2" stroke-opacity="0.55" fill="none"/>',
      '<circle cx="-14" cy="12" r="2.4" fill="#ffffff" opacity="0.8"/>',
      "</g></g>",
      "</svg>",
      "</div>",
    ].join("\\n");

    mountRef.current.innerHTML = KOI_POND_HTML;

    function ellipsePoint(cfg: any, theta: number) {
      var rot = (cfg.rot * Math.PI) / 180;
      var ex = cfg.rx * Math.cos(theta);
      var ey = cfg.ry * Math.sin(theta);
      var x = cfg.cx + ex * Math.cos(rot) - ey * Math.sin(rot);
      var y = cfg.cy + ex * Math.sin(rot) + ey * Math.cos(rot);
      var dex = -cfg.rx * Math.sin(theta);
      var dey = cfg.ry * Math.cos(theta);
      var dx = dex * Math.cos(rot) - dey * Math.sin(rot);
      var dy = dex * Math.sin(rot) + dey * Math.cos(rot);
      var angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      return { x: x, y: y, angle: angle };
    }

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function ellipseCircumference(rx: number, ry: number) {
      var h = Math.pow(rx - ry, 2) / Math.pow(rx + ry, 2);
      return Math.PI * (rx + ry) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
    }

    var KOI_HEAD_LEN = 46.3;
    var FOOD_SPEED_MULTIPLIER = 1.35;

    var footer = mountRef.current.querySelector(".koi-footer");
    if (!footer) return;
    var svg = footer.querySelector(".koi-scene") as any;
    var foodLayer = svg.querySelector(".koi-food-layer");

    FISH_CONFIGS.forEach(function (cfg: any) {
      cfg.el = svg.querySelector('[data-fish="' + cfg.cls + '"]');
      cfg.state = "patrol";
      cfg.theta0 = Math.PI;
      cfg.startTime = performance.now();
      cfg.speed = ellipseCircumference(cfg.rx, cfg.ry) / cfg.dur;
      cfg.headLen = KOI_HEAD_LEN * cfg.scale;
    });

    function patrolPos(cfg: any, now: number) {
      var theta = cfg.theta0 + ((now - cfg.startTime) / cfg.dur) * TWO_PI;
      return ellipsePoint(cfg, theta);
    }

    function tick(now: number) {
      FISH_CONFIGS.forEach(function (cfg: any) {
        var pos;
        if (cfg.state === "approach") {
          var t = Math.min(1, (now - cfg.phaseStart) / cfg.approachDur);
          pos = {
            x: lerp(cfg.fromX, cfg.mouthTargetX, t),
            y: lerp(cfg.fromY, cfg.mouthTargetY, t),
            angle: cfg.travelAngle,
          };
          if (t >= 1) {
            cfg.state = "eating";
            cfg.phaseStart = now;
            cfg.el.classList.add("koi-nibble");
            if (cfg.foodSession) {
              var session = cfg.foodSession;
              session.eatenCount++;
              if (session.eatenCount < session.totalFish) {
                var pellets = session.food.querySelectorAll(".koi-pellet:not(.koi-pellet-eaten)");
                for (var i = 0; i < 2 && i < pellets.length; i++) {
                  pellets[i].classList.add("koi-pellet-eaten");
                }
              } else {
                session.food.classList.add("koi-food-eaten");
                setTimeout(function () {
                  session.food.remove();
                }, 350);
              }
              cfg.foodSession = null;
            }
          }
        } else if (cfg.state === "eating") {
          var t2 = (now - cfg.phaseStart) / cfg.eatDur;
          pos = { x: cfg.mouthTargetX, y: cfg.mouthTargetY, angle: cfg.travelAngle };
          if (t2 >= 1) {
            cfg.state = "return";
            cfg.phaseStart = now;
            cfg.el.classList.remove("koi-nibble");
            var guessDur = 1500;
            for (var pass = 0; pass < 2; pass++) {
              var t0 = patrolPos(cfg, now + guessDur);
              var d0 = Math.hypot(t0.x - cfg.mouthTargetX, t0.y - cfg.mouthTargetY);
              guessDur = Math.max(300, d0 / (cfg.speed * FOOD_SPEED_MULTIPLIER));
            }
            cfg.returnDur = guessDur;
            var target = patrolPos(cfg, now + cfg.returnDur);
            cfg.retFromX = cfg.mouthTargetX;
            cfg.retFromY = cfg.mouthTargetY;
            cfg.returnX = target.x;
            cfg.returnY = target.y;
          }
        } else if (cfg.state === "return") {
          var t3 = Math.min(1, (now - cfg.phaseStart) / cfg.returnDur);
          var ddx = cfg.returnX - cfg.retFromX;
          var ddy = cfg.returnY - cfg.retFromY;
          var travelAngle = (Math.atan2(ddy, ddx) * 180) / Math.PI;
          pos = {
            x: lerp(cfg.retFromX, cfg.returnX, t3),
            y: lerp(cfg.retFromY, cfg.returnY, t3),
            angle: travelAngle,
          };
          if (t3 >= 1) cfg.state = "patrol";
        } else {
          pos = patrolPos(cfg, now);
        }
        if (cfg.el) {
          cfg.el.setAttribute(
            "transform",
            "translate(" + pos.x.toFixed(2) + "," + pos.y.toFixed(2) + ") rotate(" + pos.angle.toFixed(2) + ")"
          );
        }
      });
      rafId.current = requestAnimationFrame(tick);
    }
    
    rafId.current = requestAnimationFrame(tick);

    function dropFood(fx: number, fy: number) {
      var now = performance.now();
      var food = document.createElementNS(SVG_NS, "g");
      food.setAttribute("class", "koi-food");
      food.setAttribute("transform", "translate(" + fx.toFixed(1) + "," + fy.toFixed(1) + ")");
      food.innerHTML =
        '<circle class="koi-food-ripple" r="6"/>' +
        '<circle class="koi-pellet" cx="-3" cy="-2" r="2.1"/>' +
        '<circle class="koi-pellet" cx="3" cy="1" r="1.7"/>' +
        '<circle class="koi-pellet" cx="0" cy="3" r="1.9"/>';
      foodLayer.appendChild(food);

      var candidates = FISH_CONFIGS.filter(function (c: any) {
        return c.state === "patrol";
      });
      candidates.forEach(function (c: any) {
        var p = patrolPos(c, now);
        c._pos = p;
        c._d = Math.hypot(p.x - fx, p.y - fy);
      });
      candidates.sort(function (a: any, b: any) {
        return a._d - b._d;
      });
      var chosen = candidates.slice(0, 2);

      var foodSession = { food: food, eatenCount: 0, totalFish: chosen.length };

      chosen.forEach(function (cfg: any, idx: number) {
        cfg.fromX = cfg._pos.x;
        cfg.fromY = cfg._pos.y;
        cfg.foodX = fx + (idx === 0 ? -3 : 3);
        cfg.foodY = fy + (idx === 0 ? 2 : -2);
        cfg.travelAngle = (Math.atan2(cfg.foodY - cfg.fromY, cfg.foodX - cfg.fromX) * 180) / Math.PI;
        var angleRad = (cfg.travelAngle * Math.PI) / 180;
        cfg.mouthTargetX = cfg.foodX - cfg.headLen * Math.cos(angleRad);
        cfg.mouthTargetY = cfg.foodY - cfg.headLen * Math.sin(angleRad);
        var approachDist = Math.hypot(cfg.mouthTargetX - cfg.fromX, cfg.mouthTargetY - cfg.fromY);
        cfg.approachDur = Math.max(350, approachDist / (cfg.speed * FOOD_SPEED_MULTIPLIER));
        cfg.eatDur = 750;
        cfg.phaseStart = now;
        cfg.state = "approach";
        cfg.foodSession = foodSession;
      });

      if (chosen.length === 0) {
        setTimeout(function () {
          food.classList.add("koi-food-eaten");
          setTimeout(function () {
            food.remove();
          }, 350);
        }, 3000);
      }
    }

    const handleClick = function (e: any) {
      var pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      var loc = pt.matrixTransform(svg.getScreenCTM().inverse());
      dropFood(loc.x, loc.y);
    };
    
    footer.addEventListener("click", handleClick);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      footer.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <section className="relative w-full bg-[#080808] overflow-hidden flex justify-center items-center p-4 md:p-12">
      <style dangerouslySetInnerHTML={{ __html: KOI_POND_CSS }} />
      <div 
        className="w-full relative shadow-[0_20px_60px_rgba(0,0,0,0.8)] rounded-[20px] p-4 md:p-6"
        style={{
          backgroundColor: "#f4f1ea",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
        }}
      >
        <div ref={mountRef} className="w-full rounded-[12px] overflow-hidden" />
      </div>
    </section>
  );
}
