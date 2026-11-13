"use client";

import * as React from "react";
import { ComponentCategory } from "@/lib/types/build";
import { getCategoryIcon } from "./slot-card-empty";
import { Loader2, Sparkles } from "lucide-react";

export function SlotCardScanning({
  category,
  label,
}: {
  category: ComponentCategory;
  label: string;
}) {
  const Icon = getCategoryIcon(category);

  return (
    <div className="relative overflow-hidden w-full p-4 sm:p-5 rounded-card bg-surface-highest/50 border border-foreground/30 shadow-glass-elevated transition-all flex items-center justify-between ring-1 ring-foreground/20">
      {/* Laser Scanning Beam Sweep */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-foreground/15 to-transparent animate-[shimmer_1.8s_infinite] ease-in-out"
        style={{
          animation: "shimmer 1.8s ease-in-out infinite",
        }}
      />

      <div className="flex items-center gap-4 min-w-0 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-surface-highest border border-outline flex items-center justify-center text-foreground shrink-0 shadow-sm animate-pulse">
          <Icon className="h-6 w-6" />
        </div>
        <div className="space-y-2 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-foreground font-semibold">
              {category}
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-foreground text-background font-mono text-[9px] uppercase font-bold animate-pulse">
              <Sparkles className="h-2.5 w-2.5" />
              <span>Scanning</span>
            </span>
          </div>
          <div className="h-4 w-44 bg-surface-highest/80 rounded animate-pulse" />
          <div className="h-3 w-28 bg-surface-highest/50 rounded animate-pulse" />
        </div>
      </div>

      <div className="flex items-center gap-2.5 text-xs font-mono text-foreground relative z-10">
        <Loader2 className="h-4 w-4 animate-spin text-foreground" />
        <span className="hidden sm:inline font-semibold">Extracting Specs...</span>
      </div>
    </div>
  );
}
