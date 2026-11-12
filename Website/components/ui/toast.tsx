"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface ToastProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  visible: boolean;
  onClose?: () => void;
}

export function Toast({
  message,
  actionLabel = "Undo",
  onAction,
  visible,
  onClose,
}: ToastProps) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center gap-3 rounded-full bg-surface-highest/90 px-4 py-2.5 text-sm text-foreground backdrop-blur-2xl border border-outline shadow-glass-elevated">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-background">
          <Check className="h-2.5 w-2.5 stroke-[3]" />
        </span>
        <span className="font-medium text-on-surface">{message}</span>
        {onAction && (
          <>
            <span className="h-3 w-px bg-outline" />
            <button
              onClick={onAction}
              className="font-mono text-xs text-foreground underline-offset-4 hover:underline"
            >
              {actionLabel}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

