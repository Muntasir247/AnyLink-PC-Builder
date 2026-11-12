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
      "inline-flex items-center justify-center font-medium rounded-control transition-all duration-150 select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/50 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]";

    const sizeStyles = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2.5",
      icon: "h-10 w-10 p-0 text-sm",
    };

    const variantStyles = {
      solid:
        "bg-primary text-primary-foreground hover:opacity-90 shadow-md",
      glass:
        "bg-surface text-foreground border border-outline hover:bg-surface-bright/20 shadow-glass",
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
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

