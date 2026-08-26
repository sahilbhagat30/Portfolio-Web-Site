"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hand, Camera, Sparkles, X } from "lucide-react";
import Script from "next/script";

// Setup types for particles
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export default function HandMagic() {
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const detectorRef = useRef<any>(null);
  const particlesRef = useRef<Particle[]>([]);
  
  // Clean up
  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsActive(false);
    setIsLoading(false);
  };

  const startMagic = async () => {
    setIsLoading(true);
    setErrorMsg("");
    
    try {
      // Ensure scripts are loaded
      const tf = (window as any).tf;
      const handPoseDetection = (window as any).handPoseDetection;
      
      if (!tf || !handPoseDetection) {
        throw new Error("TensorFlow AI models are still loading. Please try again in a few seconds.");
      }

      // 1. Setup Camera
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480, facingMode: "user" } 
      });
      
      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;
      
      await new Promise((resolve) => {
        videoRef.current!.onloadedmetadata = () => {
          resolve(videoRef.current!.play());
        };
      });

      // 2. Load Model
      await tf.setBackend("webgl");
      await tf.ready();
      
      const model = handPoseDetection.SupportedModels.MediaPipeHands;
      const detectorConfig = {
        runtime: "tfjs",
        modelType: "lite",
      };
      
      detectorRef.current = await handPoseDetection.createDetector(model, detectorConfig);
      
      setIsLoading(false);
      setIsActive(true);
      
      // 3. Start render loop
      renderLoop();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to access camera or load model.");
      stopWebcam();
    }
  };

  const renderLoop = async () => {
    if (!videoRef.current || !canvasRef.current || !detectorRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Match canvas size to container
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    }

    try {
      // Predict hand
      const hands = await detectorRef.current.estimateHands(video, { flipHorizontal: true });
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (hands.length > 0) {
        const hand = hands[0];
        // Index finger tip is landmark 8
        const indexTip = hand.keypoints.find((k: any) => k.name === "index_finger_tip");
        
        if (indexTip) {
          const x = (indexTip.x / video.videoWidth) * canvas.width;
          const y = (indexTip.y / video.videoHeight) * canvas.height;
          
          // Emit particles
          for (let i = 0; i < 3; i++) {
            particlesRef.current.push({
              x: x,
              y: y,
              vx: (Math.random() - 0.5) * 4,
              vy: (Math.random() - 0.5) * 4 - 2, // Slight upward drift
              life: 0,
              maxLife: 40 + Math.random() * 40,
              color: `hsl(${Math.random() * 60 + 200}, 100%, 70%)`, // Cool cyan/blue glow
              size: Math.random() * 6 + 2
            });
          }
          
          // Draw a glowing orb at the finger tip
          ctx.beginPath();
          ctx.arc(x, y, 12, 0, 2 * Math.PI);
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          ctx.shadowBlur = 20;
          ctx.shadowColor = "#00FFFF";
          ctx.fill();
          ctx.shadowBlur = 0; // Reset
        }
      }
      
      // Update and draw particles
      const newParticles: Particle[] = [];
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        
        if (p.life < p.maxLife) {
          newParticles.push(p);
          
          const progress = p.life / p.maxLife;
          const alpha = 1 - progress;
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 - progress), 0, 2 * Math.PI);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha;
          ctx.fill();
        }
      }
      particlesRef.current = newParticles;
      ctx.globalAlpha = 1.0;

    } catch (e) {
      // Ignore prediction errors
    }

    animationRef.current = requestAnimationFrame(renderLoop);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  return (
    <section id="interactive" className="relative py-32 overflow-hidden bg-[var(--background)]">
      {/* Inject ML Scripts globally for this section */}
      <Script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.10.0/dist/tf.min.js" strategy="afterInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection@2.0.0/dist/hand-pose-detection.min.js" strategy="afterInteractive" />
      {/* Background Gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.1] blur-[150px]"
        style={{ background: "radial-gradient(circle, #00FFFF, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-16 relative z-10 flex flex-col md:flex-row gap-12 items-center">
        {/* Left: Content */}
        <div className="w-full md:w-1/3">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-label mb-4"
          >
            Experiment
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
            style={{ letterSpacing: "-0.02em" }}
          >
            Digital <br /> Magic
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-sm md:text-base leading-relaxed mb-8"
          >
            Using edge AI and TensorFlow, your browser can track your physical hand in real-time. Enable your camera and wave your hand to paint with light.
          </motion.p>
          
          <AnimatePresence mode="wait">
            {!isActive && !isLoading && (
              <motion.button
                key="start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={startMagic}
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-white text-black font-semibold text-sm hover:scale-105 transition-transform"
              >
                <Camera size={16} /> Enable Camera
              </motion.button>
            )}
            
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 text-white font-semibold text-sm border border-white/20"
              >
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Loading AI Model...
              </motion.div>
            )}

            {isActive && (
              <motion.button
                key="stop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={stopWebcam}
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-semibold text-sm hover:bg-red-500/30 transition-colors"
              >
                <X size={16} /> Stop Tracking
              </motion.button>
            )}
          </AnimatePresence>
          
          {errorMsg && (
            <p className="mt-4 text-red-400 text-xs font-medium">{errorMsg}</p>
          )}
        </div>

        {/* Right: Interactive Canvas Container */}
        <div className="w-full md:w-2/3 relative rounded-2xl overflow-hidden shadow-2xl bg-black/50 border border-white/10 aspect-video md:aspect-[4/3] flex items-center justify-center">
          
          {/* Hidden video element required for TFJS to read from camera */}
          <video 
            ref={videoRef} 
            className="hidden" 
            playsInline 
            muted 
          />

          {/* Render Canvas */}
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full object-cover z-20 pointer-events-none"
            style={{ transform: "scaleX(-1)" }} // Mirror horizontally to match webcam
          />

          {/* Idle State Graphic */}
          <AnimatePresence>
            {!isActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-gradient-to-tr from-black/80 to-transparent"
              >
                <div className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center bg-white/5 mb-4">
                  <Hand size={32} className="text-white/50" />
                </div>
                <p className="text-white/40 text-sm font-medium tracking-widest uppercase">Waiting for signal</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Webcam feed (faint) */}
          {isActive && (
            <video 
              autoPlay
              playsInline
              muted
              ref={(el) => {
                if (el && videoRef.current?.srcObject) {
                  el.srcObject = videoRef.current.srcObject;
                }
              }}
              className="absolute inset-0 w-full h-full object-cover opacity-20 z-0 grayscale"
              style={{ transform: "scaleX(-1)" }} 
            />
          )}
        </div>
      </div>
    </section>
  );
}
