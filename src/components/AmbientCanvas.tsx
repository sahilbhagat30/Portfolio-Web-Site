"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  opacityDir: number;
  color: string;
  life: number;
  maxLife: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

const COLORS = ["rgba(234,230,225,", "rgba(163,163,163,", "rgba(255,255,255,", "rgba(214,211,209,"];

export default function AmbientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: -1000, y: -1000 });
  const animRef   = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight; // Fix canvas vertical squashing
    };
    resize();
    window.addEventListener("resize", resize);

    // Pre-render glowing orbs for blazing fast drawing
    const orbCache: Record<string, HTMLCanvasElement> = {};
    COLORS.forEach(color => {
      const c = document.createElement("canvas");
      const size = 30;
      c.width = size * 2;
      c.height = size * 2;
      const cx = c.getContext("2d");
      if (cx) {
        const grad = cx.createRadialGradient(size, size, 0, size, size, size);
        grad.addColorStop(0, `${color}1)`);
        grad.addColorStop(0.4, `${color}0.8)`);
        grad.addColorStop(1, `${color}0)`);
        cx.fillStyle = grad;
        cx.fillRect(0, 0, size * 2, size * 2);
      }
      orbCache[color] = c;
    });

    const onMouse = (e: MouseEvent) => {
      // For fixed canvas, mouse Y is just clientY
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    // Init particles
    const PARTICLE_COUNT = 150;
    const particles: Particle[] = [];
    const sparks: Spark[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle(canvas.width, canvas.height));
    }

    function createParticle(w: number, h: number): Particle {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2.5 + 1.0, // Make slightly bigger
        opacity: Math.random() * 0.5 + 0.2, // Make brighter
        opacityDir: (Math.random() > 0.5 ? 1 : -1) * 0.003,
        color,
        life: 0,
        maxLife: Math.random() * 5000 + 4000,
      };
    }

    function spawnSpark() {
      if (!canvas) return;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 1;
      const w = canvas.width;
      const h = canvas.height;
      sparks.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: Math.random() * 120 + 60,
        color,
      });
    }

    let lastSpark = 0;
    let lastTime  = 0;

    const tick = (time: number) => {
      const dt = Math.min(time - lastTime, 50);
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;
      const w = canvas.width;
      const h = canvas.height;

      // Particles (Dust Motes / Fireflies)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;

        // Gentle Mouse interaction
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 250) {
          const force = (250 - dist) / 250 * 0.02;
          p.vx -= (dx / dist) * force; // slightly attract
          p.vy -= (dy / dist) * force;
        }

        // Natural drifting
        p.vx += (Math.random() - 0.5) * 0.02;
        p.vy += (Math.random() - 0.5) * 0.02;

        // Damping
        p.vx *= 0.98;
        p.vy *= 0.98;

        p.x += p.vx;
        p.y += p.vy;
        
        // Twinkling
        p.opacity += p.opacityDir;
        if (p.opacity > 0.8 || p.opacity < 0.1) p.opacityDir *= -1;

        // Wrap around viewport
        if (p.x < -50) p.x = w + 50;
        if (p.x > w + 50) p.x = -50;
        if (p.y < -50) p.y = h + 50;
        if (p.y > h + 50) p.y = -50;

        const cachedOrb = orbCache[p.color];
        if (cachedOrb) {
          ctx.globalAlpha = p.opacity;
          const drawSize = p.radius * 6;
          ctx.drawImage(cachedOrb, p.x - drawSize / 2, p.y - drawSize / 2, drawSize, drawSize);
          ctx.globalAlpha = 1.0; // reset
        }

        if (p.life > p.maxLife) {
          particles[i] = createParticle(w, h);
        }
      }

      // Sparks (Occasional magic)
      if (time - lastSpark > 1000) {
        spawnSpark();
        lastSpark = time;
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life++;
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.98;
        s.vy *= 0.98;

        const progress = s.life / s.maxLife;
        const alpha    = (1 - Math.pow(progress, 2)) * 0.8;

        const cachedOrb = orbCache[s.color];
        if (cachedOrb) {
          ctx.globalAlpha = alpha;
          ctx.drawImage(cachedOrb, s.x - 10, s.y - 10, 20, 20);
          
          // Trail
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x - s.vx * 12, s.y - s.vy * 12);
          ctx.strokeStyle = `${s.color}0.6)`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          
          ctx.globalAlpha = 1.0;
        }

        if (s.life >= s.maxLife) sparks.splice(i, 1);
      }

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.7,
      }}
      aria-hidden="true"
    />
  );
}
