"use client";
import React, { useEffect, useRef } from "react";

interface Vector {
  x: number;
  y: number;
}

class Boid {
  x: number;
  y: number;
  vx: number;
  vy: number;
  history: Vector[];
  maxSpeed: number;
  maxForce: number;
  color: string;
  size: number;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = (Math.random() - 0.5) * 4;
    this.history = [];
    this.maxSpeed = 2 + Math.random() * 2.5; // Variations in speed
    this.maxForce = 0.04 + Math.random() * 0.04;
    this.color = color;
    this.size = 2 + Math.random() * 2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    
    this.history.push({ x: this.x, y: this.y });
    // Keep trail length proportional to speed
    if (this.history.length > 25) {
      this.history.shift();
    }
  }

  edges(width: number, height: number) {
    const margin = 100;
    const turn = 0.8;
    if (this.x < margin) this.vx += turn;
    if (this.x > width - margin) this.vx -= turn;
    if (this.y < margin) this.vy += turn;
    if (this.y > height - margin) this.vy -= turn;
  }

  flock(boids: Boid[], foods: Food[]) {
    let alignment = { x: 0, y: 0 };
    let cohesion = { x: 0, y: 0 };
    let separation = { x: 0, y: 0 };
    let total = 0;
    
    const perceptionRadius = 80;
    
    for (let other of boids) {
      let d = Math.hypot(this.x - other.x, this.y - other.y);
      if (other !== this && d < perceptionRadius) {
        alignment.x += other.vx;
        alignment.y += other.vy;
        
        cohesion.x += other.x;
        cohesion.y += other.y;
        
        // Separation is stronger closer they are
        let diff = { x: this.x - other.x, y: this.y - other.y };
        diff.x /= (d * d || 1); 
        diff.y /= (d * d || 1);
        separation.x += diff.x;
        separation.y += diff.y;
        
        total++;
      }
    }
    
    if (total > 0) {
      alignment.x /= total; alignment.y /= total;
      alignment = this.steer(alignment.x, alignment.y);
      
      cohesion.x /= total; cohesion.y /= total;
      cohesion = this.seek(cohesion.x, cohesion.y);
      
      separation.x /= total; separation.y /= total;
      separation = this.steer(separation.x, separation.y);
    }

    // Food attraction overrides flocking slightly
    let foodForce = { x: 0, y: 0 };
    let closestFood = -1;
    let recordDist = Infinity;
    
    for (let i = 0; i < foods.length; i++) {
      let d = Math.hypot(this.x - foods[i].x, this.y - foods[i].y);
      if (d < recordDist) {
        recordDist = d;
        closestFood = i;
      }
    }
    
    if (closestFood !== -1 && recordDist < 400) {
      // Seek food aggressively
      foodForce = this.seek(foods[closestFood].x, foods[closestFood].y);
      foodForce.x *= 4;
      foodForce.y *= 4;
      
      // If close enough, eat it
      if (recordDist < 20) {
        foods[closestFood].radius -= 8;
      }
    }

    this.vx += alignment.x * 1.0 + cohesion.x * 0.8 + separation.x * 1.5 + foodForce.x;
    this.vy += alignment.y * 1.0 + cohesion.y * 0.8 + separation.y * 1.5 + foodForce.y;

    // Limit speed
    let speed = Math.hypot(this.vx, this.vy);
    if (speed > this.maxSpeed) {
      this.vx = (this.vx / speed) * this.maxSpeed;
      this.vy = (this.vy / speed) * this.maxSpeed;
    }
  }

  seek(tx: number, ty: number) {
    let desired = { x: tx - this.x, y: ty - this.y };
    let d = Math.hypot(desired.x, desired.y);
    if (d === 0) return { x: 0, y: 0 };
    desired.x = (desired.x / d) * this.maxSpeed;
    desired.y = (desired.y / d) * this.maxSpeed;
    
    let steer = { x: desired.x - this.vx, y: desired.y - this.vy };
    let steerSpeed = Math.hypot(steer.x, steer.y);
    if (steerSpeed > this.maxForce) {
      steer.x = (steer.x / steerSpeed) * this.maxForce;
      steer.y = (steer.y / steerSpeed) * this.maxForce;
    }
    return steer;
  }
  
  steer(vx: number, vy: number) {
    let d = Math.hypot(vx, vy);
    if (d === 0) return { x: 0, y: 0 };
    let desiredX = (vx / d) * this.maxSpeed;
    let desiredY = (vy / d) * this.maxSpeed;
    
    let steer = { x: desiredX - this.vx, y: desiredY - this.vy };
    let steerSpeed = Math.hypot(steer.x, steer.y);
    if (steerSpeed > this.maxForce) {
      steer.x = (steer.x / steerSpeed) * this.maxForce;
      steer.y = (steer.y / steerSpeed) * this.maxForce;
    }
    return steer;
  }
}

class Food {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  life: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.maxRadius = 15;
    this.radius = 15;
    this.life = 255;
  }
  
  update() {
    this.life -= 1.5;
    return this.life > 0 && this.radius > 0;
  }
}

export default function FishPond() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = Math.min(window.innerHeight * 0.8, 600); // Responsive height
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      ctx.scale(dpr, dpr);
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);

    const colors = ["#a855f7", "#22d3ee", "#e2e8f0"]; // violet, cyan, silver
    const boids: Boid[] = [];
    for (let i = 0; i < 35; i++) {
      boids.push(new Boid(Math.random() * width, Math.random() * height, colors[Math.floor(Math.random() * colors.length)]));
    }

    let foods: Food[] = [];
    let animationFrameId: number;

    const render = () => {
      // Fade out background for trail effect (gives the neon glow trails)
      ctx.fillStyle = "rgba(8, 8, 8, 0.25)";
      ctx.fillRect(0, 0, width, height);

      // Render foods (ripples)
      for (let i = foods.length - 1; i >= 0; i--) {
        let f = foods[i];
        if (!f.update()) {
          foods.splice(i, 1);
          continue;
        }
        
        // Inner glowing orb
        ctx.beginPath();
        ctx.arc(f.x, f.y, Math.max(0, f.radius), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${f.life / 255})`;
        ctx.fill();
        
        // Expanding ripple
        ctx.beginPath();
        const rippleExpansion = (255 - f.life) * 0.4;
        ctx.arc(f.x, f.y, f.maxRadius + rippleExpansion, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${f.life / 500})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Render flock
      for (let b of boids) {
        b.flock(boids, foods);
        b.update();
        b.edges(width, height);

        // Draw flowing trail
        if (b.history.length > 1) {
          ctx.beginPath();
          ctx.moveTo(b.history[0].x, b.history[0].y);
          for (let i = 1; i < b.history.length; i++) {
            // Taper the width of the line over its history
            ctx.lineTo(b.history[i].x, b.history[i].y);
          }
          ctx.strokeStyle = b.color;
          ctx.lineWidth = b.size;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.stroke();
        }

        // Draw vivid "head"
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size + 1, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        
        // Glow effect on head
        ctx.shadowBlur = 10;
        ctx.shadowColor = b.color;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      foods.push(new Food(x, y));
      if (foods.length > 8) foods.shift(); // Max 8 active foods
    };
    canvas.addEventListener("click", handleClick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <section className="relative w-full border-t border-white/5 bg-[#080808] overflow-hidden" style={{ height: "min(80vh, 600px)" }}>
      {/* Title */}
      <div className="absolute top-10 left-6 md:left-12 pointer-events-none z-10">
        <p className="text-white/30 text-[10px] md:text-xs font-semibold tracking-widest uppercase mb-1">
          System Idle
        </p>
        <p className="text-white/60 text-xs md:text-sm">
          Click to feed the digital koi.
        </p>
      </div>
      
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full cursor-crosshair mix-blend-screen"
      />
      
      {/* Inner shadow to blend edges into the void */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(8,8,8,1)]" />
    </section>
  );
}
