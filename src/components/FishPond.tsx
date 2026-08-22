"use client";
import React, { useEffect, useRef } from "react";

interface Vector {
  x: number;
  y: number;
}

class LilyPad {
  x: number;
  y: number;
  r: number;
  angle: number;
  hasFlower: boolean;
  flowerAngle: number;

  constructor(x: number, y: number, r: number) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.angle = Math.random() * Math.PI * 2;
    this.hasFlower = Math.random() > 0.6; // 40% chance of a flower
    this.flowerAngle = Math.random() * Math.PI * 2;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Drop shadow
    ctx.shadowColor = "rgba(0, 40, 30, 0.5)";
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 10;

    // Main pad
    ctx.beginPath();
    ctx.arc(0, 0, this.r, 0.3, Math.PI * 2 - 0.3);
    ctx.lineTo(0, 0);
    ctx.fillStyle = "#4a8542";
    ctx.fill();

    // Turn off shadow for details
    ctx.shadowColor = "transparent";
    
    // Veins
    ctx.strokeStyle = "#3a6a33";
    ctx.lineWidth = 1.5;
    for (let i = 1; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      const a = 0.3 + i * ((Math.PI * 2 - 0.6) / 8);
      ctx.lineTo(Math.cos(a) * this.r * 0.85, Math.sin(a) * this.r * 0.85);
      ctx.stroke();
    }
    
    // Center dot
    ctx.beginPath();
    ctx.arc(0, 0, 2, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    // Draw Lotus Flower
    if (this.hasFlower) {
      ctx.save();
      // Position flower near the edge of the pad
      ctx.translate(-this.r * 0.4, -this.r * 0.4);
      ctx.rotate(this.flowerAngle);
      
      // Petals
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 8; i++) {
        ctx.rotate((Math.PI * 2) / 8);
        ctx.beginPath();
        ctx.ellipse(this.r * 0.25, 0, this.r * 0.3, this.r * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Flower center
      ctx.beginPath();
      ctx.arc(0, 0, this.r * 0.1, 0, Math.PI * 2);
      ctx.fillStyle = "#F94C2B"; // Orange center
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }
}

class Cloud {
  x: number;
  y: number;
  w: number;
  h: number;
  speedX: number;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.w = 150 + Math.random() * 250;
    this.h = 40 + Math.random() * 60;
    this.speedX = (Math.random() - 0.5) * 0.3;
  }
  
  draw(ctx: CanvasRenderingContext2D, width: number) {
    this.x += this.speedX;
    if (this.x > width + this.w) this.x = -this.w;
    if (this.x < -this.w) this.x = width + this.w;
    
    ctx.fillStyle = "rgba(60, 130, 110, 0.15)"; // Soft underwater teal/green
    ctx.beginPath();
    ctx.roundRect(this.x - this.w/2, this.y - this.h/2, this.w, this.h, this.h/2);
    ctx.fill();
  }
}

class Boid {
  x: number;
  y: number;
  vx: number;
  vy: number;
  maxSpeed: number;
  maxForce: number;
  size: number;
  seed: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = (Math.random() - 0.5) * 4;
    this.maxSpeed = 1.2 + Math.random() * 1.5;
    this.maxForce = 0.03 + Math.random() * 0.02;
    this.size = 3 + Math.random() * 5; 
    this.seed = Math.random() * 1000;
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
    
    const perceptionRadius = 90;
    
    for (let other of boids) {
      let d = Math.hypot(this.x - other.x, this.y - other.y);
      if (other !== this && d < perceptionRadius) {
        alignment.x += other.vx;
        alignment.y += other.vy;
        cohesion.x += other.x;
        cohesion.y += other.y;
        
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
      foodForce = this.seek(foods[closestFood].x, foods[closestFood].y);
      foodForce.x *= 4;
      foodForce.y *= 4;
      if (recordDist < 20) {
        foods[closestFood].radius -= 8;
      }
    }

    this.vx += alignment.x * 1.0 + cohesion.x * 0.8 + separation.x * 1.8 + foodForce.x;
    this.vy += alignment.y * 1.0 + cohesion.y * 0.8 + separation.y * 1.8 + foodForce.y;

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

  draw(ctx: CanvasRenderingContext2D, time: number) {
    const angle = Math.atan2(this.vy, this.vx);
    const speed = Math.hypot(this.vx, this.vy);
    
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(angle);

    const wiggle = Math.sin(time * 0.005 + this.seed) * (speed * 1.5);
    const fishColor = "#F94C2B"; // Vibrant orange vector style
    
    // Drop shadow
    ctx.shadowColor = "rgba(0, 30, 20, 0.4)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 15;

    ctx.fillStyle = fishColor;

    // Tail (sharp triangle)
    ctx.beginPath();
    ctx.moveTo(-this.size * 1.5, 0);
    ctx.lineTo(-this.size * 4, -this.size * 1.2 + wiggle);
    ctx.lineTo(-this.size * 3.5, wiggle);
    ctx.lineTo(-this.size * 4, this.size * 1.2 + wiggle);
    ctx.fill();

    // Body (Ellipse)
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size * 2.5, this.size * 1.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Fins (sharp triangles)
    ctx.beginPath();
    ctx.moveTo(0, -this.size);
    ctx.lineTo(-this.size * 1.5, -this.size * 2.5 + wiggle * 0.5);
    ctx.lineTo(-this.size, -this.size);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, this.size);
    ctx.lineTo(-this.size * 1.5, this.size * 2.5 + wiggle * 0.5);
    ctx.lineTo(-this.size, this.size);
    ctx.fill();

    // Turn off shadow for details
    ctx.shadowColor = "transparent";

    // Eyes
    ctx.fillStyle = "#111111";
    ctx.beginPath();
    ctx.arc(this.size * 1.5, -this.size * 0.55, this.size * 0.2, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.size * 1.5, this.size * 0.55, this.size * 0.2, 0, Math.PI*2);
    ctx.fill();

    // Back scale pattern on larger fish
    if (this.size > 4) {
      ctx.strokeStyle = "rgba(200, 40, 20, 0.5)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(this.size * 0.5, 0, this.size * 0.8, -Math.PI/3, Math.PI/3);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(this.size * 1.2, 0, this.size * 0.6, -Math.PI/3, Math.PI/3);
      ctx.stroke();
    }

    ctx.restore();
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
    let lilyPads: LilyPad[] = [];
    let clouds: Cloud[] = [];

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      // We are wrapped in a container that might have padding, so we get parent width
      const parent = canvas.parentElement;
      width = parent ? parent.clientWidth : window.innerWidth;
      height = Math.min(window.innerHeight * 0.6, 500); // slightly shorter for framing
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      ctx.scale(dpr, dpr);

      // Regenerate static scenery
      lilyPads = [];
      const numPads = Math.floor(width / 150);
      for (let i = 0; i < numPads; i++) {
        lilyPads.push(new LilyPad(
          Math.random() * width,
          Math.random() * height,
          25 + Math.random() * 35
        ));
      }

      clouds = [];
      for (let i = 0; i < 8; i++) {
        clouds.push(new Cloud(width, height));
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);

    const boids: Boid[] = [];
    for (let i = 0; i < 18; i++) {
      boids.push(new Boid(Math.random() * width, Math.random() * height));
    }

    let foods: Food[] = [];
    let animationFrameId: number;

    const render = () => {
      // Clear canvas entirely
      ctx.clearRect(0, 0, width, height);

      // Render drifting underwater clouds
      for (let cloud of clouds) {
        cloud.draw(ctx, width);
      }

      // Render static lily pads
      for (let pad of lilyPads) {
        pad.draw(ctx);
      }

      // Render foods (ripples)
      for (let i = foods.length - 1; i >= 0; i--) {
        let f = foods[i];
        if (!f.update()) {
          foods.splice(i, 1);
          continue;
        }
        
        ctx.beginPath();
        ctx.arc(f.x, f.y, Math.max(0, f.radius * 0.3), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${f.life / 255})`;
        ctx.fill();
        
        ctx.beginPath();
        const rippleExpansion = (255 - f.life) * 0.5;
        ctx.arc(f.x, f.y, f.maxRadius + rippleExpansion, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${f.life / 600})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      const time = Date.now();

      // Render flock (Koi)
      for (let b of boids) {
        b.flock(boids, foods);
        b.update();
        b.edges(width, height);
        b.draw(ctx, time);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      foods.push(new Food(x, y));
      if (foods.length > 8) foods.shift();
    };
    canvas.addEventListener("click", handleClick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <section className="relative w-full bg-[#080808] overflow-hidden flex justify-center items-center p-4 md:p-12">
      {/* 
        The "Art Frame": A textured cream paper background.
        We use an inline SVG data URI to generate a soft noise texture.
      */}
      <div 
        className="w-full relative shadow-[0_20px_60px_rgba(0,0,0,0.8)] rounded-[20px] p-4 md:p-6"
        style={{
          backgroundColor: "#f4f1ea",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
        }}
      >
        {/* The Painting Canvas */}
        <div 
          className="relative w-full rounded-[12px] overflow-hidden shadow-[inset_0_4px_20px_rgba(0,0,0,0.4)]"
          style={{ 
            background: "radial-gradient(ellipse at center, #358071 0%, #1f574d 100%)"
          }}
        >
          <div className="absolute top-6 left-6 pointer-events-none z-10">
            <p className="text-white/50 text-[10px] md:text-xs font-semibold tracking-widest uppercase mb-1 drop-shadow-md">
              Koi Pond
            </p>
            <p className="text-white/80 text-xs md:text-sm drop-shadow-md">
              Click to feed the fish.
            </p>
          </div>
          
          <canvas 
            ref={canvasRef} 
            className="block w-full h-full cursor-crosshair"
          />
        </div>
      </div>
    </section>
  );
}
