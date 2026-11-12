"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  mono?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, mono = false, ...props }, ref) => {
    return (
      <div className="relative inline-flex items-center w-full">
        <select
          ref={ref}
          className={cn(
            "h-10 w-full appearance-none rounded-control bg-surface/40 px-3.5 pr-8 text-sm text-foreground border border-outline/60 transition-all duration-150 focus-visible:outline-none focus-visible:border-foreground/40 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
            mono && "font-mono text-[13px]",
            className
          )}
          style={{
            boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
          }}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 h-4 w-4 text-on-surface-variant/70" />
      </div>
    );
  }
);
Select.displayName = "Select";

