"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Bookmark, X } from "lucide-react";

export interface GuestSaveNudgeProps {
  itemCount: number;
  isGuest: boolean;
  onSaveBuild: () => void;
}

export function GuestSaveNudge({
  itemCount,
  isGuest,
  onSaveBuild,
}: GuestSaveNudgeProps) {
  const [dismissed, setDismissed] = React.useState(false);

  // Flow 13: Triggers only for guests with 4 or more parts added
  if (!isGuest || itemCount < 4 || dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-4 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center justify-between gap-4 p-3.5 px-4 rounded-full bg-surface-highest/95 backdrop-blur-2xl border border-outline shadow-glass-elevated">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background shrink-0">
            <Bookmark className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs text-foreground font-medium truncate">
            Don&apos;t lose your build. Save it to an account.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="solid"
            size="sm"
            onClick={onSaveBuild}
            className="h-8 px-3 text-xs"
          >
            Save build
          </Button>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
            className="p-1 rounded-full text-on-surface-muted hover:text-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
