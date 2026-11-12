"use client";

import * as React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { ArrowRight, Link2, Sparkles, Cpu } from "lucide-react";

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

  React.useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % SAMPLE_URLS.length;
      setTypedUrl(SAMPLE_URLS[index]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden selection:bg-foreground selection:text-background">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-outline/30 bg-background/60 backdrop-blur-xl px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-foreground text-background">
            <Cpu className="h-4 w-4" />
          </div>
          <span className="font-semibold tracking-tight text-foreground text-base">
            AnyLink
          </span>
        </div>
        <ThemeToggle />
      </header>

      {/* Hero Content */}
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center relative z-10 pt-16 space-y-8">
        {/* Brand Icon Pill */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-highest/60 border border-outline shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-foreground animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">
            PC Part Picker Architecture
          </span>
        </div>

        {/* Headline & Subtitle */}
        <div className="space-y-3 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
            Build your PC from any store.
          </h1>
          <p className="text-base sm:text-lg text-on-surface-variant max-w-xl mx-auto">
            Paste a link. We do the rest.
          </p>
        </div>

        {/* Simulated Frosted Glass URL Ingest Preview */}
        <div className="w-full max-w-2xl p-2 rounded-card glass-panel shadow-glass-elevated">
          <div className="flex items-center gap-3 px-4 py-3 rounded-control bg-surface-highest/40 border border-outline/60">
            <Link2 className="h-5 w-5 text-on-surface-muted shrink-0" />
            <div className="flex-1 min-w-0 text-left">
              <span className="font-mono text-xs sm:text-sm text-foreground block truncate">
                {typedUrl}
              </span>
            </div>
            <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-highest border border-outline font-mono text-[10px] uppercase text-foreground">
              <Sparkles className="h-3 w-3" />
              <span>Auto-Detect</span>
            </div>
          </div>
        </div>

        {/* Auth Choice Card */}
        <GlassCard elevated className="w-full max-w-md p-6 sm:p-8 space-y-4 border border-outline">
          <Button
            variant="solid"
            className="w-full h-11 text-sm font-medium"
            onClick={onStartAsGuest}
          >
            <span>Continue as guest</span>
            <ArrowRight className="h-4 w-4 ml-2" />
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
      </div>
    </div>
  );
}

