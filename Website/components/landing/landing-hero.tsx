"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { AnyLinkIconBadge } from "@/components/ui/logo";
import { ArrowRight, Link2, Sparkles } from "lucide-react";

export interface LandingHeroProps {
  onStartAsGuest: () => void;
}

const SAMPLE_URLS = [
  "https://www.startech.com.bd/amd-ryzen-7-7800x3d-processor",
  "https://www.techlandbd.com/asus-tuf-gaming-geforce-rtx-4070-super",
  "https://www.newegg.com/p/N82E16819113793",
  "https://www.amazon.com/dp/B0BTZB7F88",
];

export function LandingHero({ onStartAsGuest }: LandingHeroProps) {
  const [typedUrl, setTypedUrl] = React.useState(SAMPLE_URLS[0]);
  const [cardTilt, setCardTilt] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % SAMPLE_URLS.length;
      setTypedUrl(SAMPLE_URLS[index]);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setCardTilt({ x: x * 6, y: -y * 6 });
  };

  const handleMouseLeave = () => {
    setCardTilt({ x: 0, y: 0 });
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden selection:bg-foreground selection:text-background">
      {/* Top Bar */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-outline/30 bg-background/60 backdrop-blur-xl px-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-2.5">
          <AnyLinkIconBadge />
          <span className="font-semibold tracking-tight text-foreground text-base">
            AnyLink
          </span>
        </div>
        <ThemeToggle />
      </motion.header>

      {/* Hero Content */}
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center relative z-10 pt-16 space-y-8">
        {/* Headline & Subtitle */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="space-y-3 max-w-2xl"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
            Build your PC from any store.
          </h1>
          <p className="text-base sm:text-lg text-on-surface-variant max-w-xl mx-auto">
            Paste a link. We do the rest.
          </p>
        </motion.div>

        {/* Interactive 3D Frosted Glass URL Ingest Preview */}
        <motion.div
          initial={{ y: 25, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring", damping: 20 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `perspective(1000px) rotateX(${cardTilt.y}deg) rotateY(${cardTilt.x}deg)`,
            transition: "transform 0.15s ease-out",
          }}
          className="w-full max-w-2xl p-2.5 rounded-card glass-panel shadow-glass-elevated border border-outline/60 hover:border-foreground/30 transition-colors"
        >
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-control bg-surface-highest/40 border border-outline/60 shadow-inner">
            <Link2 className="h-5 w-5 text-on-surface-muted shrink-0 animate-pulse" />
            <div className="flex-1 min-w-0 text-left overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={typedUrl}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="font-mono text-xs sm:text-sm text-foreground block truncate"
                >
                  {typedUrl}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-highest border border-outline font-mono text-[10px] uppercase text-foreground shadow-sm">
              <Sparkles className="h-3 w-3 animate-spin [animation-duration:8s]" />
              <span>Auto-Detect</span>
            </div>
          </div>
        </motion.div>

        {/* Auth Choice Card */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <GlassCard elevated className="p-6 sm:p-8 space-y-4 border border-outline hover:border-foreground/30">
            <Button
              variant="solid"
              className="w-full h-11 text-sm font-medium group"
              onClick={onStartAsGuest}
            >
              <span>Continue as guest</span>
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1.5 transition-transform duration-200" />
            </Button>

            <div className="grid grid-cols-2 gap-2.5 w-full">
              <Link href="/login" className="w-full">
                <Button variant="glass" className="w-full h-10 text-xs">
                  Log in
                </Button>
              </Link>
              <Link href="/signup" className="w-full">
                <Button variant="glass" className="w-full h-10 text-xs">
                  Create account
                </Button>
              </Link>
            </div>

            <p className="text-[11px] text-on-surface-muted pt-2 border-t border-outline/20">
              No account needed to start. Sign up later to save and share.
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
