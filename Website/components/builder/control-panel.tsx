"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Globe,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Info,
  Share2,
  Bookmark,
  Sparkles,
} from "lucide-react";

export interface LinkIngestPanelProps {
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
  itemCount: number;
}

export function LinkIngestPanel({
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
  itemCount,
}: LinkIngestPanelProps) {
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

  const isUrlValid =
    url.trim().length > 8 &&
    (url.startsWith("http://") || url.startsWith("https://"));

  return (
    <GlassCard
      elevated
      className="p-5 sm:p-6 space-y-4 border border-outline shadow-glass-elevated hover:border-foreground/30 transition-all duration-300"
    >
      {/* Empty state guidance tooltip for new users */}
      {itemCount === 0 && !isScanning && !error && (
        <Tooltip className="w-full text-left justify-start">
          <Info className="h-3.5 w-3.5 text-foreground shrink-0" />
          <span className="truncate">
            Paste a link from Star Tech, Tech Land, Ryans, PC Builder Store, Amazon or Newegg.
          </span>
        </Tooltip>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="space-y-0.5">
          <label className="text-sm font-semibold text-foreground tracking-tight block">
            Add Part via Store Link
          </label>
          <p className="text-xs text-on-surface-variant">
            Paste any PC component URL to auto-extract hardware specs and price.
          </p>
        </div>

        {/* Slot selector dropdown */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[11px] font-mono uppercase text-on-surface-variant font-semibold">
            Slot:
          </span>
          <Select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value as ComponentCategory | "auto")}
            className="w-48 text-xs font-medium"
          >
            <option value="auto">Auto-detect Category</option>
            {STANDARD_SLOTS.map((s) => (
              <option key={s.id} value={s.category}>
                {s.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Dynamic State Machine: Normal Ingestion vs Scanning vs Error */}
      <AnimatePresence mode="wait">
        {isScanning ? (
          /* Flow 5: Real-time Scanning Progress */
          <motion.div
            key="scanning"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="relative overflow-hidden p-5 rounded-control bg-surface-highest/60 border border-foreground/30 space-y-3.5 shadow-glass ring-1 ring-foreground/20"
          >
            {/* High-tech Scanning Laser Wave */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-foreground/15 to-transparent animate-[shimmer_2s_infinite] ease-in-out"
            />

            <div className="flex items-center justify-between text-xs relative z-10">
              <span className="font-mono text-foreground font-semibold flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 animate-spin [animation-duration:6s]" />
                <span>ANALYZING HARDWARE COMPONENT...</span>
              </span>
              <span className="font-mono text-on-surface-variant font-medium">
                Step {scanStep} of 3
              </span>
            </div>

            {/* Stepped Checklist tied to REAL pipeline state */}
            <div className="space-y-2 text-xs font-mono relative z-10">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className={`h-3.5 w-3.5 transition-colors ${
                    scanStep >= 1 ? "text-foreground" : "text-on-surface-muted"
                  }`}
                />
                <span
                  className={
                    scanStep >= 1
                      ? "text-foreground font-medium"
                      : "text-on-surface-muted"
                  }
                >
                  Fetching page {scanStep >= 1 && "✓"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {scanStep === 2 ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-foreground" />
                ) : (
                  <CheckCircle2
                    className={`h-3.5 w-3.5 transition-colors ${
                      scanStep >= 2 ? "text-foreground" : "text-on-surface-muted"
                    }`}
                  />
                )}
                <span
                  className={
                    scanStep >= 2
                      ? "text-foreground font-medium"
                      : "text-on-surface-muted"
                  }
                >
                  Reading product details {scanStep >= 2 && "✓"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {scanStep === 3 ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-foreground" />
                ) : (
                  <CheckCircle2
                    className={`h-3.5 w-3.5 transition-colors ${
                      scanStep >= 3 ? "text-foreground" : "text-on-surface-muted"
                    }`}
                  />
                )}
                <span
                  className={
                    scanStep >= 3
                      ? "text-foreground font-medium"
                      : "text-on-surface-muted"
                  }
                >
                  Extracting specs {scanStep >= 3 && "✓"}
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onCancelScan}
              className="w-full text-xs relative z-10"
            >
              Cancel
            </Button>
          </motion.div>
        ) : error ? (
          /* Flow 9: Inline Error Card */
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="p-4 rounded-control bg-surface-highest/60 border border-outline space-y-3"
          >
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
              {error.message ||
                "The store may be blocking access, or this isn't a product page."}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button variant="solid" size="sm" onClick={onRetry}>
                Try again
              </Button>
              <Button variant="glass" size="sm" onClick={onManualEntry}>
                Enter manually
              </Button>
            </div>
          </motion.div>
        ) : (
          /* Normal Ingestion Form */
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Input with Domain Pill and Clear Action */}
            <div className="relative flex items-center">
              <Link2 className="absolute left-3.5 h-4 w-4 text-on-surface-muted pointer-events-none" />

              <input
                type="url"
                value={url}
                onChange={(e) => onUrlChange(e.target.value)}
                placeholder={
                  selectedCategory === "auto"
                    ? "Paste any product link (Star Tech, Tech Land, Ryans, Amazon, Newegg)..."
                    : `Paste a ${selectedCategory.toUpperCase()} product link...`
                }
                className="h-11 w-full rounded-control bg-surface-highest/40 pl-10 pr-28 font-mono text-xs text-foreground placeholder:text-on-surface-variant/70 border border-outline focus:outline-none focus:border-foreground/60 focus:ring-1 focus:ring-foreground/20 transition-all"
              />

              {/* Domain Recognition Badge */}
              <AnimatePresence>
                {domainPill && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="absolute right-24 hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-highest border border-outline font-mono text-[9px] text-foreground truncate max-w-[130px] shadow-sm"
                  >
                    <Globe className="h-2.5 w-2.5 shrink-0" />
                    <span className="truncate">{domainPill}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Clear button */}
              {url.trim() && (
                <button
                  type="button"
                  onClick={() => onUrlChange("")}
                  className="absolute right-20 sm:right-24 p-1 text-on-surface-muted hover:text-foreground transition-colors"
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
                className="absolute right-1.5 h-8 px-3.5 text-xs font-medium"
              >
                Analyze
              </Button>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant font-medium pt-0.5">
              <span>Supported: Star Tech · Tech Land · Ryans · Amazon · Newegg</span>
              <button
                type="button"
                onClick={onManualEntry}
                className="text-foreground hover:underline underline-offset-4 font-semibold hover:text-foreground/80 transition-colors"
              >
                Enter manually
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}

export interface TotalSummaryCardProps {
  totalAmount: number;
  currency: string;
  itemCount: number;
  totalSlots: number;
  lastDelta?: { amount: number; currency: string } | null;
  hasAdvisories: boolean;
  advisoryCount: number;
  onExportClick?: () => void;
  onSaveClick?: () => void;
}

export function TotalSummaryCard({
  totalAmount,
  currency,
  itemCount,
  totalSlots,
  lastDelta,
  hasAdvisories,
  advisoryCount,
  onExportClick,
  onSaveClick,
}: TotalSummaryCardProps) {
  const progressPercent = Math.min(
    100,
    Math.round((itemCount / Math.max(totalSlots, 1)) * 100)
  );

  return (
    <GlassCard className="p-5 sm:p-6 space-y-4 border border-outline shadow-glass hover:border-foreground/30 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Price & Delta */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-on-surface-variant font-semibold">
              Estimated Total
            </span>
            <AnimatePresence>
              {lastDelta && lastDelta.amount > 0 && (
                <motion.span
                  initial={{ opacity: 0, y: 5, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.9 }}
                  transition={{ type: "spring", damping: 15 }}
                  className="font-mono text-xs text-foreground font-semibold px-1.5 py-0.2 rounded bg-surface-highest border border-outline/50 shadow-sm"
                >
                  + {formatCurrency(lastDelta.amount, lastDelta.currency)}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-foreground transition-all">
            {formatCurrency(totalAmount, currency)}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {onSaveClick && (
            <Button
              variant="glass"
              size="md"
              onClick={onSaveClick}
              className="text-xs gap-2 group"
            >
              <Bookmark className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
              <span>Save Build</span>
            </Button>
          )}

          {onExportClick && (
            <Button
              variant="solid"
              size="md"
              onClick={onExportClick}
              className="text-xs gap-2 group"
            >
              <Share2 className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
              <span>Export & Share</span>
            </Button>
          )}
        </div>
      </div>

      {/* Interactive Progress Bar */}
      <div className="space-y-1.5 pt-1">
        <div className="h-1.5 w-full rounded-full bg-surface-highest/60 overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ type: "spring", damping: 22, stiffness: 120 }}
            className="h-full rounded-full bg-foreground shadow-sm"
          />
        </div>
      </div>

      {/* Progress & Status Badges */}
      <div className="flex items-center justify-between pt-2 border-t border-outline/30 text-xs">
        <span className="font-mono text-on-surface-variant font-medium">
          {itemCount} of {totalSlots} components added ({progressPercent}%)
        </span>

        {hasAdvisories ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-highest border border-outline font-mono text-[11px] uppercase font-semibold text-foreground animate-pulse">
            <AlertTriangle className="h-3 w-3" />
            <span>{advisoryCount} to check</span>
          </span>
        ) : itemCount > 0 ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-highest/80 border border-outline font-mono text-[11px] uppercase font-semibold text-foreground">
            <CheckCircle2 className="h-3 w-3" />
            <span>Looking good</span>
          </span>
        ) : (
          <span className="font-mono text-xs text-on-surface-variant uppercase font-medium">
            No components added yet
          </span>
        )}
      </div>
    </GlassCard>
  );
}

// Backwards-compatible ControlPanel export combining both
export interface ControlPanelProps extends LinkIngestPanelProps, TotalSummaryCardProps {}

export function ControlPanel(props: ControlPanelProps) {
  return (
    <div className="flex flex-col gap-6 select-none">
      <LinkIngestPanel {...props} />
      <TotalSummaryCard {...props} />
    </div>
  );
}
