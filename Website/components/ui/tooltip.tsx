"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  arrow?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({
  className,
  arrow = "bottom",
  children,
  ...props
}: TooltipProps) {
  return (
    <div
      className={cn(
        "relative inline-flex items-center gap-1.5 rounded-control bg-surface-highest/80 px-3 py-1.5 text-xs text-foreground backdrop-blur-xl border border-outline shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

