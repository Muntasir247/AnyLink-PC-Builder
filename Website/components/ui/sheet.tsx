"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Sheet({
  isOpen,
  onClose,
  title,
  children,
  className,
}: SheetProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-background/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Sheet Container */}
      <div
        className={cn(
          "relative w-full rounded-t-card glass-floating p-6 z-10 max-h-[85vh] overflow-y-auto border-t border-x border-outline shadow-glass-elevated animate-in slide-in-from-bottom duration-200",
          className
        )}
      >
        <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-outline" />

        <div className="flex items-center justify-between mb-4">
          {title && (
            <h2 className="text-lg font-semibold text-foreground tracking-tight">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            aria-label="Close sheet"
            className="rounded-lg p-1 text-on-surface-variant hover:text-foreground hover:bg-surface/50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

