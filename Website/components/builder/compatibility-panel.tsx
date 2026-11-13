"use client";

import * as React from "react";
import { CompatibilityAdvisory } from "@/lib/compatibility/types";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ChevronDown, ChevronUp, Eye } from "lucide-react";

export interface CompatibilityPanelProps {
  advisories: CompatibilityAdvisory[];
  onScrollToSlot: (slotId: string) => void;
}

export function CompatibilityPanel({
  advisories,
  onScrollToSlot,
}: CompatibilityPanelProps) {
  const [isOpen, setIsOpen] = React.useState(true);

  if (advisories.length === 0) return null;

  return (
    <GlassCard className="p-4 sm:p-5 border border-outline bg-surface-highest/40 space-y-3">
      {/* Header with Accordion Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left group"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background">
            <AlertTriangle className="h-3 w-3" />
          </span>
          <span className="font-semibold text-sm text-foreground tracking-tight">
            {advisories.length} {advisories.length === 1 ? "thing" : "things"} to check
          </span>
        </div>

        <div className="p-1 rounded-lg text-on-surface-muted group-hover:text-foreground">
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="space-y-2.5 pt-1 animate-in fade-in duration-150">
          {advisories.map((advisory) => (
            <div
              key={advisory.id}
              className="p-3 rounded-control bg-surface/50 border border-outline/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
            >
              <div className="space-y-0.5">
                <div className="font-semibold text-sm text-foreground tracking-tight">
                  {advisory.title}
                </div>
                <p className="text-on-surface-variant text-xs leading-relaxed font-normal">
                  {advisory.message}
                </p>
              </div>

              {advisory.affectedSlotIds.length > 0 && (
                <div className="flex items-center gap-1.5 shrink-0">
                  {advisory.affectedSlotIds.map((slotId) => (
                    <Button
                      key={slotId}
                      variant="ghost"
                      size="sm"
                      onClick={() => onScrollToSlot(slotId)}
                      className="h-7 px-2 text-[11px] font-mono uppercase"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      <span>View {slotId}</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}

