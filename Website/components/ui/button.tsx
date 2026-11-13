"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "glass" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "solid", size = "md", children, disabled, ...props }, ref) => {
    const baseStyles =
      "group relative overflow-hidden inline-flex items-center justify-center font-medium rounded-control transition-all duration-200 select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/50 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.97] hover:scale-[1.015]";

    const sizeStyles = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2.5",
      icon: "h-10 w-10 p-0 text-sm",
    };

    const variantStyles = {
      solid:
        "bg-primary text-primary-foreground hover:opacity-95 shadow-md hover:shadow-lg",
      glass:
        "bg-surface text-foreground border border-outline hover:bg-surface-bright/30 hover:border-foreground/30 shadow-glass",
      ghost:
        "bg-transparent text-on-surface-variant hover:text-foreground hover:bg-surface/50",
      destructive:
        "bg-transparent text-foreground border border-outline hover:bg-red-500/10 hover:border-red-500/30",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {/* Specular Light Reflection Sweep for Solid Buttons */}
        {variant === "solid" && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-out"
          />
        )}
        <span className="relative z-10 inline-flex items-center justify-center gap-inherit">
          {children}
        </span>
      </button>
    );
  }
);
Button.displayName = "Button";
