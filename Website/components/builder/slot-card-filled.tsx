"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ComponentItem } from "@/lib/types/build";
import { formatCurrency, convertPrice } from "@/lib/currency/converter";
import { getCategoryIcon } from "./slot-card-empty";
import { Edit2, Trash2, Globe, ExternalLink, AlertTriangle } from "lucide-react";

export interface SlotCardFilledProps {
  item: ComponentItem;
  activeCurrency: string;
  rates: Record<string, number>;
  hasWarning?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
}

export function SlotCardFilled({
  item,
  activeCurrency,
  rates,
  hasWarning = false,
  onEdit,
  onRemove,
}: SlotCardFilledProps) {
  const Icon = getCategoryIcon(item.category);

  const converted = convertPrice(
    item.originalPrice,
    item.originalCurrency,
    activeCurrency,
    rates
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.96 }}
      transition={{ duration: 0.35, type: "spring", damping: 22 }}
      className={`relative overflow-hidden w-full p-4 sm:p-5 rounded-card bg-surface/50 hover:bg-surface/80 border transition-all duration-300 group select-none shadow-glass flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:-translate-y-0.5 hover:shadow-xl ${
        hasWarning
          ? "border-foreground/60 shadow-[0_0_15px_rgba(255,255,255,0.08)]"
          : "border-outline hover:border-foreground/30"
      }`}
    >
      {/* Specular Glaze Sweep on Hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-out"
      />

      {/* Left: Thumbnail & Details */}
      <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-surface-highest/60 border border-outline flex items-center justify-center shrink-0 p-2 overflow-hidden relative shadow-sm group-hover:border-foreground/40 transition-colors">
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt={item.name}
              className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <Icon className="h-6 w-6 text-foreground group-hover:scale-110 transition-transform duration-300" />
          )}
        </div>

        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
              {item.category}
            </span>
            <span className="text-xs text-on-surface-muted font-bold">•</span>
            <span className="font-mono text-xs text-on-surface-variant font-medium flex items-center gap-1.5 truncate">
              <Globe className="h-3 w-3 text-foreground" />
              <span>{item.sourceDomain}</span>
            </span>
            {hasWarning && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-foreground text-background font-mono text-[10px] uppercase font-bold animate-pulse">
                <AlertTriangle className="h-2.5 w-2.5" />
                <span>Advisory</span>
              </span>
            )}
          </div>

          <h3 className="font-semibold text-sm sm:text-base text-foreground tracking-tight line-clamp-1 group-hover:text-foreground">
            {item.name}
          </h3>

          {/* Specs Chips */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {item.specs.socket && (
              <span className="px-2 py-0.5 rounded-md bg-surface-highest/80 font-mono text-[11px] text-foreground font-medium border border-outline/50 hover:border-foreground/30 hover:scale-105 transition-all">
                Socket {item.specs.socket}
              </span>
            )}
            {item.specs.tdp && (
              <span className="px-2 py-0.5 rounded-md bg-surface-highest/80 font-mono text-[11px] text-foreground font-medium border border-outline/50 hover:border-foreground/30 hover:scale-105 transition-all">
                {item.specs.tdp}W TDP
              </span>
            )}
            {item.specs.capacity && (
              <span className="px-2 py-0.5 rounded-md bg-surface-highest/80 font-mono text-[11px] text-foreground font-medium border border-outline/50 hover:border-foreground/30 hover:scale-105 transition-all">
                {item.specs.capacity}
              </span>
            )}
            {item.specs.memoryType && (
              <span className="px-2 py-0.5 rounded-md bg-surface-highest/80 font-mono text-[11px] text-foreground font-medium border border-outline/50 hover:border-foreground/30 hover:scale-105 transition-all">
                {item.specs.memoryType}
              </span>
            )}
            {item.specs.lengthMm && (
              <span className="px-2 py-0.5 rounded-md bg-surface-highest/80 font-mono text-[11px] text-foreground font-medium border border-outline/50 hover:border-foreground/30 hover:scale-105 transition-all">
                {item.specs.lengthMm} mm
              </span>
            )}
            {item.specs.psuWattage && (
              <span className="px-2 py-0.5 rounded-md bg-surface-highest/80 font-mono text-[11px] text-foreground font-medium border border-outline/50 hover:border-foreground/30 hover:scale-105 transition-all">
                {item.specs.psuWattage}W
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Converted Price & Hover Actions */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-outline/20 relative z-10">
        <div className="text-right">
          <div className="font-mono text-base sm:text-lg font-semibold text-foreground group-hover:scale-105 transition-transform duration-200 origin-right">
            {formatCurrency(converted.amount, activeCurrency)}
          </div>
          {item.originalCurrency !== activeCurrency && (
            <div className="text-[10px] font-mono text-on-surface-muted">
              Orig: {formatCurrency(item.originalPrice, item.originalCurrency)}
            </div>
          )}
        </div>

        {/* Hover Actions */}
        <div className="flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 mt-1">
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer noopener"
              className="p-1.5 rounded-lg text-on-surface-muted hover:text-foreground hover:bg-surface-highest hover:scale-110 active:scale-95 transition-all"
              title="Open Store Link"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-1.5 rounded-lg text-on-surface-muted hover:text-foreground hover:bg-surface-highest hover:scale-110 active:scale-95 transition-all"
              title="Edit Component"
              aria-label="Edit part"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          )}
          {onRemove && (
            <button
              onClick={onRemove}
              className="p-1.5 rounded-lg text-on-surface-muted hover:text-foreground hover:bg-surface-highest hover:scale-110 active:scale-95 transition-all"
              title="Remove Component"
              aria-label="Remove part"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
