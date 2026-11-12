"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  interactive?: boolean;
  as?: React.ElementType;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, elevated = false, interactive = false, children, as: Component = "div", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "rounded-card p-6 transition-all duration-200",
          elevated ? "glass-floating" : "glass-panel",
          interactive && "hover:border-foreground/30 hover:shadow-xl cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
GlassCard.displayName = "GlassCard";

