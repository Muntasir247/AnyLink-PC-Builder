"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  mono?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", mono = false, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "h-10 w-full rounded-control px-3.5 py-2 text-sm text-foreground placeholder:text-on-surface-muted bg-surface/40 border border-outline/60 transition-all duration-150 focus-visible:outline-none focus-visible:border-foreground/40 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
          mono && "font-mono text-[13px]",
          className
        )}
        style={{
          boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
        }}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

