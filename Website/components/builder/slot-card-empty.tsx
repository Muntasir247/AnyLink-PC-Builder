"use client";

import * as React from "react";
import { ComponentCategory } from "@/lib/types/build";
import { cn } from "@/lib/utils";
import {
  Cpu,
  Fan,
  CircuitBoard,
  MemoryStick,
  HardDrive,
  Tv,
  Zap,
  Box,
  Wind,
  Plus,
} from "lucide-react";

export interface SlotCardEmptyProps {
  slotId: string;
  category: ComponentCategory;
  label: string;
  description: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function getCategoryIcon(category: ComponentCategory) {
  switch (category) {
    case "cpu":
      return Cpu;
    case "cooler":
      return Fan;
    case "motherboard":
      return CircuitBoard;
    case "memory":
      return MemoryStick;
    case "storage":
      return HardDrive;
    case "gpu":
      return Tv;
    case "psu":
      return Zap;
    case "case":
      return Box;
    case "fans":
      return Wind;
    default:
      return Box;
  }
}

export function SlotCardEmpty({
  slotId,
  category,
  label,
  description,
  isActive = false,
  onClick,
}: SlotCardEmptyProps) {
  const Icon = getCategoryIcon(category);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative w-full text-left p-4 sm:p-5 rounded-card transition-all duration-300 border group select-none flex items-center justify-between overflow-hidden",
        isActive
          ? "bg-surface-highest/60 border-foreground shadow-glass-elevated scale-[1.01] ring-1 ring-foreground/30"
          : "bg-surface/30 hover:bg-surface/60 border-dashed border-outline/70 hover:border-foreground/40 hover:-translate-y-0.5 hover:shadow-md"
      )}
    >
      {/* Subtle Shimmer highlight on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-out"
      />

      <div className="flex items-center gap-4 min-w-0 relative z-10">
        <div
          className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-2 shadow-sm",
            isActive
              ? "bg-foreground text-background"
              : "bg-surface-highest/50 text-on-surface-variant group-hover:text-foreground group-hover:bg-surface-highest"
          )}
        >
          <Icon className="h-6 w-6 transition-transform duration-300" />
        </div>

        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
              {category}
            </span>
            {isActive && (
              <span className="px-1.5 py-0.2 rounded-full bg-foreground text-background font-mono text-[9px] uppercase font-bold animate-pulse">
                Active Slot
              </span>
            )}
          </div>
          <h3 className="font-semibold text-sm sm:text-base text-foreground tracking-tight truncate group-hover:text-foreground transition-colors">
            {label}
          </h3>
          <p className="text-xs text-on-surface-variant font-medium truncate">
            {description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium group-hover:text-foreground transition-colors shrink-0 ml-3 relative z-10">
        <span className="hidden sm:inline-block font-mono text-xs group-hover:translate-x-0.5 transition-transform duration-200">
          Paste link to add
        </span>
        <div className="w-6 h-6 rounded-full bg-surface-highest/50 border border-outline/40 flex items-center justify-center group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-all duration-300">
          <Plus className="h-3.5 w-3.5 group-hover:rotate-90 transition-transform duration-300" />
        </div>
      </div>
    </button>
  );
}
