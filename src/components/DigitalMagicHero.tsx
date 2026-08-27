"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Play, Pause } from "lucide-react";
import Script from "next/script";

// Simple Diamond Icon
const Diamond = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="inline-block mr-2 text-white/70">
    <path d="M12 2L2 12L12 22L22 12L12 2z" />
  </svg>
);

export default function DigitalMagicHero() {
  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [gestureState, setGestureState] = useState<"play" | "pause" | "none">("none");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const webcamRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const detectorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Play/Pause main video based on gesture state changes
  useEffect(() => {
    if (!videoRef.current) return;
    if (gestureState === "play") {
      videoRef.current.play().catch(() => {});
    } else if (gestureState === "pause") {
      videoRef.current.pause();
    }
  }, [gestureState]);
  
  const stopWebcam = () => {
    if (webcamRef.current && webcamRef.current.srcObject) {
      const stream = webcamRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      webcamRef.current.srcObject = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsTracking(false);
    setIsLoading(false);
    setGestureState("none");
  };

  const startTracking = async () => {
    setIsLoading(true);
    setErrorMsg("");
    
    try {
      const tf = (window as any).tf;
      const handPoseDetection = (window as any).handPoseDetection;
      
      if (!tf || !handPoseDetection) {
        throw new Error("AI models are still loading. Try again in a few seconds.");
      }

      // Setup Camera
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 320, height: 240, facingMode: "user" } 
      });
      
      if (!webcamRef.current) return;
      webcamRef.current.srcObject = stream;
      
      await new Promise((resolve) => {
        webcamRef.current!.onloadedmetadata = () => resolve(webcamRef.current!.play());
      });

      // Load Model
      await tf.setBackend("webgl");
      await tf.ready();
      
      const model = handPoseDetection.SupportedModels.MediaPipeHands;
      const detectorConfig = {
        runtime: "tfjs",
        modelType: "lite",
      };
      
      detectorRef.current = await handPoseDetection.createDetector(model, detectorConfig);
      
      setIsLoading(false);
      setIsTracking(true);
      
      renderLoop();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to access camera or load AI.");
      stopWebcam();
    }
  };

  // Utility to calculate Euclidean distance between two landmarks
  const getDistance = (p1: any, p2: any) => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };

  const renderLoop = async () => {
    if (!webcamRef.current || !canvasRef.current || !detectorRef.current) return;
    
    const video = webcamRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    try {
      const hands = await detectorRef.current.estimateHands(video, { flipHorizontal: true });
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (hands.length > 0) {
        const hand = hands[0];
        
        // Draw Skeleton
        ctx.fillStyle = "#00FFFF";
        ctx.strokeStyle = "#00FFFF";
        ctx.lineWidth = 2;
        
        hand.keypoints.forEach((keypoint: any) => {
          if (keypoint.score > 0.5) {
            ctx.beginPath();
            ctx.arc(keypoint.x, keypoint.y, 4, 0, 2 * Math.PI);
            ctx.fill();
          }
        });

        // Simple connections for visualization (Wrist to finger bases, etc)
        const connections = [
          [0,1], [1,2], [2,3], [3,4], // Thumb
          [0,5], [5,6], [6,7], [7,8], // Index
          [0,9], [9,10], [10,11], [11,12], // Middle
          [0,13], [13,14], [14,15], [15,16], // Ring
          [0,17], [17,18], [18,19], [19,20], // Pinky
          [5,9], [9,13], [13,17] // Palm bridge
        ];

        ctx.beginPath();
        connections.forEach(([i, j]) => {
          const kp1 = hand.keypoints[i];
          const kp2 = hand.keypoints[j];
          if (kp1 && kp2 && kp1.score > 0.5 && kp2.score > 0.5) {
            ctx.moveTo(kp1.x, kp1.y);
            ctx.lineTo(kp2.x, kp2.y);
          }
        });
        ctx.stroke();

        // GESTURE RECOGNITION LOGIC (Fist vs Open Hand)
        // Measure distance from wrist (0) to index tip (8) and middle tip (12)
        const wrist = hand.keypoints[0];
        const indexTip = hand.keypoints[8];
        const middleTip = hand.keypoints[12];
        const indexBase = hand.keypoints[5];
        
        if (wrist && indexTip && middleTip && indexBase) {
          // Normalize distance based on palm size (wrist to index base) to account for depth
          const palmSize = getDistance(wrist, indexBase);
          const indexDist = getDistance(wrist, indexTip);
          const middleDist = getDistance(wrist, middleTip);
          
          // If the finger tips are closer to the wrist than ~1.5x the palm size, it's a fist
          if (indexDist < palmSize * 1.5 && middleDist < palmSize * 1.5) {
            setGestureState("pause");
          } else {
            setGestureState("play");
          }
        }
      } else {
        // No hand detected
        setGestureState("none");
      }
    } catch (e) {
      // Ignore
    }

    animationRef.current = requestAnimationFrame(renderLoop);
  };

  useEffect(() => {
    return () => stopWebcam();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-[100vh] overflow-hidden bg-black text-white font-sans">
      {/* Script Injection */}
      <Script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.10.0/dist/tf.min.js" strategy="afterInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection@2.0.0/dist/hand-pose-detection.min.js" strategy="afterInteractive" />

      {/* BACKGROUND VIDEO (Right Side) */}
      <div className="absolute right-0 top-0 w-full md:w-[60%] h-full z-0 pointer-events-none">
        <video 
          ref={videoRef}
          src="/video/Animate_the_original_origami_p.mp4"
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ transform: "scaleX(-1)" }} // Mirrored horizontally
        />
        {/* Gradient fade to blend left to right */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
      </div>

      {/* TOP NAVIGATION */}
      <nav className="absolute top-0 left-0 w-full z-20 flex items-center justify-between px-8 py-6">
        <div className="text-xl font-bold tracking-tight">Sahil</div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <a href="#" className="hover:text-white transition-colors">Home</a>
          <a href="#" className="hover:text-white transition-colors">Work</a>
          <a href="#" className="hover:text-white transition-colors">About</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <button className="hidden md:block hover:text-white/80 transition-colors">See My Work</button>
          <button className="px-5 py-2 rounded-full border border-white/30 hover:bg-white hover:text-black transition-colors">Say Hello</button>
        </div>
      </nav>

      {/* LEFT COLUMN CONTENT */}
      <div className="absolute left-0 top-0 w-full md:w-[50%] h-full z-10 flex flex-col justify-center px-8 md:px-16 pt-20 pointer-events-none">
        
        <div className="flex items-center text-xs md:text-sm uppercase tracking-widest text-white/80 mb-6">
          <Diamond />
          <span>Design & Creative <span className="italic font-serif normal-case text-base">Direction</span></span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight leading-[1.1] mb-12">
          Crafting digital<br />
          experiences,<br />
          <span className="font-serif italic font-normal text-6xl md:text-8xl lg:text-[6.5rem] block mt-2 text-white/90">
            one fold at a time.
          </span>
        </h1>

        <div className="mt-8 md:mt-24 max-w-sm pointer-events-auto">
          <p className="text-white/60 text-sm leading-relaxed mb-8">
            An interactive exploration of generative motion and hand-tracked agency. Open your hand to unfold the geometry. Close your fist to pause time.
          </p>
          <button className="px-8 py-4 rounded-full bg-white text-black font-semibold text-sm hover:scale-105 transition-transform flex items-center gap-2">
            View My Work <span>&rarr;</span>
          </button>
        </div>
      </div>

      {/* FLOATING DRAGGABLE CAMERA */}
      <motion.div 
        drag 
        dragConstraints={containerRef}
        dragElastic={0.1}
        dragMomentum={false}
        className="absolute bottom-10 right-10 z-30 w-64 md:w-80 rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black/80 backdrop-blur-md cursor-grab active:cursor-grabbing flex flex-col"
        style={{ touchAction: "none" }}
      >
        {/* Floating Window Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10 pointer-events-none">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/70">
            <Camera size={14} /> AI Tracker
          </div>
          <div className="flex items-center gap-2">
            {/* Status indicator */}
            <div className={`text-xs font-bold ${gestureState === 'play' ? 'text-green-400' : gestureState === 'pause' ? 'text-red-400' : 'text-white/40'}`}>
              {gestureState === 'play' ? 'PLAYING' : gestureState === 'pause' ? 'PAUSED' : 'WAITING'}
            </div>
            {isTracking && (
              <button onClick={stopWebcam} className="text-white/40 hover:text-white p-1 pointer-events-auto">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Video Area */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          <AnimatePresence>
            {!isTracking && !isLoading && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={startTracking}
                className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors"
              >
                <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center">
                  <Play size={16} className="text-white/70 ml-1" />
                </div>
                <span className="text-xs text-white/60 font-medium">Activate Tracking</span>
              </motion.button>
            )}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-3"
              >
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span className="text-xs text-white/50">Loading AI Engine...</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Visible Webcam feed + Canvas */}
          <div className={`relative w-full h-full transition-opacity duration-500 pointer-events-none ${isTracking ? 'opacity-100' : 'opacity-0'}`}>
            <video 
              ref={webcamRef} 
              autoPlay 
              playsInline 
              muted 
              className="absolute inset-0 w-full h-full object-cover grayscale opacity-50"
              style={{ transform: "scaleX(-1)" }} 
            />
            <canvas 
              ref={canvasRef} 
              className="absolute inset-0 w-full h-full object-cover z-10"
              style={{ transform: "scaleX(-1)" }} 
            />
          </div>
        </div>
      </motion.div>

    </section>
  );
}
