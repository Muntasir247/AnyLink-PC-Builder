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
        "w-full text-left p-4 sm:p-5 rounded-card transition-all duration-200 border group select-none flex items-center justify-between",
        isActive
          ? "bg-surface-highest/50 border-foreground shadow-glass-elevated scale-[1.01]"
          : "bg-surface/30 hover:bg-surface/60 border-dashed border-outline/70 hover:border-outline"
      )}
    >
      <div className="flex items-center gap-4 min-w-0">
        <div
          className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors",
            isActive
              ? "bg-foreground text-background"
              : "bg-surface-highest/40 text-on-surface-variant group-hover:text-foreground"
          )}
        >
          <Icon className="h-6 w-6" />
        </div>

        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
              {category}
            </span>
            {isActive && (
              <span className="px-1.5 py-0.2 rounded-full bg-foreground text-background font-mono text-[9px] uppercase font-bold">
                Active Slot
              </span>
            )}
          </div>
          <h3 className="font-semibold text-sm sm:text-base text-foreground tracking-tight truncate">
            {label}
          </h3>
          <p className="text-xs text-on-surface-variant font-medium truncate">
            {description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium group-hover:text-foreground transition-colors shrink-0 ml-3">
        <span className="hidden sm:inline-block font-mono text-xs">
          Paste link to add
        </span>
        <Plus className="h-4 w-4" />
      </div>
    </button>
  );
}

