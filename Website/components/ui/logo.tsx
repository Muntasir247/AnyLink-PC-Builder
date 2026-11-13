import * as React from "react";
import { cn } from "@/lib/utils";

export interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

/**
 * Concept 03: Dynamic Prism A-Link
 * Geometric monogram "A" constructed from 45-degree PCIe hardware traces
 * with an integrated forward hyperlink arrow crossbar and pin connector terminals.
 */
export function AnyLinkMark({ size = 20, className, ...props }: LogoProps) {
  return (
    <svg
      viewBox="0 0 512 512"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      {...props}
    >
      {/* Left Leg of 'A' */}
      <path
        d="M 256 112 L 140 376 L 194 376 L 232 290 L 280 290"
        stroke="currentColor"
        strokeWidth="32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right Leg forming forward Link Connector Arrow */}
      <path
        d="M 256 112 L 372 376 L 318 376 L 292 316"
        stroke="currentColor"
        strokeWidth="32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Dynamic Crossbar: Forward Hyperlink Pointer */}
      <path
        d="M 190 270 L 330 270 M 294 234 L 330 270 L 294 306"
        stroke="currentColor"
        strokeWidth="26"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Precision Connector Pin Points */}
      <circle cx="140" cy="376" r="8" fill="currentColor" />
      <circle cx="372" cy="376" r="8" fill="currentColor" />
      <circle cx="256" cy="112" r="10" fill="currentColor" />

      {/* Speed Trace Accent Lines */}
      <path
        d="M 112 376 L 80 376"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M 400 376 L 432 376"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Standard AnyLink Brand Emblem (Icon in squircle container)
 */
export function AnyLinkIconBadge({
  className,
  iconSize = 18,
}: {
  className?: string;
  iconSize?: number;
}) {
  return (
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-xl bg-foreground text-background shadow-sm transition-transform group-hover:scale-105",
        className
      )}
    >
      <AnyLinkMark size={iconSize} />
    </div>
  );
}

