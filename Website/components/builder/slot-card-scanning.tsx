"use client";

import * as React from "react";
import { ComponentCategory } from "@/lib/types/build";
import { getCategoryIcon } from "./slot-card-empty";
import { Loader2 } from "lucide-react";

export function SlotCardScanning({
  category,
  label,
}: {
  category: ComponentCategory;
  label: string;
}) {
  const Icon = getCategoryIcon(category);

  return (
    <div className="w-full p-4 sm:p-5 rounded-card bg-surface-highest/50 border border-outline shadow-glass animate-pulse transition-all flex items-center justify-between">
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-12 h-12 rounded-2xl bg-surface-highest flex items-center justify-center text-foreground shrink-0">
          <Icon className="h-6 w-6" />
        </div>
        <div className="space-y-1.5 min-w-0">
          <div className="h-3 w-16 bg-surface-highest rounded" />
          <div className="h-4 w-40 bg-surface-highest rounded" />
          <div className="h-3 w-28 bg-surface-highest/60 rounded" />
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs font-mono text-on-surface-variant">
        <Loader2 className="h-4 w-4 animate-spin text-foreground" />
        <span className="hidden sm:inline">Analyzing URL...</span>
      </div>
    </div>
  );
}

