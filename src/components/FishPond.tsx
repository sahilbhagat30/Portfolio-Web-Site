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
    this.maxSpeed = 1.5 + Math.random() * 1.5; // Slower, more natural speed
    this.maxForce = 0.03 + Math.random() * 0.02;
    this.color = color;
    this.size = 3 + Math.random() * 3; // Slightly larger for fish bodies
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
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

    const colors = ["#FF6B00", "#FF6B00", "#EEEEEE", "#222222", "#FFB300"]; // Natural koi colors: orange, white, black, gold
    const boids: Boid[] = [];
    for (let i = 0; i < 35; i++) {
      boids.push(new Boid(Math.random() * width, Math.random() * height, colors[Math.floor(Math.random() * colors.length)]));
    }

    let foods: Food[] = [];
    let animationFrameId: number;

    const render = () => {
      // Clear with slight trail for smooth water movement, but not neon
      ctx.fillStyle = "rgba(5, 16, 20, 0.4)";
      ctx.fillRect(0, 0, width, height);

      // Render foods (water ripples / food pellets)
      for (let i = foods.length - 1; i >= 0; i--) {
        let f = foods[i];
        if (!f.update()) {
          foods.splice(i, 1);
          continue;
        }
        
        // Food pellet
        ctx.beginPath();
        ctx.arc(f.x, f.y, Math.max(0, f.radius * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210, 180, 140, ${f.life / 255})`; // tan color
        ctx.fill();
        
        // Expanding water ripple
        ctx.beginPath();
        const rippleExpansion = (255 - f.life) * 0.5;
        ctx.arc(f.x, f.y, f.maxRadius + rippleExpansion, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${f.life / 800})`; // very subtle white
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      const time = Date.now() * 0.005; // For swimming animation

      // Render flock (Koi)
      for (let b of boids) {
        b.flock(boids, foods);
        b.update();
        b.edges(width, height);

        const angle = Math.atan2(b.vy, b.vx);
        const speed = Math.hypot(b.vx, b.vy);
        
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(angle);

        // Swimming tail wiggle based on speed and time
        const wiggle = Math.sin(time + b.x * 0.1) * (speed * 1.5);
        
        // Shadow for depth
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowOffsetY = 10;
        
        ctx.fillStyle = b.color;
        
        // Draw Tail
        ctx.beginPath();
        ctx.moveTo(-b.size * 1.5, 0);
        ctx.lineTo(-b.size * 3.5, -b.size + wiggle);
        ctx.lineTo(-b.size * 3.5, b.size + wiggle);
        ctx.fill();

        // Draw Body (Ellipse)
        ctx.beginPath();
        ctx.ellipse(0, 0, b.size * 2.5, b.size * 1.2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw Fin (Left)
        ctx.beginPath();
        ctx.ellipse(-b.size * 0.5, -b.size * 1.2, b.size * 1.5, b.size * 0.5, -Math.PI / 6 + wiggle * 0.1, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw Fin (Right)
        ctx.beginPath();
        ctx.ellipse(-b.size * 0.5, b.size * 1.2, b.size * 1.5, b.size * 0.5, Math.PI / 6 + wiggle * 0.1, 0, Math.PI * 2);
        ctx.fill();

        // Reset shadow for details
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // White spots on orange/black fish to make them look like Koi
        if ((b.color === "#FF6B00" || b.color === "#222222") && b.size > 4) {
           ctx.fillStyle = "#ffffff";
           ctx.beginPath();
           ctx.ellipse(b.size * 0.8, 0, b.size * 1.2, b.size * 0.7, 0, 0, Math.PI * 2);
           ctx.fill();
        }

        ctx.restore();
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
    <section className="relative w-full border-t border-white/5 bg-[#051014] overflow-hidden" style={{ height: "min(80vh, 600px)" }}>
      {/* Title */}
      <div className="absolute top-10 left-6 md:left-12 pointer-events-none z-10">
        <p className="text-white/30 text-[10px] md:text-xs font-semibold tracking-widest uppercase mb-1">
          Koi Pond
        </p>
        <p className="text-white/60 text-xs md:text-sm">
          Click to feed the fish.
        </p>
      </div>
      
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full cursor-crosshair"
      />
      
      {/* Inner shadow to blend edges into the void */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(5,16,20,1)]" />
    </section>
  );
}
