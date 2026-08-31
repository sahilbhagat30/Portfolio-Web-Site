"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import React, { useRef, useMemo, useEffect, useState, Component, ReactNode } from "react";
import * as THREE from "three";

// --- FLUID SHADER ---
const fluidFragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  
  varying vec2 vUv;

  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

  float cnoise(vec3 P){
    vec3 Pi0 = floor(P);
    vec3 Pi1 = Pi0 + vec3(1.0);
    Pi0 = mod(Pi0, 289.0);
    Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P);
    vec3 Pf1 = Pf0 - vec3(1.0);
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 / 7.0;
    vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 / 7.0;
    vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
    return 2.2 * n_xyz;
  }

  void main() {
    // Normalize and adjust for aspect ratio
    vec2 uv = vUv;
    vec2 p = uv * 2.0 - 1.0;
    
    // Prevent divide by zero if resolution isn't set yet
    if (uResolution.y > 0.0) {
      p.x *= uResolution.x / uResolution.y;
    }

    // Slow, elegant time progression
    float t = uTime * 0.12;

    // Swirl the coordinates gently
    float swirl = cnoise(vec3(p * 0.8, t * 0.8));
    p += swirl * 0.4;

    // Multiple layers of noise for rich depth
    float noise1 = cnoise(vec3(p * 0.7 + vec2(t * 0.4, -t * 0.2), t));
    float noise2 = cnoise(vec3(p * 1.3 - vec2(-t * 0.15, t * 0.3), t * 1.2));
    float noise3 = cnoise(vec3(p * 2.2 + vec2(sin(t * 0.5), cos(t * 0.5)), t * 0.9));

    // Combine into a smooth flowing volumetric field
    float field = (noise1 + noise2 * 0.5 + noise3 * 0.25) * 0.5 + 0.5;
    field = smoothstep(0.1, 0.9, field);

    // Cinematic Portrait Palette (Deep Navy & Burning Amber)
    // Matches the stunning "Fire & Ice" lighting of the provided photo
    vec3 baseColor = vec3(0.01, 0.02, 0.06);         // Deepest shadow blue
    vec3 midColor = vec3(0.04, 0.10, 0.25);          // Rich cinematic navy
    vec3 highlightColor = vec3(0.60, 0.18, 0.05);    // Luminous burning amber/orange

    // Blend the colors smoothly
    vec3 color = mix(baseColor, midColor, field);
    
    // Add specular-like glowing highlights at the peaks
    float highlight = smoothstep(0.5, 1.0, field);
    color = mix(color, highlightColor, highlight * 0.7);

    // Subtle edge vignette for a focused, premium look
    float vignette = length(uv - 0.5);
    color = mix(color, vec3(0.0), smoothstep(0.4, 1.5, vignette));

    gl_FragColor = vec4(color, 1.0);
  }
`;

const basicVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

function FluidShader() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2() },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      materialRef.current.uniforms.uResolution.value.set(
        window.innerWidth,
        window.innerHeight
      );
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={basicVertexShader}
        fragmentShader={fluidFragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

class ShaderErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn("ShaderBackground WebGL error caught:", error);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

function isWebGLAvailable() {
  try {
    const canvas = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
  } catch (e) {
    return false;
  }
}

export default function ShaderBackground() {
  const [mounted, setMounted] = useState(false);
  const [webglEnabled, setWebglEnabled] = useState(true);

  useEffect(() => {
    setMounted(true);
    setWebglEnabled(isWebGLAvailable());

    // Catch async WebGL errors from react-three-fiber that escape the ErrorBoundary
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason && typeof event.reason.message === "string" && event.reason.message.includes("WebGLRenderer")) {
        console.warn("Caught async WebGLRenderer error, falling back to CSS background.");
        event.preventDefault();
        setWebglEnabled(false);
      }
    };
    
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () => window.removeEventListener("unhandledrejection", handleUnhandledRejection);
  }, []);

  if (!mounted || !webglEnabled) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none w-full h-full">
      <ShaderErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 1] }}
          gl={{ powerPreference: "high-performance", alpha: false, antialias: false }}
          dpr={0.5}
        >
          <FluidShader />
        </Canvas>
      </ShaderErrorBoundary>
    </div>
  );
}

