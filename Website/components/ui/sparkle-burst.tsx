"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  character: string;
}

const CHARACTERS = ["✦", "✧", "•", "✕", "⬡"];

export function SparkleBurst({ trigger }: { trigger: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger === 0) return;

    const newParticles: Particle[] = Array.from({ length: 14 }).map((_, i) => {
      const angle = (i / 14) * 2 * Math.PI + (Math.random() - 0.5) * 0.4;
      const distance = 40 + Math.random() * 80;
      return {
        id: Date.now() + i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        size: 10 + Math.random() * 12,
        rotation: Math.random() * 360,
        character: CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)],
      };
    });

    setParticles(newParticles);
    const timer = setTimeout(() => setParticles([]), 900);
    return () => clearTimeout(timer);
  }, [trigger]);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 0, x: 0, y: 0, rotate: 0 }}
            animate={{
              opacity: [1, 1, 0],
              scale: [0, 1.4, 0.4],
              x: p.x,
              y: p.y,
              rotate: p.rotation,
            }}
            transition={{ duration: 0.85, ease: "easeOut" }}
            style={{ fontSize: `${p.size}px` }}
            className="absolute font-mono text-foreground font-bold select-none drop-shadow-sm"
          >
            {p.character}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

