"use client";

import * as React from "react";
import { Link2, Clipboard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface MobileBottomBarProps {
  totalDisplay?: string;
  isScanning?: boolean;
  onAnalyze?: (url: string) => void;
}

export function MobileBottomBar({
  totalDisplay = "৳0.00",
  isScanning = false,
  onAnalyze,
}: MobileBottomBarProps) {
  const [url, setUrl] = React.useState("");

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        onAnalyze?.(text);
      }
    } catch {
      // Clipboard access denied or unsupported
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze?.(url.trim());
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-outline/50 bg-background/85 backdrop-blur-2xl p-3 shadow-glass-elevated">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1 flex items-center">
          <Link2 className="absolute left-3 h-4 w-4 text-on-surface-muted" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste product link..."
            className="h-10 w-full rounded-control bg-surface/50 pl-9 pr-10 text-xs font-mono text-foreground placeholder:text-on-surface-muted border border-outline focus:outline-none focus:border-foreground/40"
          />
          <button
            type="button"
            onClick={handlePaste}
            aria-label="Paste from clipboard"
            className="absolute right-2 rounded-lg p-1 text-on-surface-variant hover:text-foreground"
          >
            <Clipboard className="h-4 w-4" />
          </button>
        </div>

        {/* Compact Total Chip */}
        <div className="flex h-10 items-center justify-center rounded-control bg-surface px-3 font-mono text-xs font-semibold text-foreground border border-outline shrink-0">
          {totalDisplay}
        </div>

        <Button
          type="submit"
          variant="solid"
          size="sm"
          disabled={!url.trim() || isScanning}
          className="h-10 px-3 shrink-0"
        >
          {isScanning ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Add"
          )}
        </Button>
      </form>
    </div>
  );
}

