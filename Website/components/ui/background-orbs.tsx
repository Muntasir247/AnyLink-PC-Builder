"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function BackgroundOrbs() {
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Smooth mouse coordinates with spring dampening
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);

  const springX = useSpring(mouseX, { damping: 30, stiffness: 120 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 120 });

  useEffect(() => {
    setMounted(true);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 175);
      mouseY.set(e.clientY - 175);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* Interactive Cursor Spotlight Orb */}
      {mounted && !reducedMotion && (
        <motion.div
          style={{ x: springX, y: springY }}
          className="absolute h-[350px] w-[350px] rounded-full bg-white opacity-[calc(var(--orb-opacity)*0.9)] blur-[100px] pointer-events-none transform-gpu"
        />
      )}

      {/* Floating Ambient Orb 1 (Top Left) */}
      <motion.div
        animate={
          reducedMotion
            ? undefined
            : {
                x: [-30, 40, -20, -30],
                y: [-20, 30, -10, -20],
                scale: [1, 1.08, 0.95, 1],
              }
        }
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-40 left-1/4 h-[550px] w-[550px] rounded-full bg-white opacity-[var(--orb-opacity)] blur-[140px] transform-gpu transition-opacity duration-700"
      />

      {/* Floating Ambient Orb 2 (Center Right) */}
      <motion.div
        animate={
          reducedMotion
            ? undefined
            : {
                x: [25, -35, 15, 25],
                y: [30, -25, 20, 30],
                scale: [1, 0.94, 1.06, 1],
              }
        }
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 right-10 h-[500px] w-[500px] rounded-full bg-white opacity-[var(--orb-opacity)] blur-[150px] transform-gpu transition-opacity duration-700"
      />

      {/* Floating Ambient Orb 3 (Bottom Center) */}
      <motion.div
        animate={
          reducedMotion
            ? undefined
            : {
                x: [-20, 25, -35, -20],
                y: [15, -30, 20, 15],
                scale: [0.95, 1.05, 1, 0.95],
              }
        }
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-10 left-1/3 h-[450px] w-[450px] rounded-full bg-white opacity-[var(--orb-opacity)] blur-[130px] transform-gpu transition-opacity duration-700"
      />
    </div>
  );
}
