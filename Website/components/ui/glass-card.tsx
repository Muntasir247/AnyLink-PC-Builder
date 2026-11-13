"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  interactive?: boolean;
  spotlight?: boolean;
  as?: React.ElementType;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      className,
      elevated = false,
      interactive = false,
      spotlight = true,
      children,
      as: Component = "div",
      onMouseMove,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const cardRef = React.useRef<HTMLDivElement | null>(null);
    const [mousePos, setMousePos] = React.useState<{ x: number; y: number } | null>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (spotlight && cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
      onMouseMove?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      setMousePos(null);
      onMouseLeave?.(e);
    };

    return (
      <Component
        ref={(node: HTMLDivElement | null) => {
          cardRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "relative overflow-hidden rounded-card p-6 transition-all duration-300",
          elevated ? "glass-floating" : "glass-panel",
          interactive &&
            "hover:border-foreground/40 hover:-translate-y-0.5 hover:shadow-2xl cursor-pointer active:translate-y-0 active:scale-[0.995]",
          className
        )}
        {...props}
      >
        {/* Optical Specular Glass Spotlight on Pointer Move */}
        {spotlight && mousePos && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 280px at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.08), transparent 70%)`,
            }}
          />
        )}
        <div className="relative z-10">{children}</div>
      </Component>
    );
  }
);
GlassCard.displayName = "GlassCard";
