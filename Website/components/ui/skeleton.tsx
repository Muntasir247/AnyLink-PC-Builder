"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-control bg-surface-highest/40",
        className
      )}
      style={{
        boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
      }}
      {...props}
    />
  );
}

