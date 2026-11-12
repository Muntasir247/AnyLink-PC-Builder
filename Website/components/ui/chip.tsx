"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: "active" | "idle" | "flag" | "neutral";
  size?: "sm" | "md";
}

export const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  ({ className, status = "neutral", size = "md", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-outline bg-surface px-2.5 font-mono uppercase tracking-wider select-none",
          size === "sm" ? "h-6 text-[10px]" : "h-7 text-[11px]",
          className
        )}
        style={{
          boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.10)",
        }}
        {...props}
      >
        {status === "active" && (
          <span className="h-1.5 w-1.5 rounded-full bg-foreground animate-pulse" />
        )}
        {status === "idle" && (
          <span className="h-1.5 w-1.5 rounded-full border border-foreground/60" />
        )}
        {status === "flag" && (
          <span className="h-1.5 w-1.5 rounded-full bg-foreground/40" />
        )}
        <span className="text-on-surface-variant font-medium">{children}</span>
      </div>
    );
  }
);
Chip.displayName = "Chip";

