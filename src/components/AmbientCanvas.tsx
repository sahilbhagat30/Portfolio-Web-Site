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

const COLORS = ["rgba(168,85,247,", "rgba(34,211,238,", "rgba(99,102,241,", "rgba(192,132,252,"];

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
      canvas.height = document.documentElement.scrollHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY + window.scrollY };
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    // Init particles
    const PARTICLE_COUNT = 60;
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
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.15 + 0.02,
        opacityDir: (Math.random() > 0.5 ? 1 : -1) * 0.002,
        color,
        life: 0,
        maxLife: Math.random() * 4000 + 3000,
      };
    }

    function spawnSpark() {
      if (!canvas) return;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.5 + 0.5;
      const w = canvas.width;
      const h = canvas.height;
      sparks.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: Math.random() * 80 + 40,
        color,
      });
    }

    let lastSpark = 0;
    let lastTime  = 0;

    const tick = (time: number) => {
      const dt = Math.min(time - lastTime, 50);
      lastTime = time;

      // Only draw on visible portion (performance)
      const scrollTop = window.scrollY;
      const viewH     = window.innerHeight;

      ctx.clearRect(0, scrollTop, canvas.width, viewH);

      const mouse = mouseRef.current;

      // Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;

        // Mouse repulsion — very gentle
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const force = (200 - dist) / 200 * 0.015;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Damping
        p.vx *= 0.99;
        p.vy *= 0.99;

        p.x += p.vx;
        p.y += p.vy;
        p.opacity += p.opacityDir;
        if (p.opacity > 0.18 || p.opacity < 0.01) p.opacityDir *= -1;

        // Wrap
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < scrollTop - 100) p.y = scrollTop + viewH + 100;
        if (p.y > scrollTop + viewH + 100) p.y = scrollTop - 100;

        // Only draw if in view
        if (p.y > scrollTop - 50 && p.y < scrollTop + viewH + 50) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${p.opacity})`;
          ctx.fill();
        }

        if (p.life > p.maxLife) {
          particles[i] = createParticle(canvas.width, canvas.height);
          particles[i].y = scrollTop + Math.random() * viewH;
        }
      }

      // Sparks
      if (time - lastSpark > 2000) {
        spawnSpark();
        lastSpark = time;
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life++;
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.97;
        s.vy *= 0.97;

        const progress = s.life / s.maxLife;
        const alpha    = (1 - progress) * 0.25;

        if (s.y > scrollTop - 10 && s.y < scrollTop + viewH + 10) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `${s.color}${alpha})`;
          ctx.fill();

          // Trail
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x - s.vx * 8, s.y - s.vy * 8);
          ctx.strokeStyle = `${s.color}${alpha * 0.5})`;
          ctx.lineWidth = 1;
          ctx.stroke();
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
