"use client";

import * as React from "react";
import { ComponentCategory } from "@/lib/types/build";
import { STANDARD_SLOTS } from "@/lib/store/build-store";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Select } from "@/components/ui/select";
import { Tooltip } from "@/components/ui/tooltip";
import { formatCurrency } from "@/lib/currency/converter";
import {
  Link2,
  X,
  Sparkles,
  ArrowRight,
  Globe,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  Info,
} from "lucide-react";

export interface ControlPanelProps {
  url: string;
  onUrlChange: (url: string) => void;
  selectedCategory: ComponentCategory | "auto";
  onCategoryChange: (category: ComponentCategory | "auto") => void;
  onAnalyze: (url: string, category: ComponentCategory | "auto") => void;
  isScanning: boolean;
  scanStep: number; // 1: Fetching, 2: Reading, 3: Extracting
  onCancelScan: () => void;
  error: { code: string; message: string } | null;
  onRetry: () => void;
  onManualEntry: () => void;
  totalAmount: number;
  currency: string;
  itemCount: number;
  totalSlots: number;
  lastDelta?: { amount: number; currency: string } | null;
  hasAdvisories: boolean;
  advisoryCount: number;
}

export function ControlPanel({
  url,
  onUrlChange,
  selectedCategory,
  onCategoryChange,
  onAnalyze,
  isScanning,
  scanStep,
  onCancelScan,
  error,
  onRetry,
  onManualEntry,
  totalAmount,
  currency,
  itemCount,
  totalSlots,
  lastDelta,
  hasAdvisories,
  advisoryCount,
}: ControlPanelProps) {
  const [domainPill, setDomainPill] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (url.trim()) {
      try {
        const parsed = new URL(url.trim());
        setDomainPill(parsed.hostname.replace(/^www\./, ""));
      } catch {
        setDomainPill(null);
      }
    } else {
      setDomainPill(null);
    }
  }, [url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && !isScanning) {
      onAnalyze(url.trim(), selectedCategory);
    }
  };

  const isUrlValid = url.trim().length > 8 && (url.startsWith("http://") || url.startsWith("https://"));

  return (
    <div className="flex flex-col gap-6 lg:sticky lg:top-24 select-none">
      {/* 1. Hero Link Ingest Panel */}
      <GlassCard elevated className="p-5 sm:p-6 space-y-4 border border-outline shadow-glass-elevated">
        {/* Empty state guidance tooltip for new users */}
        {itemCount === 0 && !isScanning && !error && (
          <Tooltip className="w-full text-left justify-start">
            <Info className="h-3.5 w-3.5 text-foreground shrink-0" />
            <span className="truncate">
              Paste a link from Star Tech, Tech Land, Ryans, Amazon or Newegg.
            </span>
          </Tooltip>
        )}

        <div className="space-y-1">
          <label className="text-sm font-semibold text-foreground tracking-tight block">
            Add Part via Store Link
          </label>
          <p className="text-xs text-on-surface-variant">
            Paste any PC component URL to auto-extract hardware specs.
          </p>
        </div>

        {/* Normal Input State vs Scanning State vs Error State */}
        {isScanning ? (
          /* Flow 6: Stepped Scanning Progress State */
          <div className="p-4 rounded-control bg-surface-highest/50 border border-outline space-y-4 animate-in fade-in">
            {/* Truncated URL pill */}
            <div className="flex items-center gap-2 font-mono text-xs text-on-surface-variant truncate">
              <Link2 className="h-3.5 w-3.5 text-foreground shrink-0" />
              <span className="truncate">{url}</span>
            </div>

            {/* Progress bar shimmer */}
            <div className="h-1.5 w-full bg-surface-highest rounded-full overflow-hidden relative">
              <div
                className="h-full bg-foreground transition-all duration-500 rounded-full"
                style={{ width: `${(scanStep / 3) * 100}%` }}
              />
            </div>

            {/* Stepped Checklist */}
            <div className="space-y-2 font-mono text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className={`h-3.5 w-3.5 ${
                    scanStep >= 1 ? "text-foreground" : "text-on-surface-muted"
                  }`}
                />
                <span className={scanStep >= 1 ? "text-foreground font-medium" : "text-on-surface-muted"}>
                  Fetching page {scanStep >= 1 && "✓"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {scanStep === 2 ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-foreground" />
                ) : (
                  <CheckCircle2
                    className={`h-3.5 w-3.5 ${
                      scanStep >= 2 ? "text-foreground" : "text-on-surface-muted"
                    }`}
                  />
                )}
                <span className={scanStep >= 2 ? "text-foreground font-medium" : "text-on-surface-muted"}>
                  Reading product details {scanStep >= 2 && "✓"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {scanStep === 3 ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-foreground" />
                ) : (
                  <CheckCircle2
                    className={`h-3.5 w-3.5 ${
                      scanStep >= 3 ? "text-foreground" : "text-on-surface-muted"
                    }`}
                  />
                )}
                <span className={scanStep >= 3 ? "text-foreground font-medium" : "text-on-surface-muted"}>
                  Extracting specs {scanStep >= 3 && "✓"}
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onCancelScan}
              className="w-full text-xs"
            >
              Cancel
            </Button>
          </div>
        ) : error ? (
          /* Flow 9: Inline Error Card */
          <div className="p-4 rounded-control bg-surface-highest/60 border border-outline space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-foreground shrink-0" />
                <span className="text-xs font-semibold text-foreground">
                  We couldn&apos;t read this page.
                </span>
              </div>
              <button
                onClick={() => onUrlChange("")}
                className="text-on-surface-muted hover:text-foreground p-1"
                aria-label="Clear URL"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <p className="text-xs text-on-surface-variant">
              {error.message || "The store may be blocking access, or this isn't a product page."}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button variant="solid" size="sm" onClick={onRetry}>
                Try again
              </Button>
              <Button variant="glass" size="sm" onClick={onManualEntry}>
                Enter manually
              </Button>
            </div>
          </div>
        ) : (
          /* Normal Ingestion Form */
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Category Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-on-surface-muted">
                Slot:
              </span>
              <Select
                value={selectedCategory}
                onChange={(e) =>
                  onCategoryChange(e.target.value as ComponentCategory | "auto")
                }
                className="h-8 text-xs font-medium"
              >
                <option value="auto">Auto-detect Category</option>
                {STANDARD_SLOTS.map((s) => (
                  <option key={s.category} value={s.category}>
                    {s.label}
                  </option>
                ))}
              </Select>
            </div>

            {/* Input with Domain Pill and Clear Action */}
            <div className="relative flex items-center">
              <Link2 className="absolute left-3 h-4 w-4 text-on-surface-muted pointer-events-none" />

              <input
                type="url"
                value={url}
                onChange={(e) => onUrlChange(e.target.value)}
                placeholder={
                  selectedCategory === "auto"
                    ? "Paste any product link..."
                    : `Paste a ${selectedCategory.toUpperCase()} link...`
                }
                className="h-11 w-full rounded-control bg-surface-highest/40 pl-9 pr-24 font-mono text-xs text-foreground placeholder:text-on-surface-muted border border-outline focus:outline-none focus:border-foreground/50 transition-all"
              />

              {/* Domain Recognition Badge */}
              {domainPill && (
                <div className="absolute right-14 flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-highest border border-outline font-mono text-[9px] text-foreground truncate max-w-[120px]">
                  <Globe className="h-2.5 w-2.5 shrink-0" />
                  <span className="truncate">{domainPill}</span>
                </div>
              )}

              {/* Clear button */}
              {url.trim() && (
                <button
                  type="button"
                  onClick={() => onUrlChange("")}
                  className="absolute right-10 p-1 text-on-surface-muted hover:text-foreground"
                  aria-label="Clear input"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}

              <Button
                type="submit"
                variant="solid"
                size="sm"
                disabled={!isUrlValid}
                className="absolute right-1 h-9 px-3 text-xs"
              >
                Analyze
              </Button>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-on-surface-muted pt-0.5">
              <span>Star Tech · Tech Land · Amazon · Newegg</span>
            </div>
          </form>
        )}
      </GlassCard>

      {/* 2. Build Metrics & Summary Card */}
      <GlassCard className="p-5 space-y-4 border border-outline">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-on-surface-muted">
              Estimated Total
            </span>
            {lastDelta && lastDelta.amount > 0 && (
              <span className="font-mono text-xs text-foreground font-semibold animate-in fade-in">
                + {formatCurrency(lastDelta.amount, lastDelta.currency)}
              </span>
            )}
          </div>
          <div className="font-mono text-3xl font-bold tracking-tight text-foreground">
            {formatCurrency(totalAmount, currency)}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-outline/30 text-xs">
          <span className="font-mono text-on-surface-variant">
            {itemCount} of {totalSlots} components
          </span>

          {hasAdvisories ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-highest border border-outline font-mono text-[10px] uppercase text-foreground">
              <AlertTriangle className="h-3 w-3" />
              <span>{advisoryCount} to check</span>
            </span>
          ) : itemCount > 0 ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-highest/60 border border-outline font-mono text-[10px] uppercase text-foreground">
              <CheckCircle2 className="h-3 w-3" />
              <span>Looking good</span>
            </span>
          ) : (
            <span className="font-mono text-[10px] text-on-surface-muted uppercase">
              Nothing to check yet
            </span>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

